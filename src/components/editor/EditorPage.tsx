/** @format */

import React, { Component } from "react";
import SideController from "./components/SideController";
import Title from "./components/Title";
import MainEditor from "./MainEditor";
import { EditorContext } from "../model/editorContext";
import MessageBar from "./components/MessageBar";
import { EditorProps } from "../model/interfaces";
import SettingCard from "../setting/SettingCard";
import UploadDialog from "./components/dialogs/UploadDialog";
import { Snackbar, SnackbarContent } from "@material-ui/core";
import { ImageEditDialog } from "./components/dialogs/ImageEditDialog";
import InsertInternalLinkDialog from "./components/dialogs/InsertInternalLinkDialog";
const { ipcRenderer, remote } = (window as any).require("electron");
const { Menu, MenuItem } = remote;

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

  showMenu = (e: MouseEvent) => {
    e.preventDefault();
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: "Show Image Window",
        click() {
          ipcRenderer.send("show-image");
        },
      })
    );
    menu.append(
      new MenuItem({
        label: "Show Post Settings",
        click() {
          ipcRenderer.send("show-post-settings");
        },
      })
    );
    menu.popup({ window: remote.getCurrentWindow() });
  };

  componentDidMount() {
    console.log("id", this.props.match.params);
    const _id = this.props.match.params._id;
    this.setState({ _id: _id });

    window.addEventListener("contextmenu", this.showMenu, false);
  }

  componentWillUnmount() {
    window.removeEventListener("contextmenu", this.showMenu);
  }

  uploadFiles = async (acceptedFiles: File[], rejectedFiles: File[]) => {
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
        {({ initEditor, clear, progress, isLoading, showEditImageDialog }) => {
          return (
            <div>
              <SideController />
              <Title />
              <div
                className="content"
                style={{ marginTop: 170, marginBottom: 70 }}>
                {this.state._id ? (
                  <MainEditor
                    initEditor={initEditor}
                    _id={this.state._id}
                    clear={clear}
                    upload={this.uploadFiles}
                  />
                ) : (
                  <div> </div>
                )}
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

              <UploadDialog
                id={this.state._id}
                open={open}
                files={files}
                close={this.close}
                shouldInsert={true}
              />
            </div>
          );
        }}
      </EditorContext.Consumer>
    );
  }
}
