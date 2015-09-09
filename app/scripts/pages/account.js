var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var log = require('../services/logger');
var Spinner = require('../components/spinner');

class Account extends React.Component {
    constructor(props) {
        this.state = {
            'submit': false,
            'error': undefined
        };
    }

    createAccount() {
        log.Debug("creating account...");
        var first_name = this.refs.firstname.getValue();
        var last_name = this.refs.lastname.getValue();
        var email = this.refs.email.getValue();

        if (first_name.length === 0 || last_name.length === 0) {
            this.setState({'error': 'Name cannot be blank'});
            return;
        }

        if (!email.endsWith('.gov')) {
            this.setState({'error': 'To sign up for an account from this page, you must use your .gov email address.  You can change it later.'});
            return;
        }

        this.setState({'submit': true});

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
        return (
            <div className="account-all" style={this.fullHeight()}>
            <div className="landing-header"><img className={"logo"} src={"images/gaea.png"}></img>Guangzhou American Employees Association</div>
            <div className="account-container" style={this.backStyle()}></div>
                <div className="account-sign-up-box">
                    <div className="box-header">
                    Create a new account
                    </div>
                    <div className="box-name-container">
                        <div className="box-name-left">
                        <B.Input type="text" label="First Name" ref="firstname" />
                        </div>
                        <div className="box-name-right">
                        <B.Input type="text" label="Last Name" ref="lastname" />
                        </div>
                    </div>
                    <B.Input type="text" label="Enter a .gov email address" ref="email" />
                    <B.Button bsSize="large" bsStyle='info' block onClick={this.createAccount.bind(this)}>Create Account{this.state.submit ? <Spinner /> : null}</B.Button>
                    <div className="box-fine-print">
                    We use your .gov email address to verify your account eligibility.  After that, we recommend you use your personal email with the GAEA website.
                    </div>
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
  listenTo: ['SessionStore'],
  fetch: {
    session: function() {
      var sess = this.app.SessionStore.getSession();
      return sess;
    }
  }
});
