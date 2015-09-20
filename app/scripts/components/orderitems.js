var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var calc = require('../services/calc');

class OrderItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          'showNotes': true
        };

        this.itemsByID = _.indexBy(this.props.items, 'inventory_id');
    }

    hideNotes() {
      this.setState({'showNotes': false});
    }

    onAddLocal(id) {
        this.props.onAdd(id, parseInt(this.refs['qty-'+id].getValue()));
    }

    onUpdateLocal(id) {
        this.props.onUpdate(id, parseInt(this.refs['qty-'+id].getValue()));
    }

    render() {

        var makeItem = function(item) {
            var addItemFunc = this.onAddLocal.bind(this);
            var updateItemFunc = this.onUpdateLocal.bind(this);
            var _handleAdd = function(id) {
                return function() {
                    addItemFunc(id);
                };
            }.bind(this);
            var _handleUpdate =function(id) {
                return function() {
                    updateItemFunc(id);
                };
            };

            var addOrUpdateBtn = function(id) {
                var item = _.findWhere(this.props.items, {'inventory_id': id});
                if (item) {
                    return (
                            <div className="oi-item-btn">
                                <B.Button bsStyle='default'
                                    onClick={_handleUpdate(id)}>
                                Update Cart
                                </B.Button>
                            </div>
                    );
                } else {
                    return (
                    <div className="oi-item-btn">
                        <B.Button bsStyle='info'
                            onClick={_handleAdd(id)}>
                            Add to Cart
                        </B.Button>
                    </div>
                    );
                }
            }.bind(this);

            var cartArea = function(id) {
                var item = _.findWhere(this.props.items, {'inventory_id': id});
                var inv = _.findWhere(this.props.inventory, {'inventory_id': id});

                if (item) {
                    // var memPrice = item.qty*parseFloat(inv.mem_price);
                    // var nonmemPrice = item.qty*parseFloat(inv.nonmem_price);
                    var memPrice = calc.ItemTotal(inv, item.qty, 'member');
                    var nonmemPrice = calc.ItemTotal(inv, item.qty, 'nonmember');


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
                                <B.Col md={3} lg={3}>
                                <div className="oi-item-cart-qty-header">
                                    Qty
                                </div>
                                <div className="oi-item-cart-qty">
                                    {item.qty}
                                </div>
                                </B.Col>
                                <B.Col md={7} lg={7}>
                                <div className="oi-item-cart-total-header">
                                    Total
                                </div>
                                <div className="oi-item-cart-total">
                                    ${this.props.member ? memPrice.toFixed(2) : nonmemPrice.toFixed(2)}
                                </div>

                                </B.Col>

                            </B.Row>
                            <B.Row>
                            <B.Col md={10} mdOffset={2} lg={10} lgOffset={2}>
                            <div className="oi-item-split-case">
                            {calc.IsSplitCase(item.qty, inv) ? <span><B.Glyphicon glyph="warning-sign"/>   Split Case</span> : null}
                            </div>
                            </B.Col>
                            </B.Row>
                        </div>
                        </div>
                    );
                }
            }.bind(this);

            var makeOptions = function(numOptions, caseSize, useCasePricing) {
              if (!useCasePricing) {
                var out = [];
                for (var i=0; i<=numOptions; i++) {
                  out = out.concat(<option value={i}>{i}</option>);
                }
                return out;
              } else {
                var out2 = [];
                for (var j=0; j<=numOptions; j++) {
                switch(j % caseSize) {
                  case 0:
                    if (j===0) {
                      out2 = out2.concat(<option value={j}>{j}</option>);
                      break;
                    }
                    out2 = out2.concat(<option value={j}>{j} (Full Case)</option>);
                    break;
                  default:
                    out2 = out2.concat(<option value={j}>{j}</option>);
                  }
                }
                return out2;
              }
            };

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
                            <div className="oi-item-price-mem-header">Non-Member<br/>Price</div>
                            <div className="oi-item-price-mem">
                                ${parseFloat(item.nonmem_price).toFixed(2)}
                            </div>
                            </B.Col>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-price-non-header">Member<br/>Price</div>
                            <div className="oi-item-price-non">
                                ${parseFloat(item.mem_price).toFixed(2)}
                            </div>
                            </B.Col>
                            <B.Col md={3} lg={3}>
                            <div className="oi-item-select">
                            <form>
                                <B.Input type='select' ref={'qty-'+item.inventory_id} bsSize='small' label='Quantity' placeholder='0'>
                                  {makeOptions(20, item.case_size, item.use_case_pricing)}
                                </B.Input>
                            </form>
                            </div>
                            </B.Col>
                            <B.Col md={3} lg={3}>
                                {addOrUpdateBtn(item.inventory_id)}
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
        switch (this.state.showNotes) {
          case true:
            return (
              <div className="oi-notes">
              <B.Well>
                <h2>Notes about this sale</h2>
                <h3>This vendor sells wine by the case</h3>
                <p>The vendor we are using for this order only sells wine by the case.  The prices shown are per bottle for a whole case.  You can still order less than a full case, however, your per bottle price will be about 20% higher than the case price.  The total cost in your cart reflects the actual price you will pay for the number of bottles that you have ordered, including any additional cost for the split case.</p>
                <h3>Prices may fluctuate due to exchange rates</h3>
                <p>This vendor prices their items in Australian dollars.  When you shop, the current exchange rate is used to convert prices to USD.  When the order is finalized with the vendor, we will lock in an exchange rate and you will be billed at that rate.</p>
                <B.Button bsStyle='info' onClick={this.hideNotes.bind(this)}>Ok, I got it.  Let me shop.</B.Button>
              </B.Well>
              </div>
            );
          default:
            return (
                <div className="oi-all-items">
                    {items}
                </div>
            );

        }

    }
}

module.exports = OrderItems;
