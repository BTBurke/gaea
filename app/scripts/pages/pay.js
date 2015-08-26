var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var Loading = require('../components/loading');
var log = require('../services/logger');

class Pay extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        <div>
        <TopNav user={this.props.user.fullName} />
        <div className="pay-container">
        <div className="pay-confirm-header">
            Thank you for your order
        </div>
        <div className="pay-confirm-body">
            Your order has been received.  When the order is finalized you will receive an email with payment options.  For any questions, you can contact us at <a href="mailto:orders@guangzhouaea.org">orders@guangzhouaea.org</a>.
        </div>
        <B.Button href="/#/">Return home</B.Button>
        </div>
        </div>
    }
}

module.exports = Marty.createContainer(Pay, {
  listenTo: ['UserStore', 'OrderStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    orders: function() {
      var ord = this.app.OrderStore.getOrders();
      console.log('page receive:', ord);
      return ord;
    },
    sales: function() {
      return this.app.SaleStore.getSales();
    }
  },
  pending() {
    return (
      <Loading />
      );
  }
});