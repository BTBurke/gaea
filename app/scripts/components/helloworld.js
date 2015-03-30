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
    Button = B.Button;


class HelloWorld extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      "user": '',
      "pw": '',
      "height": 0,
      "img": ''
    }
  }

  componentWillMount() {
      this.updateDimensions();
      var headerImgs = ["con-01.jpg", "con-02.jpg", "con-03.jpg", "con-04.jpg"];
      var headerImg = "images/" + _.first(_.shuffle(headerImgs));
      this.setState({"img": headerImg});

  }

  updateDimensions() {
    this.setState({"height": $(window).height() - 50});
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  calcHeight() {
    return $(window).height() - 50;
  }

  handleChange() {
    this.setState({
      "user": this.refs.username.getValue(),
      "pw": this.refs.password.getValue()
    })
  }

  handleSubmit() {
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
              <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Login</Button>
              </form>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
      </div>
    );
  }
}

module.exports = HelloWorld;
