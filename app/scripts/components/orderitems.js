var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

class OrderItems extends React.Component {
    constructor(props) {
        super(props);
        
        this.itemsByID = _.indexBy(this.props.items, 'inventory_id');
    }
    
    onAddLocal(id) {
        console.log("refs local", this.refs);
        this.props.onAdd(id, parseInt(this.refs['qty-'+id].getValue()));
    }
    
    render() {
        
        var makeItem = function(item) {
            var f = this.onAddLocal.bind(this);
            var _handleAdd = function(id) {
                return function() {
                    f(id);
                }
        }.bind(this);
        
        var cartArea = function(id) {
            var item = _.findWhere(this.props.items, {'inventory_id': id});
            var inv = _.findWhere(this.props.inventory, {'inventory_id': id});
            
            if (item) {
                return (
                    <div>
                    <div className="oi-item-cart-header">In Cart</div>
                    <div className="oi-item-cart">
                        <B.Row>
                            <B.Col md={2} lg={2}>
                            <div className="oi-item-cart-glyph">
                                <B.Glyphicon glyph="shopping-cart"/>
                            </div>
                            </B.Col>
                            <B.Col md={4} lg={4}>
                            <div className="oi-item-cart-qty-header">
                                Qty
                            </div>
                            <div className="oi-item-cart-qty">
                                {item.qty}
                            </div>
                            </B.Col>
                            <B.Col md={6} lg={6}>
                            <div className="oi-item-cart-total-header">
                                Total
                            </div>
                            <div className="oi-item-cart-total">
                                {item.qty * inv.mem_price}<span className="oi-rmb">RMB</span>
                            </div>
                            </B.Col>
                        </B.Row>
                    </div>
                    </div>
                );
            }
        }.bind(this);
            
            return (
                <div className="oi-item" key={item.supplier_id}>
                <B.Row>
                <B.Col md={12} lg={12}>
                <div className="oi-item-header">{item.name}</div>
                <div className="oi-item-table">
                    <B.Table condensed responsive>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Type</th>
                                <th>Origin</th>
                                <th>Year</th>
                                <th>ABV</th>
                                <th>Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td width="15%">{item.supplier_id}</td>
                                <td width="25%">{_.last(item.types)}</td>
                                <td width="25%">{item.origin.slice(0).reverse().join(", ")}</td>
                                <td width="10%">{item.year}</td>
                                <td width="10%">{item.abv + "%"}</td>
                                <td width="10%">{item.size}</td>
                            </tr>
                        </tbody>
                    </B.Table>
                    <div className="oi-item-desc">
                        {item.desc}
                    </div>
                </div>
                </B.Col>
                </B.Row>
                <B.Row>
                    <B.Col md={9} lg={9}>
                        <div className="oi-item-price">
                        <B.Row>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-price-mem-header">Non-Member Price</div>
                            <div className="oi-item-price-mem">
                                {item.nonmem_price}<span className="oi-rmb">RMB</span>
                            </div>
                            </B.Col>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-price-non-header">Member Price</div>
                            <div className="oi-item-price-non">
                                {item.mem_price}<span className="oi-rmb">RMB</span>
                            </div>
                            </B.Col>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-select">
                            <form>
                                <B.Input type='select' ref={'qty-'+item.inventory_id} bsSize='small' label='Quantity' placeholder='0'>
                                  <option value='0'>0</option>
                                  <option value='1'>1</option>
                                  <option value='2'>2</option>
                                  <option value='3'>3</option>
                                  <option value='4'>4</option>
                                  <option value='5'>5</option>
                                  <option value='6'>6</option>
                                  <option value='7'>7</option>
                                  <option value='8'>8</option>
                                  <option value='9'>9</option>
                                  <option value='10'>10</option>
                                  <option value='11'>11</option>
                                  <option value='12'>12</option>
                                  <option value='13'>13</option>
                                  <option value='14'>14</option>
                                  <option value='15'>15</option>
                                  <option value='16'>16</option>
                                  <option value='17'>17</option>
                                  <option value='18'>18</option>
                                  <option value='19'>19</option>
                                  <option value='20'>20</option>
                                </B.Input>
                            </form>
                            </div>
                            </B.Col>
                            <B.Col md={3} lg={3}>
                                <div className="oi-item-btn">
                                <B.Button bsStyle='info' 
                                onClick={_handleAdd(item.inventory_id)}>
                                    Add to Cart
                                </B.Button>
                                </div>
                            </B.Col>
                        </B.Row>
                        </div>
                    </B.Col>
                    <B.Col md={3} lg={3}>
                        {cartArea(item.inventory_id)}
                    </B.Col>
                </B.Row>
                </div>
            );
        }.bind(this);
        
        var items = _.map(this.props.inventory, function(item) { return makeItem(item) });
        console.log('items', items);
        return (
            <div className="oi-all-items">
                {items}
            </div>
        );
    }
}

module.exports = OrderItems;