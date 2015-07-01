var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Link = require('react-router').Link;

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
        No sales.
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
          <td>
            <span className="st-linkL"><Link to={'/sale/' + sale.sale_id}>Edit Sale</Link></span>|
            <span className="st-linkM"><Link to={'/sale/' + sale.sale_id + '/inventory'}>Edit Inventory</Link></span>|
            <span className="st-linkR"><Link to={'/sale/' + sale.sale_id + '/orders'}>View Orders</Link></span>
            
          </td>
        </tr>
      );
    });
    return (
      <B.Panel header={this.props.title}>
        <B.Table condensed>
          <thead>
            <tr>
              <th width='15%'>Sale Type</th>
              <th width='15%'>Sale Open</th>
              <th width='15%'>Sale Close</th>
              <th width='10%'>Status</th>
              <th width='45%'>Actions</th>
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

module.exports = SaleTable;
