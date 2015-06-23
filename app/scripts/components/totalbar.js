var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

class TotalBar extends React.Component {
    constructor(props){
        super(props);
        
        this.rate = 6.21;
    }

    render() {
        
        var total = _.reduce(this.props.items, function(tot, item) {
            var thisItem = _.findWhere(this.props.inventory, {'inventory_id': item.inventory_id});
            
            var price = this.props.user.role === 'nonmember' ? thisItem.nonmem_price : thisItem.mem_price;
            
            return item.qty * price + tot; 
        }.bind(this), 0);
        return (
            <B.Grid>
                <div className="tb-bar">
                    <B.Col md={4} lg={4} mdOffset={6} lgOffset={6}>
                    <span className="tb-cart"><B.Glyphicon glyph="shopping-cart"/></span>
                    <span className="tb-total-rmb">{total}</span><span className="tb-rmb">RMB</span>
                    /
                    <span className="tb-total-usd">${(total/this.rate).toFixed(2)}</span>
                    </B.Col>
                    <B.Col md={2} lg={2}>
                        <B.Button bsStyle='info'>Checkout</B.Button>
                    </B.Col>
                </div>
            </B.Grid>
        );
    }
    
}

module.exports = TotalBar;