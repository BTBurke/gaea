var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Sticky = require('react-sticky');

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
                <Sticky>
                <div className="tb-bar">
                    <B.Col md={2} lg={2} mdOffset={8} lgOffset={8}>
                    <span className="tb-cart"><B.Glyphicon glyph="shopping-cart"/></span>
                    <span className="tb-total-rmb">{total}</span><span className="tb-rmb">RMB</span>
                    /
                    <span className="tb-total-usd">${(total/this.rate).toFixed(2)}</span>
                    </B.Col>
                    <B.Col md={2} lg={2}>
                        <B.Button bsStyle='info'>Checkout</B.Button>
                    </B.Col>
                </div>
                </Sticky>
            </B.Grid>
        );
    }
    
}

module.exports = TotalBar;