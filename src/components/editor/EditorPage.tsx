import React, { Component } from "react";
import SideController from "./SideController";
import { UserContext } from "../model/userContext";
import { TextField } from "@material-ui/core";
import Title from "./Title";
import MainEditor from "./MainEditor";
import { EditorContext, MainEditorProvider } from "../model/editorContext";
import { RouteComponentProps } from "react-router";
import MessageBar from "./components/MessageBar";
import { EditorProps } from "../model/interfaces";
import SettingCard from "../setting/SettingCard";

interface State {
  isLocal: boolean;
  _id: string;
}

export default class EditorPage extends Component<EditorProps, State> {
  componentWillMount() {
    let _id = this.props.match.params._id;
    let isLocal = this.props.match.params.isLocal !== "undefined";
    this.setState({ isLocal: isLocal, _id: _id });
  }

  render() {
    return (
      <EditorContext.Consumer>
        {({ initEditor, clear }) => {
          return (
            <div>
              <SideController />
              <div className="content">
                <Title />
                <MainEditor
                  initEditor={initEditor}
                  _id={this.state._id}
                  isLocal={this.state.isLocal}
                  clear={clear}
                />
                <MessageBar />
              </div>
              <SettingCard isCreated={false} />
            </div>
          );
        }}
      </EditorContext.Consumer>
    );
  }
}
