var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

class Directions extends React.Component {
    constructor(props) {
        super(props);

    }
    
    
    render() {
    
        
        var title = function(t) {
            return (
                <div>
                {t}<span className="dir-show-link">(Click to show directions)</span>
                </div>
                );
        }
        
        var directions = _.map(this.props.directions, function(dir, idx) {
           return (
            <div className="dir-section" key={dir.section}>
            <B.Row>
               <B.Col md={2} lg={2} className="dir-section-title">
                {dir.section}
                </B.Col>
                <B.Col md={10} lg={10}>
                {dir.text}
                </B.Col>
              </B.Row>
              {idx < this.props.directions.length -1 ? <hr /> : null}
            </div>
            );
        }.bind(this));
        return (
            
            <B.Accordion>
            <B.Panel bsStyle='info' eventKey="1" header={title(this.props.title)}>
            {directions}
            </B.Panel>
            </B.Accordion>
        
        );
    }
}

module.exports = Directions;