var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Marty = require('marty');

var Loading = require('../components/loading');
var TopNav = require('../components/topnav');
var log = require('../services/logger');
var OrderSummary = require('../components/ordersummary');

class Pay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <div>
        <TopNav user={this.props.user} />
        <B.Grid>
        <div className="pay-print">
        <B.Button bsSize="xsmall" bsStyle="default" onClick={window.print}><B.Glyphicon glyph="print" />  Print</B.Button>
        </div>
        
        <B.Row>
          <B.Col md={10} lg={8} mdOffset={1} lgOffset={2}>
          <div className="pay-container">
          <div className="pay-confirm-header">
              Thank you for your order
          </div>
          <div className="pay-confirm-body">
              Your order has been received.  When the order is finalized you will receive an email with payment options.  Your order is listed below for your reference.  For any questions, you can contact us at <span className="mailto-link-noprint"><a href="mailto:orders@guangzhouaea.org">orders@guangzhouaea.org</a></span><span className="mailto-link-print">orders@guangzhouaea.org</span>.
          </div>
          </div>
          </B.Col>
        </B.Row>
        <B.Row>
        <B.Col md={10} lg={8} mdOffset={1} lgOffset={2}>
          <div className="pay-order">
           <OrderSummary
                items={this.props.items}
                inventory={this.props.inventory}
                user={this.props.user}
            />
          </div>
          <div className="pay-home-button">
          <B.Button bsSize="small" href="/#/home">Return home</B.Button>
          </div>
          </B.Col>
        </B.Row>
        </B.Grid>
        </div>
      );
    }
}

module.exports = Marty.createContainer(Pay, {
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
    }
  },
  pending() {
    return (
      <Loading />
      );
  }
});
