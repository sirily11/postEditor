/** @format */

import React, { useContext } from "react";
import {
  List,
  Collapse,
  CircularProgress,
  IconButton,
  Fade,
  Backdrop,
} from "@material-ui/core";
import PostItem from "./Components/PostItem";
import {
  createMuiTheme,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
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
import VideoPage from "../video/VideoPage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: { marginLeft: 250 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export default function HomePage() {
  const classes = useStyles();
  const displayContext = useContext(DisplayContext);
  const { progress, errMsg, postsResult, fetch, fetchMore } = displayContext;

  React.useEffect(() => {
    fetch();
  }, []);

  if (errMsg) {
    return (
      <div className="d-flex h-100">
        <div className="mx-auto my-auto" style={{ alignItems: "center" }}>
          <IconButton onClick={fetch} data-testid="err-msg">
            <RefeashIcon />
          </IconButton>
          {errMsg}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.body}>
      <Collapse in={true} timeout={1000}>
        <div className="container-fluid h-100">
          {displayContext.currentPage === 0 ? (
            <div>
              {" "}
              <SearchBar />
              <TabBar />
              <Backdrop
                className={classes.backdrop}
                open={progress <= 100 && !errMsg}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <Fade
                in={!(progress < 100 && !errMsg)}
                mountOnEnter
                unmountOnExit
                timeout={1000}>
                <div>
                  <List id="post-list">
                    {postsResult &&
                      postsResult.results.map((post, index) => {
                        return (
                          <Collapse in={true} key={`post-${post.id}-${index}`}>
                            <PostItem post={post} />
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
                        onClick={() => fetchMore()}>
                        Load More
                      </Button>
                    </Grid.Row>
                  </Grid>
                </div>
              </Fade>
            </div>
          ) : (
            <VideoPage />
          )}
        </div>
        <SettingCard isCreated={true} />
      </Collapse>
    </div>
  );
}
