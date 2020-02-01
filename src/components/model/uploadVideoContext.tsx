import React, { Component, useContext } from "react";

import { getURL } from "../setting/settings";
import * as path from "path";
import { FfmpegCommand, Codec } from "fluent-ffmpeg";
import { bool } from "aws-sdk/clients/signer";
const fs = (window as any).require("fs");
const ffmpeg = (window as any).require("fluent-ffmpeg");
const getDimensions = (window as any).require("get-video-dimensions");

export interface UploadFile {
  file: File;
  progress?: number;
  will_transcode: boolean;
  transcode_progress?: number;
  transcode_file_path?: string;
  task_description?: string;
  transcoded_files: string[];
}

interface UploadVideoState {
  uploadFiles: UploadFile[];
  access_id?: string;
  secret_id?: string;
  bucket_name?: string;

  confirmUpload(
    access_id?: string,
    secret_id?: string,
    bucket_name?: string,
    will_transcode?: boolean
  ): Promise<void>;

  upload(files: UploadFile[]): Promise<void>;
}

interface UploadVideoProps {}

const context: UploadVideoState = {
  uploadFiles: [],

  upload(files: UploadFile[]): Promise<void> {
    return Promise.resolve();
  },
  confirmUpload(
    access_id: string,
    secret_id: string,
    bucket_name: string
  ): Promise<void> {
    return Promise.resolve();
  }
};

export const UploadVideoConext = React.createContext(context);

export class UploadVideoProvider extends Component<
  UploadVideoProps,
  UploadVideoState
> {
  constructor(props: UploadVideoProps) {
    super(props);
    this.state = {
      uploadFiles: [],
      upload: this.upload,
      confirmUpload: this.confirmUpload
    };
  }

  componentWillMount() {
    let access = localStorage.getItem("access");
    let secret = localStorage.getItem("secret");
    let bucket = localStorage.getItem("bucket");
    if (access && secret && bucket) {
      this.setState({
        access_id: access,
        secret_id: secret,
        bucket_name: bucket
      });
    }
  }

  upload = async (files: UploadFile[]): Promise<void> => {
    await Promise.resolve();
    this.setState({ uploadFiles: files });
  };

  confirmUpload = async (
    access_id?: string,
    secret_id?: string,
    bucket_name?: string,
    will_transcode?: boolean
  ) => {
    const { uploadFiles } = this.state;
    if (!access_id || !secret_id || !bucket_name) {
      alert("Value should not be empty");
    } else {
      localStorage.setItem("access", access_id);
      localStorage.setItem("secret", secret_id);
      localStorage.setItem("bucket", bucket_name);
      for (let f of this.state.uploadFiles) {
        if (f.will_transcode || will_transcode) {
          //   let info = await this.getVideoMaxResolution(f);
          //   await this.transcode(f, info);
        }
        await this.uploadToAws(f, access_id, secret_id, bucket_name);
      }
    }
  };

  getVideoMaxResolution = (file: UploadFile): Promise<number> => {
    return new Promise(async (resolve, reject) => {
      let dimensions: { width: number; height: number } = await getDimensions(
        file.file.path
      );
      resolve(dimensions.height);
    });
  };

  transcode = async (file: UploadFile, resolution: number): Promise<void> => {
    let finalResolutions = ["640x480"];
    if (resolution >= 720) {
      finalResolutions.push("1280x720");
    } else if (resolution >= 1080) {
      finalResolutions.push("1920x1080");
    } else if (resolution >= 2160) {
      finalResolutions.push("3840x2160");
    }

    const { uploadFiles } = this.state;
    let parentFolder = path.join(
      path.dirname(file.file.path),
      "transcode",
      path.basename(file.file.name, path.extname(file.file.name))
    );
    if (!fs.existsSync(path.join(path.dirname(file.file.path), "transcode"))) {
      fs.mkdirSync(path.join(path.dirname(file.file.path), "transcode"));
    }
    for (let resolution of finalResolutions) {
      let outputFileName = `${parentFolder}_${resolution}.m3u8`;
      file.task_description = `Transcoding: ${resolution}`;
      this.setState({ uploadFiles });
      await this.transcodeSingle(
        file,
        file.file.path,
        outputFileName,
        resolution
      );
      file.transcoded_files.push(outputFileName);
      this.setState({ uploadFiles });
    }
  };

  transcodeSingle = (
    file: UploadFile,
    inputFileName: string,
    outputFileName: string,
    resolution: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      let command: FfmpegCommand = ffmpeg(inputFileName);
      const { uploadFiles } = this.state;
      command
        .output(outputFileName)
        .size(resolution)
        .videoCodec("libx264")
        .on("progress", (progress) => {
          file.transcode_progress = progress.percent;
          this.setState({ uploadFiles });
        })
        .on("end", () => {
          resolve();
        })
        .run();
    });
  };

  uploadToAws = async (
    file: UploadFile,
    access_id: string,
    secret_id: string,
    bucket_name: string
  ): Promise<void> => {
    let parentFolder = path.join(path.dirname(file.file.path), "transcode");
    return new Promise(async (resolve, reject) => {
      // upload original video

      // Upload transcoded video
      fs.readdir(parentFolder, async (err: any, files: string[]) => {
        let baseNameWithoutExt = path.basename(
          file.file.name,
          path.extname(file.file.name)
        );
        for (let f of files) {
          if (f.includes(baseNameWithoutExt)) {
            console.log(f);
          }
        }

        // upload to database
        resolve();
      });
    });
  };

  render() {
    return (
      <UploadVideoConext.Provider value={this.state}>
        {this.props.children}
      </UploadVideoConext.Provider>
    );
  }
}
