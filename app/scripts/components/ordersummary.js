var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

class OrderSummary extends React.Component {
    constructor(props) {
        super(props);
        
        this.rate = 6.21;
    }
    
    render() {
        var items = _.map(this.props.items, function(item) {
            var currentItem = _.findWhere(this.props.inventory, {'inventory_id': item.inventory_id});
            var price = this.props.user.role === 'nonmember' ? currentItem.nonmem_price : currentItem.mem_price;
            var total = parseFloat(price) * item.qty;
            return (
                <tr key={currentItem.supplier_id}>
                <td>{currentItem.supplier_id}</td>
                <td>{currentItem.name}</td>
                <td>${price}</td>
                <td>{item.qty}</td>
                <td>${total.toFixed(2)}</td>
                </tr>
            );
        }.bind(this));
        
        var grandTotal = _.reduce(this.props.items, function(tot, item) {
            var currentItem = _.findWhere(this.props.inventory, {'inventory_id': item.inventory_id});
            var price = this.props.user.role === 'nonmember' ? currentItem.nonmem_price : currentItem.mem_price;
        
            return item.qty * parseFloat(price) + tot;
        }.bind(this), 0.0);
        
        var noItemsMessage = function() {
            if (this.props.items.length === 0) {
                return (
                <div className="os-message">
                You have no items in your cart
                </div>
                );
            }
        }.bind(this);
        
        return (
        <div>
        <B.Table condensed>
            <thead>
                <tr>
                <th width='15%'>ID</th>
                <th width='35%'>Item</th>
                <th width='15%'>Price</th>
                <th width='15%'>Qty</th>
                <th width='20%'>Total</th>
                </tr>
            </thead>
            <tbody>
                {items}
            </tbody>
            
        </B.Table>
        {noItemsMessage()}
        <hr/>
        <div className="os-order-total">
            <span className="os-order-total-label">Total</span>
            <span className="os-order-total-amount">${grandTotal.toFixed(2)}</span>
        </div>
        </div>
        );
    }
}

module.exports = OrderSummary;