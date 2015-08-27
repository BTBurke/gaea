var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var Utils = require('../services/utils');

class CurrentSales extends React.Component {
    constructor(props) {
        super(props);
    }

    localCreateOrder(id) {
        return function() {
            this.props.createOrder(id);
        }.bind(this)
    }

    render() {
        var openSales = _.filter(this.props.sales, function(sale) {
            var today = new Date();
            return (new Date(sale.open_date) <= today && new Date(sale.close_date) >= today)
        });

        if (openSales.length === 0) {
          return (
            <B.Panel header={this.props.title}>
            Nothing for sale right now.  Check back soon.
            </B.Panel>
          );
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
                <B.Button bsStyle={this.props.spin === sale.sale_id ? 'default' : 'info'} bsSize='small' onClick={this.localCreateOrder(sale.sale_id).bind(this)}>Create a new order</B.Button>
                {this.props.spin === sale.sale_id ? <img src="images/ring.gif"/> : null}
                {idx <= openSales.length -2 ? <hr/> : null }
            </div>
            );
        }.bind(this));

        return (
            <B.Panel header={this.props.title}>
                {sales}
            </B.Panel>
        );
    }
}

module.exports = CurrentSales;
