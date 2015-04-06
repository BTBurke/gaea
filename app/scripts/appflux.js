var Flux = require('flummox').Flux;
var UserActions = require('./actions/useractions'),
    UserStore = require('./stores/userstore');

class AppFlux extends Flux {
  constructor() {
    super();

    // User state
    this.createActions('user', UserActions);
    this.createStore('user', UserStore, this);
  }
}

module.exports = AppFlux;
