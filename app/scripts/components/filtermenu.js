var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

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
        
        var listOfTypes = _.pluck(this.props.inventory, 'types');
        var listOfOrigins = _.pluck(this.props.inventory, 'origin');
        
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
            var displayTypes = _.uniq(_.map(listOfTypes, function(t) { return makeItem(t[0]) }));
        } else {
            var mostSpecific = _.last(this.props.filter);
            console.log("Most specific", mostSpecific);
            var displayTypes = _.uniq(_.map(listOfTypes, function(t) {
               var idx = _.findIndex(t, function(t1) {return t1 === mostSpecific});
               console.log("found index", idx);
               if (idx != -1 && t.length >= idx+2) {
                   console.log("adding filter", t[idx+1]);
                   return makeItem(t[idx+1])
               } else {
                   return
               }
            }));
        }
        
        if (this.props.origin.length == 0) {
            // return first item in lists only
            var displayOrigins = _.uniq(_.map(listOfOrigins, function(t) { return makeItemOrigin(t[0]) }));
        } else {
            var mostSpecific = _.last(this.props.origin);
            console.log("Most specific", mostSpecific);
            var displayOrigins = _.uniq(_.map(listOfOrigins, function(t) {
               var idx = _.findIndex(t, function(t1) {return t1 === mostSpecific});
               console.log("found index", idx);
               if (idx != -1 && t.length >= idx+2) {
                   console.log("adding origin", t[idx+1]);
                   return makeItemOrigin(t[idx+1])
               } else {
                   return
               }
            }));
        }
        
        return (
            
            <div className="fm-menu">
                <div className="fm-menu-header">Filters</div>
                <div className="fm-menu-section">
                    <div className="fm-menu-title">By Type</div>
                    {displayTypes}
                </div>
                <hr/>
                <div className="fm-menu-section">
                    <div className="fm-menu-title">By Origin</div>
                    {displayOrigins}
                </div>
            </div>
        );
    }
    
}

module.exports = FilterMenu;