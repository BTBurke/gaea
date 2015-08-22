var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");

var localstorage = require('local-storage');

var SessionConstants = Marty.createConstants([
  'REQUEST_FAILED',
  'LOGIN_REQUIRED',
  'LOGIN_SUCCESS',
  'LOGIN_FAIL',
  'LOGOUT',
  'USER_MESSAGE_SET',
  'USER_MESSAGE_DISMISS',
  'ON_AUTH_REDIRECT'
]);

////////////////////////////////////////////////////////////////////////
// SessionAPI reflects all routes associated with managing session state
////////////////////////////////////////////////////////////////////////

class SessionAPI extends Marty.HttpStateSource {
   login(user, pwd) {
        return this.request({
            url: Config.baseURL + '/login',
            method: 'POST',
            body: {
                'user': user,
                'pwd': pwd
            }
        });
   }
   
   logout(user) {
       return this.request({
           url: Config.baseURL + '/logout',
           method: 'POST',
           body: {
               'user': user
           }
       });
   }
   
   
}

////////////////////////////////////////////////////////
// Actions
////////////////////////////////////////////////////////

class SessionActions extends Marty.ActionCreators {
    setMessage(msg, timeout) {
        this.dispatch(SessionConstants.USER_MESSAGE_SET, msg, timeout);
    }
    
    dismissMessage() {
        this.dispatch(SessionConstants.USER_MESSAGE_DISMISS);
    }
    
    setAuthRedirect(location) {
        this.dispatch(SessionConstants.ON_AUTH_REDIRECT, location);
    }
}

//////////////////////////////////
// Queries
//////////////////////////////////

class SessionQueries extends Marty.Queries {
  login(user, pwd) {
    return this.app.SessionAPI.login(user, pwd)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(SessionConstants.LOGIN_SUCCESS, res.body);
            break;
          case 401:
            this.dispatch(SessionConstants.LOGIN_FAILED, res.body);
            break;
          default:
            throw new AppError("Login failed").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(SessionConstants.REQUEST_FAILED, err)
      });
  }
  
  logout(user) {
    return this.app.SessionAPI.logout(pwd)
      .then(this.dispatch(SessionConstants.LOGOUT))
      .catch(err => {
        console.log(err);
        this.dispatch(SessionConstants.REQUEST_FAILED, err)
      });
  }
}



///////////////////////////////////
// Store
///////////////////////////////////
class SessionStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {
        'auth_redirect': undefined,
        'user_message': undefined,
        'error': undefined,
        'login_required': false
    };
    this.handlers = {
      _handleLogin: SessionConstants.LOGIN_SUCCESS,
      _handleLoginFail: SessionConstants.LOGIN_FAILED,
      _handleLogout: SessionConstants.LOGOUT,
      _handleSetMessage: SessionConstants.USER_MESSAGE_SET,
      _handleDismissMessage: SessionConstants.USER_MESSAGE_DISMISS,
      _handleRequestFailed: SessionConstants.REQUEST_FAILED,
      _handleLoginRequired: SessionConstants.LOGIN_REQUIRED,
      _handleSetAuthRedirect: SessionConstants.ON_AUTH_REDIRECT
    };
  }

  // Action Handlers
  _handleReceive(user) {
    console.log("handling user receive...");
    this.state['user'] = new User(user);
    this.hasChanged();
  }


  // Methods
  getUser() {
    return this.fetch({
      id: 'user',
      locally: function() {
        return this.state;
      },
      remotely: function() {
        console.log("Unable to return the session storage.");
      }
    });

  }

}

//module.exports = Marty.register(UserStore);
module.exports.UserStore = UserStore;
module.exports.UserQueries = UserQueries;
module.exports.UserAPI = UserAPI;