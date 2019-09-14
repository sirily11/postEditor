import React, { useContext } from "react";
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
import { DisplayContext } from "../model/displayContext";
import TabBar from "./Components/TabBar";
import SettingCard from "../setting/SettingCard";
import { Grid } from "semantic-ui-react";
import { Button } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: lightBlue
  }
});

export default function HomePage() {
  const displayContext = useContext(DisplayContext);
  const { progress, errMsg, postsResult, fetch, fetchMore } = displayContext;

  if (progress < 100 && !errMsg) {
    return (
      <div className="d-flex h-100">
        <div className="mx-auto my-auto">
          <CircularProgress
            id="progress-bar"
            variant="determinate"
            color="primary"
            value={progress}
          >
            {" "}
          </CircularProgress>
          <div>{progress} %</div>
        </div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="d-flex h-100">
        <div
          className="mx-auto my-auto"
          style={{ alignItems: "center" }}
          id="err-msg"
        >
          <IconButton onClick={fetch}>
            <RefeashIcon />
          </IconButton>
          {errMsg}
        </div>
      </div>
    );
  }

  // if (!this.state.isLogin) return <Redirect to="/" />;

  return (
    <ThemeProvider theme={theme}>
      <Collapse in={true} timeout={1000}>
        <div className="container-fluid">
          <Navs />
          <SearchBar />
          <TabBar />
          <List id="post-list">
            {postsResult &&
              postsResult.results.map((post) => {
                return (
                  <Collapse in={true}>
                    <PostItem post={post} key={`post-${post.id}`} />
                  </Collapse>
                );
              })}
          </List>
          <Grid>
            <Grid.Row centered>
              <Button
                id="load-btn"
                color="primary"
                disabled={!(postsResult && postsResult.next)}
                onClick={() => fetchMore()}
              >
                Load More
              </Button>
            </Grid.Row>
          </Grid>
        </div>
        <SettingCard isCreated={true} />
      </Collapse>
    </ThemeProvider>
  );
}
