'use strict';

var Marty = require('marty');
var UserStore = require('../stores/userstore');
var React = require('react');
var B = require('react-bootstrap');

var TopNav = require('../components/topnav');
var SideMenu = require('../components/sidemenu');

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

            <B.Panel header='Use your duty-free liquor benefit'>
              <p>The next duty-free liquor sale is open for orders.  Choose from over 500 items including wine, beer, and spirits.  Orders should be delivered by Thanksgiving!</p>
              <B.Button bsStyle='success' bsSize='small' href='/#/order'>Order booze</B.Button>
              <div className="home-posted-on">Posted on 25-August-2015</div>

            </B.Panel>
          </B.Col>
        </B.Row>
      </B.Grid>

      </div>
    );
  }
}


module.exports = Marty.createContainer(Home, {
  listenTo: 'UserStore',
  fetch: {
    user() {
      return this.app.UserStore.getUser();
    }
  }
});
