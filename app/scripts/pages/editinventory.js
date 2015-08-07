var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var TopNav = require('../components/topnav');
var Directions = require('../components/directions');
var UploadInventory = require('../components/uploadinventory');
var SideMenu = require('../components/sidemenu');
var log = require('../services/logger');
var InventoryItems = require('../components/inventoryitems');

var Application = require('../stores/application');
var app = new Application();

class EditInventory extends React.Component {
    constructor(props) {
        super(props);
        this.menu = {'title': undefined,
        'items': [
          {'key': 0, 'href': 'https://s3.amazonaws.com/gaea/inventorytemplate.xlsx', 'text': 'Download Inventory Template', 'external': true}
          ]
      };
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
          <InventoryItems inventory={this.props.inventory} />
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
    }
  }
});
