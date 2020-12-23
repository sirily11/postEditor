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
  createStyles,
  TextField,
  Select,
  MenuItem
} from "@material-ui/core";
import { SettingConext } from "../model/settingContext";
import { getURL } from "../model/utils/settings";
import axios from "axios";

interface Props {
  open: boolean;
  setOpen(o: boolean, changed: boolean): void;
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

export default function VideoEditModel(props: Props) {
  const settingContext = useContext(SettingConext);
  const classes = useStyles();
  const [category, setCategory] = useState<number>(props.video.category);
  const [title, setTitle] = useState(props.video.title);
  const [content, setContent] = useState(props.video.content);
  const [videoOriginal, setVideoOriginal] = useState(
    props.video.original_video
  );
  const [video480p, setVideo480p] = useState(props.video.video_480p);
  const [video720p, setVideo720p] = useState(props.video.video_720p);
  const [video1080p, setVideo1080p] = useState(props.video.video_1080p);
  const [video4k, setVideo4k] = useState(props.video.video_4k);

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false, false)}
      fullWidth
    >
      <DialogTitle>Edit Video</DialogTitle>
      <DialogContent>
        {" "}
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            value={title}
            id="outlined-basic"
            label="Title"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            value={content}
            id="outlined-basic"
            label="Content"
            multiline
            rows={3}
            variant="outlined"
            onChange={(e) => setContent(e.target.value)}
          />
          <TextField
            value={videoOriginal}
            id="outlined-basic"
            label="video original"
            multiline
            rows={3}
            variant="outlined"
            onChange={(e) => setVideo480p(e.target.value)}
          />
          <TextField
            value={video480p}
            id="outlined-basic"
            label="Video 480p"
            multiline
            rows={3}
            variant="outlined"
            onChange={(e) => setVideo480p(e.target.value)}
          />
          <TextField
            value={video720p}
            id="outlined-basic"
            label="Video 720p"
            multiline
            rows={3}
            variant="outlined"
            onChange={(e) => setVideo720p(e.target.value)}
          />
          <TextField
            value={video1080p}
            id="outlined-basic"
            label="Video 1080p"
            multiline
            rows={3}
            variant="outlined"
            onChange={(e) => setVideo1080p(e.target.value)}
          />
          <TextField
            value={video4k}
            id="outlined-basic"
            label="Video 4k"
            multiline
            rows={3}
            variant="outlined"
            onChange={(e) => setVideo4k(e.target.value)}
          />
          <Select
            value={category}
            placeholder={"Category"}
            onChange={(e) => {
              setCategory(e.target.value as number);
            }}
          >
            {settingContext.categories.map((c) => (
              <MenuItem key={`category-${c.id}`} value={c.id}>
                {c.category}
              </MenuItem>
            ))}
          </Select>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false, false)}>Cancel</Button>
        <Button
          onClick={async () => {
            let token = localStorage.getItem("access");
            let url = getURL(`/blog/video/${props.video.id}/`);
            await axios.patch(
              url,
              {
                title: title,
                content: content,
                category: category,
                video_480p: video480p,
                video_720p: video720p,
                video_1080p: video1080p,
                video_4k: video4k,
                original_video: videoOriginal
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            props.setOpen(false, true);
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
