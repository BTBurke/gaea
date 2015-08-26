var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var log = require('../services/logger');

class FilterMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // filterInventory(inventory, filters, origins) {
        
    //     var checkAll = function(item, filters) {
    //         if (filters.length === 0) {
    //             return true;
    //         } else {
    //             var checks = _.map(filters, function(f1) { return _.contains(item, f1) });
    //             console.log("checks", checks);
    //             return _.every(checks, function(c) { return c === true });
    //         }
                
    //     }
        
    //     return _.filter(inventory, function(item) {
    //         if (checkAll(item.types, filters) && checkAll(item.origin, origins)) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     });
    // }
    

    render() {
        console.log("FM Received Inventory", this.props.inventory);
        console.log("FM Filter Click", this.props.onFilterClick);
        console.log("FM Filter received", this.props.filter);
        
        //var filteredInventory = this.filterInventory(this.props.inventory, this.props.filter, this.props.origin); 
        console.log("filteredInventory", this.props.inventory);
        
        var listOfTypes = _.uniq(_.pluck(this.props.inventory, 'types'));
        console.log("all the types", listOfTypes);
        var listOfOrigins = _.uniq(_.pluck(this.props.inventory, 'origin'));
        console.log("all the origins", listOfOrigins);
        
        var makeItem = function(item) {
            return (
                <div className="fm-menu-item" key={item} onClick={this.props.onFilterClick}>{item}</div>
            );
        }.bind(this);
        
        var makeItemOrigin = function(item) {
            return (
                <div className="fm-menu-item" key={item} onClick={this.props.onOriginClick}>{item}</div>
            );
        }.bind(this);
        
        if (this.props.filter.length == 0) {
            // return first item in lists only
            console.log("No filters applied");
            var displayTypes = _.map(listOfTypes, function(t) { return makeItem(t[0]) });
            displayTypes = _.uniq(_.filter(displayTypes, (dt) => { return dt != undefined }), false, function(dt) { return dt.key })
        } else {
            console.log("filters applied", this.props.filter);
            var mostSpecific = _.last(this.props.filter);
            console.log("Most specific", mostSpecific);
            var displayTypes = _.map(listOfTypes, function(t) {
               var idx = _.findIndex(t, function(t1) {return t1 === mostSpecific});
               console.log("found index", idx);
               if (idx != -1 && t.length >= idx+2) {
                   console.log("adding filter", t[idx+1]);
                   return makeItem(t[idx+1])
               } else {
                   return
               }
            });
            displayTypes = _.uniq(_.filter(displayTypes, (dt) => { return dt != undefined }), false, function(dt) { return dt.key })
        }
        
        if (this.props.origin.length == 0) {
            // return first item in lists only
            console.log("No origin applied");
            var displayOrigins = _.map(listOfOrigins, function(t) {
                console.log("going for origins", t);
                return makeItemOrigin(t[0])
                
            });
            displayOrigins = _.uniq(_.filter(displayOrigins, (dt) => { return dt != undefined }), false, function(dt) { return dt.key })
        } else {
            console.log("Origin applied:", this.props.origin);
            var mostSpecific = _.last(this.props.origin);
            console.log("Most specific", mostSpecific);
            var displayOrigins = _.map(listOfOrigins, function(t) {
               var idx = _.findIndex(t, function(t1) {return t1 === mostSpecific});
               console.log("found index", idx);
               if (idx != -1 && t.length >= idx+2) {
                   console.log("adding origin", t[idx+1]);
                   return makeItemOrigin(t[idx+1])
               } else {
                   return
               }
            });
            displayOrigins = _.uniq(_.filter(displayOrigins, (dt) => { return dt != undefined }), false, function(dt) { return dt.key })
        }
        
        var clearFilter = () => {
            
            if (this.props.filter.length === 0) {
                return null;
            }
            return (
                <div className="fm-filter-clear">
                <div className="fm-filter-clear-values">
                    {this.props.filter.slice(0).join(" > ")}
                </div>
                    <div className="fm-filter-clear-btn">
                        <a onClick={this.props.onClearFilter}>Clear Filter</a>
                    </div>
                </div>
            );
        }
        
        var clearOrigin = () => {
            
            if (this.props.origin.length === 0) {
                return null;
            }
            return (
                <div className="fm-filter-clear">
                <div className="fm-filter-clear-values">
                    {this.props.origin.slice(0).join(" > ")}
                </div>
                    <div className="fm-filter-clear-btn">
                        <a onClick={this.props.onClearOrigin}>Clear Filter</a>
                    </div>
                </div>
            );
        }
        log.Debug('displayTypes', displayTypes);
        return (
            
            <div className="fm-menu">
                <div className="fm-menu-header">Filters</div>
                <div className="fm-menu-title">By Type</div>
                {clearFilter()}
                <div className="fm-menu-section">
                    {displayTypes.length > 0 ? displayTypes : <span className="fm-no-results">No more types</span>}
                </div>
                <hr/>
                <div className="fm-menu-title">By Origin</div>
                {clearOrigin()}
                <div className="fm-menu-section">
                    {displayOrigins.length > 0 ? displayOrigins : <span className="fm-no-results">No more origins</span>}
                </div>
            </div>
        );
    }
    
}

module.exports = FilterMenu;