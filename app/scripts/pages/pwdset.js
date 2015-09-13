var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var log = require('../services/logger');
var TopNav = require('../components/topnav');
var Spinner = require('../components/spinner');

class PwdSet extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
          'error': undefined,
          'submit': false
        };
    }

    set() {
      var pwd1 = this.refs.pwd1.getValue();
      var pwd2 = this.refs.pwd2.getValue();
      if (pwd1.length === 0 || pwd1 !== pwd2) {
        this.setState({'error': 'Passwords must be the same.'});
        return;
      }
      this.setState({'error': undefined, 'submit': true});
      this.app.SessionActions.setAuthRedirect("home");
      this.app.SessionQueries.setPassword(pwd1, this.props.params.token);
    }

    componentWillReceiveProps(newprops) {
      if (newprops.password_reset_fail) {
        this.setState({
          'error': 'Password reset failed.  Your password reset token is probably expired.  Visit https://guangzhouaea.org/#/reset for a new token.',
          'submit': false
        });
      }
    }

    render() {
        return (
          <div>
            <TopNav />
            <B.Grid>
                <B.Row>
                  <B.Col md={4} lg={4} mdOffset={4} lgOffset={4}>
                  <h4>Set your password</h4>
                  <div className="login-container">
                    <B.Input type="password" label="Enter your password" ref="pwd1" />
                    <B.Input type="password" label="Enter your password again" ref="pwd2" />
                    <B.Button bsStyle='info' onClick={this.set.bind(this)}>Set your password{this.state.submit ? <Spinner /> : null}</B.Button>
                  </div>
                  {this.state.error ? <span className="login-error">{this.state.error}</span> : null}
                  </B.Col>
                </B.Row>
            </B.Grid>
        </div>
        );
    }
}

module.exports = Marty.createContainer(PwdSet, {
  listenTo: ['SessionStore'],
  fetch: {
    session: function() {
      var sess = this.app.SessionStore.getSession();
      return sess;
    }
  }
});
