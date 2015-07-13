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
        console.log('Open Sales', openSales);
        
        var sales = _.map(openSales, function(sale, idx) {
           return (
            <div className="cs-sale" key={sale.sale_id}>
                <div className="cs-sale-title">{Utils.Capitalize(sale.sale_type)}</div>
                <div className="cs-sale-close"> Closes {new Date(sale.close_date).toDateString()}</div>
                <div className="cs-sale-copy">{sale.sales_copy}</div>
                <B.Button bsStyle='info' bsSize='small' onClick={this.localCreateOrder(sale.sale_id).bind(this)}>Create a new {sale.sale_type} order</B.Button>
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