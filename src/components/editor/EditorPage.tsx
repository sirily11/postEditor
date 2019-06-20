import React, { Component } from "react";
import SideController from "./SideController";
import { UserContext } from "../model/userContext";
import { TextField } from "@material-ui/core";
import Title from "./Title";
import MainEditor from "./MainEditor";
import {
  EditorContext,
  MainEditorProvider,
  MainEditorProps
} from "../model/editorContext";
import { RouteComponentProps } from "react-router";

export default class EditorPage extends Component<MainEditorProps, any> {
  render() {
    return (
      <MainEditorProvider
        location={this.props.location}
        history={this.props.history}
        match={this.props.match}
      >
        <div>
          <SideController />
          <div className="content">
            <Title />
            <MainEditor />
          </div>
        </div>
      </MainEditorProvider>
    );
  }
}
