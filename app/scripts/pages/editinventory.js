var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var fulltextsearchlight = require('full-text-search-light');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var Directions = require('../components/directions');
var UploadInventory = require('../components/uploadinventory');
var SideMenu = require('../components/sidemenu');
var SearchBox = require('../components/searchbox');
var log = require('../services/logger');
var InventoryItems = require('../components/inventoryitems');

var Application = require('../stores/application');
var app = new Application();

class EditInventory extends React.Component {
    constructor(props) {
        super(props);
        
        this.search = new fulltextsearchlight();
        this.menu = {'title': undefined,
          'items': [
            {'key': 0, 'href': 'https://s3.amazonaws.com/gaea/inventorytemplate.xlsx', 'text': 'Download Inventory Template', 'external': true}
          ]
        };
        this.menu2 = {'title': undefined,
          'items': [
            {'key': 0, 'href': '/sale/'+this.props.params.saleID+'/inventory/new', 'text': 'Add an Inventory Item'}
          ]
        };
        this.state = {
          'search_string': ''
        }
    }

    upload(csv) {
        log.Debug("received csv", csv);
        var payload = {
          'csv': csv,
          'sale_id': parseInt(this.props.params.saleID),
          'header': true
        };
        this.app.InventoryQueries.uploadInventoryCSV(payload);
    }
    
    componentWillMount() {
      log.Debug("adding inventory to search", this.props.inventory);
      if (this.props.inventory.length > 0) {
        _.map(this.props.inventory, function(inv) {
            this.search.add(inv.asSearchObject());
        }.bind(this));
      }
    }
    
    // On a inventory property change, updates the full text search
    componentWillReceiveProps(newprops) {
      log.Debug("new props", newprops);
      
      if (this.props.inventory.length > 0) {
        _.map(this.props.inventory, function(inv) {
            this.search.remove(inv.asSearchObject());
        }.bind(this));
      }
      
      if (newprops.inventory.length > 0) {
        _.map(newprops.inventory, function(inv) {
          this.search.add(inv.asSearchObject());
        }.bind(this));
      }
    }
    
    // reponsible for updating the displayed inventory items in response
    // to a full text search
    searchFilter(inv) {
      if (this.state.search_string.length === 0) {
        return inv;
      } else {
        log.Debug('this search', this.search);
        
        var results = this.search.search(this.state.search_string);
        log.Debug('search results', results);
        // convert from search object back to Inventory model
        return _.map(results, function(result) { return _.findWhere(inv, {'supplier_id': result.supplier_id}); });
      }
    }
    
    updateSearch(search_string) {
      log.Debug('Received search string: ', search_string);
      this.setState({'search_string': search_string});
    }

    render() {
      if (this.props.inventory.length === 0) {
        return (
          <div>
          <TopNav user={this.props.user.fullName} />
          <B.Grid>
            <B.Row>
              <B.Col md={3} lg={3}>
                <SideMenu menu={this.menu}/>
              </B.Col>
              <B.Col md={9} lg={9}>
                <UploadInventory upload={this.upload.bind(this)}/>
              </B.Col>
            </B.Row>
          </B.Grid>
          </div>
        );
      } else {
        return (
          <div>
          <TopNav user={this.props.user.fullName} />
          <B.Grid>
            <B.Row>
              <B.Col md={3} lg={3}>
                <SideMenu menu={this.menu2} />
                <SearchBox onSearch={this.updateSearch.bind(this)} />
              </B.Col>
              <B.Col md={9} lg={9}>
              <InventoryItems inventory={this.searchFilter(this.props.inventory)} />
              </B.Col>
            </B.Row>
          </B.Grid>
          </div>
        );
      }

    }
}

module.exports = Marty.createContainer(EditInventory, {
  listenTo: ['UserStore', 'InventoryStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    inventory: function() {
      var sales = this.app.InventoryStore.getInventoryBySale(this.props.params.saleID);
      return sales;
    },
    sales: function() {
      var sales = this.app.SaleStore.getSales();
      console.log('page receive sales:', sales);
      return _.findWhere(sales, {'sale_id': this.props.params.saleID});
    }
  }
});
