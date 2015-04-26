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
          <B.NavItem eventKey={1} href='#'>Link</B.NavItem>
          <B.NavItem eventKey={2} href='#'>Link</B.NavItem>
          <B.DropdownButton eventKey={3} title='Dropdown'>
            <B.MenuItem eventKey='1'>Action</B.MenuItem>
            <B.MenuItem eventKey='2'>Another action</B.MenuItem>
            <B.MenuItem eventKey='3'>Something else here</B.MenuItem>
            <B.MenuItem divider />
            <B.MenuItem eventKey='4'>Separated link</B.MenuItem>
          </B.DropdownButton>
        </B.Nav>
  </B.Navbar>
    );
  }
}

module.exports = TopNav;
