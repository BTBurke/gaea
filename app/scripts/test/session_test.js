var React = require('react');
var B = require('react-bootstrap');

var Marty = require('marty');
var Session = require('../components/session');
var Application = require('../stores/application');

var app = new Application();
var log = require('../services/logger');

class SessionTest extends React.Component {
  constructor(props) {
    super(props);
  }

  _setMessage(msg) {
    this.app.SessionActions.setMessage("Test Message");
  }

  _setPopup() {
    this.app.SessionActions.setPopupContent("This is my test popup content");
  }

  _triggerLogin() {
    this.app.SessionActions.triggerLogin("This is my custom login message");
  }

  render() {
    console.log('app', this.app);
    return (
    <div>
    <Session />
    <B.Grid>
      <B.Row>
        <h2>This is a test page for the session component</h2>
        <h3>Test 1: Setting a user message</h3>
        <div>Clicking the button shows a user message with the message "Test Message"</div>
        <B.Button onClick={this._setMessage.bind(this)}>Trigger User Message</B.Button>

        <h3>Test 2: Trigger a modal popup with recent changes or important messages</h3>
        <div>Clicking the button shows a modal dialog</div>
        <B.Button onClick={this._setPopup.bind(this)}>Trigger Modal Dialog</B.Button>

        <h3>Test 3: Trigger a login</h3>
        <div>Clicking the button shows a login dialog</div>
        <B.Button onClick={this._triggerLogin.bind(this)}>Trigger Login Dialog</B.Button>

      </B.Row>
    </B.Grid>
    </div>
  );
  }
}

module.exports = Marty.createContainer(SessionTest, {
  listenTo: ['SessionStore'],
  fetch: {
    session: function() {
      log.Debug('getting session...');
      var sess = this.app.SessionStore.getSession();
      log.Debug('Got session', sess);
      return sess;
    }
  }
});
