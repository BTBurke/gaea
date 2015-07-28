var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var log = require('../services/logger');

class ErrorList extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        if (this.props.errors.length > 0) {
            return (
                <div className="el-box">
                    <h4>There are errors in your inventory:</h4>
                    {_.map(this.props.errors, function (err) { return (<p>{err}</p>); })}
                </div>
                );
        } else {
            return null;
        }
    }
}

module.exports = ErrorList;