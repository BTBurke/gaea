var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var FilterMenu = require('../components/filtermenu');
var OrderItems = require('../components/orderitems');

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
            'sort': 'type'
        }
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
                </B.Col>
                <B.Col md={9} lg={9}>
                    <OrderItems inventory={this.filterInventory(this.props.inventory)}/>
                </B.Col>
            </B.Row>
            </B.Grid>
            
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
    orderstore: function() {
      var ord = this.app.OrderStore.getOrders();
      console.log('page receive:', ord);
      return ord;
    },
    inventory: function() {
        var loc = this.props.params.orderID;
        console.log("location", loc);
        console.log("this.app", this.app);
        return this.app.InventoryStore.getInventoryByOrder(loc);
    }
  }
});