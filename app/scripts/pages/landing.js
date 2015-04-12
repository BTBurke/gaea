'use strict';

var React = require('react'),
    B = require('react-bootstrap'),
    _ = require('underscore'),
    $ = require('jquery'),
    Col = B.Col,
    Row = B.Row,
    Grid = B.Grid,
    Navbar = B.Navbar,
    Nav = B.Nav,
    Input = B.Input,
    Button = B.Button,
    Glyphicon = B.Glyphicon;

var AjaxLoginButton = require("../components/ajaxbutton");

var Link = require('react-router').Link;

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      "user": '',
      "pw": '',
      "height": 0,
      "img": '',
      "loginBtn": '',
    }
  }

  componentWillMount() {
      this.updateDimensions();
      var headerImgs = ["con-01.jpg", "con-02.jpg", "con-03.jpg", "con-04.jpg"];
      var headerImg = "images/" + _.first(_.shuffle(headerImgs));
      this.setState({"img": headerImg});

  }

  updateDimensions() {
    var height = $(window).height();
    if (height >= 850) {
      height = 850;
    }
    this.setState({"height": height-50});
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  handleChange() {
    this.setState({
      "user": this.refs.username.getValue(),
      "pw": this.refs.password.getValue()
    })
  }

  handleSubmit() {
    this.setState({"loginBtn": "fetch"});
    console.log(this.state.user, this.state.pw);
  }

  render() {


    var style = {
      "background-image": "url(\"" + this.state.img + "\")",
      "height": this.state.height
    }

    return (

      <div>
      <div className={"landing-header"}><img className={"logo"} src={"images/gaea.png"}></img>Guangzhou American Employees Association</div>
      <div className={"landing-main-content-img"} style={style}>
        <Grid fluid={true}>
          <Row>
            <Col xs={10} xsOffset={1} md={6} mdOffset={4} lg={4} lgOffset={6}>
              <div className={"landing-login-box"}>
              <h1>Members Login</h1>
                <form onSubmit={this.handleSubmit.bind(this)}>
                <Input
                type='text'
                value={this.state.user}
                placeholder=''
                label='Email address'
                hasFeedback
                ref='username'
                onChange={this.handleChange.bind(this)}
                />

                <Input
                type='password'
                value={this.state.pw}
                placeholder=''
                label='Password'
                hasFeedback
                ref='password'
                onChange={this.handleChange.bind(this)}
                />
              <AjaxLoginButton status={this.state.loginBtn} onClick={this.handleSubmit.bind(this)}></AjaxLoginButton>
              </form>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
      <div className={"landing-before-sale"}>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} md={6} mdOffset={6} lg={4} lgOffset={4}>
              <Button bsStyle='success' bsSize='large' block><span className="call">Join the GAEA</span></Button>
            </Col>
          </Row>
      </Grid>
      </div>
      <div className={"landing-foot-boundingbox"}>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} md={4} mdOffset={2} lg={4} lgOffset={2}>
              <div className={"landing-benefit"}>
                <h2>Save Money</h2>
                <h2><Glyphicon glyph='piggy-bank' /></h2>
                <p>GAEA members save money when shopping at participating organizations</p>
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div className={"landing-benefit"}>
                <h2>Support the Community</h2>
                <h2><Glyphicon glyph='globe' /></h2>
                <p>GAEA supports the community with fun events, group buying opportunities, and more</p>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
      <div className={"landing-footer"}>
      The Guangzhou American Employees Association is a 501(c)(3) non-profit organization representing the interests of American direct-hires and eligible family members assigned to the United States Consulate General in Guangzhou, China.
      <br/><Link to="tos">Terms of Service</Link>
      </div>
      </div>

    );
  }
}

module.exports = Landing;
