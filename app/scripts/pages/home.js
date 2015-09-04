'use strict';

var Marty = require('marty');
var UserStore = require('../stores/userstore');
var React = require('react');
var B = require('react-bootstrap');

var TopNav = require('../components/topnav');
var SideMenu = require('../components/sidemenu');
var Loading = require('../components/loading');
var SalesHome = require('../components/saleshome');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');

var app = new Application();

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.menu = {'title': undefined,
        'items': [
          {'key': 0, 'href': '/order', 'text': 'Manage your orders'},
          ]
      };
    this.adminMenu = {'title': 'Admin Links',
        'items': [
          {'key': 0, 'href': '/announcements', 'text': 'Add or Edit Announcements'},
          {'key': 1, 'href': '/sale', 'text': 'Manage Sales'},
          {'key': 2, 'href': '/user', 'text': "Manage Users"}
          ]
    }
  }

  render() {

    var adminMenu = function(role, menu) {
      if (role === 'admin' || role === 'superadmin') {
        return (
          <SideMenu menu={menu}/>
        );
      }
    }

    return (
      <div>
      <TopNav user={this.props.user.fullName}/>
      <B.Grid>
        <B.Row>
          <B.Col md={3} lg={3}>
            <SideMenu menu={this.menu}/>
            {adminMenu(this.props.user.role, this.adminMenu)}
          </B.Col>

          <B.Col md={9} lg={9}>
            <SalesHome sales={this.props.sales} />
          </B.Col>
        </B.Row>
      </B.Grid>

      </div>
    );
  }
}


module.exports = Marty.createContainer(Home, {
  listenTo: ['UserStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    }, 
    sales: function() {
      return this.app.SaleStore.getSales();
    }
  },
  pending() {
    return (
      <Loading />
      );
  }
});
