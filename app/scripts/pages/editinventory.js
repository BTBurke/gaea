var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var TopNav = require('../components/topnav');
var Directions = require('../components/directions');
var log = require('../services/logger');

var Application = require('../stores/application');
var app = new Application();

class EditInventory extends React.Component {
    constructor(props) {
        super(props);
    }

    upload(csv) {
        console.log("received csv", csv);
    }

    render() {
      if len(this.props.inventory === 0) {
        return (
          <div>
          <TopNav user={this.props.user.fullName} />
          <UploadInventory upload={this.upload.bind(this)}/>
          </div>
        );
      } else {
        return (
          <div>
          <TopNav user={this.props.user.fullName} />
          <p>Still testing</p>
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
