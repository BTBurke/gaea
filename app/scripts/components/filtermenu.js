var React = require('react');
var B = require('react-bootstrap');
var _ = require('underscore');

var log = require('../services/logger');

class FilterMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {


        var listOfTypes = _.uniq(_.pluck(this.props.inventory, 'types'));

        var listOfOrigins = _.uniq(_.pluck(this.props.inventory, 'origin'));

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

            var displayTypes = _.map(listOfTypes, function(t) { return makeItem(t[0]) });
            displayTypes = _.uniq(_.filter(displayTypes, (dt) => { return dt != undefined }), false, function(dt) { return dt.key })
        } else {

            var mostSpecific = _.last(this.props.filter);
            var displayTypes = _.map(listOfTypes, function(t) {
               var idx = _.findIndex(t, function(t1) {return t1 === mostSpecific});
               if (idx != -1 && t.length >= idx+2) {
                   return makeItem(t[idx+1])
               } else {
                   return
               }
            });
            displayTypes = _.uniq(_.filter(displayTypes, (dt) => { return dt != undefined }), false, function(dt) { return dt.key })
        }

        if (this.props.origin.length == 0) {
            // return first item in lists only
            var displayOrigins = _.map(listOfOrigins, function(t) {
                return makeItemOrigin(t[0])

            });
            displayOrigins = _.uniq(_.filter(displayOrigins, (dt) => { return dt != undefined }), false, function(dt) { return dt.key })
        } else {
            var mostSpecific = _.last(this.props.origin);
            var displayOrigins = _.map(listOfOrigins, function(t) {
               var idx = _.findIndex(t, function(t1) {return t1 === mostSpecific});
               if (idx != -1 && t.length >= idx+2) {
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
                      <span className="fm-filter-clear-last"><a onClick={this.props.onClearFilterLast}>x</a></span>
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
