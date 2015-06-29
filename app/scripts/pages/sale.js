var OrderStore = require('../stores/salestore');
var React = require('react');
var B = require('react-bootstrap');

var TopNav = require('../components/topnav');
var SideMenu = require('../components/sidemenu');
var OrderTable = require('../components/saletable');

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
  }

  render() {


    return (
      <div>
      <TopNav user={this.props.user.fullName}/>
      <B.Grid>
        <B.Row>
          <B.Col md={3} lg={3}>
            <SideMenu menu={this.menu}/>
          </B.Col>

          <B.Col md={9} lg={9}>
            <SaleTable title="Open Sales" sales={_.reject(this.props.salestore.sales, function(sale) { return sale.status === 'complete' })}/>
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
    salestore: function() {
      var sales = this.app.SaleStore.getSales();
      console.log('page receive sales:', sales);
      return sales;
    }
  }
});
