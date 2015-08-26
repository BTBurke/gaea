var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var OrderSummary = require('../components/ordersummary');
var Loading = require('../components/loading');
var Spinner = require('../components/spinner');
var log = require('../services/logger');
var config = require('../config');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');


var app = new Application();

class Checkout extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            'transition_pending': false
        }
    }
    
    onSubmit() {
        log.Debug("Submitting order...");
        log.Debug("orders", this.props.orders);
        var order = _.findWhere(this.props.orders, {'order_id': parseInt(this.props.params.orderID)});
        order.status = 'submit';
        this.setState({'transition_pending': true});
        this.app.OrderQueries.updateOrder(order);
    }
    
    componentWillReceiveProps(newprops, oldprops) {
        if (this.state.transition_pending) {
            window.location = config.homeURL + "/#/order/" + this.props.params.orderID + '/pay';
        }
    }
    
    render() {
        return (
        <div>
        <TopNav user={this.props.user.fullName}/>    
        <B.Grid>
            <B.Row>
            <B.Col md={10} mdOffset={1} lg={10} lgOffset={1}>
            <div className="co-order-header">
            Your Order
            </div>
            <OrderSummary
                items={this.props.items}
                inventory={this.props.inventory}
                user={this.props.user}
            />
            <div className="co-buttons">
                <B.ButtonToolbar>
                <B.Button href={"/#/order/"+this.props.params.orderID}>Edit Order</B.Button>
                {this.state.transition_pending ? <B.Button bsStyle="default">Submitting...<Spinner /></B.Button> :
                <B.Button bsStyle="success" onClick={this.onSubmit.bind(this)}>Submit Order</B.Button>}
                </B.ButtonToolbar>
            </div>
            </B.Col>
            </B.Row>
        </B.Grid>
        </div>
        
        );
    }
    
    
}


module.exports = Marty.createContainer(Checkout, {
  listenTo: ['UserStore', 'OrderStore', 'InventoryStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    items: function() {
      var loc = this.props.params.orderID;
      var ord = this.app.OrderStore.getItems(loc);
      return ord;
    },
    orders: function() {
      return this.app.OrderStore.getOrders();  
    },
    inventory: function() {
        var loc = this.props.params.orderID;
        console.log("location", loc);
        return this.app.InventoryStore.getInventoryByOrder(loc);
    },
  },
  pending() {
      return (
        <Loading />
    );
  }
});