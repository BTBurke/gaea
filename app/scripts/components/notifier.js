var React = require('react');
var Notification = require('react-notification');

class Notifier extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            'message': ''
        };
        
        this.notifierStyle = this.props.style ? this.props.style : {
            'background': '#263238',
            'color': '#FFCCBC'
        };

    }
    
    handleClose() {
        this.refs.notification.hide();
    }
    
    componentWillReceiveProps(props) {
        if (props.message === undefined || props.message === '') {
            this.setState({'message': ''});
            this.refs.notification.hide();
        } else {
            this.setState({'message': props.message});
            this.refs.notification.show();
            setTimeout(function() {
                this.refs.notification.hide();
            }.bind(this), 2000);
        }
    }
    
    render() {
        return (
        <Notification
          ref="notification"
          message={this.state.message}
          action={'CLOSE'}
          styles={this.notifierStyle}
          onClick={this.handleClose.bind(this)}/>
        );
    }
}

module.exports = Notifier;