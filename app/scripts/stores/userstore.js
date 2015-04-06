var Store = require("flummox").Store;

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

class UserStore extends Store {
  constructor(flux) {
    super();

    console.log(flux);
    const userActionIds = flux.getActionIds('user');
    this.register(userActionIds.login, this.handleLogin);
    this.register(userActionIds.logout, this.handleLogout);
    this.register(userActionIds.updateProfile, this.handleUpdateProfile);

    this.state = {
      user: {},
    };
  }

  handleLogin(user) {
    this.setState({
      user: {"userID": "admin"},
    });
  }

  handleLogout() {
    this.setState({
      user: {},
    });
  }

  handleUpdateProfile(user) {
    this.setState({
      user: {"userID": "admin"},
    });
  }

  getState() {
    return this.state.user;
  }
}

module.exports = UserStore;
