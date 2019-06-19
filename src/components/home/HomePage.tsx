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
import { getAllLocalPosts } from "../model/localDB";

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  }
});

export interface Post {
  id?: string;
  userID?: number;
  title: string;
  content: string;
  category_name?: string;
  posted_name?: string;
  isLocal: boolean;
}

interface HomeState {
  posts: Post[];
  searchWord: string;
  failedToFetch: boolean;
  errMsg: string;
}

interface HomeProps {}

export default class HomePage extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      posts: [],
      searchWord: "",
      failedToFetch: false,
      errMsg: ""
    };
  }

  async componentDidMount() {
    await this._onMount();
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
    let response = await axios.get(getURL());
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

    return (
      <ThemeProvider theme={theme}>
        <Collapse in={true} timeout={1000}>
          <div className="container-fluid">
            <Navs />
            <SearchBar
              onSearchTextChange={this.onSearchTextChange}
              refeash={this._onMount}
            />
            <List>
              {this.state.posts.map((post) => {
                let searchWord = this.state.searchWord;
                let exist = true;
                if (!post.title.includes(searchWord)) {
                  exist = false;
                }
                return (
                  <Collapse key={post.title} in={exist}>
                    <PostItem post={post} />
                  </Collapse>
                );
              })}
            </List>
          </div>
        </Collapse>
      </ThemeProvider>
    );
  }
}
