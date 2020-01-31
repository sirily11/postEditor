import React, { Component, useContext } from "react";
import { Category, Post, Result } from "./interfaces";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { getURL } from "../setting/settings";

const fs = (window as any).require("fs");

interface SettingState {
  open: boolean;
  categories: Category[];
  language: number;
  openSetting: any;
  closeSetting: any;
  addCategory(category: Category): void;
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
      addCategory: this.addCategory
    };
  }

  async componentWillMount() {
    try {
      let response = await axios.get(getURL("blog/category/"));
      let categories: Result<Category> = response.data;
      if (categories.results) {
        this.setState({ categories: categories.results });
      }
    } catch (err) {
      console.error(err);
    }
  }

  addCategory = (category: Category) => {
    let categories = this.state.categories;
    categories.push(category);
    this.setState({ categories });
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
  addCategory: () => {}
};

export const SettingConext = React.createContext(context);
