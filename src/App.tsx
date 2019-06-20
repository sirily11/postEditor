import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/login/Login";
import EditorPage from "./components/editor/EditorPage";
import { UserContext } from "./components/model/userContext";
import HomePage from "./components/home/HomePage";

class App extends Component {
  render() {
    return (
      <Router>
        <UserContext.Provider
          value={{ userID: "123", userName: "sirily11", isLogin: false }}
        >
          <div id="second-root">
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/edit/:_id?/:isLocal?" component={EditorPage} />
          </div>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
