var React = require('react'),
    B = require('react-bootstrap'),
    Button = B.Button,
    Spinner = require('react-spinkit');

class AjaxLoginButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //console.log("in the new btn");
    if (this.props.status === '') {
      return (
        <Button bsStyle="success" bsSize="large" block onClick={this.props.onClick}>Login</Button>
      );
    }
    if (this.props.status === 'fetch') {
      return (
        <Button bsStyle="success" bsSize="large" block>
        <Spinner spinnerName="chasing-dots" className="landing-spinner"></Spinner>
        </Button>
      );
    }
  }
}

module.exports = AjaxLoginButton;
