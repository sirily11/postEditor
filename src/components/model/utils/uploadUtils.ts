import axios from "axios"
import { NativeImage } from "electron";
import { getURL } from "../../setting/settings";
const electron = (window as any).require("electron");
const nativeImage = electron.nativeImage;


export const uploadImage = async (imageFile: File, pid: string, onUpload: (progress: number) => void) => {
    return new Promise(async (resolve, reject) => {
        let url = getURL("post-image/")
        let token = localStorage.getItem("access");
        let form = new FormData();
        // const image: NativeImage = nativeImage.createFromPath(imageFile.path);
        // const dataURL = image.toDataURL();
        form.append("image", imageFile);
        form.append('pid', pid.toString())

        let result = await axios.post(url, form, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (evt) => computeUploadProgress(evt, onUpload)
        });
        resolve(result.data)
    })
}

export function dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

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
    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
    if (totalLength !== null) {
        let progress = Math.round((progressEvent.loaded * 100) / totalLength);
        callback(progress)
    }
}

export function computeUploadProgress(progressEvent: any, callback?: any) {
    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
    if (totalLength !== null) {
        let progress = Math.round((progressEvent.loaded * 100) / totalLength);
        callback(progress)
    }
}