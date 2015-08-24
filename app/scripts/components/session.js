var React = require('react');
var B = require('react-bootstrap');

var Marty = require('marty');
var Application = require('../stores/application');
var log = require('../services/logger');

var app = new Application();

class Session extends React.Component {
  constructor(props) {
    super(props);
  }
  _dismissMessage() {
    this.app.SessionActions.dismissMessage();
  }

  _closePopup() {
    this.app.SessionActions.dismissPopupContent();
  }

  _improperLoginClose() {
    log.Debug("Need to redirect on improper close...");
  }

  _handleLogin() {
    log.Debug("going to login...");
  }

  render() {

    var displayMessage = () => {
      return (
        <div className="session-message">
          <B.Grid>
            <B.Row>
              <B.Col md={8} lg={8} mdOffset={2} lgOffset={2}>
              {this.props.session.user_message}
              </B.Col>
              <B.Col md={1} lg={1} mdOffset={1} lgOffset={1}>
              <p onClick={this._dismissMessage.bind(this)}>Dismiss</p>
              </B.Col>
            </B.Row>
          </B.Grid>
        </div>
      );
    }

    var displayPopupContent = () => {
      log.Debug("showing modal content...");
      return (
      <B.Modal show={this.props.session.popup_content != undefined} onHide={this._closePopup.bind(this)}>
        <B.Modal.Header closeButton>
          <B.Modal.Title>Test Title</B.Modal.Title>
        </B.Modal.Header>
        <B.Modal.Body>
          {this.props.session.popup_content}
        </B.Modal.Body>
        <B.Modal.Footer>
        <B.Button onClick={this._closePopup.bind(this)}>Close</B.Button>
        </B.Modal.Footer>
      </B.Modal>
      );
    }

    var displayLoginBox = () => {
      return (
        <B.Modal show={this.props.session.login_required}
                onHide={this._improperLoginClose.bind(this)}
                keyboard={false}
                bsSize='medium'
                backdrop='static'
                >
          <B.Modal.Header>
            <B.Modal.Title>Login Required</B.Modal.Title>
          </B.Modal.Header>
          <B.Modal.Body>
            <div className="session-login-message">
            {this.props.session.login_message ? this.props.session.login_message : "This action requires you to be logged in.  Please log in and retry what you were doing."}
            </div>
          </B.Modal.Body>
          <B.Modal.Footer>
          <B.Button bsStyle='info' onClick={this._handleLogin.bind(this)}>Login</B.Button>
          </B.Modal.Footer>
        </B.Modal>
      );
    }

    log.Debug('app from session', this.app);

    return (
      <div className="session-container">
        {this.props.session.errors ? displayErrors() : null}
        {this.props.session.user_message ? displayMessage() : null}
        {this.props.session.login_required ? displayLoginBox() : null}
        {this.props.session.popup_content ? displayPopupContent() : null}
      </div>
    );
  }
}

module.exports = Marty.createContainer(Session, {
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
