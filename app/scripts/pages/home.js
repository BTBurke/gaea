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
          {'key': 0, 'href': '/#/order', 'text': 'Submit an order'},
          {'key': 1, 'href': '/#/events', 'text': 'See Schedule of Events'}
          ]
      };
    this.adminMenu = {'title': 'Admin Links',
        'items': [
          {'key': 0, 'href': '/#/announcements/edit', 'text': 'Add or Edit Announcements'}
          ]
    }
  }
  
  render() {
    
    var adminMenu = function(role, menu) {
      if (role === 'admin') {
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
              <p>The next duty-free liquor order is coming up.  We expect that all orders will have to be in by the end of July for a delivery date in August.</p>
              <B.Button bsStyle='success' bsSize='small' href='/#/order'>Order booze</B.Button>
              <div className="home-posted-on">Posted on 5-June-2015</div>

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
