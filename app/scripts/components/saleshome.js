var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var Utils = require('../services/utils');

class SalesHome extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        var openSales = _.filter(this.props.sales, function(sale) {
            var today = new Date();
            return (new Date(sale.open_date) <= today && new Date(sale.close_date) >= today)
        });

        if (openSales.length === 0) {
          return null;
        }

        var saleTitle = function(sale) {
          var sales = {
            'alcohol': "Duty-Free Liquor",
            'merchandise': 'U.S. Consulate Guangzhou Merchandise'
          }
          return sales[sale];
        }

        var sales = _.map(openSales, function(sale, idx) {
           return (
            <div className="cs-sale" key={sale.sale_id}>
                <div className="cs-sale-title">{sale.title}</div>
                <div className="cs-sale-type">{saleTitle(sale.sale_type)}</div>
                <div className="cs-sale-close"> Closes {new Date(sale.close_date).toDateString()}</div>
                <div className="cs-sale-copy">{sale.sales_copy}</div>
                {idx <= openSales.length -2 ? <hr/> : null }
            </div>
            );
        }.bind(this));

        return (
            <B.Panel header={this.props.title}>
                {sales}
                <B.Button bsStyle='info' href='/#/order'>Go to my orders</B.Button>
            </B.Panel>
        );
    }
}

module.exports = SalesHome;
