var React = require('react');
var B = require('react-bootstrap');
var parse = require('csv-parse');
var _ = require('underscore');

var log = require('../services/logger');
var Directions = require('./directions');
var ErrorList = require('./errorlist');
var Spinner = require('./spinner');
var config = require('../config');

class UploadInventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'errors': [],
            'submit': false
        }
        
        this.directions = [
        {'section': 'Step 1', 'text': 'Create an excel file with the inventory data.  Download the template format using the link on the left.  Follow the instructions on the first sheet.'},
        {'section': 'Step 2', 'text': 'Save the inventory sheet as a CSV-format file.'},
        {'section': 'Step 3', 'text': 'Open the CSV file in Notepad then copy and paste the text into the box below.'},
        {'section': 'Step 4', 'text': 'Press the Validate and Upload button.  If the inventory passes validation, it will be uploaded and the inventory will appear on the screen below.  If there are errors, make changes to the file and repeat.'}
        ];
    }
    
    validate(csv) {
        var colNames = _.first(csv);
        var invs = _.rest(csv);
        var reqNames = config.inventory_required;
        
        // returns a map keyed by the index of the column names that
        // are required.  Allows the format to change as long as the column
        // names are tracked in config.inventory_required list
        var reqts = _.indexBy(reqNames, function(req) {
            return _.indexOf(colNames, req);
        });
        
        if (reqts[-1]) {
            log.Debug('Missing column:', reqts[-1]);
            return ["Missing required column: " + reqts[-1]];
        }
        
        var errs = _.map(invs, function(inv, line) {
            return _.map(reqts, function(name, idx) {
                if (inv[idx].length === 0) {
                    return "Line " + (line+2) + ": Required value missing - " + name;
                } 
            }); 
        });
        
        log.Debug("reqts", reqts);
        
        return _.filter(_.flatten(errs), function (err) { return err !== undefined });
    }
        
    validateThenUpload() {
        var csvtext = this.refs.csvtext.getValue();
        log.Debug("csv text", csvtext)
        this.setState({'errors': [], 'submit': true});
        
        parse(csvtext, function(err, outputAsArray) {
             if (err) {
                 this.setState({'errors': [err]});
             } else {
                 var errs = this.validate(outputAsArray);
                 log.Debug("errors:", errs);
                 if (errs) {
                     this.setState({'errors': errs});
                 }
             }
        }.bind(this));
        
        if (csvtext.length === 0) {
            this.setState({'errors': ['Inventory CSV text is empty']});
        }
        
        if (this.state.errors.length === 0) {
            log.Debug('Uploading validated CSV file...');
            this.props.upload(csvtext);
        }
        //this.setState({'submit': false});
    }
    
    render() {
        
        return (
        <div>
        <Directions title="Uploading a New Inventory" directions={this.directions}/>
        <form>
        <B.Input type='textarea' label='Paste Inventory CSV' placeholder='' ref='csvtext' className="ui-inventory-box" />
        </form>
        <B.Button onClick={this.validateThenUpload.bind(this)} bsStyle={this.state.submit ? 'default' : 'info'}>Validate and Submit{this.state.submit ? <Spinner /> : null}</B.Button>
        <ErrorList errors={this.state.errors}/>
        </div>
        );
    }
}
module.exports = UploadInventory;