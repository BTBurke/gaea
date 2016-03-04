var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var Utils = require('../services/utils');
var log = require('../services/logger');

class OrderTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    var orders = this.props.orders;

    if (orders.length === 0) {
      return (
        <B.Panel header={this.props.title}>
        No open orders.  Create a new order from the current sales listed below.
        </B.Panel>
      );
    }
      log.Debug('sales', this.props.sales);
      log.Debug('orders', this.props.orders);

    var displayorders = _.map(orders, (order, idx) => {

      var sale = _.findWhere(this.props.sales, {'sale_id': order.sale_id});
      var shortDate = new Date(sale.close_date);


      var actionButton = function(ord) {
        var btn = {
          'text': undefined,
          'href': undefined
        } ;

        switch (ord.status) {
          case 'saved':
            btn.text = "Edit Order";
            btn.href = "/#/order/" + ord.order_id;
            break;
          case 'submit':
            btn.text = "Pay for Order";
            btn.href = "/#/order/" + ord.order_id +'/pay';
            break;
          default:
            btn.text = undefined;
            btn.href = undefined;
        }

        if (btn.text) {
          return (
            <B.Button bsStyle='info' bsSize='xsmall' href={btn.href}>{btn.text}</B.Button>
          );
        }
        return
      }

      return (
        <tr key={idx}>
          <td>{order.order_id}</td>
          <td>{Utils.Capitalize(order.sale_type)}</td>
          <td>{shortDate.toDateString()}</td>
          <td><span className={"ot-"+order.status}></span>{Utils.Capitalize(order.status)}</td>
          <td>{order.item_qty}</td>
          <td>${parseFloat(order.amount_total).toFixed(2)}</td>
          <td>{actionButton(order)}</td>
        </tr>
      );
    })
    return (
      <B.Panel header={this.props.title}>
        <B.Table condensed>
          <thead>
            <tr>
              <th>Order#</th>
              <th>Order Type</th>
              <th>Sale Closes</th>
              <th>Status</th>
              <th>Item Qty</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayorders}
          </tbody>
        </B.Table>
      </B.Panel>
    );

  }
}

module.exports = OrderTable;
