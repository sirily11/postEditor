import React, { useContext } from "react";
import {
  List,
  Collapse,
  CircularProgress,
  IconButton,
  Fade,
} from "@material-ui/core";
import PostItem from "./Components/PostItem";
import {
  createMuiTheme,
  createStyles,
  makeStyles,
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

const useStyles = makeStyles({
  body: {
    marginLeft: 300,
  },
});

export default function HomePage() {
  const classes = useStyles();
  const displayContext = useContext(DisplayContext);
  const { progress, errMsg, postsResult, fetch, fetchMore } = displayContext;

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

  return (
    <div className={classes.body}>
      <Collapse in={true} timeout={1000}>
        <div className="container-fluid h-100">
          {displayContext.currentPage === 0 ? (
            <div>
              {" "}
              <SearchBar />
              <TabBar />
              <Collapse
                in={progress <= 100 && !errMsg}
                mountOnEnter
                timeout={{ enter: 500, exit: 1000 }}
              >
                <div className="d-flex h-100">
                  <div className="mx-auto my-auto">
                    <CircularProgress
                      id="progress-bar"
                      variant="determinate"
                      color="primary"
                      value={progress}
                    />
                    <div>{progress.toFixed(0)} %</div>
                  </div>
                </div>
              </Collapse>
              <Fade
                in={!(progress < 100 && !errMsg)}
                mountOnEnter
                unmountOnExit
                timeout={1000}
              >
                <div>
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
