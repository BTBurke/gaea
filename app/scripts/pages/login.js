var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var log = require('../services/logger');
var TopNav = require('../components/topnav');
var Spinner = require('../components/spinner');

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          'error': this.props.session.login_tries > 0 ? 'Username or password incorrect' : undefined,
          'submit': false
        }
    }

    login() {
      log.Debug("trying login...");
      var user = this.refs.email.getValue();
      var pwd = this.refs.pwd.getValue();
      if (user.length === 0) {
        this.setState({'error': 'Username cannot be empty'});
        return
      }
      if (pwd.length === 0) {
        this.setState({'error': 'Password cannot be empty'});
        return
      }
      this.setState({'error': undefined,
                    'submit': true
                    });
      this.app.SessionActions.setAuthRedirect("home");
      this.app.SessionQueries.login(user, pwd);
    }

    componentWillReceiveProps(newprops) {
      log.Debug(newprops);
      if (newprops.session.login_tries > 0) {
        this.setState({'error': 'Username or password incorrect',
          'submit': false
        });
      }
    }

    render() {
      log.Debug('session', this.props.session);
        return (
          <div>
            <TopNav />
            <B.Grid>
                <B.Row>
                  <B.Col md={4} lg={4} mdOffset={4} lgOffset={4}>
                  <h4>Login</h4>
                  <div className="login-container">
                  <B.Input type="text" label="Email Address" ref="email" />
                  <B.Input type="password" label="Password" ref="pwd" />
                  <B.Button bsStyle='info' onClick={this.login.bind(this)}>Login{this.state.submit ? <Spinner /> : null}</B.Button>
                  </div>
                  {this.state.error ? <span className="login-error">{this.state.error}</span> : null}
                  <div className="login-reset-link">
                    {this.props.session.login_tries > 1 ? <a href="/#/reset">Forgot your password?</a> : null}
                  </div>
                  </B.Col>
                </B.Row>
            </B.Grid>
        </div>
        );
    }
}

module.exports = Marty.createContainer(Login, {
  listenTo: ['SessionStore'],
  fetch: {
    session: function() {
      var sess = this.app.SessionStore.getSession();
      return sess;
    }
  }
});
