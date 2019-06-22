import React, { Component } from "react";
import axios from "axios";
import { getURL } from "../setting/settings";
import {
  List,
  Collapse,
  CircularProgress,
  IconButton
} from "@material-ui/core";
import PostItem from "./Components/PostItem";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import lightBlue from "@material-ui/core/colors/lightBlue";
import SearchBar from "./Components/SearchBar";
import RefeashIcon from "@material-ui/icons/Refresh";
import Navs from "./Components/Navs";
import { getAllLocalPosts } from "../model/utils/localDB";
import { Post } from "../model/interfaces";
import { DisplayProvider, DisplayContext } from "../model/displayContext";
import TabBar from "./Components/TabBar";
import SettingCard from "../setting/SettingCard";
import { Redirect } from "react-router";

const electron = (window as any).require("electron");
const ipc: Electron.IpcRenderer = electron.ipcRenderer;

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  }
});

interface HomeState {
  posts: Post[];
  searchWord: string;
  failedToFetch: boolean;
  errMsg: string;
  isLogin: boolean;
}

interface HomeProps {}

export default class HomePage extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      isLogin: true,
      posts: [],
      searchWord: "",
      failedToFetch: false,
      errMsg: ""
    };
  }

  async componentDidMount() {
    setTimeout(async () => {
      await this._onMount();
    }, 100);

    ipc.on("logout", () => {
      this.setState({ isLogin: false });
    });
  }

  _onMount = async () => {
    try {
      let online_posts = await this.fetchPosts();
      let local_posts = await getAllLocalPosts(1);
      let posts = local_posts.concat(online_posts);
      this.setState({ posts: posts, errMsg: "", failedToFetch: false });
    } catch (err) {
      this.setState({
        failedToFetch: true,
        errMsg: err.toString()
      });
    }
  };

  async fetchPosts(): Promise<Post[]> {
    let response = await axios.get(getURL("get/post"));
    let data: Post[] = response.data;
    return data;
  }

  onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchWord: e.target.value });
  };

  render() {
    if (this.state.posts.length === 0 && !this.state.failedToFetch) {
      return (
        <div className="d-flex h-100">
          <div className="mx-auto my-auto">
            <CircularProgress color="primary"> </CircularProgress>
          </div>
        </div>
      );
    }

    if (this.state.failedToFetch) {
      return (
        <div className="d-flex h-100">
          <div className="mx-auto my-auto" style={{ alignItems: "center" }}>
            <IconButton onClick={this._onMount}>
              <RefeashIcon />
            </IconButton>
            {this.state.errMsg}
          </div>
        </div>
      );
    }

    if (!this.state.isLogin) return <Redirect to="/login" />;

    return (
      <ThemeProvider theme={theme}>
        <Collapse in={true} timeout={1000}>
          <div className="container-fluid">
            <Navs />
            <SearchBar
              onSearchTextChange={this.onSearchTextChange}
              refeash={this._onMount}
            />
            <TabBar />
            <DisplayContext.Consumer>
              {({ value }) => (
                <List>
                  {this.state.posts
                    .filter((post) => {
                      let isLocal = value === 1;
                      if (isLocal) {
                        return post.isLocal === true;
                      } else {
                        return post.isLocal === undefined;
                      }
                    })
                    .map((post) => {
                      let searchWord = this.state.searchWord;
                      let exist = true;
                      if (!post.title.includes(searchWord)) {
                        exist = false;
                      }
                      return (
                        <Collapse key={`post_${post._id}`} in={exist}>
                          <PostItem post={post} />
                        </Collapse>
                      );
                    })}
                </List>
              )}
            </DisplayContext.Consumer>
          </div>
          <SettingCard isCreated={true} />
        </Collapse>
      </ThemeProvider>
    );
  }
}
