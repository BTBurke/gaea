var React = require('react');
var B = require('react-bootstrap');

var Spinner = require('./spinner');

class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
        <div>
        <B.Navbar toggleNavKey={0} brand={'Guangzhou American Employee Association'}>
        </B.Navbar>
        <div className="loading">
          <span>Loading...<Spinner /></span>
        </div>
        </div>
        );
    }
}

module.exports = Loading;
