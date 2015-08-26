var React = require('react');

var Spinner = require('./spinner');

class Loading extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
        <div className="loading">
          <span>Loading...<Spinner /></span>
        </div>    
        );
    }
}

module.exports = Loading;