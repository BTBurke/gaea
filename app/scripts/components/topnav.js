var React = require('react');
var B=require('react-bootstrap');

class TopNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <B.Navbar brand='React-Bootstrap' toggleNavKey={0}>
        <B.Nav right eventKey={0}> {/* This is the eventKey referenced */}
          <B.NavItem eventKey={1} href='#'>Events</B.NavItem>
          <B.NavItem eventKey={2} href='#'>Order</B.NavItem>
          <B.DropdownButton eventKey={3} title={this.props.user}>
            <B.MenuItem eventKey='1'>Profile</B.MenuItem>
            <B.MenuItem eventKey='2'>Logout</B.MenuItem>
          </B.DropdownButton>
        </B.Nav>
      </B.Navbar>
    );
  }
}

module.exports = TopNav;
