var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

class FilterMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var listOfTypes = _.pluck(this.props.inventory, 'type');
        console.log('listoftypes', listOfTypes);
        
        return (
            <div>testing</div>
        );
    }
    
}