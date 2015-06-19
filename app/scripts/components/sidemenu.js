var React = require('react');
var B = require('react-bootstrap');

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        var menu = this.props.menu;
        var listitems = menu.items.map(function(item) {
            return (
                <B.ListGroupItem key={item.key} href={item.href}>{item.text}</B.ListGroupItem>
            );
        });
        
        var title = function(title) {
            if (title) {
                return (
                <span className='comp-sidemenu-title'>{title}</span>
                );
            }
        }
        
        return (
            <div className='comp-sidemenu'>
                {title(menu.title)}
                <B.ListGroup>
                    {listitems}
                </B.ListGroup>
            </div>
        );
    }
}

module.exports = SideMenu;