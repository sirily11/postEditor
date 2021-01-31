/** @format */

import React, { Component, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import { getURL } from "./utils/settings";
import * as path from "path";
import { FfmpegCommand, Codec } from "fluent-ffmpeg";
import { bool } from "aws-sdk/clients/signer";
import AWS from "aws-sdk";
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
    will_transcode?: boolean,
    title?: string,
    content?: string,
    category?: number,
    region?: string
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
  },
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
      confirmUpload: this.confirmUpload,
    };
  }

  componentDidMount() {
    const access = localStorage.getItem("access_id");
    const secret = localStorage.getItem("secret");
    const bucket = localStorage.getItem("bucket");
    if (access) {
      this.setState({ access_id: access });
    }
    if (secret) {
      this.setState({ secret_id: secret });
    }
    if (bucket) {
      this.setState({ bucket_name: bucket });
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
    will_transcode?: boolean,
    title?: string,
    content?: string,
    category?: number,
    region?: string
  ) => {
    const { uploadFiles } = this.state;
    if (
      !access_id ||
      !secret_id ||
      !bucket_name ||
      !title ||
      !content ||
      !category ||
      !region
    ) {
      alert("Value should not be empty");
    } else {
      localStorage.setItem("access_id", access_id);
      localStorage.setItem("secret", secret_id);
      localStorage.setItem("bucket", bucket_name);
      localStorage.setItem("region", region);
      for (const f of this.state.uploadFiles) {
        if (f.will_transcode || will_transcode) {
          const info = await this.getVideoMaxResolution(f);
          console.log(info);
          await this.transcode(f, info);
        }

        const result = await this.uploadToAws(
          f,
          access_id,
          secret_id,
          bucket_name,
          region
        );
        if (result) {
          await this.uploadToDatabase(
            title,
            content,
            category,
            result.originalURL,
            result.transcodedURL
          );
        }
      }
    }
  };

  getVideoMaxResolution = async (file: UploadFile): Promise<number> => {
    const dimensions: { width: number; height: number } = await getDimensions(
      file.file.path
    );
    return dimensions.height;
  };

  transcode = async (file: UploadFile, resolution: number): Promise<void> => {
    const finalResolutions = ["?x480"];
    if (resolution >= 720) {
      finalResolutions.push("?x720");
    }
    if (resolution >= 1080) {
      finalResolutions.push("?x1080");
    }
    if (resolution >= 2160) {
      finalResolutions.push("?x2160");
    }

    const { uploadFiles } = this.state;
    const parentFolder = path.join(
      path.dirname(file.file.path),
      "transcode",
      path.basename(file.file.name, path.extname(file.file.name))
    );
    if (!fs.existsSync(path.join(path.dirname(file.file.path), "transcode"))) {
      fs.mkdirSync(path.join(path.dirname(file.file.path), "transcode"));
    }
    for (const resolution of finalResolutions) {
      const outputFileName = `${parentFolder}_${resolution.replace(
        "?x",
        ""
      )}_.m3u8`;
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
      const command: FfmpegCommand = ffmpeg(inputFileName);
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
  // Upload to aws and database
  uploadToAws = async (
    file: UploadFile,
    access_id: string,
    secret_id: string,
    bucket_name: string,
    region?: string
  ): Promise<{ originalURL: string; transcodedURL: string[] } | undefined> => {
    const parentFolder = path.join(path.dirname(file.file.path), "transcode");
    const { uploadFiles } = this.state;

    try {
      let originalFileUploadedURL = "";
      const transcodedFilesUploadURL: string[] = [];
      const s3 = new AWS.S3({
        accessKeyId: access_id,
        secretAccessKey: secret_id,
        region: region,
      });
      file.task_description = "Uploading original file to AWS";
      this.setState({ uploadFiles });
      // upload original video
      const fileContent = fs.readFileSync(file.file.path);
      const upload: AWS.S3.ManagedUpload = s3
        .upload({
          Bucket: bucket_name,
          Key: path.join("original", file.file.name),
          Body: fileContent,
        })
        .on("httpUploadProgress", (progress) => {
          file.progress = (progress.loaded / progress.total) * 100;
          this.setState({ uploadFiles });
        });
      const data = await upload.promise();
      originalFileUploadedURL = data.Location;

      // Upload transcoded video
      file.task_description = "Uploading transcoded files to AWS";
      this.setState({ uploadFiles });
      fs.readdir(parentFolder, async (err: any, files: string[]) => {
        const baseNameWithoutExt = path.basename(
          file.file.name,
          path.extname(file.file.name)
        );
        let index = 0;
        const matchedFiles = files.filter((f) =>
          f.includes(baseNameWithoutExt)
        );
        for (const f of matchedFiles) {
          const filePath = path.join(parentFolder, f);
          const fileContent = fs.readFileSync(filePath);
          const upload = s3.upload({
            Bucket: bucket_name,
            Key: path.join("transcoding", baseNameWithoutExt, f),
            Body: fileContent,
          });
          const data = await upload.promise();
          if (data.Location.includes(".m3u8")) {
            transcodedFilesUploadURL.push(data.Location);
          }
          index += 1;
          file.progress = (index / matchedFiles.length) * 100;
          this.setState({ uploadFiles });
        }
        return {
          originalURL: originalFileUploadedURL,
          transcodedURL: transcodedFilesUploadURL,
        };
      });
    } catch (err) {
      alert(err);
    }
    return;
  };

  uploadToDatabase = async (
    title: string,
    content: string,
    category: number,
    originalURL: string,
    transcodedURL: string[]
  ): Promise<void> => {
    try {
      const video480p = transcodedURL.find((v) => v.includes("480"));
      const video720p = transcodedURL.find((v) => v.includes("720"));
      const video1080p = transcodedURL.find((v) => v.includes("1080"));
      const video4k = transcodedURL.find((v) => v.includes("4k"));
      const data = {
        title: title,
        content: content,
        category: category,
        original_video: originalURL,
        video_480p: video480p,
        video_720p: video720p,
        video_1080p: video1080p,
        video_4k: video4k,
      };
      const url = getURL(`blog/video/`);
      const token = localStorage.getItem("access");
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Upload success");
    } catch (err) {
      alert(err);
    }
  };

  render() {
    return (
      <UploadVideoConext.Provider value={this.state}>
        {this.props.children}
      </UploadVideoConext.Provider>
    );
  }
}
