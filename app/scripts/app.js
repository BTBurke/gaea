// Pages
var React = require('react'),
    Landing = require("./pages/landing"),
    Tos = require("./pages/tos"),
    Home = require('./pages/home');
    //Login = require("./pages/login")

// React-router
var Router = require('react-router'),
	DefaultRoute = Router.DefaultRoute,
	Link = Router.Link,
	Route = Router.Route,
	RouteHandler = Router.RouteHandler;


// Public views are rendered under the External component, does
// not require login
var External = React.createClass({
  render: function () {
    return (
      <div>
        <RouteHandler/>
      </div>
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
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.getElementById("app"));
});
