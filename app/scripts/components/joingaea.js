var React = require('react');
var _ = require('underscore');
var B = require('react-bootstrap');
var Marty = require('marty');

class JoinGAEA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'membership_item': _.findWhere(this.props.inventory, {'name': 'Membership'})
        }
    }
    
    onAddLocal() {
        console.log("found membership", this.state.membership_item);
        var id = this.state.membership_item.inventory_id;
        this.props.onAdd(id, 1);
        this.app.UserQueries.updateMembership(this.props.user.userName);
    }
    
    render() {
        return (
        <div className="join-container">
        <span className="join-text">Join the GAEA today to save 20% on this order and get all the association has to offer.  Lifetime membership is $150.</span>
        <span className="join-button"><B.Button bsStyle="warning" onClick={this.onAddLocal.bind(this)}>Join GAEA</B.Button></span>
        </div>
        
        );
    }
}

module.exports = Marty.createContainer(JoinGAEA, {
  listenTo: ['UserStore'],
  fetch: {
    user: function() {
        return this.app.UserStore.getUser();
    }
  }
});