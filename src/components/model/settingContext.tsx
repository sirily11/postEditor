import React, { Component } from "react";
import { Category } from "./interfaces";
import axios from "axios";
import { getURL } from "../setting/settings";
import { t } from "@lingui/macro";

interface SettingState {
  open: boolean;
  categories: Category[];
  language: number;
  setImage: any;
  openSetting: any;
  closeSetting: any;
}

interface SettingProps {}

export class SettingProvider extends Component<SettingProps, SettingState> {
  constructor(props: SettingProps) {
    super(props);
    this.state = {
      open: false,
      language: -1,
      categories: [],
      openSetting: this.openSetting,
      closeSetting: this.closeSetting,
      setImage: this.setImage
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

  setImage = (imagePath: File) => {
    let reader = new FileReader();
    reader.readAsDataURL(imagePath);
    reader.onloadend = () => {
      let image = reader.result;
    };
  };

  openSetting = () => {
    this.setState({ open: true });
  };

  closeSetting = () => {
    this.setState({ open: false });
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
  open: false,
  language: -1,
  categories: [],
  openSetting: () => {},
  closeSetting: () => {},
  setImage: () => {}
};

export const SettingConext = React.createContext(context);
