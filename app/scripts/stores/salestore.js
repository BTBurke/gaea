var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");
var _ = require('underscore');

var Constants = Marty.createConstants([
  'SALES_READ',
  'SALES_CREATE',
  'SALES_DELETE',
  'SALES_UPDATE',
  'REQUEST_FAILED',
  'LOGIN_REQUIRED'
]);

//////////////////////////////////////////////////////////////////
// SalesAPI reflects all routes associated with managing sales state
//////////////////////////////////////////////////////////////////

class SaleAPI extends Marty.HttpStateSource {
   readSales() {
     return this.get(Config.baseURL + '/sale');
   }
   createSale(sale) {
     return this.request({
      url: Config.baseURL + '/sale',
      method: 'POST',
      body: sale
     });
   }
   deleteSale() {

   }
   updateSale(sale) {
      return this.request({
      url: Config.baseURL + '/sale/' + sale.sale_id,
      method: 'PUT',
      body: sale
    });

   }
}


//////////////////////////////////
// Queries
//////////////////////////////////

// SalesQueries sends HTTP requests to the server and dispatches actions
// based on server response
class SaleQueries extends Marty.Queries {
  readSales() {
    return this.app.SaleAPI.readSales()
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.SALES_READ, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to get list of sales").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err)
      });
  }

  createSale(sale) {
    return this.app.SaleAPI.createSale(sale)
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.SALES_CREATE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to create sale").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err)
      });
  }

  updateSale(sale) {
    return this.app.SaleAPI.updateSale(sale)
      .then(res => {
        switch (res.status) {
          case 200:
            console.log("Server receive:", res.body);
            this.dispatch(Constants.SALES_UPDATE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Failed to update sale").getError();
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

class Sale {
  constructor(props) {
    this.sale_id = props.sale_id;
    this.status = props.status;
    this.open_date = props.open_date;
    this.close_date = props.close_date;
    this.sale_type = props.sale_type;
    this.title = props.title;
    this.sales_copy = props.sales_copy;
    this.require_final = props.require_final;
  }
}

///////////////////////////////////
// Store
///////////////////////////////////
class SaleStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {
      'sales': undefined
    };
    this.handlers = {
      _salesRead: Constants.SALES_READ,
      _updateSale: Constants.SALES_UPDATE,
      _createSale: Constants.SALES_CREATE
    };
  }

  // Action Handlers
  _salesRead(sales) {
    console.log('received sales', sales);
    if (sales.qty === 0) {
      this.state['sales'] = [];
      this.hasChanged();
    } else {
      this.state['sales'] = _.map(sales.sales, function(sale) {return new Sale(sale)})
      this.hasChanged();
    }
  }

  _updateSale(sale) {
    this.state['sales'] = _.reject(this.state.sales, function (i) { return sale.sale_id === i.sale_id});
    this.state['sales'] = this.state.sales.concat(new Sale(sale));
    this.hasChanged();
  }

  _createSale(sale) {
    this.state['sales'] = this.state.sales.concat(new Sale(sale));
    this.hasChanged();
  }

  // Methods
  getSales() {
    return this.fetch({
      id: 'sales',
      locally: function() {
        return this.state['sales'];
      },
      remotely: function() {
        return this.app.SaleQueries.readSales();
      }
    });
  }

}

module.exports.SaleStore = SaleStore;
module.exports.SaleQueries = SaleQueries;
module.exports.SaleAPI = SaleAPI;
