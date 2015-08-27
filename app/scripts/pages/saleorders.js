var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Marty = require('marty');

var log = require('../services/logger');
var Loading = require('../components/loading');
var TopNav = require('../components/topnav');

class SaleOrders extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            'open': undefined
        }
    }
    
    makeOpenLink(orderID) {
        return () => {
            if (this.state.open === orderID) {
                this.setState({'open': undefined});
            } else {
                this.setState({'open': orderID});
            }        
        }
    }
    
    render() {
        log.Debug('all sale', this.props.sale);
        
        var itemTable = (order) => {
            var thisOrderItems = this.props.sale.items["order-"+order.order_id];
            var items = _.map(thisOrderItems, (item) => {
               var currentItem = _.findWhere(this.props.inventory, {'inventory_id': item.inventory_id});
               var price = this.props.sale.users[order.user_name].role === 'nonmember' ? currentItem.nonmem_price : currentItem.mem_price;
               var total = item.qty * parseFloat(price);
               return (
                    <tr key={currentItem.supplier_id}>
                    <td>{currentItem.supplier_id}</td>
                    <td>{currentItem.name}</td>
                    <td>${price}</td>
                    <td>{item.qty}</td>
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
        
        return (
            <div>
            <TopNav user={this.props.user.fullName} />
            <B.Grid>
            <B.Row>
                <B.Col md={3} lg={3}>
                </B.Col>
            
                <B.Col md={9} lg={9}>
                {allOrders}
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