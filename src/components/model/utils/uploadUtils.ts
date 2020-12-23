import axios from "axios";
import { NativeImage } from "electron";
import { getURL } from "./settings";
import { number } from "@lingui/core";
import { convertFromRaw } from "draft-js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
const electron = (window as any).require("electron");
const { ipcRenderer } = (window as any).require("electron");

const nativeImage = electron.nativeImage;

export const uploadImage = async (
  imageFile: File,
  pid: string,
  onUpload: (progress: number) => void
) => {
  return new Promise(async (resolve, reject) => {
    let url = getURL(`blog/post-image/`);
    let token = localStorage.getItem("access");
    let form = new FormData();
    // const draft-js-image-plugin: NativeImage = nativeImage.createFromPath(imageFile.path);
    // const dataURL = draft-js-image-plugin.toDataURL();
    let newFilename = `${uuidv4()}${path.extname(imageFile.path)}`;
    form.append("image", imageFile, newFilename);
    form.append("pid", pid.toString());

    let result = await axios.post(url, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (evt) => computeUploadProgress(evt, onUpload),
    });
    ipcRenderer.send("add-images", [result.data])
    resolve(result.data);
  });
};

export const deleteImage = async (
  imageID: number,
  onUpload: (progress: number) => void
) => {
  return new Promise(async (resolve, reject) => {
    let url = getURL(`blog/post-image/${imageID}`);
    let token = localStorage.getItem("access");

    let result = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (evt) => computeUploadProgress(evt, onUpload),
    });
    resolve(result.data);
  });
};

export function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], { type: mimeString });
}

export function computeDownloadProgress(progressEvent: any, callback?: any) {
  const totalLength = progressEvent.lengthComputable
    ? progressEvent.total
    : progressEvent.target.getResponseHeader("content-length") ||
    progressEvent.target.getResponseHeader("x-decompressed-content-length");
  if (totalLength !== null) {
    let progress = Math.round((progressEvent.loaded * 100) / totalLength);
    callback(progress);
  }
}

export function computeUploadProgress(progressEvent: any, callback?: any) {
  const totalLength = progressEvent.lengthComputable
    ? progressEvent.total
    : progressEvent.target.getResponseHeader("content-length") ||
    progressEvent.target.getResponseHeader("x-decompressed-content-length");
  if (totalLength !== null) {
    let progress = Math.round((progressEvent.loaded * 100) / totalLength);
    callback(progress);
  }
}
