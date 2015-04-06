var Actions = require('flummox').Actions;

class UserActions extends Actions {
  login(user, pw) {
    // Only for frontend testing, done on server in production
          return {
        'user_name': 'admin',
        'first_name': 'Admin',
        'last_name': 'User',
        'email': 'test@gzaea.org',
        'role': 'user',
        'uuid': '065d7596-5f1f-495e-993f-6b883a08c3d0',
      };
    
  }

  logout() {
    return
  }

  updateProfile(props) {
    return props
  }

}

module.exports = UserActions;
