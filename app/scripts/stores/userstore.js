var Store = require("marty");

var UserConstants = Marty.createConstants([
  'USER_LOGIN',
  'USER_LOGOUT',
  'USER_UPDATE',
  'USER_LOGIN_FAILED',
  'USER_UPDATE_FAILED'
]);

// UserAPI reflects all routes associated with managing user state
class UserAPI extends Marty.HttpStateSource {
   login(user, pw) {
      if (user === 'admin' && pw === 'admin') {
        return this.get('http://echo.jsontest.com/userid/admin');
      }
   }
}
var userAPI = Marty.register(UserAPI);

// UserQueries sends HTTP requests to the server and dispatches actions
// based on server response
class UserQueries extends Marty.Queries {
  login(user, pw) {
    this.dispatch(UserConstants.USER_LOGIN_STARTING, user);

    return userAPI.login(user, pw)
      .then(res => this.dispatch(UserConstants.USER_LOGIN, res.body))
      .catch(err => this.dispatch(UserConstants.USER_LOGIN_FAILED, err));
  }

  logout(user) {
    return this.dispatch(UserConstants.USER_LOGOUT);
  }

}
var userQueries = Marty.register(UserQueries);


// class User {
//   constructor() {
//     this.userName = null;
//     this.firstName = null;
//     this.lastName = null;
//     this.emailAddress = null;
//     this.fullName = null;
//     this.role = null;
//     this.uuid = null;
//   }
//
//   fromProps(props) {
//     this.userName = props.user_name;
//     this.firstName = props.first_name;
//     this.lastName = props.last_name;
//     this.emailAddress = props.email;
//     this.fullName = props.first_name + ' ' + props.last_name;
//     this.role = props.role;
//     this.uuid = props.uuid;
//   }
//
//   isLoggedIn() {
//     return this.uuid !== null
//   }
//
//   isAdmin() {
//     return this.role === 'admin'
//   }
//
//   isSuperAdmin() {
//     return this.role === 'superadmin'
//   }
// }

class UserStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      handleLogin: UserConstants.USER_LOGIN,
      handleLogout: UserConstants.USER_LOGOUT
    };
  }

  //////////////////////////////////////////////////////
  // Action Handlers
  //////////////////////////////////////////////////////
  handleLogin(user) {
    this.state[userId] = user.userid;
    this.hasChanged();
  }
  handleLogout() {
    this.state = {};
    this.hasChanged();
  }

  //////////////////////////////////////////////////////
  // Methods
  /////////////////////////////////////////////////////
  Login(user, pw) {
    return this.fetch({
      id: user,
      locally: function () {
        return this.state[userId];
      },
      remotely: function () {
        return userQueries.login(user,pw)
      }
    });
  }

  Logout() {
    return userQueries.logout();
  }
}

module.exports = UserStore;
