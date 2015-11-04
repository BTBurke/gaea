var Marty = require("marty");
var AppError = require("../services/apperror.js");
var Config = require("../config");

var Constants = Marty.createConstants([
  'TRANSACTION_RECEIVE',
  'TRANSACTION_UPDATE',
  'TRANSACTION_CREATE',
  'TRANSACTION_DELETE',
  'REQUEST_FAILED',
  'LOGIN_REQUIRED'
]);

//////////////////////////////////////////////////////////////////
// Transaction API
//////////////////////////////////////////////////////////////////

class TransactionAPI extends Marty.HttpStateSource {
   getTransactionByOrderId(orderID) {
        return this.get(Config.baseURL + '/transaction/order/' + orderID);
   }
   getTransactionBySaleId(saleID) {
        return this.get(Config.baseURL + '/transaction/sale/' + saleID);
   }
   getTransactionByUser(username) {
        return this.get(Config.baseURL + '/transaction/user/' + username);
   }


	createTransaction(trans) {
		return this.request({
		'url': Config.baseURL + '/transaction',
		'method': 'POST',
		'body': trans
		});
	}

  updateTransaction(trans) {
    return this.request({
		'url': Config.baseURL + '/transaction/' + trans.transaction_id,
		'method': 'PUT',
		'body': trans
		});
  }

  deleteTransaction(trans_id) {
    return this.request({
		'url': Config.baseURL + '/transaction/' + ann_id,
		'method': 'DELETE'
		});
  }
}


//////////////////////////////////
// Queries
//////////////////////////////////

// UserQueries sends HTTP requests to the server and dispatches actions
// based on server response
class TransactionQueries extends Marty.Queries {
  getTransactionByOrderId(orderID) {
    return this.app.TransactionAPI.getTransactionByOrderId(orderID)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(Constants.TRANSACTION_RECEIVE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not get the transactions").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  getTransactionBySaleId(saleID) {
    return this.app.TransactionAPI.getTransactionBySaleId(saleID)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(Constants.TRANSACTION_RECEIVE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not get the transactions").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  getTransactionByUser(username) {
    return this.app.TransactionAPI.getTransactionByUser(username)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(Constants.TRANSACTION_RECEIVE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not get the transactions").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  createTransaction(trans) {
    return this.app.TransactionAPI.createTransaction(trans)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(Constants.TRANSACTION_CREATE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not create transaction").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }


  updateTransaction(trans) {
    return this.app.TransactionAPI.updateTransaction(trans)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(Constants.TRANSACTION_UPDATE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not update transaction").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

  deleteTransaction(trans_id) {
    return this.app.TransactionAPI.deleteTransaction(trans_id)
      .then(res => {
        switch (res.status) {
          case 200:
            this.dispatch(Constants.TRANSACTION_DELETE, res.body);
            break;
          case 401:
            this.dispatch(Constants.LOGIN_REQUIRED);
            break;
          default:
            throw new AppError("Could not delete transaction").getError();
        }
      })
      .catch(err => {
        console.log(err);
        this.dispatch(Constants.REQUEST_FAILED, err);
      });
  }

}



///////////////////////////////////
// Store
///////////////////////////////////
class TransactionStore extends Marty.Store {
  constructor(options) {
    super(options);
    this.state = {};
    this.handlers = {
      _handleReceive: Constants.TRANSACTION_RECEIVE,
      _handleCreate: Constants.TRANSACTION_CREATE,
	    _handleUpdate: Constants.TRANSACTION_UPDATE,
      _handleDelete: Constants.TRANSACTION_DELETE
    };
  }

  // Action Handlers
  _handleReceive(res) {
    if (res.qty === 0) {
      this.state[res.query] = [];
    } else {
      this.state[res.query] = res.transactions;
    }
    this.hasChanged();
  }

  _handleCreate(res) {
    this.state[res.query] = this.state[res.query].concat(res.transaction);
    this.hasChanged();
  }

  _handleUpdate(trans) {
  	this.state[trans.query] = _.reject(this.state[trans.query], (trans1) => { trans1.announcement_id === trans.announcement_id });
    this.state[trans.query] = this.state[trans.query].concat(trans);
  	this.hasChanged();
  }

  _handleDelete(ann) {
    this.state['ann'] = _.reject(this.state['ann'], (ann1) => {ann1.announcement_id === ann.announcement_id });
    this.hasChanged();
  }


  // Methods
  getAnnouncements() {
    return this.fetch({
      id: 'announcements',
      locally: function() {
        return this.state['ann'];
      },
      remotely: function() {
        return this.app.AnnouncementQueries.getAnnouncements();
      }
    });
  }
}

module.exports.AnnouncementStore = AnnouncementStore;
module.exports.AnnouncementQueries = AnnouncementQueries;
module.exports.AnnouncementAPI = AnnouncementAPI;
