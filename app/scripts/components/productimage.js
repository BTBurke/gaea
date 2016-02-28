var React = require('react');
var config = require('../config');


class ProductImage extends React.Component {
    render() {
        var img_source = config.imgURL + '/' + this.props.item + ".jpg";
        var imgStyle = {
            'backgroundImage': 'url(' + img_source + ')',
            'backgroundRepeat': 'no-repeat',
            'backgroundPosition': 'center',
            'backgroundSize': 'contain',
            'backgroundColor': '#fff',
            'minHeight': '250px',
            'margin-top': 'auto'
        }
        console.log("getting image: ", img_source);
        return (
        <div style={imgStyle}>
        </div>
        
        );
    }
}

module.exports = ProductImage;