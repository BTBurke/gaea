var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var Utils = require('../services/utils');

class OrderTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    var orders = this.props.orders;

    var displayorders = _.map(orders, function(order, idx) {

      var shortDate = new Date(order.status_date);


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
            btn.href = "/#/pay/" + ord.order_id;
            break;
          default:
            btn.text = undefined;
            btn.href = undefined;
        }
        console.log("btn", btn);
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
          <td>{order.amount_total}<span className="ot-rmb">RMB</span></td>
          <td>{actionButton(order)}</td>
        </tr>
      );
    });
    return (
      <B.Panel header={this.props.title}>
        <B.Table condensed>
          <thead>
            <tr>
              <th>Order#</th>
              <th>Order Type</th>
              <th>Last Update</th>
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
