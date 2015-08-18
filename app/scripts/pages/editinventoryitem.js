var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var log = require('../services/logger');
var config = require('../config');

var TopNav = require('../components/topnav');
var SideMenu = require('../components/sidemenu');
var ErrorList = require('../components/errorlist');

var Application = require('../stores/application');
var app = new Application();

class EditInventoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.menu = {
          'title': undefined,
          'items': [
            {'key': 0, 'href': '/sale/'+this.props.params.saleID+'/inventory', 'text': 'Return to Inventory'}
          ]
        }
        log.Debug('edit inventory received:', this.props.inventory)
        
        this.oldInventory = _.findWhere(this.props.inventory, {'inventory_id': parseInt(this.props.params.invID)});
        this.state = {
            transitionPending: false,
            inventory: this.oldInventory.clone(),
            errors: []
        }
        
        if (this.state.inventory) {
            this.state.inventory.types = this.state.inventory.types.slice(0).join(">");
            this.state.inventory.origin = this.state.inventory.origin.slice(0).join(">");
        }
    }
    
    
    onChange(field) {
        return function() {
            var newInventory = this.state.inventory;
            newInventory[field] = this.refs[field].getValue();
            this.setState({'inventory': newInventory});
        }.bind(this);
    }
    
    onChangeStock() {
        var newInventory = this.state.inventory;
        
        if (this.refs.stock === 'instock') {
            newInventory.in_stock = true;
        } else {
            newInventory.in_stock = false;
        }
        this.setState({'inventory': newInventory});
    }
    
    validate() {
        var errors = _.filter(_.map(config.inventory_required, (field) => {
            if (this.state.inventory[field].length === 0) {
                return field + ' must have a value';
            } else {
                return null;
            }
        }), (error) => { return error != null});
        if (errors.length > 0) {
            this.setState({'errors': errors});
            return false;
        } else {
            return true;
        }
    }
    
    changelog(newItem, oldItem) {
        log.Debug('new', newItem);
        log.Debug('old', oldItem);
        var changeLog = [];
        var changedFields = [];
        var now = new Date();
        
        for (var key in newItem) {
            if (typeof(newItem[key]) === 'object') {
                continue;
            }
            if (newItem[key] !== oldItem[key]) {
                changeLog = changeLog.concat(now.toString() + " : " + this.props.user.fullName + " changed the value of " + key + " from '" + oldItem[key] + "' to '" + newItem[key] + "'");
                changedFields = changedFields.concat(key);
            }
        }
        return {
            'changeLog': changeLog,
            'changeField': changedFields
        }
    }
    
    updateItem() {
        var validated = this.validate();
        if (validated) {
            var submitInv = this.state.inventory.clone();
            
            log.Debug("item update with", this.state.inventory);
            var changes = this.changelog(submitInv, this.oldInventory);
            log.Debug("changes", changes);
        }
        
    }
    
    render() {
        var text = (label, ref, dir, before, after, bumpup) => {
            return (
                <B.Row>
                <B.Col md={6} lg={6}>
                    <B.Input type="text" label={label} ref={ref} value={this.state.inventory ? this.state.inventory[ref] : ""} onChange={this.onChange(ref)} addonBefore={before} addonAfter={after} />
                </B.Col>
                <B.Col md={6} lg={6}>
                    <div className={bumpup ? "eii-instruct-bump" : "eii-instruct"}>{dir}</div>
                </B.Col>
                </B.Row>
            );
        }
        
        var determineAvailability = () => {
            if (this.state.inventory) {
                if (this.state.inventory.in_stock) {
                    return "instock";
                } else {
                    return "outstock";
                }
            } else {
                // New inventory item, default to instock
                return "instock";
            }
        }
        return (
            <div>
            <TopNav user={this.props.user.fullName} />
            <B.Grid>
                <B.Row>
                    <B.Col md={3} lg={3}>
                        <SideMenu menu={this.menu} />
                    </B.Col>
                    <B.Col md={9} lg={9}>
                        <form>
                        {text("Supplier ID", "supplier_id", "Enter the supplier's ID code")}
                        
                        {text("Product Name", "name", "Enter the name of the product")}
                        
                        <B.Input type="textarea" label="Product Description" ref='desc' value={this.state.inventory ? this.state.inventory.desc : ""} onChange={this.onChange('desc')} />
                        
                        {text("Alcohol By Volume (%)", "abv", "Enter the alcohol content", null, "%")}
                        
                        {text("Item Size", "size", "Enter the size of the item (e.g., 750mL, 6x33cL)")}
                        
                        {text("Year", "year", "Enter the year the item was made")}
                        
                        {text("Non-Member Price", "nonmem_price", "Enter the non-member price in dollars", "$", ".00")}
                        
                        {text("Member Price", "mem_price", "Enter the member price in dollars", "$", ".00")}
                        
                        <B.Row>
                        <B.Col md={6} lg={6}>
                            <B.Input type='select' label='Stock Availability' ref='stock' value={determineAvailability()} onChange={this.onChangeStock.bind(this)}>
                                <option value='instock'>In Stock</option>
                                <option value='outstock'>Out of Stock</option>
                            </B.Input>
                        </B.Col>
                        <B.Col md={6} lg={6} className="eii-item">
                            <div className="eii-instruct">Select stock availability</div>
                        </B.Col>
                        </B.Row>
                        
                        {text("Type Tags", "types", "Enter type tags separated by >. These tags are used to filter the inventory (e.g., Spirits>Gin, Wine>Red Wine>Malbec)", null, null, true)}
                        {text("Origin Tags", "origin", "Enter origin tags separated by >. These tags are used to filter the inventory (e.g., Scotland>Speyside)", null, null, true)}
                        
                        </form>
                        <B.Button onClick={this.updateItem.bind(this)}>{this.state.inventory.inventory_id ? "Update Item" : "Create Item"}</B.Button>
                        <ErrorList errors={this.state.errors} />
                    </B.Col>
                </B.Row>
            </B.Grid>
            </div>
        );
    }
}


module.exports = Marty.createContainer(EditInventoryItem, {
  listenTo: ['UserStore', 'InventoryStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    inventory: function() {
        return this.app.InventoryStore.getInventoryBySale(this.props.params.saleID);
    }  
  }
});