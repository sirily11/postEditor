import React, { useContext, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { Video } from "../model/interfaces";
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core";
import { SettingConext } from "../model/settingContext";
import { Button as Button2 } from "semantic-ui-react";
import ReactVideoPlayer from "./ReactVideoPlayer";

interface Props {
  open: boolean;
  setOpen(o: boolean): void;
  video: Video;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "100%"
      }
    },
    input: {
      margin: "10px"
    }
  })
);

export default function VideoPlayer(props: Props) {
  const settingContext = useContext(SettingConext);
  const classes = useStyles();
  const [videoSrc, setVideoSrc] = useState(props.video.video_480p);
  const {
    video_480p,
    video_720p,
    video_1080p,
    video_4k,
    original_video
  } = props.video;

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [
      {
        src: videoSrc,
        type:
          videoSrc === original_video ? "video/mp4" : "application/x-mpegURL"
      }
    ]
  };

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)} fullWidth>
      <DialogTitle>Playing Video</DialogTitle>
      <DialogContent>
        <div>
          <ReactVideoPlayer {...videoJsOptions} />
        </div>

        <div>
          {video_480p && (
            <Button2
              primary={video_480p === videoSrc}
              onClick={() => setVideoSrc(video_480p)}
            >
              480 p
            </Button2>
          )}{" "}
          {video_720p && (
            <Button2
              primary={video_720p === videoSrc}
              onClick={() => setVideoSrc(video_720p)}
            >
              720 p
            </Button2>
          )}{" "}
          {video_1080p && (
            <Button2
              primary={video_1080p === videoSrc}
              onClick={() => setVideoSrc(video_1080p)}
            >
              1080 p
            </Button2>
          )}{" "}
          {video_4k && (
            <Button2
              primary={video_4k === videoSrc}
              onClick={() => setVideoSrc(video_4k)}
            >
              4k
            </Button2>
          )}
          {original_video && (
            <Button2
              primary={original_video === videoSrc}
              onClick={() => setVideoSrc(original_video)}
            >
              Original
            </Button2>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
