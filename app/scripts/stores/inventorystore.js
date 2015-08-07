var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");
var _ = require('underscore');

var log = require('../services/logger');

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
     console.log("API receive:", orderID);
     console.log("Going to read inventory for " + orderID + "...");
     //TODO: need to allow search along the lines of http://api.gzaea.org/v1/inventory?order=xxxxxx
      return this.get(Config.baseURL + '/inventory?order=' + orderID);
   }
   
   readInventoryBySale(saleID) {
     log.Debug("Going to read inventory for " + saleID + "...");
     //TODO: need to allow search by sale http://api.gzaea.org/v1/inventory?sale=xxxxxx
     return this.get(Config.baseURL + '/inventory?sale=' + saleID);
   }
   uploadInventoryCSV(csvtext) {
     log.Debug("Posting inventory CSV text...")
     return this.request({
      url: Config.baseURL + '/inventory/csv',
      method: 'POST',
      body: csvtext
     });
   }
   deleteInventory() {

   }
   updateInventoryItem() {

   }
}


//////////////////////////////////
// Queries
//////////////////////////////////

class InventoryQueries extends Marty.Queries {
  readInventoryByOrder(orderID) {
    console.log("query receive:", orderID);
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
            throw new AppError("Failed to get inventory. OrderID: " + orderID).getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err)
      });
  }

  readInventoryBySale(saleID) {
    return this.app.InventoryAPI.readInventoryBySale(saleID)
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
            throw new AppError("Failed to get inventory. saleID: " + saleID).getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err)
      });
  }
  
  uploadInventoryCSV(csvtext) {
    return this.app.InventoryAPI.uploadInventoryCSV(csvtext)
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
            throw new AppError("Failed to get inventory after uploading CSV." + saleID).getError();
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
    this.types = props.types.split(">");
    this.origin = props.origin.split(">");
    this.changelog = props.changelog.split(">");
    this.in_stock = props.in_stock;
  }
}


///////////////////////////////////
// Store
///////////////////////////////////
class InventoryStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      _inventoryRead: Constants.INVENTORY_READ,

    };
  }

  // Action Handlers
  _inventoryRead(inv) {
    console.log('Inventory: received', inv);
    if (inv.qty > 0) {
      this.state[inv.query] = _.map(inv.inventory, function(inv1) {return new Inventory(inv1)});
    } else {
      this.state[inv.query] = [];
    }
    console.log('Inventory: state update', this.state);
    this.hasChanged();
  }




  // Methods
  getInventoryByOrder(orderID) {
    console.log("i received orderid in store:", orderID);
    return this.fetch({
      id: 'inventory',
      locally: function() {
        return this.state['order-'+orderID];
      },
      remotely: function() {
        return this.app.InventoryQueries.readInventoryByOrder(orderID);
      }
    });
  }
    
  getInventoryBySale(saleID) {
    return this.fetch({
      id: 'inventory',
      locally: function() {
        return this.state['sale-'+saleID];
      },
      remotely: function() {
        return this.app.InventoryQueries.readInventoryBySale(saleID);
      }
    });
  }

}

module.exports.InventoryStore = InventoryStore;
module.exports.InventoryQueries = InventoryQueries;
module.exports.InventoryAPI = InventoryAPI;
