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
    
    render() {
        
    }
}

module.exports = Marty.createContainer(EditInventory, {
  listenTo: ['UserStore', 'InventoryStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    inventory: function() {
      var sales = this.app.InventoryStore.getInventoryBySale();
      //sales.result = _.findWhere(sales.result, {"sale_id": this.props.params.saleID});
      return sales;
    }
  }
});