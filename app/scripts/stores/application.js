var Marty = require('marty');
var localstorage = require('local-storage');

Marty.HttpStateSource.addHook({
   id: 'JWT',
   priority: 1,
   before(req) {
       var jwt = localstorage.get('gaea_jwt');
       if (jwt !== null && jwt.length > 0) {
         req.headers['Authorization'] = 'Bearer ' + jwt;
       }
       return req;
   }
});

Marty.HttpStateSource.addHook({
   id: 'JWT2',
   priority: 2,
   after(res) {
     console.log("res", res);
      var jwt = res.headers.get('Authorization');
      if (jwt !== null && jwt.length > 0) {
        console.log("Setting new jwt...");
        console.log("old jwt", localstorage.get('gaea_jwt'));
        localstorage.set('gaea_jwt', jwt.split(" ")[1]);
        console.log("new jwt", localstorage.get('gaea_jwt'));
      }
      return res;
   }
});

var UserStore = require('./userstore').UserStore;
var UserAPI = require('./userstore').UserAPI;
var UserQueries = require('./userstore').UserQueries;
var { OrderStore, OrderQueries, OrderAPI } = require('./orderstore');
var { InventoryStore, InventoryQueries, InventoryAPI } = require('./inventorystore');
var { SaleStore, SaleQueries, SaleAPI } = require('./salestore');
var SessionStore = require('./sessionstore').SessionStore;
var SessionQueries = require('./sessionstore').SessionQueries;
var SessionActions = require('./sessionstore').SessionActions;
var SessionAPI = require('./sessionstore').SessionAPI;
var AnnouncementStore = require('./announcementstore').AnnouncementStore;
var AnnouncementQueries = require('./announcementstore').AnnouncementQueries;
var AnnouncementAPI = require('./announcementstore').AnnouncementAPI;
var TransactionStore = require('./transactionstore').TransactionStore;
var TransactionQueries = require('./transactionstore').TransactionQueries;
var TransactionAPI = require('./transactionstore').TransactionAPI;

class Application extends Marty.Application {
    constructor(options) {
        super(options);

        this.register('UserStore', UserStore);
        this.register('UserQueries', UserQueries);
        this.register('UserAPI', UserAPI);

        this.register('OrderStore', OrderStore);
        this.register('OrderQueries', OrderQueries);
        this.register('OrderAPI', OrderAPI);

        this.register('InventoryStore', InventoryStore);
        this.register('InventoryQueries', InventoryQueries);
        this.register('InventoryAPI', InventoryAPI);

        this.register('SaleStore', SaleStore);
        this.register('SaleQueries', SaleQueries);
        this.register('SaleAPI', SaleAPI);

        this.register('SessionStore', SessionStore);
        this.register('SessionQueries', SessionQueries);
        this.register('SessionActions', SessionActions);
        this.register('SessionAPI', SessionAPI);

        this.register('AnnouncementStore', AnnouncementStore);
        this.register('AnnouncementQueries', AnnouncementQueries);
        this.register('AnnouncementAPI', AnnouncementAPI);
        
        this.register('TransactionStore', TransactionStore);
        this.register('TransactionQueries', TransactionQueries);
        this.register('TransactionAPI', TransactionAPI);

    }
}

module.exports = Application;
