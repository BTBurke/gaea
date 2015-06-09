var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");

var UserConstants = Marty.createConstants([
  'USER_RECEIVE',
  'USER_UPDATE',
  'REQUEST_FAILED',
  'LOGIN_REQUIRED'
]);

//////////////////////////////////////////////////////////////////
// UserAPI reflects all routes associated with managing user state
//////////////////////////////////////////////////////////////////

class UserAPI extends Marty.HttpStateSource {
   getUser() {
        return this.get(Config.baseURL + '/user');
   }
}


//////////////////////////////////
// Queries
//////////////////////////////////

// UserQueries sends HTTP requests to the server and dispatches actions
// based on server response
class UserQueries extends Marty.Queries {
  getUser() {
    return this.app.UserAPI.getUser()
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(UserConstants.USER_RECEIVE, res.body);
            break;
          case 401:
            this.dispatch(UserConstants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Some shit really fucked up").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(UserConstants.REQUEST_FAILED, err)
      });
  }
}


////////////////////////////////////
// Model
////////////////////////////////////

class User {

  constructor(props) {
    this.userName = props.user_name;
    this.firstName = props.first_name;
    this.lastName = props.last_name;
    this.email = props.email;
    this.fullName = props.first_name + ' ' + props.last_name;
    this.role = props.role;
    this.userID = props.user_id;
  }

  isLoggedIn() {
    return this.uuid !== null
  }

  isAdmin() {
    return this.role === 'admin'
  }

  isSuperAdmin() {
    return this.role === 'superadmin'
  }
}

///////////////////////////////////
// Store
///////////////////////////////////
class UserStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      _handleReceive: UserConstants.USER_RECEIVE,
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
        return this.state['user'];
      },
      remotely: function() {
        return this.app.UserQueries.getUser();
      }
    });

  }

}

//module.exports = Marty.register(UserStore);
module.exports.UserStore = UserStore;
module.exports.UserQueries = UserQueries;
module.exports.UserAPI = UserAPI;
