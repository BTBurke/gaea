'use strict';

var Marty = require('marty');
var UserStore = require('../stores/userstore');
var OrderStore = require('../stores/orderstore');
var React = require('react');
var B = require('react-bootstrap');

var TopNav = require('../components/topnav');
var SideMenu = require('../components/sidemenu');
var OrderTable = require('../components/ordertable');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');

var app = new Application();

class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.menu = {'title': undefined,
        'items': [
          {'key': 0, 'href': '/order/completed', 'text': 'View completed orders'},
          ]
      };
    this.adminMenu = {'title': 'Admin Links',
        'items': [
          {'key': 0, 'href': '/sale', 'text': 'Create a new sale'}
          ]
    }
  }

  render() {

    var adminMenu = function(role, menu) {
      if (role === 'admin') {
        return (
          <SideMenu menu={menu}/>
        );
      }
    }

    return (
      <div>
      <TopNav user={this.props.user.fullName}/>
      <B.Grid>
        <B.Row>
          <B.Col md={3} lg={3}>
            <SideMenu menu={this.menu}/>
            {adminMenu(this.props.user.role, this.adminMenu)}
          </B.Col>

          <B.Col md={9} lg={9}>
              <OrderTable title="Open Orders" orders={this.props.orderstore.orders}/>
          </B.Col>
        </B.Row>
      </B.Grid>

      </div>
    );
  }
}


module.exports = Marty.createContainer(Orders, {
  listenTo: ['UserStore', 'OrderStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    orderstore: function() {
      var ord = this.app.OrderStore.getOrders();
      console.log('page receive:', ord);
      return ord;
    }
  }
});
