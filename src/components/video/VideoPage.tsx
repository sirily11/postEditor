import React from "react";
import { useState } from "react";
import { Result, Video } from "../model/interfaces";
import { getURL } from "../model/utils/settings";
import axios from "axios";
import {
  makeStyles,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle
} from "@material-ui/core";
import MovieIcon from "@material-ui/icons/Movie";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VideoEditModel from "./VideoEditModel";
import VideoPlayer from "./VideoPlayer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    }
  })
);

export default function VideoPage() {
  const [videoResult, setVideoResult] = useState<Result<Video>>();
  const [selectedVideo, setSelectedVideo] = useState<Video>();
  const [selectedPlayingVideo, setSelectedPlayingVideo] = useState<Video>();
  if (!videoResult) {
    let url = getURL("/blog/video");
    axios.get<Result<Video>>(url).then((res) => {
      setVideoResult(res.data);
    });
  }

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <div className={classes.root}>
      <List>
        {videoResult?.results.map((v, index) => (
          <ListItem
            button
            key={index}
            onClick={() => setSelectedPlayingVideo(v)}
          >
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary={v.title} secondary={v.content} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  setOpen(true);
                  setSelectedVideo(v);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={async () => {
                  let confirmed = window.confirm("Do you want to delete?");
                  if (confirmed && videoResult) {
                    let token = localStorage.getItem("access");
                    let url = getURL(`/blog/video/${v.id}/`);
                    await axios.delete(url, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    videoResult.results.splice(index, 1);
                    videoResult.count -= 1;
                    setVideoResult(JSON.parse(JSON.stringify(videoResult)));
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button
        disabled={videoResult?.next === null}
        onClick={async () => {
          if (videoResult && videoResult.next) {
            let res = await axios.get<Result<Video>>(videoResult.next);
            videoResult.count = res.data.count;
            videoResult.next = res.data.next;
            videoResult.results = [...videoResult.results, ...res.data.results];
            setVideoResult(JSON.parse(JSON.stringify(videoResult)));
          }
        }}
      >
        Load More
      </Button>
      {selectedVideo && (
        <VideoEditModel
          open={open}
          setOpen={async (v: boolean, changed: boolean) => {
            if (changed) {
              let url = getURL("/blog/video");
              let res = await axios.get<Result<Video>>(url);
              setVideoResult(res.data);
            }

            setOpen(false);
          }}
          video={selectedVideo}
        />
      )}
      {selectedPlayingVideo && (
        <VideoPlayer
          open={selectedPlayingVideo !== undefined}
          video={selectedPlayingVideo}
          setOpen={(v) => {
            if (v === false) {
              setSelectedPlayingVideo(undefined);
            }
          }}
        ></VideoPlayer>
      )}
    </div>
  );
}
