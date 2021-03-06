var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var FilterMenu = require('../components/filtermenu');
var OrderItems = require('../components/orderitems');
var Notifier = require('../components/notifier');
var TotalBar = require('../components/totalbar');
var Loading = require('../components/loading');
var JoinGAEA = require('../components/joingaea');
var log = require('../services/logger');

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
            'message': '',
            'items_to_show': 30,
            'current_page': 1
        };

    }
    
    upgradeMembership() {
        alert("time to upgrade");
        this.app.UserQueries.upgradeMembership(this.props.user.userName);
    }
    
    message(msg) {
        this.setState({'message': msg});
        setTimeout(() => {
            this.setState({'message': ''});
        }, 1000);
    }

    clearMessage() {
        this.setState({'message': ''});
    }

    onFilterClick(e) {
        e.preventDefault();
        var filt = e.currentTarget.innerText;
        this.setState({'filter': this.state.filter.concat(filt), 'current_page': 1});

    }

    onOriginClick(e) {
        e.preventDefault();
        var filt = e.currentTarget.innerText;
        this.setState({'origin': this.state.origin.concat(filt), 'current_page': 1});

    }

    onClearFilter() {
        this.setState({'filter': [], 'current_page': 1});
    }

    onClearFilterLast() {
      this.setState({'filter': _.initial(this.state.filter), 'current_page': 1});
    }

    onClearOrigin() {
        this.setState({'origin': [], 'current_page': 1});
    }

    onAdd(id, qty) {
        console.log('add id', id);
        if (qty === 0) {
            return;
        }
        var item = {
            'inventory_id': id,
            'qty': qty,
            'order_id': parseInt(this.props.params.orderID),
            'user_name': this.props.user.userName
        };

        var thisItem = _.findWhere(this.props.inventory, {'inventory_id': id});
        this.message("Adding " + thisItem.name + " to your cart");
        this.app.OrderQueries.createOrderItem(item);
    }

    onUpdate(id, qty) {
        var item = _.findWhere(this.props.items, {'inventory_id': id});
        var thisItem = _.findWhere(this.props.inventory, {'inventory_id': id});

        if (!item) {
            log.Warn("Could not find item in inventory to update.");
            return;
        }
        switch(qty) {
            case 0:
                this.message("Removing " + thisItem.name + " from your cart");
                this.app.OrderQueries.deleteOrderItem(item);
                break;
            case item.qty:
                log.Debug("Order quantity did not change, no op.");
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
                return _.every(checks, function(c) { return c === true });
            }

        }

        return _.filter(inventory, function(item) {
            if (checkAll(item.types, filters) && checkAll(item.origin, origins) && !checkAll(item.types, ['Membership'])) {
                return true;
            } else {
                return false;
            }
        });
    }

    sortBy(method) {
        var sorts = {
            'type': function(inv) { return inv.types[0] },
            'name': function(inv) { return inv.name },
            'price': function(inv) { return parseFloat(inv.mem_price) }
        }
        return sorts[method];
    }

    onSortChange() {
      var sortBy = this.refs.sort.getValue();
      this.setState({'sort': sortBy, 'current_page': 1});
    }
    
    handlePageSelect(event, selectedEvent) {
        window.scroll(0,0);
        this.setState({
            'current_page': selectedEvent.eventKey
        });
    }

    render() {
        log.Debug('page receives inventory', this.props.inventory);
        var sortedInventory = _.sortBy(this.props.inventory, this.sortBy(this.state.sort));
        var from = (this.state.current_page-1)*this.state.items_to_show;
        var inv = this.filterInventory(sortedInventory);
        var to = this.state.current_page*this.state.items_to_show;
        var numpages = Math.ceil(inv.length/this.state.items_to_show);
        return (
            <div>
            <TopNav user={this.props.user}/>
            <JoinGAEA inventory={this.props.inventory}
                      onAdd={this.onAdd.bind(this)}
                      items={this.props.items}
            />
            <div className="eo-sort">
              <B.Grid>
              <B.Row>
                <B.Col md={9} lg={9} mdOffset={3} lgOffset={3}>
                  <B.Row>
                  <B.Col md={4} lg={4}>
                  <B.Input type="select" label="Sort" ref="sort" onChange={this.onSortChange.bind(this)}>

                    <option value="type">By type</option>
                    <option value="name">By name (alphabetical)</option>
                    <option value="price">By price (ascending)</option>
                  </B.Input>
                  </B.Col>
                  <B.Col md={8} lg={8}>
                  <div className="eo-showing">
                  Showing {from+1}-{Math.min(to, inv.length)} of {inv.length} items
                  </div>
                  </B.Col>
                  </B.Row> 
                </B.Col>
              </B.Row>
            </B.Grid>
            </div>

            <B.Grid>
            <B.Row>
                <B.Col md={3} lg={3}>
                    <FilterMenu inventory={inv}
                    filter={this.state.filter}
                    origin={this.state.origin}
                    onFilterClick={this.onFilterClick.bind(this)}
                    onOriginClick={this.onOriginClick.bind(this)}
                    onClearFilter={this.onClearFilter.bind(this)}
                    onClearOrigin={this.onClearOrigin.bind(this)}
                    onClearFilterLast={this.onClearFilterLast.bind(this)}
                    />

                    <TotalBar user={this.props.user}
                        inventory={this.props.inventory}
                        items={this.props.items}
                        params={this.props.params}
                    />
                </B.Col>
                <B.Col md={9} lg={9}>
                    <OrderItems inventory={inv.slice(from, to)}
                        onAdd={this.onAdd.bind(this)}
                        onUpdate={this.onUpdate.bind(this)}
                        items={this.props.items}
                        member={this.props.user.role === 'nonmember' ? false : true}
                    />
                </B.Col>
            </B.Row>
            <B.Row>
            <B.Col md={9} lg={9} mdOffset={3} lgOffset={3}>
            <div className="oi-pagination">
            <B.Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={numpages}
                maxButtons={5}
                activePage={this.state.current_page}
                bsStyle='info'
                onSelect={this.handlePageSelect.bind(this)} />
            </div>
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
        return this.app.InventoryStore.getInventoryByOrder(this.props.params.orderID, 'USD');
    },
  },
  pending() {
      return (
        <Loading />
    );
  }
});
