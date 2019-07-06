import React, { Component, useContext } from "react";
import { Category, Post } from "./interfaces";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { getURL } from "../setting/settings";
import { t } from "@lingui/macro";
import { promisify } from "util";
import { EditorContext } from "./editorContext";
import { computeUploadProgress } from "./utils/uploadUtils";

const fs = (window as any).require("fs");
const readFile = promisify(fs.readFile);

interface SettingState {
  open: boolean;
  imagePath?: File;
  didUpload: boolean;
  categories: Category[];
  language: number;
  setImage: any;
  openSetting: any;
  closeSetting: any;
  sendCover: any;
  progress?: number;
}

interface SettingProps {}

export class SettingProvider extends Component<SettingProps, SettingState> {
  constructor(props: SettingProps) {
    super(props);
    this.state = {
      progress: 0,
      didUpload: false,
      imagePath: undefined,
      open: false,
      language: -1,
      categories: [],
      openSetting: this.openSetting,
      closeSetting: this.closeSetting,
      setImage: this.setImage,
      sendCover: this.sendCover
    };
  }

  async componentWillMount() {
    try {
      let response = await axios.get(getURL("get/category"));
      let categories: Category[] | undefined = response.data;
      if (categories) {
        this.setState({ categories: categories });
      }
    } catch (err) {
      console.error(err);
    }
  }

  setImage = (image: File) => {
    this.setState({ imagePath: image });
  };

  sendCover = async (post: Post) => {
    // let imageUrl = new URL(post.image_url ? post.image_url : "")
    if (this.state.imagePath) {
      let url = "";
      let response: AxiosResponse;
      let token = localStorage.getItem("access");
      let data = new FormData();
      const settings: AxiosRequestConfig = {
        onUploadProgress: (evt: any) => {
          computeUploadProgress(evt, (progress: number) => {
            this.setState({ progress });
          });
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      };

      data.append("image_url", this.state.imagePath);
      try {
        // Newly created post
        if (post.isLocal && !post.onlineID) {
          url = getURL("create/post");
          response = await axios.post(url, data, settings);
        }
        // not saved online post
        else if (!post.isLocal && !post.onlineID) {
          url = getURL("update/post/" + post._id);
          response = await axios.patch(url, data, settings);
        }
        // saved online post
        else {
          url = getURL("update/post/" + post.onlineID);
          response = await axios.patch(url, data, settings);
        }
        this.closeSetting();
      } catch (err) {
        alert(err);
      }
    } else {
      this.closeSetting()
    }
  };

  openSetting = () => {
    this.setState({ open: true });
  };

  closeSetting = () => {
    this.setState({ progress: undefined, open: false, imagePath: undefined });
  };

  render() {
    return (
      <SettingConext.Provider value={this.state}>
        {this.props.children}
      </SettingConext.Provider>
    );
  }
}

const context: SettingState = {
  didUpload: false,
  imagePath: undefined,
  open: false,
  language: -1,
  categories: [],
  openSetting: () => {},
  closeSetting: () => {},
  setImage: () => {},
  sendCover: () => {}
};

export const SettingConext = React.createContext(context);
