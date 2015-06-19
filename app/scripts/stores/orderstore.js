var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");
var _ = require('underscore');

var Constants = Marty.createConstants([
  'ORDERS_READ',
  'ORDERS_CREATE',
  'ORDERS_DELETE',
  'ORDERS_UPDATE',
  'ORDERS_SUBMIT',
  'ORDER_ITEMS_READ',
  'ORDER_ITEMS_CREATE',
  'ORDER_ITEMS_UPDATE',
  'ORDER_ITEMS_DELETE',
  'REQUEST_FAILED',
  'LOGIN_REQUIRED'
]);

//////////////////////////////////////////////////////////////////
// OrderAPI reflects all routes associated with managing order state
//////////////////////////////////////////////////////////////////

class OrderAPI extends Marty.HttpStateSource {
   readOrders() {
     console.log("Going to read orders...");
        return this.get(Config.baseURL + '/order');
   }
   createOrder() {

   }
   deleteOrder() {

   }
   submitOrder() {

   }
   updateOrder() {

   }
   readOrderItems() {

   }
   updateOrderItem() {

   }
   createOrderItem(item) {
    console.log("Going to add order item...");
    return this.request({
      url: '/order/item',
      method: 'POST',
      body: item
    });
   }
   deleteOrderItem() {

   }
   getInventory() {

   }

}


//////////////////////////////////
// Queries
//////////////////////////////////

// UserQueries sends HTTP requests to the server and dispatches actions
// based on server response
class OrderQueries extends Marty.Queries {
  readOrders() {
    return this.app.OrderAPI.readOrders()
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.ORDERS_READ, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to get list of orders").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err)
      });
  }
  
  createOrderItem(item) {
    return this.app.OrderAPI.createOrderItem(item)
      .then(res => {
          switch (res.status) {
            case 200:
              console.log("Server receive:", res.body);
              this.dispatch(Constants.ORDER_ITEMS_CREATE, res.body);
              break;
            case 401:
              this.dispatch(Constants.LOGIN_REQUIRED);
              break;
            default:
              throw new AppError("Failed to add order item").getError();
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

class Order {
  constructor(props) {
    this.sale_id = props.sale_id;
    this.status = props.status;
    this.status_date = props.status_date;
    this.user_name = props.user_name;
    this.user_id = props.user_id;
    this.order_id = props.order_id;
    this.sale_type = props.sale_type;
    this.item_qty = props.item_qty;
    this.amount_total = props.amount_total;
  }
}

class OrderItem {
  constructor(props) {
    this.qty = props.qty;
    this.inventory_id = props.inventory_id;
    this.order_id = props.order_id;
    this.order_item_id = props.order_item_id;
    this.user_id = props.user_id;
    this.updated_at = props.updated_at;
  }
}

///////////////////////////////////
// Store
///////////////////////////////////
class OrderStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {
      'orders': undefined,
      'current': undefined,
      'items': undefined
    };
    this.handlers = {
      _ordersRead: Constants.ORDERS_READ,
      _addItem: Constants.ORDER_ITEMS_CREATE,

    };
  }

  // Action Handlers
  _ordersRead(orders) {
    console.log('received', orders);
    this.state['orders'] = _.each(orders, function(order) { return new Order(order)});
    console.log('state update', this.state['orders']);
    this.hasChanged();
  }
  
  _addItem(item) {
    this.state['items'] = this.state['items'].concat(item);
    console.log('items update', this.state['items']);
    this.hasChanged();
  }




  // Methods
  getOrders() {
    return this.fetch({
      id: 'orders',
      locally: function() {
        return this.state['orders'];
      },
      remotely: function() {
        return this.app.OrderQueries.readOrders();
      }
    });
    
  }

}

module.exports.OrderStore = OrderStore;
module.exports.OrderQueries = OrderQueries;
module.exports.OrderAPI = OrderAPI;
