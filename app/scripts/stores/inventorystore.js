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
  'LOGIN_REQUIRED',
  'EFFECTS_RECEIVE'
]);

////////////////////////////////////////////////////////////////////////////
// InventoryAPI reflects all routes associated with managing inventory state
////////////////////////////////////////////////////////////////////////////

class InventoryAPI extends Marty.HttpStateSource {
   readInventoryByOrder(orderID, currency) {
     if (currency) {
       return this.request({
         url: Config.baseURL + '/inventory?order=' + orderID + '&currency=' + currency
       });
     } else {
       return this.request({
         url: Config.baseURL + '/inventory?order=' + orderID
       });
     }
  }

   readInventoryBySale(saleID, currency) {
     if (currency) {
       return this.request({
         url: Config.baseURL + '/inventory?sale=' + saleID + '&currency=' + currency
       });
     } else {
       return this.request({
         url: Config.baseURL + '/inventory?sale=' + saleID
       });
     }
   }
   uploadInventoryCSV(csvtext) {
     log.Debug("Posting inventory CSV text...");
     return this.request({
      url: Config.baseURL + '/inventory/csv',
      method: 'POST',
      body: csvtext
     });
   }
   deleteInventory() {

   }
   createItem(item) {
     return this.request({
       url: Config.baseURL + '/inventory',
       method: 'POST',
       body: item
     });
   }
   updateItem(payload) {
    return this.request({
      url: Config.baseURL + '/inventory/' + payload.old.inventory_id,
      method: 'PUT',
      body: payload
    });
   }

   getInventoryEffects(inventory_id) {
     return this.get(Config.baseURL + '/inventory/' + inventory_id + '/effects');
   }
}


//////////////////////////////////
// Queries
//////////////////////////////////

class InventoryQueries extends Marty.Queries {
  readInventoryByOrder(orderID, currency) {
    return this.app.InventoryAPI.readInventoryByOrder(orderID, currency)
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
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  readInventoryBySale(saleID, currency) {
    return this.app.InventoryAPI.readInventoryBySale(saleID, currency)
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
        this.dispatch(Constants.REQUEST_FAILED, err);
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
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  createItem(item) {
    return this.app.InventoryAPI.createItem(item)
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.INVENTORY_CREATE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to create inventory item").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  updateItem(payload) {
    return this.app.InventoryAPI.updateItem(payload)
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.INVENTORY_UPDATE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to update inventory item " + payload.old.inventory_id ).getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }
  getInventoryEffects(inventory_id) {
    return this.app.InventoryAPI.getInventoryEffects(inventory_id)
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.EFFECTS_RECEIVE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to get inventory item change effects for " + inventory_id ).getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

}


////////////////////////////////////
// Model
////////////////////////////////////

class Inventory {
  constructor(props) {
    if (props) {
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
      this.in_stock = props.in_stock;
      this.use_case_pricing = props.use_case_pricing;
      this.case_size = props.case_size;
      this.split_case_penalty_per_item_pct = props.split_case_penalty_per_item_pct;
      this.currency = props.currency;

      if (typeof(props.types) === 'string') {
        this.types = props.types.split(">");
      } else {
        this.types = props.types;
      }

      if (typeof(props.origin) === 'string') {
        this.origin = props.origin.split(">");
      } else {
        this.origin = props.origin;
      }

      if (typeof(props.changelog) === 'string') {
        this.changelog = props.changelog.split(">");
      } else {
        this.changelog = props.changelog;
      }
    } else {
      this.sale_id = undefined;
      this.updated_at = undefined;
      this.inventory_id = undefined;
      this.supplier_id = undefined;
      this.name = undefined;
      this.desc = undefined;
      this.abv = undefined;
      this.size = undefined;
      this.year = undefined;
      this.nonmem_price = undefined;
      this.mem_price = undefined;
      this.in_stock = undefined;
      this.types = undefined;
      this.origin = undefined;
      this.changelog = undefined;
      this.use_case_pricing = undefined;
      this.case_size = undefined;
      this.split_case_penalty_per_item_pct = undefined;
      this.currency = undefined;
    }

  }

  asSearchObject() {
    return {
      'supplier_id': this.supplier_id,
      'name': this.name,
      'desc': this.desc,
      'types': this.types,
      'origin': this.origin
    };

    }

  clone() {
    return new Inventory({
      'sale_id': this.sale_id,
      'updated_at': this.updated_at,
      'inventory_id': this.inventory_id,
      'supplier_id': this.supplier_id,
      'name': this.name,
      'desc': this.desc,
      'abv': this.abv,
      'size': this.size,
      'year': this.year,
      'nonmem_price': this.nonmem_price,
      'mem_price': this.mem_price,
      'types': this.types,
      'origin': this.origin,
      'changelog': this.changelog,
      'in_stock': this.in_stock,
      'use_case_pricing': this.use_case_pricing,
      'case_size': this.case_size,
      'split_case_penalty_per_item_pct': this.split_case_penalty_per_item_pct,
      'currency': this.currency
    });
  }

  stringifyArrays() {
      var inv = this.clone();
      inv.types = inv.types.join(">");
      inv.origin = inv.origin.join(">");
      inv.changelog = inv.changelog.join(">");
      return inv;
  }
}


///////////////////////////////////
// Store
///////////////////////////////////
class InventoryStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {
      'inv-new': []
    };
    this.handlers = {
      _inventoryRead: Constants.INVENTORY_READ,
      _inventoryCreate: Constants.INVENTORY_CREATE,
      _inventoryUpdate: Constants.INVENTORY_UPDATE,
      _inventoryEffects: Constants.EFFECTS_RECEIVE

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

  _inventoryCreate(inv) {
    this.state[inv.query] = this.state[inv.query].concat(new Inventory(inv.inventory));
    this.hasChanged();
  }

  _inventoryUpdate(inv) {
    this.state[inv.query] = _.reject(this.state[inv.query], function(i) { return i.inventory_id === inv.inventory.inventory_id});
    this.state[inv.query] = this.state[inv.query].concat(new Inventory(inv.inventory));
    this.hasChanged();
  }

  _inventoryEffects(eff) {
    if (eff.qty === 0) {
      this.state[eff.query] = [];
    } else {
      this.state[eff.query] = eff.users;
    }
    this.hasChanged();
  }

  // Methods
  getInventoryByOrder(orderID, currency) {
    return this.fetch({
      id: 'inventory',
      locally: function() {
        return this.state['order-'+orderID];
      },
      remotely: function() {
        return this.app.InventoryQueries.readInventoryByOrder(orderID, currency);
      }
    });
  }

  getInventoryBySale(saleID, currency) {
    return this.fetch({
      id: 'inventory',
      locally: function() {
        return this.state['sale-'+saleID];
      },
      remotely: function() {
        return this.app.InventoryQueries.readInventoryBySale(saleID, currency);
      }
    });
  }

  getInventoryEffects(inventoryID) {
    return this.fetch({
      id: 'effects',
      locally: function() {
        return this.state['inv-'+inventoryID];
      },
      remotely: function() {
        return this.app.InventoryQueries.getInventoryEffects(inventoryID);
      }
    });
  }

}

module.exports.InventoryStore = InventoryStore;
module.exports.InventoryQueries = InventoryQueries;
module.exports.InventoryAPI = InventoryAPI;
module.exports.Inventory = Inventory;
