var React = require('react');
var B = require('react-bootstrap');

class ErrorBar extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        if (!this.props.error) {
            return null;
        }
        return (
            <B.Alert bsStyle='danger'>
                {this.props.error}
            </B.Alert>
        );
    }
    
}

module.exports = ErrorBar;