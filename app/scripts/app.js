// Release v0.1.0
var React = require('react');
var Landing = require("./pages/landing");
var Tos = require("./pages/tos");
var Home = require('./pages/home');
var Orders = require('./pages/orders');
var EditOrder = require('./pages/editorder');
var Checkout = require('./pages/checkout');
var Sales = require('./pages/sale');
var EditSale = require('./pages/editsale');
var NewSale = require('./pages/newsale');
var EditInventory = require('./pages/editinventory');
var EditInventoryItem = require('./pages/editinventoryitem');
var SessionTest = require('./test/session_test');
var Pay = require('./pages/pay');
var SaleOrders = require('./pages/saleorders');
var Login = require('./pages/login');
var PwdReset = require('./pages/pwdreset');
var PwdSet = require('./pages/pwdset');
var Account = require('./pages/account');
var Users = require('./pages/users');


// React-router
var Router = require('react-router'),
	DefaultRoute = Router.DefaultRoute,
	Link = Router.Link,
	Route = Router.Route,
	RouteHandler = Router.RouteHandler;

// For Marty Flux
var { ApplicationContainer } = require('marty');
var Application = require('./stores/application');
var app = new Application();
var Session = require('./components/session');

//For testing
window.Marty = require('marty');

// Public views are rendered under the External component, does
// not require login
var External = React.createClass({
  render: function () {
    return (
      <ApplicationContainer app={app} router={this.context.router}>
        <Session />
        <RouteHandler/>
      </ApplicationContainer>
    );
  }
});

var routes = (
  <Route name="external" path="/" handler={External}>
    <DefaultRoute handler={Landing}/>
    <Route name="tos" path="/tos" handler={Tos}/>
    <Route name="home" path="/home" handler={Home}/>
		<Route name="login" path="/login" handler={Login} />
		<Route name="account" path="/account" handler={Account}/>
		<Route name="reset" path="/reset" handler={PwdReset} />
		<Route name="set" path="/set/:token" handler={PwdSet} />
    <Route name="order" path="/order" handler={Orders}/>
    <Route name="editorder" path="/order/:orderID" handler={EditOrder}/>
    <Route name="checkout" path="/order/:orderID/checkout" handler={Checkout}/>
    <Route name="pay" path="/order/:orderID/pay" handler={Pay}/>
    <Route name="sales" path="/sale" handler={Sales}/>
    <Route name="salenew" path="/sale/new" handler={NewSale}/>
    <Route name="invitemedit" path="/sale/:saleID/inventory/:invID" handler={EditInventoryItem}/>
    <Route name="invedit" path="/sale/:saleID/inventory" handler={EditInventory}/>
    <Route name="saleorder" path="sale/:saleID/orders" handler={SaleOrders}/>
    <Route name="saleedit" path="/sale/:saleID" handler={EditSale}/>
    <Route name="users" path="/users" handler={Users}/>

    <Route name="sessiontest" path="/test/session" handler={SessionTest}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.getElementById("app"));
});
