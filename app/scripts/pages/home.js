'use strict';

var Marty = require('marty');
var UserStore = require('../stores/userstore');
var React = require('react');
var B = require('react-bootstrap');

var TopNav = require('../components/topnav');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');

var app = new Application();

class Home extends React.Component {
  render() {
    return (
      <div>
      <TopNav user={this.props.user.userName}/>
      <B.Grid>
        <B.Row>
          <B.Col md={3} lg={3}>
            <B.ListGroup>
              <B.ListGroupItem href="/#/order">Submit an Order</B.ListGroupItem>
              <B.ListGroupItem href="/#/events">See Schedule of Events</B.ListGroupItem>
            </B.ListGroup>
          </B.Col>

          <B.Col md={9} lg={9}>

            <B.Panel header='Use your duty-free liquor benefit'>
              <p>The next duty-free liquor order is coming up.  We expect that all orders will have to be in by the end of July for a delivery date in August.</p>
              <B.Button bsStyle='success' bsSize='small' href='/#/order'>Submit an order</B.Button>
              <div className="home-posted-on">Posted on 5-June-2015</div>

            </B.Panel>
          </B.Col>
        </B.Row>
      </B.Grid>

      </div>
    );
  }
}


module.exports = Marty.createContainer(Home, {
  listenTo: 'UserStore',
  fetch: {
    user() {
      return this.app.UserStore.getUser();
    }
  }
});
