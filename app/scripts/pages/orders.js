'use strict';

var Marty = require('marty');
var UserStore = require('../stores/userstore');
var OrderStore = require('../stores/orderstore');
var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var SideMenu = require('../components/sidemenu');
var OrderTable = require('../components/ordertable');
var CurrentSales = require('../components/currentsales');

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
    this.state = {
      'transitionPending': false,
      'spin': undefined
    }
  }
  
  createOrder(sale) {
    console.log("creating new order for sale: ", sale);
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
              <OrderTable title="Open Orders" orders={_.reject(this.props.orderstore.orders, function(order) { return order.status === 'complete' })}/>
          </B.Col>
        </B.Row>
        <B.Row>
          <B.Col md={9} mdOffset={3} lg={9} lgOffset={3}>
            <CurrentSales title="Current items for sale" sales={this.props.sales} createOrder={this.createOrder.bind(this)} />
          </B.Col>
        </B.Row>
      </B.Grid>

      </div>
    );
  }
}


module.exports = Marty.createContainer(Orders, {
  listenTo: ['UserStore', 'OrderStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    orderstore: function() {
      var ord = this.app.OrderStore.getOrders();
      console.log('page receive:', ord);
      return ord;
    },
    sales: function() {
      return this.app.SaleStore.getSales();
    }
  }
});
