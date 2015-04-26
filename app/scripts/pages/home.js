'use strict';

var Marty = require('marty');
var UserStore = require('../stores/userstore');
var React = require('react');

var TopNav = require('../components/topnav');


class Home extends React.Component {
  render() {
    return (
      <div>
      <TopNav />
      <div>First: {this.props.user.firstName}</div>
      <div>Last: {this.props.user.lastName}</div>
      </div>
    );
  }
}

module.exports = Marty.createContainer(Home, {
  listenTo: UserStore,
  fetch: {
    user() {
      return UserStore.getUser();
    }
  }
});
