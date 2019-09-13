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
import { Post } from "../model/interfaces";
import { DisplayProvider, DisplayContext } from "../model/displayContext";
import TabBar from "./Components/TabBar";
import SettingCard from "../setting/SettingCard";
import { Redirect } from "react-router";
import { computeDownloadProgress } from "../model/utils/uploadUtils";

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
  progress?: number;
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
      errMsg: "",
      progress: 0
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
      this.setState({
        posts: online_posts,
        errMsg: "",
        failedToFetch: false
      });
    } catch (err) {
      this.setState({
        failedToFetch: true,
        errMsg: err.toString()
      });
    }
  };

  async fetchPosts(): Promise<Post[]> {
    let token = localStorage.getItem("access");
    let response = await axios.get(getURL("post"), {
      headers: { Authorization: `Bearer ${token}` },
      onDownloadProgress: (progressEvent) => {
        computeDownloadProgress(progressEvent, (progress: number) =>
          this.setState({ progress })
        );
      }
    });
    let data: Post[] = response.data.results;

    return data.reverse();
  }

  onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchWord: e.target.value });
  };

  render() {
    if (this.state.posts.length === 0 && !this.state.failedToFetch) {
      return (
        <div className="d-flex h-100">
          <div className="mx-auto my-auto">
            <CircularProgress
              variant="determinate"
              color="primary"
              value={this.state.progress}
            >
              {" "}
            </CircularProgress>
            <div>{this.state.progress} %</div>
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

    if (!this.state.isLogin) return <Redirect to="/" />;

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
                  {this.state.posts.map((post) => {
                    let searchWord = this.state.searchWord;
                    let exist = true;
                    if (!post.title.includes(searchWord)) {
                      exist = false;
                    }
                    return (
                      <Collapse
                        mountOnEnter
                        unmountOnExit
                        key={`post_${post.id}`}
                        in={
                          exist &&
                          (value !== -1
                            ? post.post_category &&
                              post.post_category.id === value
                            : true)
                        }
                      >
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
