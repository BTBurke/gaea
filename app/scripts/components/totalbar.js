var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Sticky = require('react-sticky');
var Link = require('react-router').Link;

class TotalBar extends React.Component {
    constructor(props){
        super(props);
        
        this.rate = 6.21;
        this.stickyStyle = {
            'position': 'fixed',
            'top': 0,
            'width': '225px'
        }
    }

    render() {
        
        var total = _.reduce(this.props.items, function(tot, item) {
            var thisItem = _.findWhere(this.props.inventory, {'inventory_id': item.inventory_id});
            
            var price = this.props.user.role === 'nonmember' ? parseFloat(thisItem.nonmem_price) : parseFloat(thisItem.mem_price);
            
            return item.qty * price + tot; 
        }.bind(this), 0);
        
        var itemTotal = _.reduce(this.props.items, function(tot, item) {
            return item.qty + tot;
        }.bind(this), 0);
        
        console.log("props", this.props);
        var linkTarget = "/order/" + this.props.params.orderID + "/checkout";
        
        return (
                <Sticky stickyStyle={this.stickyStyle}>
                <div className="tb-bar">
                <div className="tb-bar-internal">
                    <div className="tb-cart-header">
                        <span className="tb-cart"><B.Glyphicon glyph="shopping-cart"/></span>Your Cart
                    </div>
                    <div className="tb-cart-items">
                    <B.Row>
                        <B.Col md={6} lg={6}>
                        <span className="tb-cart-items-header">Items</span>
                        </B.Col>
                        <B.Col md={6} lg={6}>
                        <span className="tb-cart-items-total">{itemTotal}</span>
                        </B.Col>
                    </B.Row>
                    </div>
                    <div className="tb-cart-total">
                        <B.Row>
                            <B.Col md={6} lg={6}>
                            Total
                            </B.Col>
                            <B.Col md={6} lg={6}>
                            <span className="tb-total-usd">${total.toFixed(2)}</span>
                            </B.Col>
                        </B.Row>

                    </div>
                
                    <Link to={linkTarget}><B.Button bsStyle='info' block>Checkout</B.Button></Link>
                </div>
                </div>
                </Sticky>
        );
    }
    
}

module.exports = TotalBar;