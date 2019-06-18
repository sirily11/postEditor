import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/login/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Login} />
          <Route path="/home" />
        </div>
      </Router>
    );
  }
}

export default App;
