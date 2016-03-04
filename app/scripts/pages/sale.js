var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var SideMenu = require('../components/sidemenu');
var SaleTable = require('../components/saletable');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');

var app = new Application();

class Sales extends React.Component {
  constructor(props) {
    super(props);

    this.menu = {'title': 'Admin Links',
        'items': [
          {'key': 0, 'href': '/sale/new', 'text': 'Create a New Sale'}
          ]
      };
      
    this.state = {
      'showCompleted': false
    }
  }
  
  toggleShowComplete() {
    this.setState({'showCompleted': !this.state.showCompleted});
  }

  render() {

  console.log("component receive sales", this.props);
    var completedSales = function() {
      if (this.state['showCompleted']) {
        return (
          <div>
            <a onClick={this.toggleShowComplete.bind(this)}>Hide Completed Sales</a>
            <SaleTable title="Completed Sales" sales={_.where(this.props.sales, {'status': 'complete'})}/>
          </div>
        );
      } else {
        return (
          <a onClick={this.toggleShowComplete.bind(this)}>Show Completed Sales</a>
        );
      }
    }.bind(this);
  
    return (
      <div>
      <TopNav user={this.props.user}/>
      <B.Grid>
        <B.Row>
          <B.Col md={3} lg={3}>
            <SideMenu menu={this.menu}/>
          </B.Col>

          <B.Col md={9} lg={9}>
            <SaleTable title="Open Sales" sales={_.reject(this.props.sales, function(sale) { return sale.status === 'complete' })}/>
            {completedSales()}
          </B.Col>
        </B.Row>
      </B.Grid>

      </div>
    );
  }
}


module.exports = Marty.createContainer(Sales, {
  listenTo: ['UserStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    sales: function() {
      var sales = this.app.SaleStore.getSales();
      console.log('page receive sales:', sales);
      return sales;
    }
  }
});
