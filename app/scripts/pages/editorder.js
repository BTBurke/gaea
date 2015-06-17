var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');

var TopNav = require('../components/topnav');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');

var app = new Application();

class EditOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'filter': [],
            'search': undefined,
            'sort': 'type'
        }
    }
    
    render() {
        return (
            <TopNav user={this.props.user.fullName}/>
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