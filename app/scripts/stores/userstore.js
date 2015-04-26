var Marty = require("marty");

var UserConstants = Marty.createConstants([
  'USER_RECEIVE',
  'USER_UPDATE',
  'USER_RECEIVE_FAILED',
  'USER_UPDATE_FAILED'
]);

// UserAPI reflects all routes associated with managing user state
class UserAPI extends Marty.HttpStateSource {
   getUser() {
      return this.get('http://echo.jsontest.com/user_name/admin/first_name/admin/last_name/admin/email/test@gzaea.org/role/admin/uuid/xxxx-xxxx-xxxxxxx-xxxx');
   }
}
var userAPI = Marty.register(UserAPI);

// UserQueries sends HTTP requests to the server and dispatches actions
// based on server response
class UserQueries extends Marty.Queries {
  getUser() {
    this.dispatch(UserConstants.USER_RECEIVE_STARTING);

    return userAPI.getUser()
      .then(res => this.dispatch(UserConstants.USER_RECEIVE, res.body))
      .catch(err => this.dispatch(UserConstants.USER_RECEIVE_FAILED, err));
  }
}
var userQueries = Marty.register(UserQueries);


class User {

  constructor(props) {
    this.userName = props.user_name;
    this.firstName = props.first_name;
    this.lastName = props.last_name;
    this.emailAddress = props.email;
    this.fullName = props.first_name + ' ' + props.last_name;
    this.role = props.role;
    this.uuid = props.uuid;
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

class UserStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      handleReceive: UserConstants.USER_RECEIVE,
    };
  }

  //////////////////////////////////////////////////////
  // Action Handlers
  //////////////////////////////////////////////////////
  handleReceive(user) {
    console.log("handling user receive...");
    this.state['user'] = new User(user);
    console.log(this.state);
    this.hasChanged();
  }


  //////////////////////////////////////////////////////
  // Methods
  /////////////////////////////////////////////////////

  getUser() {
    return this.fetch({
      id: 'user',
      locally: function() {
        return this.state['user'];
      },
      remotely: function() {
        return userQueries.getUser();
      }
    });

  }

}

module.exports = Marty.register(UserStore);
