'use strict';

var Marty = require('marty');
var UserStore = require('../stores/userstore');
var React = require('react');

var TopNav = require('../components/topnav');

var Application = require('../stores/application');
var { ApplicationContainer } = require('marty');

var app = new Application();

class Home extends React.Component {
  render() {
    return (
      <div>
      <TopNav user={this.props.user.userName}/>
      <div>First: {this.props.user.firstName}</div>
      <div>Last: {this.props.user.lastName}</div>
      </div>
    );
  }
}

// module.exports = Marty.createContainer(Home, {
//   listenTo: UserStore,
//   fetch: {
//     user() {
//       return UserStore.getUser();
//     }
//   }
// });

module.exports = Marty.createContainer(Home, {
  listenTo: 'UserStore',
  fetch: {
    user() {
      return this.app.UserStore.getUser();
    }
  }
});