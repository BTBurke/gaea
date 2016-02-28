var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Marty = require('marty');

var Loading = require('../components/loading');
var TopNav = require('../components/topnav');
var log = require('../services/logger');

class Pay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <div>
        <TopNav user={this.props.user.fullName} />
        <B.Grid>
        <B.Row>
          <B.Col md={8} lg={6} mdOffset={2} lgOffset={3}>
          <div className="pay-container">
          <div className="pay-confirm-header">
              Thank you for your order
          </div>
          <div className="pay-confirm-body">
              Your order has been received.  When the order is finalized you will receive an email with payment options.  For any questions, you can contact us at <a href="mailto:orders@guangzhouaea.org">orders@guangzhouaea.org</a>.
          </div>
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
  listenTo: ['UserStore', 'OrderStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    transactions: function() {
      var orderID = this.props.params.orderID;
      return this.app.TransactionStore.getTransactionsByOrderId(orderID);
    }
  },
  pending() {
    return (
      <Loading />
      );
  }
});
