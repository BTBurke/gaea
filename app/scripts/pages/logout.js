var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var localstorage = require('local-storage');

var TopNav = require('../components/topnav');

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.app.SessionQueries.logout(localstorage.get('gaea_user'));
  }

  render() {
    var sty = {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '15px',
      marginBottom: '15px',
      width: '100%',
      textAlign: 'center'
    };

    return (
      <div>
      <TopNav />
      <div style={sty}>
      You have been logged out<br />
      <a href="/#/login">Take me to the login page</a>
      </div>

      </div>
    );
  }
}

module.exports = Marty.createContainer(Logout, {
  listenTo: ['SessionStore'],
  fetch: {
    session: function() {
      var sess = this.app.SessionStore.getSession();
      return sess;
    }
  }
});
