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
            window.location = config.homeURL + '/#/sale/' + item.sale_id + '/inventory/' + item.inventory_id;
        }
    }

    render() {

        var makeItem = function(item) {
            return (
                <div className="oi-item" key={item.inventory_id}>
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
                    <B.Col md={10} lg={10}>
                        <div className="oi-item-price">
                        <B.Row>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-price-mem-header">Member Price</div>
                            <div className="oi-item-price-mem">
                                ${parseFloat(item.mem_price).toFixed(2)}
                            </div>
                            </B.Col>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-price-non-header">Non-Member Price</div>
                            <div className="oi-item-price-non">
                                ${parseFloat(item.nonmem_price).toFixed(2)}
                            </div>
                            </B.Col>
                            <B.Col md={4} lg={4}>
                             <div className="oi-item-status-header">Type</div>
                             <div className="oi-item-status">{item.types.slice(0).join(" > ")}</div>
                            </B.Col>
                            <B.Col md={2} lg={2}>
                            <div className="oi-item-status-header">Status</div>
                            <div className="oi-item-status">
                                {item.in_stock ? <span className="oi-item-status-instock">In Stock</span> : <span className="oi-item-status-outstock">Out of Stock</span>}
                            </div>
                            </B.Col>
                        </B.Row>
                        </div>
                    </B.Col>
                    <B.Col md={2} lg={2}>
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
