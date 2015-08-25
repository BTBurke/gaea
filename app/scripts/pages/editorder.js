var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var FilterMenu = require('../components/filtermenu');
var OrderItems = require('../components/orderitems');
var Notifier = require('../components/notifier');
var TotalBar = require('../components/totalbar');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');

var app = new Application();

class EditOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'filter': [],
            'origin': [],
            'search': undefined,
            'sort': 'type',
            'message': ''
        }
        
    }
    
    message(msg) {
        this.setState({'message': msg});
        setTimeout(() => {
            this.setState({'message': ''})
        }, 1000);
    }
    
    clearMessage() {
        this.setState({'message': ''});
    }
    
    onFilterClick(e) {
        e.preventDefault();
        var filt = e.currentTarget.innerText;
        this.setState({'filter': this.state.filter.concat(filt)});
        console.log("new filter", this.state.filter);
        
    }
    
    onOriginClick(e) {
        e.preventDefault();
        var filt = e.currentTarget.innerText;
        this.setState({'origin': this.state.origin.concat(filt)});
        console.log("new origin", this.state.origin);
        
    }
    
    clearFilter() {
        this.setState({'filter': []});
        console.log("Clear filter");
    }
    
    onAdd(id, qty) {
        console.log('add id', id);
        if (qty === 0) {
            console.log("Add 0 items, no op")
            return
        }
        var item = {
            'inventory_id': id,
            'qty': qty,
            'order_id': parseInt(this.props.params.orderID),
            'user_name': this.props.user.userName
        }
        
        var thisItem = _.findWhere(this.props.inventory, {'inventory_id': id});
        this.message("Adding " + thisItem.name + " to your cart");
        this.app.OrderQueries.createOrderItem(item);
    }
    
    onUpdate(id, qty) {
        var item = _.findWhere(this.props.items, {'inventory_id': id});
        var thisItem = _.findWhere(this.props.inventory, {'inventory_id': id});

        if (!item) {
            console.log("Could not find item in inventory to update.")
            return
        }
        switch(qty) {
            case 0:
                this.message("Removing " + thisItem.name + " from your cart");
                this.app.OrderQueries.deleteOrderItem(item);
                break;
            case item.qty:
                console.log("Order quantity did not change, no op.")
                break;
            default:
                this.message("Changing quantity of " + thisItem.name + " in your cart");
                item.qty = qty;
                this.app.OrderQueries.updateOrderItem(item);
        }
    }
    
    filterInventory(inventory) {
        
        var filters = this.state.filter;
        var origins = this.state.origin;
        
        var checkAll = function(item, filters) {
            if (filters.length === 0) {
                return true;
            } else {
                var checks = _.map(filters, function(f1) { return _.contains(item, f1) });
                console.log("checks", checks);
                return _.every(checks, function(c) { return c === true });
            }
                
        }
        
        return _.filter(inventory, function(item) {
            if (checkAll(item.types, filters) && checkAll(item.origin, origins)) {
                return true;
            } else {
                return false;
            }
        });
    }
    
    render() {
        console.log('page receives inventory', this.props.inventory);
        return (
            <div>
            <TopNav user={this.props.user.fullName}/>
            
            <B.Grid>
            <B.Row>
                <B.Col md={3} lg={3}>
                    <FilterMenu inventory={this.filterInventory(this.props.inventory)}
                    filter={this.state.filter}
                    origin={this.state.origin}
                    onFilterClick={this.onFilterClick.bind(this)}
                    onOriginClick={this.onOriginClick.bind(this)}/>
                    
                    <TotalBar user={this.props.user}
                        inventory={this.props.inventory}
                        items={this.props.items}
                        params={this.props.params}
                    />
                </B.Col>
                <B.Col md={9} lg={9}>
                    <OrderItems inventory={this.filterInventory(this.props.inventory)}
                        onAdd={this.onAdd.bind(this)}
                        onUpdate={this.onUpdate.bind(this)}
                        items={this.props.items}
                        member={this.props.user.role === 'nonmember' ? false : true}
                    />
                </B.Col>
            </B.Row>
            </B.Grid>
            <Notifier message={this.state.message}/>
            </div>
            
            );
    }
}

module.exports = Marty.createContainer(EditOrder, {
  listenTo: ['UserStore', 'OrderStore', 'InventoryStore'],
  fetch: {
    user: function() {
        return this.app.UserStore.getUser();
    },
    items: function() {
        return this.app.OrderStore.getItems(this.props.params.orderID);
    },
    inventory: function() {
        return this.app.InventoryStore.getInventoryByOrder(this.props.params.orderID);
    },
  },
  pending() {
      return (
        <div>Loading...</div>
    );
  }
});