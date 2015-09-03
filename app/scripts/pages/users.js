var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');
var Marty = require('marty');

var TopNav = require('../components/topnav');
var Loading = require('../components/loading');
var Spinner = require('../components/spinner');
var log = require('../services/logger');
var utils = require('../services/utils');

class Users extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      'show': false,
      'submit': false,
	'error': undefined
    }
  }
  
  createUser() {
    log.Debug("create user...");
    this.setState({'submit': true});
	var first = this.refs.first.getValue();
	var last = this.refs.last.getValue();
	var email = this.refs.email.getValue();
	var role = this.refs.role.getValue();
	var exp = this.refs.exp.getValue();
	if (first.length === 0 || last.length === 0 || email.length === 0) {
		this.setState({'error': 'User must have a first name, last name, and email entered', 'submit': false});
		return	
	}	
	if (role === 'member' && !Date.parse(exp)) {
		this.setState({'error': 'Date must be in a valid format - MM/DD/YYYY', 'submit': false});
		return	
	}
	var body = {
		'first_name': first,
		'last_name': last,
		'email': email,
		'role': role,
		'member_exp': role !== 'nonmember' ? new Date(exp).toISOString() : new Date('01-01-1950').toISOString()
	}
	this.app.UserQueries.createUser(body);
  }
  
  showAdd() {
    this.setState({'show': true});
  }
  onHide () {
   this.setState({'show': false}); 
  }


  componentWillReceiveProps(newprops) {
	if (this.state.submit) {
		this.setState({'submit': false, 'error': undefined});
		this.onHide();
	}
  }

  render() {
    var userStats = () => {
      var totalUsers = this.props.users.length;
      var totalMembers = _.filter(this.props.users, (user) => { return user.role !== "nonmember" }).length;
      var pct = totalMembers/totalUsers*100.0;
      
      return (
        <B.Row>
          <B.Col md={6} lg={6}>
            <div className="member-stats">
              <div className="stats-header">Membership Stats</div> 
              <div className="stats-line"><span className="stats-figure">{totalMembers}</span> users have a membership</div>
              <div className="stats-line"><span className="stats-figure">{totalUsers}</span> total users</div>
              <div className="stats-line"><span className="stats-figure">{pct.toFixed(1)}%</span> membership rate</div>
            </div>
          </B.Col>
          <B.Col md={6} lg={6}>
            <div className="member-actions">
              <div className="actions-header">User Actions</div>
              <div className="actions-button"><B.Button block bsSize='xsmall' onClick={this.showAdd.bind(this)}>Add a new user</B.Button></div>
            </div>
          </B.Col>
        </B.Row>
      );
    }
    
    var userTable = _.map(this.props.users, (user) => {
      log.Debug(user.user_name, user);
      return (
        <tr key={user.user_name}>
          <td>{user.last_name + ', ' + user.first_name}</td>
          <td>{utils.Capitalize(user.role)}</td>
          <td>{user.role !== 'nonmember' ? new Date(user.member_exp).toDateString() : ""}</td>
          <td>{user.email}</td>
        </tr>
        );
    });
    
     var addUserPopup = () => {
       return (
         <B.Modal bsSize='small' show={this.state.show} onHide={this.onHide.bind(this)}>
           <B.Modal.Header closeButton>
             Add a new user
           </B.Modal.Header>
             <B.Modal.Body>
             <B.Input type='text' ref='first' label='First Name' />
             <B.Input type='text' ref='last' label='Last Name' />
		<B.Input type='text' ref='email' label='Email Address' />
             <B.Input type='select' ref='role' label='Membership Status' placeholder='nonmember'>
               <option value='nonmember'>Non-member</option>
               <option value='member'>Member</option>
               {this.props.user.role === 'superadmin' ? <option value='admin'>Admin</option> : null}
             </B.Input>
             <B.Input type='text' ref='exp' placeholder='MM/DD/YYYY' label='Membership Expires'/>
		{this.state.error ? <span>{this.state.error}</span> : null}            
           </B.Modal.Body>
           <B.Modal.Footer>
           <B.Button bsStyle='info' onClick={this.createUser.bind(this)}>Create User{this.state.submit ? <Spinner /> : null}</B.Button>
           </B.Modal.Footer>
         </B.Modal>
         );
     }
    
    return (
      <div>
	{addUserPopup()}
        <TopNav user={this.props.user.fullName} />
        <B.Grid>
          <B.Row>
            <B.Col md={3} lg={3}>
            </B.Col>
            <B.Col md={9} lg={9}>
              <div className="users-stats">
                {userStats()}
              </div>
              <div className="users-table">
                <B.Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Membership</th>
                      <th>Expires</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTable}
                  </tbody>
                </B.Table>
              </div>
            </B.Col>
          </B.Row>
        </B.Grid>
      </div>
    );
  }
}

module.exports = Marty.createContainer(Users, {
  listenTo: ['UserStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    users: function() {
      return this.app.UserStore.getAllUsers();
    }
  },
  pending() {
    return (
      <Loading />
      );
  }
});
