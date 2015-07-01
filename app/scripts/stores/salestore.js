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
     console.log("Going to read sales...");
        return this.get(Config.baseURL + '/sale');
   }
   createSale() {

   }
   deleteSale() {

   }
   updateSale() {

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
      _salesRead: Constants.SALES_READ
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
  
  getSingleSale(saleID) {
    return this.fetch({
      id: 'singlesale',
      locally: function(saleID) {
        return _.findWhere(this.state['sales'], {'sale_id': saleID});
      },
      remotely: function(saleID) {
        return this.app.SaleQueries.readSales();
      }
    });
  }

}

module.exports.SaleStore = SaleStore;
module.exports.SaleQueries = SaleQueries;
module.exports.SaleAPI = SaleAPI;
