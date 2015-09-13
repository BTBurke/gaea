var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");

var localstorage = require('local-storage');
var log = require('../services/logger');
var config = require('../config');

var SessionConstants = Marty.createConstants([
  'REQUEST_FAILED',
  'LOGIN_REQUIRED',
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'LOGOUT',
  'USER_MESSAGE_SET',
  'USER_MESSAGE_DISMISS',
  'ON_AUTH_REDIRECT',
  'SET_POPUP_CONTENT',
  'DISMISS_POPUP_CONTENT',
  'REDIRECT',
  'RESET_PASSWORD',
  'PASSWORD_RESET_FAILED',
  'DISMISS_ERROR'
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

   requestReset(user) {
     return this.request({
           url: Config.baseURL + '/reset',
           method: 'POST',
           body: {
               'user': user
           }
       });
   }
   setPassword(pwd, token) {
     return this.request({
       url: Config.baseURL + '/set',
       method: 'POST',
       header: {
         'Authorization': 'Bearer ' + token
       },
       body: {
         'pwd': pwd,
         'token': token
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

    setPopupContent(htmlContent) {
      this.dispatch(SessionConstants.SET_POPUP_CONTENT, htmlContent);
    }

    dismissPopupContent() {
      this.dispatch(SessionConstants.DISMISS_POPUP_CONTENT);
    }

    triggerLogin(msg) {
      this.dispatch(SessionConstants.LOGIN_REQUIRED, msg);
    }

    redirect(target, wait) {
      this.dispatch(SessionConstants.REDIRECT, target, wait);
    }

    triggerError(err) {
      this.dispatch(SessionConstants.REQUEST_FAILED, err);
    }

    dismissError() {
      this.dispatch(SessionConstants.DISMISS_ERROR);
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
        this.dispatch(SessionConstants.REQUEST_FAILED, err);
      });
  }

  logout(user) {
    return this.app.SessionAPI.logout(pwd)
      .then(this.dispatch(SessionConstants.LOGOUT))
      .catch(err => {
        console.log(err);
        this.dispatch(SessionConstants.REQUEST_FAILED, err);
      });
  }

  requestReset(user) {
    return this.app.SessionAPI.requestReset(user)
      .then(this.dispatch(SessionConstants.RESET_PASSWORD))
      .catch(err => {
        console.log(err);
        this.dispatch(SessionConstants.REQUEST_FAILED, err);
      });
  }

  setPassword(pwd, token) {
    return this.app.SessionAPI.setPassword(pwd, token)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(SessionConstants.LOGIN_SUCCESS, res.body);
            break;
          case 401:
            this.dispatch(SessionConstants.PASSWORD_RESET_FAILED, res.body);
            break;
          default:
            throw new AppError("Password reset failed").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(SessionConstants.REQUEST_FAILED, err);
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
        'login_required': false,
        'login_message': undefined,
        'login_success': false,
        'login_tries': 0,
        'popup_content': undefined,
        'password_reset_fail': undefined
    };
    this.handlers = {
      _handleLogin: SessionConstants.LOGIN_SUCCESS,
      _handleLoginFail: SessionConstants.LOGIN_FAILED,
      _handleLogout: SessionConstants.LOGOUT,
      _handleSetMessage: SessionConstants.USER_MESSAGE_SET,
      _handleDismissMessage: SessionConstants.USER_MESSAGE_DISMISS,
      _handleRequestFailed: SessionConstants.REQUEST_FAILED,
      _handleLoginRequired: SessionConstants.LOGIN_REQUIRED,
      _handleSetAuthRedirect: SessionConstants.ON_AUTH_REDIRECT,
      _handleSetPopupContent: SessionConstants.SET_POPUP_CONTENT,
      _handleDismissPopupContent: SessionConstants.DISMISS_POPUP_CONTENT,
      _handleManualRedirect: SessionConstants.REDIRECT,
      _handleResetPasswordRequest: SessionConstants.RESET_PASSWORD,
      _handlePasswordResetFailed: SessionConstants.PASSWORD_RESET_FAILED,
      _handleDismissError: SessionConstants.DISMISS_ERROR
    };
  }

  // Action Handlers
  _handleLogin(resp){
    log.Debug("handling session login...");
    localstorage.set('gaea_jwt', resp.jwt);
    localstorage.set('gaea_user', resp.user);
    this.setState({'login_success': true,
                   'login_tries': 0,
                   'login_required': false,
                   'password_reset_fail': false
                  });
    if (resp.redirect) {
      this._redirect(resp.redirect);
    }
    if (this.state.auth_redirect) {
      this._redirect(this.state.auth_redirect);
    }
    this.hasChanged();
  }

  _handleLoginFail(resp) {
    this.setState({'login_tries': this.state.login_tries+1});
    this._redirect('login');
    this.hasChanged();
  }

  _handleLogout(resp) {
    localstorage.delete('gaea_jwt');
    localstorage.delete('gaea_user');
    this.setState({'login_success': false});
    this.hasChanged();
    this._redirect('logout');
  }

  _handleSetMessage(msg) {
    this.setState({'user_message': msg});
    this.hasChanged();
  }

  _handleDismissMessage() {
    this.setState({'user_message': undefined});
    this.hasChanged();
  }

  _handleRequestFailed(err) {
    this.setState({'error': err});
    this.hasChanged();
  }

  _handleDismissError() {
    this.setState({'error': undefined});
  }

  _handleResetPasswordRequest() {
    log.Debug("Requesting password reset...");
  }

  _handlePasswordResetFailed(resp) {
    this.setState({'password_reset_fail': true});
  }

  _handleLoginRequired(msg) {
    this.setState({'login_required': true,
                  'login_message': msg});
    this.hasChanged();
  }

  _handleSetPopupContent(content) {
    this.setState({'popup_content': content});
    this.hasChanged();
  }

  _handleDismissPopupContent() {
    this.setState({'popup_content': undefined});
    this.hasChanged();
  }

  _handleSetAuthRedirect(redirect) {
    this.setState({'auth_redirect': redirect});
    this.hasChanged();
  }

  _handleManualRedirect(target, wait) {
    if (wait === undefined) {
        wait = 0;
    }
    var exec = () => {
        this._redirect(target);
    };
    setTimeout(exec, wait);
  }

  _redirect(target) {
    log.Debug('redirecting to ' + target);
    window.location = window.location.origin + '/#/' + target;
    this.setState({'auth_redirect': undefined});
  }

  // Methods
  getSession() {
    return this.state;
  }
  // getSession() {
  //   return this.fetch({
  //     id: 'session',
  //     locally: function() {
  //       return this.state;
  //     },
  //     remotely: function() {
  //       console.log("Unable to return the session storage.");
  //     }
  //   });
  //}

}

module.exports.SessionStore = SessionStore;
module.exports.SessionQueries = SessionQueries;
module.exports.SessionActions = SessionActions;
module.exports.SessionAPI = SessionAPI;
