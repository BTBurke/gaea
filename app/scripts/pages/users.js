var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var log = require('../services/logger');

class Users extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <TopNav user={this.props.user.fullName} />
        <B.Grid>
          <B.Row>
            <B.Col md={3} lg={3}>
            </B.Col>
            <B.Col md={9} lg={9}>
              <div className="users-stats">
                {userStats}
              </div>
              <div className="users-table">

              </div>
            </B.Col>
          </B.Row>
        </B.Grid>
      </div>
    );
  }
}
