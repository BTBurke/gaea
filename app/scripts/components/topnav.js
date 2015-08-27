var React = require('react');
var B=require('react-bootstrap');

class TopNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    var showUser = () => {
        return (
          <B.Nav right eventKey={0}> {/* This is the eventKey referenced */}
            <B.DropdownButton eventKey={1} title={this.props.user}>
              <B.MenuItem eventKey='1'>Profile</B.MenuItem>
              <B.MenuItem eventKey='2'>Logout</B.MenuItem>
            </B.DropdownButton>
          </B.Nav>
        );
    }
    return (
      <B.Navbar toggleNavKey={0} brand={'Guangzhou American Employee Association'}>
        {this.props.user ? showUser() : null}
      </B.Navbar>
    );
  }
}

module.exports = TopNav;
