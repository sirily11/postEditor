import React, {Component, useContext} from "react";

import {getURL} from "../setting/settings";

const fs = (window as any).require("fs");

export interface UploadFile {
    file: File,
    progress?: number,
    will_transcode: boolean,
    transcode_progress?: number
    transcode_file_path?: string
}

interface UploadVideoState {
    uploadFiles: UploadFile[]
    access_id?: string,
    secret_id?: string,
    bucket_name?: string,

    confirmUpload(access_id: string, secret_id: string, bucket_name: string): Promise<void>,

    upload(files: UploadFile[]): Promise<void>
}

interface UploadVideoProps {
}

const context: UploadVideoState = {
    uploadFiles: [],

    upload(files: UploadFile[]): Promise<void> {
        return Promise.resolve();
    },
    confirmUpload(access_id: string, secret_id: string, bucket_name: string): Promise<void> {
        return Promise.resolve();
    }
};


export const UploadVideoConext = React.createContext(context);

export class UploadVideoProvider extends Component<UploadVideoProps, UploadVideoState> {
    constructor(props: UploadVideoProps) {
        super(props);
        this.state = {uploadFiles: [], upload: this.upload, confirmUpload: this.confirmUpload};
    }

    upload = async (files: UploadFile[]): Promise<void> => {
        await Promise.resolve();
        this.setState({uploadFiles: files});
    };

    confirmUpload = async (access_id?: string, secret_id?: string, bucket_name?: string) => {

    };

    render() {
        return <UploadVideoConext.Provider value={this.state}>
            {this.props.children}
        </UploadVideoConext.Provider>
    }
}



