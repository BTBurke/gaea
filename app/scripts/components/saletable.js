var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var Utils = require('../services/utils');

class SaleTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    var sales = this.props.sales;
    
    if (sales.length === 0) {
      return (
        <B.Panel header={this.props.title}>
        No open sales.  Create a new sale from the menu on the left.
        </B.Panel>
      );
    }

    var displaysales = _.map(sales, function(sale, idx) {

      var shortOpen = new Date(sale.open_date);
      var shortClose = new Date(sale.close_date)
      
      return (
        <tr key={idx}>
          <td>{Utils.Capitalize(sale.sale_type)}</td>
          <td>{shortOpen.toDateString()}</td>
          <td>{shortClose.toDateString()}</td>
          <td>{Utils.Capitalize(sale.status)}</td>
          <td><B.ButtonToolbar>
            <B.Button bsSize='xsmall'><Link to={'/sale/' + sale.sale_id + '/inventory'}>Edit Inventory</Link></B.Button>
            <B.Button bsStyle='info' bsSize='xsmall'><Link to={'/sale/' + sale.sale_id + '/orders'}>View Orders</Link></B.Button>
            </B.ButtonToolbar>
          </td>
        </tr>
      );
    });
    return (
      <B.Panel header={this.props.title}>
        <B.Table condensed>
          <thead>
            <tr>
              <th>Sale Type</th>
              <th>Sale Open</th>
              <th>Sale Close</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displaysales}
          </tbody>
        </B.Table>
       
      </B.Panel>
    );

  }
}

module.exports = OrderTable;
