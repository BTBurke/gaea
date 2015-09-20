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
  'SALE_ALL_ORDERS_RECEIVE',
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
   createOrder(order) {
      return this.request({
        url: Config.baseURL + '/order',
        method: 'POST',
        body: order
      });
   }
   updateOrder(order) {
     return this.request({
       url: Config.baseURL + '/order/' + order.order_id,
       method: 'PUT',
       body: order
     });

   }
   readOrderItems(ordID) {
    console.log("Going to get all order items...");
    return this.get(Config.baseURL + "/order/" + ordID + "/item");
   }
   updateOrderItem(item) {
    console.log("Going to update order item...");
    return this.request({
      url: Config.baseURL + '/order/' + item.order_id + '/item/' + item.orderitem_id,
      method: 'PUT',
      body: item
    });
   }
   createOrderItem(item) {
    console.log("Going to add order item...");
    console.log("Item to update", item);
    return this.request({
      url: Config.baseURL + '/order/' + item.order_id + '/item',
      method: 'POST',
      body: item
    });
   }
   deleteOrderItem(item) {
     console.log("Going to delete order item...");
     return this.request({
       url: Config.baseURL + '/order/' + item.order_id + '/item/' + item.orderitem_id,
       method: 'DELETE'
     });
   }

   getOrdersAndItemsForSale(saleID) {
     return this.request({
       url: Config.baseURL + '/sale/' + saleID + '/all',
       method: 'GET'
     });
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
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  createOrder(order) {
    return this.app.OrderAPI.createOrder(order)
      .then(res => {
          switch (res.status) {
            case 200:
              console.log("Server receive:", res.body);
              this.dispatch(Constants.ORDERS_CREATE, res.body);
              break;
            case 401:
              this.dispatch(Constants.LOGIN_REQUIRED);
              break;
            default:
              throw new AppError("Failed to create order").getError();
          }
        })
        .catch(err => {
          console.log(err);
          this.dispatch(Constants.REQUEST_FAILED, err);
        });
  }
  updateOrder(order) {
    return this.app.OrderAPI.updateOrder(order)
      .then(res => {
          switch (res.status) {
            case 200:
              console.log("Server receive:", res.body);
              this.dispatch(Constants.ORDERS_UPDATE, res.body);
              break;
            case 401:
              this.dispatch(Constants.LOGIN_REQUIRED);
              break;
            default:
              throw new AppError("Failed to create order").getError();
          }
        })
        .catch(err => {
          console.log(err);
          this.dispatch(Constants.REQUEST_FAILED, err);
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
          this.dispatch(Constants.REQUEST_FAILED, err);
        });
  }

 updateOrderItem(item) {
    return this.app.OrderAPI.updateOrderItem(item)
      .then(res => {
          switch (res.status) {
            case 200:
              console.log("Server receive:", res.body);
              this.dispatch(Constants.ORDER_ITEMS_UPDATE, res.body);
              break;
            case 401:
              this.dispatch(Constants.LOGIN_REQUIRED);
              break;
            default:
              throw new AppError("Failed to update order item").getError();
          }
        })
        .catch(err => {
          console.log(err);
          this.dispatch(Constants.REQUEST_FAILED, err);
        });
  }

  readOrderItems(ord) {
    return this.app.OrderAPI.readOrderItems(ord)
      .then(res => {
          switch (res.status) {
            case 200:
              console.log("Server receive:", res.body);
              this.dispatch(Constants.ORDER_ITEMS_READ, res.body);
              break;
            case 401:
              this.dispatch(Constants.LOGIN_REQUIRED);
              break;
            default:
              throw new AppError("Failed to read order items").getError();
          }
        })
        .catch(err => {
          console.log(err);
          this.dispatch(Constants.REQUEST_FAILED, err);
        });
  }

  deleteOrderItem(ord) {
    return this.app.OrderAPI.deleteOrderItem(ord)
      .then(res => {
          switch (res.status) {
            case 200:
              console.log("Server receive:", res.body);
              this.dispatch(Constants.ORDER_ITEMS_DELETE, res.body);
              break;
            case 401:
              this.dispatch(Constants.LOGIN_REQUIRED);
              break;
            default:
              throw new AppError("Failed to delete order item").getError();
          }
        })
        .catch(err => {
          console.log(err);
          this.dispatch(Constants.REQUEST_FAILED, err);
        });
  }

  getOrdersAndItemsForSale(saleID) {
    return this.app.OrderAPI.getOrdersAndItemsForSale(saleID)
      .then(res => {
          switch (res.status) {
            case 200:
              console.log("Server receive:", res.body);
              this.dispatch(Constants.SALE_ALL_ORDERS_RECEIVE, res.body);
              break;
            case 401:
              this.dispatch(Constants.LOGIN_REQUIRED);
              break;
            default:
              throw new AppError("Failed to get all orders for sale").getError();
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
    this.orderitem_id = props.orderitem_id;
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
    };
    this.handlers = {
      _ordersRead: Constants.ORDERS_READ,
      _ordersCreate: Constants.ORDERS_CREATE,
      _ordersUpdate: Constants.ORDERS_UPDATE,
      _addItem: Constants.ORDER_ITEMS_CREATE,
      _readItem: Constants.ORDER_ITEMS_READ,
      _deleteItem: Constants.ORDER_ITEMS_DELETE,
      _updateItem: Constants.ORDER_ITEMS_UPDATE,
      _receiveSale: Constants.SALE_ALL_ORDERS_RECEIVE

    };
  }

  // Action Handlers
  _ordersRead(orders) {
    console.log('received', orders);
    if (orders.qty === 0) {
      this.state['orders'] = [];
      this.hasChanged();
    } else {
      this.state['orders'] = _.map(orders.orders, function(order) { return new Order(order)});
      console.log('state update', this.state['orders']);
      this.hasChanged();
    }
  }

  _ordersCreate(order) {
    this.state['orders'] = this.state['orders'].concat(new Order(order));
    this.hasChanged();
  }

  _ordersUpdate(order) {
    this.state['orders'] = _.reject(this.state['orders'], function (o) { return order.order_id === o.order_id });
    this.state['orders'] = this.state['orders'].concat(new Order(order));
    this.hasChanged();
  }

  _addItem(item) {
    var order = "order-" + item.order_id;
    this.state[order] = this.state[order].concat(new OrderItem(item));
    console.log('items update', this.state[order]);
    this.hasChanged();
  }

  _readItem(items) {
    if (items.qty === 0) {
      this.state[items.query] = [];
    } else {
      this.state[items.query] = _.map(items.order_items, function(item) { return new OrderItem(item)});
    }
    this.hasChanged();
  }

  _deleteItem(item) {
    console.log("deleting item", item);
    var order = "order-" + item.order_id;
    this.state[order] = _.reject(this.state[order], function (i) {
      console.log("got", i.orderitem_id);
      console.log("do they equate", i.orderitem_id === parseInt(item.orderitem_id));
      return parseInt(item.orderitem_id) === i.orderitem_id;
    });
    console.log("state delete", this.state);
    this.hasChanged();
  }

  _updateItem(item) {
    var order = "order-" + item.order_id;
    this.state[order] = _.reject(this.state[order], function (i) { return item.orderitem_id === i.orderitem_id});
    this.state[order] = this.state[order].concat(new OrderItem(item));
    this.hasChanged();
  }

  _receiveSale(res) {
    // For the SaleOrders page, return a different data structure. Map contains two entries:
    // orders: Array of all orders for this sale
    // items: Map of arrays for each order, keys are "order-<id>"
    var orders = _.map(res.orders, function (ord) { return new Order(ord)});
    var items = _.groupBy(res.items, function (item) { return "order-" + item.order_id })
    var users = _.indexBy(res.users, function (user) { return user.user_name });

    this.state['sale-' + res.sale_id] = {'orders': orders, 'items': items, 'users': users};
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

  getOrdersAndItemsForSale(sale) {
    return this.fetch({
        id: 'bysale',
        locally: function() {
          return this.state['sale-' + sale];
        },
        remotely: function() {
          return this.app.OrderQueries.getOrdersAndItemsForSale(sale);
        }
    });
  }

  getItems(ord) {
    return this.fetch({
     id: 'items',
     locally: function() {
       return this.state['order-'+ord];
     },
     remotely: function() {
       return this.app.OrderQueries.readOrderItems(ord);
     }
    });
  }
}

module.exports.OrderStore = OrderStore;
module.exports.OrderQueries = OrderQueries;
module.exports.OrderAPI = OrderAPI;
