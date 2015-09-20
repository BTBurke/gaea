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
            <B.NavItem eventKey={1} href="/#/home">Home</B.NavItem>
            <B.NavItem eventKey={2} href='/#/order'>Orders</B.NavItem>
            <B.NavItem divider />
            <B.DropdownButton eventKey={3} title={this.props.user}>
              <B.MenuItem eventKey='1' href="/#/logout">Logout</B.MenuItem>
            </B.DropdownButton>
          </B.Nav>
        );
    };
    return (
      <B.Navbar toggleNavKey={0} brand={<a className="topnav-brand" href="/#/home">Guangzhou American Employee Association</a>}>
        {this.props.user ? showUser() : null}
      </B.Navbar>
    );
  }
}

module.exports = TopNav;
