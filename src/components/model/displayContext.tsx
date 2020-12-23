/** @format */

import React, { Component } from "react";
import { Post, Result, Category } from "./interfaces";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { searchPost } from "./utils/utils";
import axios from "axios";
import { getURL } from "./utils/settings";
import { computeDownloadProgress } from "./utils/uploadUtils";

interface Tab {
  name: string;
}

interface DisplayState {
  currentPage: number;
  setCurrentPage(page: number): void;
  value: number;
  onChange(value: number): any;
  searchWord: string;
  onSearch(e: React.ChangeEvent<HTMLInputElement>): Promise<void>;
  fetch(): Promise<void>;
  fetchMore(): Promise<void>;
  postsResult?: Result<Post>;
  progress: number;
  errMsg?: string;
}

interface DisplayProps {}

const searchAPIDebounced = AwesomeDebouncePromise(
  (keyword: string) => searchPost(keyword),
  400
);

export class DisplayProvider extends Component<DisplayProps, DisplayState> {
  constructor(props: DisplayProps) {
    super(props);
    this.state = {
      value: -1,
      currentPage: 0,
      progress: 0,
      searchWord: "",
      onChange: this.onChange,
      onSearch: this.onSearch,
      fetch: this.fetch,
      fetchMore: this.fetchMore,
      setCurrentPage: this.setCurrentPage,
    };
  }

  setCurrentPage = async (page: number) => {
    this.setState({ currentPage: page });
  };

  // async componentDidMount() {
  //   await this.fetch();
  // }

  fetchMore = async () => {
    let postResult = this.state.postsResult;
    if (postResult && postResult.next) {
      let result = await axios.get<Result<Post>>(postResult.next);
      let data = result.data;
      postResult.next = data.next;
      postResult.count += data.count;
      postResult.results = postResult.results.concat(data.results);
      this.setState({ postsResult: postResult });
    }
  };

  /**
   * switch the tab
   */
  onChange = async (newValue: number) => {
    this.setState({ value: newValue });
    if (newValue > 0) {
      let result = await this.fetchPosts(newValue);
      this.setState({ postsResult: result });
    } else {
      let result = await this.fetchPosts();
      this.setState({ postsResult: result });
    }
  };

  /**
   * Fetch post from internet
   * Call this function when component will mount or refreash
   */
  fetch = async () => {
    try {
      const { value } = this.state;
      let post = await this.fetchPosts(value > 0 ? value : undefined);
      this.setState({
        progress: 100,
        postsResult: post,
        errMsg: undefined,
      });
    } catch (err) {
      this.setState({
        progress: 100,
        errMsg: err.toString(),
      });
    }
  };

  /**
   * Helper function to fetch posts
   */
  private async fetchPosts(category?: number): Promise<Result<Post>> {
    let token = localStorage.getItem("access");
    let url = category
      ? getURL("blog/post/?category=" + category)
      : getURL("blog/post");

    let response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      onDownloadProgress: (progressEvent) => {
        computeDownloadProgress(progressEvent, (progress: number) =>
          this.setState({ progress })
        );
      },
    });
    /// for animation
    setTimeout(() => {
      this.setState({ progress: 100.00001 });
    }, 500);
    return response.data;
  }

  /**
   * Search post
   */
  onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchWord: e.target.value });
    const result = await searchAPIDebounced(e.target.value);
    this.setState({ postsResult: result });
  };

  render() {
    return (
      <DisplayContext.Provider value={this.state}>
        {this.props.children}
      </DisplayContext.Provider>
    );
  }
}

//@ts-ignore
const context: DisplayState = {};

export const DisplayContext = React.createContext(context);
