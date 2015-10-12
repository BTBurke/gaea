var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var log = require('../services/logger');
var Spinner = require('../components/spinner');

class Account extends React.Component {
    constructor(props) {
        this.state = {
            'submit': false,
            'error': undefined,
            'success': undefined
        };
    }

    createAccount() {
        log.Debug("creating account...");
        var first_name = this.refs.firstname.getValue();
        var last_name = this.refs.lastname.getValue();
        var email = this.refs.email.getValue();
        var role = this.refs.role.getValue();

        if (first_name.length === 0 || last_name.length === 0) {
            this.setState({'error': 'Name cannot be blank'});
            return;
        }

        if (!email.endsWith('.gov')) {
            this.setState({'error': 'To sign up for an account from this page, you must use your .gov email address.  You can change it later.'});
            return;
        }

        if (role !== "member" && role !== "nonmember") {
          this.setState({'error': 'You must pick a member status.  If you joined at any time in the past, you are still a member.'});
          return;
        }


        this.setState({'submit': true});
        this.app.UserQueries.createUserExternal({
          "first_name": first_name,
          "last_name": last_name,
          "email": email,
          "role": role
        });

    }

    componentWillReceiveProps(newprops) {
      log.Debug("new props", newprops);
      if (newprops.status.createOK === true) {
        this.setState({
          "submit": false,
          "success": "Account created successfully, check your email to set your password."
        });
        return;
      }
      if (newprops.status.createOK === false) {
        if (newprops.status.user_exists) {
          this.setState({
            'submit': false,
            'error': 'A user with this email address already exists.  Try logging in from the homepage or visit https://guangzhouaea.org/#/reset to reset your password.'
          });
        } else {
        this.setState({
          "submit": false,
          "error": "Account creation failed.  Make sure you filled out all parts of the form and used your .gov email address."
        });
        }
      }
    }

    backStyle() {
        return {
            'height': $(window).height()/2
        };
    }

    fullHeight() {
        return {
            'height': $(window).height()
        };
    }

    render() {
        var renderOnSuccess = () => {
          if (this.state.success) {
            return (
              <B.Alert bsStyle='success'>{this.state.success}</B.Alert>
            );
          }
          return (
            <div>
            <div className="box-name-container">
                <div className="box-name-left">
                <B.Input type="text" label="First Name" ref="firstname" />
                </div>
                <div className="box-name-right">
                <B.Input type="text" label="Last Name" ref="lastname" />
                </div>
            </div>
            <B.Input type="text" label="Enter a .gov email address" ref="email" />
            <B.Input type="select" label="Are you a member?" ref="role">
              <option value=""></option>
              <option value="member">Yes, I'm a member already</option>
              <option value="nonmember">I'm not a member yet</option>
            </B.Input>
            <B.Button bsSize="large" bsStyle='info' block onClick={this.createAccount.bind(this)}>Create Account{this.state.submit ? <Spinner /> : null}</B.Button>
            <div className="box-fine-print">
            We use your .gov email address to verify your account eligibility.  After that, we recommend you use your personal email with the GAEA website.
            </div>
            </div>
          );
        };

        return (
            <div className="account-all" style={this.fullHeight()}>
            <div className="landing-header"><img className={"logo"} src={"images/gaea.png"}></img>Guangzhou American Employees Association</div>
            <div className="account-container" style={this.backStyle()}></div>
                <div className="account-sign-up-box">
                    <div className="box-header">
                    Create a new account
                    </div>
                    {renderOnSuccess()}
                    {this.state.error ? <div className="account-error-box">{this.state.error}</div> : null}
                </div>

                <div className="account-callout-container">
                    <div className="callout-left">
                        <div className="callout-header">Who is eligible?</div>
                        U.S. citizens and resident aliens who are employees of the U.S. Federal Government assigned a tour of duty to the U.S. Consulate General in Guangzhou, China are eligible for full memberships.
                    </div>
                    <div className="callout-right">
                        <div className="callout-header">What are the benefits?</div>
                        The association exists to serve the interests of its members.  Enjoy benefits such as discounts at local establishments, duty-free liquor imports, discounts on events, and more.
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Marty.createContainer(Account, {
  listenTo: ['SessionStore', 'UserStore'],
  fetch: {
    session: function() {
      var sess = this.app.SessionStore.getSession();
      return sess;
    },
    status: function() {
      return this.app.UserStore.getCreateStatus();
    }
  }
});
