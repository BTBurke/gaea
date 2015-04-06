// Pages
var React = require('react'),
    Landing = require("./pages/landing"),
    Tos = require("./pages/tos");

// React-router
var Router = require('react-router'),
	DefaultRoute = Router.DefaultRoute,
	Link = Router.Link,
	Route = Router.Route,
	RouteHandler = Router.RouteHandler;

// Get state and action stores, instantiate new
// var AppFlux = require('./appflux');
// const flux = new AppFlux();
// var FluxComponent = require('flummox').FluxComponent;

// Public views are rendered under the External component, does
// not require login
var External = React.createClass({
  render: function () {
    return (
      //<FluxComponent flux={flux} connectToStores={['user']}>
      <div>
        <RouteHandler/>
      </div>
      //</FluxComponent>
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
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler />, document.getElementById("app"));
});
