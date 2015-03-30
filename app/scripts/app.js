
var React = require('react'),
    HelloWorld = require("./components/helloworld"),
    mountNode = document.getElementById("app");

class TodoApp extends React.Component {
  render() {
    return (
      <HelloWorld />
    );
  }
}


React.render(<TodoApp />, mountNode);
