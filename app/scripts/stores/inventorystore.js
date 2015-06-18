var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");
var _ = require('underscore');

var Constants = Marty.createConstants([
  'INVENTORY_READ',
  'INVENTORY_CREATE',
  'INVENTORY_DELETE',
  'INVENTORY_UPDATE',
  'REQUEST_FAILED',
  'LOGIN_REQUIRED'
]);

////////////////////////////////////////////////////////////////////////////
// InventoryAPI reflects all routes associated with managing inventory state
////////////////////////////////////////////////////////////////////////////

class InventoryAPI extends Marty.HttpStateSource {
   readInventoryByOrder(orderID) {
     console.log("Going to read inventory for " + orderID + "...");
     //TODO: need to allow search along the lines of http://api.gzaea.org/v1/inventory?order=xxxxxx
        return this.get(Config.baseURL + '/inventory');
   }
   createInventory() {

   }
   deleteInventory() {

   }
   updateInventory() {

   }
}


//////////////////////////////////
// Queries
//////////////////////////////////

class InventoryQueries extends Marty.Queries {
  readInventoryByOrder(orderID) {
    return this.app.InventoryAPI.readInventoryByOrder(orderID)
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.INVENTORY_READ, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to get inventory. InventoryID: " + inventoryID).getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err)
      });
  }
}


////////////////////////////////////
// Model
////////////////////////////////////

class Inventory {
  constructor(props) {
    this.sale_id = props.sale_id;
    this.updated_at = props.updated_at;
    this.inventory_id = props.inventory_id;
    this.supplier_id = props.supplier_id;
    this.name = props.name;
    this.desc = props.desc;
    this.abv = props.abv;
    this.size = props.size;
    this.year = props.year;
    this.nonmem_price = props.nonmem_price;
    this.mem_price = props.mem_price;
    this.types = props.types;
    this.origin = props.origin;
    this.changelog = props.changelog;
  }
}


///////////////////////////////////
// Store
///////////////////////////////////
class InventoryStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {
      'inventory': undefined
      };
    this.handlers = {
      _inventoryRead: Constants.INVENTORY_READ,

    };
  }

  // Action Handlers
  _inventoryRead(inv) {
    console.log('Inventory: received', inv);
    this.state['inventory'] = _.map(inv, function(inv1) {return new Inventory(inv1)});
    console.log('Inventory: state update', this.state['inventory']);
    this.hasChanged();
  }




  // Methods
  getInventoryByOrder(orderID) {
    return this.fetch({
      id: 'inventory',
      locally: function(orderID) {
        return this.state['inventory'];
      },
      remotely: function(orderID) {
        return this.app.InventoryQueries.readInventoryByOrder();
      }
    });

  }

}

module.exports.InventoryStore = InventoryStore;
module.exports.InventoryQueries = InventoryQueries;
module.exports.InventoryAPI = InventoryAPI;
