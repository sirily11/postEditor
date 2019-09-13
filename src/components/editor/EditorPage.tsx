import React, { Component } from "react";
import SideController from "./SideController";
import Title from "./Title";
import MainEditor from "./MainEditor";
import { EditorContext } from "../model/editorContext";
import MessageBar from "./components/MessageBar";
import { EditorProps } from "../model/interfaces";
import SettingCard from "../setting/SettingCard";
import { S3 } from "aws-sdk";
import { uploadImage } from "../model/utils/uploadUtils";
import { t } from "@lingui/macro";
import UploadDialog from "./components/UploadDialog";
import {
  LinearProgress,
  Collapse,
  Snackbar,
  SnackbarContent
} from "@material-ui/core";

interface State {
  isLocal: boolean;
  _id: string;
  open: boolean;
  files: File[];
  currentUploading: string;
  currentUploadProgress: number;
  numberOfFinished: number;
}

export default class EditorPage extends Component<EditorProps, State> {
  constructor(props: EditorProps) {
    super(props);
    this.state = {
      files: [],
      currentUploading: "",
      open: false,
      currentUploadProgress: -1,
      numberOfFinished: 0,
      isLocal: true,
      _id: ""
    };
  }

  componentWillMount() {
    let _id = this.props.match.params._id;
    this.setState({ _id: _id });
  }

  uploadFiles = async (acceptedFiles: File[], rejectedFiles: File[]) => {
    let filePath: string[] = [];
    this.setState({ files: acceptedFiles, open: true });
    // upload file
    for (let file of acceptedFiles) {
      let numCompleted = this.state.numberOfFinished;
      this.setState({ currentUploading: file.name });
      // upload file to s3
      await uploadImage(file, (progress: number) => {
        // set the progress bar's progress
        this.setState({ currentUploadProgress: progress * 100 });
      });
      // increase the counter
      this.setState({ numberOfFinished: numCompleted + 1 });
      filePath.push(file.name);
    }
  };

  close = () => {
    this.setState({
      open: false,
      numberOfFinished: 0,
      files: [],
      currentUploadProgress: 0,
      currentUploading: ""
    });
  };

  render() {
    const {
      numberOfFinished,
      currentUploadProgress,
      currentUploading,
      open,
      files
    } = this.state;
    return (
      <EditorContext.Consumer>
        {({ initEditor, clear, progress, isLoading }) => {
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
                  upload={this.uploadFiles}
                />
                <MessageBar />
                <Snackbar
                  open={isLoading}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                >
                  <SnackbarContent
                    message={`Progress:${progress}%`}
                  ></SnackbarContent>
                </Snackbar>
              </div>
              <SettingCard isCreated={false} />
              <EditorContext.Consumer>
                {({ insertImage }) => (
                  <UploadDialog
                    currentUploading={currentUploading}
                    currentUploadProgress={currentUploadProgress}
                    numberOfFinished={numberOfFinished}
                    open={open}
                    files={files}
                    close={this.close}
                    insertImage={insertImage}
                  />
                )}
              </EditorContext.Consumer>
            </div>
          );
        }}
      </EditorContext.Consumer>
    );
  }
}
