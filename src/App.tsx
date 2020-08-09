import React, { Component } from "react";
import "./App.css";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import EditorPage from "./components/editor/EditorPage";
import { UserProvider } from "./components/model/userContext";
import HomePage from "./components/home/HomePage";
import { SettingProvider } from "./components/model/settingContext";
import {
  MainEditorProvider,
  EditorContext,
} from "./components/model/editorContext";
import { DisplayProvider } from "./components/model/displayContext";
import LoginPage from "./components/login/LoginPage";
import {
  spring,
  AnimatedRoute,
  AnimatedSwitch,
} from "./components/editor/plugin/react-router-transition";
import { UploadPage } from "./components/uploadVideo/UploadPage";
import { UploadVideoProvider } from "./components/model/uploadVideoContext";
import VideoPage from "./components/video/VideoPage";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.css";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <UploadVideoProvider>
            <UserProvider>
              <MainEditorProvider>
                <SettingProvider>
                  <DisplayProvider>
                    <AnimatedSwitch
                      atEnter={{ opacity: 0 }}
                      atLeave={{ opacity: 0 }}
                      atActive={{ opacity: 1 }}
                      className="switch-wrapper"
                    >
                      <Route exact path="/" component={LoginPage} />
                      <Route exact path="/video" component={VideoPage} />
                      <Route exact path="/home" component={HomePage} />

                      <Route
                        exact
                        path="/upload-video"
                        component={UploadPage}
                      />
                      <Route
                        exact
                        path="/edit/:_id?/:isLocal?"
                        component={EditorPage}
                      />
                    </AnimatedSwitch>
                  </DisplayProvider>
                </SettingProvider>
              </MainEditorProvider>
            </UserProvider>
          </UploadVideoProvider>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
