var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var Marty = require('marty');
var Application = require('../stores/application');
var log = require('../services/logger');

var app = new Application();

class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'error': undefined,
      'submit': false
    }
  }
  _dismissMessage() {
    this.app.SessionActions.dismissMessage();
  }

  _dismissError() {
    this.app.SessionActions.dismissError();
  }

  _closePopup() {
    this.app.SessionActions.dismissPopupContent();
  }


  _handleLogin() {
    log.Debug("going to login...");
    var email = this.refs.email.getValue();
    var pwd = this.refs.pwd.getValue();
    if (email.length === 0 || pwd.length === 0) {
      this.setState({'error': 'Username and password must be provided'});
      return
    }
    this.setState({'submit': true});
    this.app.SessionActions.setAuthRedirect(window.location.origin);
    this.app.SessionQueries.login(email, pwd);
  }

  notSuppressed() {
    var home = window.location.origin;
    var suppress = [home + '/#/', home + '/#/login', home + '/#/set', home + '/#/reset', home + '/#/account'];
    var isSupressed = _.contains(suppress, window.location.href);
    return !isSuppressed;
  }

  componentWillReceiveProps(newprops) {
    if (newprops.session.login_required) {
      this.app.SessionActions.redirect('login');
    }
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
    };

    var displayErrors = () => {
      return (
      <B.Modal show={this.props.session.error !== undefined && this.notSuppressed.bind(this)} bsSize='large' onHide={this._dismissError.bind(this)}>
        <B.Modal.Header closeButton>
          <B.Modal.Title>Something Bad Happened</B.Modal.Title>
        </B.Modal.Header>
        <B.Modal.Body>
        <B.Grid fluid={true}>
          <B.Row>
            <B.Col md={6} lg={6} sm={6}>
              <img src={_.sample(['images/livinthedream.gif', 'images/nopoints.gif'])} />
            </B.Col>
            <B.Col md={6} lg={6} sm={6}>
              Something really bad happened and the error is:
              <div className="session-fail-msg">{this.props.session.error}</div>
              You can probably try what you were doing again.  It might succeed, or it might not. <p />Best just to take the rest of the day off and try tomorrow.  If you are really concerned, let us know at <a href="mailto:help@guangzhouaea.org">help@guangzhouaea.org</a>.
            </B.Col>
          </B.Row>
        </B.Grid>
        </B.Modal.Body>
      </B.Modal>
      );
    };

    var displayPopupContent = () => {
      log.Debug("showing modal content...");
      return (
      <B.Modal show={this.props.session.popup_content !== undefined} onHide={this._closePopup.bind(this)}>
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
    };

    // var displayLoginBox = () => {
    //   return (
    //     <B.Modal show={this.props.session.login_required && this.notSuppressed.bind(this)}
    //             keyboard={false}
    //             bsSize='medium'
    //             backdrop='static'
    //             >
    //       <B.Modal.Header>
    //         <B.Modal.Title>Login Required</B.Modal.Title>
    //       </B.Modal.Header>
    //       <B.Modal.Body>
    //         <div className="session-login-message">
    //         {this.props.session.login_message ? this.props.session.login_message : "This action requires you to be logged in.  Please log in and retry what you were doing."}
    //         </div>
    //         <B.Input type='text' ref="email" label="Email Address" />
    //         <B.Input type='password' ref='pwd' label='Password' />
    //       </B.Modal.Body>
    //       <B.Modal.Footer>
    //       <B.Button bsStyle='info' onClick={this._handleLogin.bind(this)}>Login</B.Button>
    //       </B.Modal.Footer>
    //     </B.Modal>
    //   );
    // }

    log.Debug('app from session', this.app);

    return (
      <div className="session-container">
        {this.props.session.error ? displayErrors() : null}
        {this.props.session.user_message ? displayMessage() : null}
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
