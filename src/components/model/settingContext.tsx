/** @format */

import React, { Component, useContext } from "react";
import { Category, Post, Result } from "./interfaces";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { getURL } from "./utils/settings";
import Axios from "axios";

const fs = (window as any).require("fs");

interface SettingState {
  open: boolean;
  categories: Category[];
  language: number;
  openSetting: any;
  closeSetting: any;
  addCategory(category: Category): void;
  updateCategory(category: Category): Promise<void>;
  deleteCategory(category: Category): Promise<void>;
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
      addCategory: this.addCategory,
      updateCategory: this.updateCategory,
      deleteCategory: this.deleteCategory,
    };
  }

  async componentWillMount() {
    try {
      const response = await axios.get(getURL("blog/category/"));
      const categories: Result<Category> = response.data;
      if (categories.results) {
        this.setState({ categories: categories.results });
      }
    } catch (err) {
      console.error(err);
    }
  }

  addCategory = (category: Category) => {
    const categories = this.state.categories;
    categories.push(category);
    this.setState({ categories });
  };

  deleteCategory = async (category: Category) => {
    const result = await Axios.delete(getURL(`blog/category/${category.id}/`));
    const { categories } = this.state;
    const removeIndex = categories.findIndex((c) => c.id === category.id);
    if (removeIndex > -1) {
      categories.splice(removeIndex, 1);
      this.setState({ categories: categories });
    }
  };

  updateCategory = async (category: Category) => {
    const result = await Axios.patch(getURL(`blog/category/${category.id}/`), {
      category: category.category,
    });
    const { categories } = this.state;
    const updateIndex = categories.findIndex((c) => c.id === category.id);
    if (updateIndex > -1) {
      categories[updateIndex] = result.data;
      this.setState({ categories: categories });
    }
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

//@ts-ignore
const context: SettingState = {
  open: false,
  language: -1,
  categories: [],
  openSetting: () => {},
  closeSetting: () => {},
  addCategory: () => {},
};

export const SettingConext = React.createContext(context);
