var React = require('react');
var B = require('react-bootstrap');

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    _onChange() {
        this.props.onSearch(this.refs.searchbox.getValue())
    }
    
    render() {
        return (
        <div className="oi-searchbox">
        <form>
            <B.Input type='text' label='Search' ref='searchbox' onChange={this._onChange.bind(this)} placeholder='Search inventory' />
        </form>
        </div>
        );
    }
}

module.exports = SearchBox;