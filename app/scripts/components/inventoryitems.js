var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var config = require("../config");

class InventoryItems extends React.Component {
    constructor(props) {
        super(props);

    }
    
    _onClickTransition(item) {
        return function() {
            window.location = config.baseURL + '/#/sale/' + item.sale_id + '/inventory/' + item.inventory_id;
        }
    }
    
    render() {
        
        var makeItem = function(item) {
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
                              
                            </B.Col>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-status-header">Status</div>
                            <div className="oi-item-status">
                                {item.in_stock ? <span className="oi-item-status-instock">In Stock</span> : <span className="oi-item-status-outstock">Out of Stock</span>}
                            </div>
                            </B.Col>
                        </B.Row>
                        </div>
                    </B.Col>
                    <B.Col md={3} lg={3}>
                        <B.Button onClick={this._onClickTransition(item)}>Edit Item</B.Button>
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

module.exports = InventoryItems;