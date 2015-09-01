var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");

var UserConstants = Marty.createConstants([
  'USER_RECEIVE',
  'USER_UPDATE',
  'ALL_USERS_RECEIVE',
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
   
   getAllUsers() {
     return this.get(Config.baseURL + '/users');
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
            throw new AppError("Could not get the current user").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(UserConstants.REQUEST_FAILED, err)
      });
  }
  
  getAllUsers() {
    return this.app.UserAPI.getAllUsers()
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(UserConstants.ALL_USERS_RECEIVE, res.body);
            break;
          case 401:
            this.dispatch(UserConstants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not get list of all users").getError();
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
      _handleAllReceive: UserConstants.ALL_USERS_RECEIVE
    };
  }

  // Action Handlers
  _handleReceive(user) {
    console.log("handling user receive...");
    this.state['user'] = new User(user);
    this.hasChanged();
  }
  
  _handleAllReceive(res) {
    if (res.qty === 0) {
      this.state['users'] = [];
    } else {
      this.state['users'] = res.users;
    }
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
  
  getAllUsers() {
    return this.fetch({
      id: 'users',
      locally: function() {
        return this.state['users'];
      },
      remotely: function() {
        return this.app.UserQueries.getAllUsers();
      }
    });

  }

}

//module.exports = Marty.register(UserStore);
module.exports.UserStore = UserStore;
module.exports.UserQueries = UserQueries;
module.exports.UserAPI = UserAPI;
