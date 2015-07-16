// Pages
var React = require('react'),
    Landing = require("./pages/landing"),
    Tos = require("./pages/tos"),
    Home = require('./pages/home');
    Orders = require('./pages/orders');
    EditOrder = require('./pages/editorder');
    Checkout = require('./pages/checkout');
    Sales = require('./pages/sale');
    EditSale = require('./pages/editsale');
    NewSale = require('./pages/newsale');
    //Login = require("./pages/login")

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

//For testing
window.Marty = require('marty');

// Public views are rendered under the External component, does
// not require login
var External = React.createClass({
  render: function () {
    return (
      <ApplicationContainer app={app} router={this.context.router}>
        <RouteHandler/>
      </ApplicationContainer>
    );
  }
});

// Private views are rendered under the Internal component,
// requires login. Every top-level view should extend either
// the Private, Admin, or SuperAdmin classes to ensure that
// logged-in states are checked via ComponentWillMount before
// render.
// var Internal = React.createClass({
//   render: function() {
//     // TODO
//   }
// })


var routes = (
  <Route name="external" path="/" handler={External}>
    <DefaultRoute handler={Landing}/>
    <Route name="tos" path="tos" handler={Tos}/>
    <Route name="home" path="home" handler={Home}/>
    <Route name="order" path="order" handler={Orders}/>
    <Route name="editorder" path="/order/:orderID" handler={EditOrder}/>
    <Route name="checkout" path="/order/:orderID/checkout" handler={Checkout}/>
    <Route name="sales" path="/sale" handler={Sales}/>
    <Route name="salenew" path="/sale/new" handler={NewSale}/>
    <Route name="saleedit" path="/sale/:saleID" handler={EditSale}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.getElementById("app"));
});
