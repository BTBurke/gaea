var Marty = require('marty');

var UserConstants = Marty.createConstants([
  'LOGIN_REQUIRED',
]);


Marty.HttpStateSource.addHook({
   id: 'JWT',
   priority: 1,
   before(req) {
       req.headers['Authorization'] = 'QWRJKLFDJKSL.FJKLDJKLFDJKL.BURKE.HS256';
   }
});

// Marty.HttpStateSource.addHook({
//    id: '401',
//    priority: 2,
//    after(res) {
//       if (res.status == 401){
//           console.log("Saw the 401");
//           this.dispatch(UserConstants.LOGIN_REQUIRED);
//           return res;
//       }
//    }
// });

var { UserStore, UserQueries, UserAPI } = require('./userstore');
var { OrderStore, OrderQueries, OrderAPI } = require('./orderstore');
var { InventoryStore, InventoryQueries, InventoryAPI } = require('./inventorystore');
var { SaleStore, SaleQueries, SaleAPI } = require('./salestore');
var SessionStore = require('./sessionstore').SessionStore;
var SessionQueries = require('./sessionstore').SessionQueries;
var SessionActions = require('./sessionstore').SessionActions;
var SessionAPI = require('./sessionstore').SessionAPI;

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

    }
}

module.exports = Application;
