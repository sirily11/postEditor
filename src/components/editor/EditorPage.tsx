/** @format */

import React, { Component } from "react";
import SideController from "./SideController";
import Title from "./Title";
import MainEditor from "./MainEditor";
import { EditorContext } from "../model/editorContext";
import MessageBar from "./components/MessageBar";
import { EditorProps } from "../model/interfaces";
import SettingCard from "../setting/SettingCard";
import UploadDialog from "./components/UploadDialog";
import {
  LinearProgress,
  Collapse,
  Snackbar,
  SnackbarContent,
  AppBar,
  Toolbar,
} from "@material-ui/core";

interface State {
  _id: string;
  open: boolean;
  files: File[];
}

export default class EditorPage extends Component<EditorProps, State> {
  constructor(props: EditorProps) {
    super(props);
    this.state = {
      files: [],
      open: false,
      _id: "",
    };
  }

  componentWillMount() {
    let _id = this.props.match.params._id;
    this.setState({ _id: _id });
  }

  uploadFiles = async (acceptedFiles: File[], rejectedFiles: File[]) => {
    let filePath: string[] = [];
    this.setState({ files: acceptedFiles, open: true });
  };

  close = () => {
    this.setState({
      open: false,
      files: [],
    });
  };

  render() {
    const { open, files } = this.state;
    return (
      <EditorContext.Consumer>
        {({ initEditor, clear, progress, isLoading }) => {
          return (
            <div>
              <SideController />
              <Title />
              <div
                className="content"
                style={{ marginTop: 150, marginBottom: 70 }}>
                <MainEditor
                  initEditor={initEditor}
                  _id={this.state._id}
                  clear={clear}
                  upload={this.uploadFiles}
                />
                <MessageBar />
                <Snackbar
                  open={isLoading}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}>
                  <SnackbarContent
                    message={`Progress:${progress}%`}></SnackbarContent>
                </Snackbar>
              </div>
              <SettingCard isCreated={false} />

              <UploadDialog open={open} files={files} close={this.close} />
            </div>
          );
        }}
      </EditorContext.Consumer>
    );
  }
}
