import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/login/Login";
import EditorPage from "./components/editor/EditorPage";
import { UserContext } from "./components/model/userContext";


class App extends Component {
  render() {
    return (
      <Router>
        <UserContext.Provider value={{ userID: "123", userName: "sirily11", isLogin: false}}>
          <div>
            <Route exact path="/" component={Login} />
            <Route path="/home" component={EditorPage} />
          </div>
          </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
