var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Marty = require('marty');

var log = require('../services/logger');
var Loading = require('../components/loading');
var TopNav = require('../components/topnav');
var utils = require('../services/utils');
var calc = require('../services/calc');

class SaleOrders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'open': undefined
        }
    }

    finalize() {
      // TODO: Need to implement finalization of the order, adding
      // transactions for each, perhaps a popup that allows you to spread
      // common charges equally or proportionally to each order
      log.Debug("I would finalize");
    }
    makeOpenLink(orderID) {
        return () => {
            if (this.state.open === orderID) {
                this.setState({'open': undefined});
            } else {
                this.setState({'open': orderID});
            }
        };
    }

    render() {
        log.Debug('all sale details', this.props.sale);
        log.Debug('all sales', this.props.allsales);

        var itemTable = (order) => {
            var thisOrderItems = this.props.sale.items["order-"+order.order_id];
            var items = _.map(thisOrderItems, (item) => {
               var currentItem = _.findWhere(this.props.inventory, {'inventory_id': item.inventory_id});
               var price = this.props.sale.users[order.user_name].role === 'nonmember' ? currentItem.nonmem_price : currentItem.mem_price;
              //  var total = item.qty * parseFloat(price);
               var total = calc.ItemTotal(currentItem, item.qty, this.props.sale.users[order.user_name].role);
               var isSplit = calc.IsSplitCase(item.qty, currentItem);
               return (
                    <tr key={currentItem.supplier_id}>
                    <td>{currentItem.supplier_id}</td>
                    <td>{currentItem.name}</td>
                    <td>${price}</td>
                    <td>{item.qty}{isSplit ? <B.Glyphicon glyph="warning-sign"/> : null}</td>
                    <td>${total.toFixed(2)}</td>
                    </tr>
                );
            });

            return (
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
            );
        }

        var allOrders = _.map(this.props.sale.orders, (ord) => {
            var thisUser = this.props.sale.users[ord.user_name];
            return (
                <div className="so-order-container" key={ord.order_id}>
                    <div className="so-order-header" onClick={this.makeOpenLink(ord.order_id).bind(this)}>
                        <div className={this.state.open === ord.order_id ? "arrow-down" : "arrow-right"}></div>
                        <div className="so-order-name">
                            {thisUser.last_name + ", " + thisUser.first_name}
                        </div>
                        <div className="so-order-qty">
                            <span className="so-data-orange">Qty: </span>{ord.item_qty}
                        </div>
                        <div className="so-order-total">
                            <span className="so-data-orange">Total: </span>${ord.amount_total}
                        </div>
                    </div>
                    <div className="so-order-items">
                    {this.state.open === ord.order_id ? itemTable(ord) : null}
                    </div>

                </div>
            );
        })
        var thisSale = _.findWhere(this.props.allsales, {'sale_id': parseInt(this.props.params.saleID)});
        var saleTotal = _.reduce(this.props.sale.orders, (tot, ord) => {
            return parseFloat(ord.amount_total) + tot
        }, 0.0);
        return (
            <div>
            <TopNav user={this.props.user} />
            <B.Grid>
            <B.Row>
                <B.Col md={3} lg={3}>
                </B.Col>

                <B.Col md={9} lg={9}>
                <div className="so-sale-details">
                  <div className="so-sale-details-leftcol">
                    <p>Open: {new Date(thisSale.open_date).toDateString()}</p>
                    <p>Close: {new Date(thisSale.close_date).toDateString()}</p>
                    <p>Status: {utils.Capitalize(thisSale.status)}</p>
                    {thisSale.require_final && this.status == "closed" ? <B.Button bsStyle='info' onClick={this.finalize.bind(this)}>Finalize Order</B.Button> : null}
                  </div>
                  <div className="so-sale-details-rightcol">
                    <div className="so-sale-total-header">
                      Sale Total
                    </div>
                    <div className="so-sale-total">
                      ${saleTotal.toFixed(2)}
                    </div>
                  </div>
                </div>
                <hr />
                {allOrders.length > 0 ? allOrders : "No orders"}
                </B.Col>
            </B.Row>
            </B.Grid>
            </div>
        );
    }
}

module.exports = Marty.createContainer(SaleOrders, {
  listenTo: ['UserStore', 'SaleStore', 'OrderStore', 'InventoryStore'],
  fetch: {
    user: function() {
        return this.app.UserStore.getUser();
    },
    allsales: function() {
       return this.app.SaleStore.getSales();
    },
    sale: function() {
        return this.app.OrderStore.getOrdersAndItemsForSale(this.props.params.saleID);
    },
    inventory: function() {
        return this.app.InventoryStore.getInventoryBySale(this.props.params.saleID);
    },
  },
  pending() {
      return (
        <Loading />
    );
  }
});
