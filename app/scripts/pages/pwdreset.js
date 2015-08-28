var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var log = require('../services/logger');
var TopNav = require('../components/topnav');

class PwdReset extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
          'error': undefined
        }
    }

    reset() {
      log.Debug("trying reset...");
      var user = this.refs.email.getValue()
      if (user.length === 0) {
        this.setState({'error': 'Email cannot be empty'});
        return
      }
      this.setState({'error': undefined});
      this.app.SessionQueries.requestReset(user);
      this.setState({'error': 'Password reset requested'});
      this.app.SessionActions.redirect("", 1000);
    }

    render() {
      log.Debug('session', this.props.session);
        return (
          <div>
            <TopNav />
            <B.Grid>
                <B.Row>
                  <B.Col md={4} lg={4} mdOffset={4} lgOffset={4}>
                  <h4>Reset your password via email</h4>
                  <div className="login-container">
                  <B.Input type="text" label="Email Address" ref="email" />
                  <B.Button bsStyle='info' onClick={this.reset.bind(this)}>Send password reset instructions</B.Button>
                  </div>
                  {this.state.error ? <span className="login-error">{this.state.error}</span> : null}
                  </B.Col>
                </B.Row>
            </B.Grid>
        </div>
        );
    }
}

module.exports = Marty.createContainer(PwdReset, {
  listenTo: ['SessionStore'],
  fetch: {
    session: function() {
      var sess = this.app.SessionStore.getSession();
      return sess;
    }
  }
});
