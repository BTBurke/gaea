var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var log = require('../services/logger');

class Effects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'showUsers': false
    }
  }

  toggleShow() {
    this.setState({'showUsers': !this.state.showUsers});
  }

  render() {
    log.Debug("receive effects", this.props.effects);
    var noEffect = function () {
      return (
        <B.Alert bsSize='small' bsStyle='info'>
        <div>No one has ordered this inventory item yet.  Making changes will have no effect on existing orders.</div>
        </B.Alert>
      );
    }

    var effect = () => {
      return (
        <div>
        <B.Alert bsSize='small' bsStyle='warning'>
        <div>This item has been ordered by {this.props.effects.length} customers.  If you make changes to the price or stock
        availability, customers will receive an email informing them of the changes.</div>
        </B.Alert>
        <a onClick={this.toggleShow.bind(this)}>{this.state.showUsers ? "Hide customer names" : "Show customer names"}</a>
        {this.state.showUsers ? showUsers() : null}
        </div>
      );
    }

    var showUsers = () => {
      return _.map(this.props.effects, (effect) => { return <div key={effect.user_name}>{effect.last_name + ", " + effect.first_name}</div> });
    }

    return (
      <div>
      {this.props.effects.length === 0 ? noEffect() : effect()}
      </div>
    );
  }
}

module.exports = Effects;
