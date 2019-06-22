import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/login/Login";
import EditorPage from "./components/editor/EditorPage";
import { UserContext } from "./components/model/userContext";
import HomePage from "./components/home/HomePage";
import { SettingProvider } from "./components/model/settingContext";
import {
  MainEditorProvider,
  EditorContext
} from "./components/model/editorContext";
import { DisplayProvider } from "./components/model/displayContext";

class App extends Component {
  render() {
    return (
      <Router>
        <UserContext.Provider
          value={{ userID: "123", userName: "sirily11", isLogin: false }}
        >
          <MainEditorProvider>
            <SettingProvider>
              <DisplayProvider>
                <div id="second-root">
                  <Route exact path="/" component={Login} />
                  <Route exact path="/home" component={HomePage} />
                  <Route
                    exact
                    path="/edit/:_id?/:isLocal?"
                    component={EditorPage}
                  />
                </div>
              </DisplayProvider>
            </SettingProvider>
          </MainEditorProvider>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
