/** @format */

import {
  Grid,
  GridList,
  GridListTile,
  List,
  Paper,
  ListItem,
  ListItemSecondaryAction,
  GridListTileBar,
  Fade,
  LinearProgress,
  Tooltip,
} from "@material-ui/core";
import React, { Component } from "react";
import { PostImage } from "../model/interfaces";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { ListItemIcon } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { PostImageCard } from "./PostCard";
import { deleteImage } from "../model/utils/uploadUtils";
import { ImageEditDialog } from "../editor/components/dialogs/ImageEditDialog";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import UploadDialog from "../editor/components/dialogs/UploadDialog";
const { ipcRenderer } = (window as any).require("electron");

const data = [
  {
    id: 52,
    pid: 13,
    image:
      "https://sirileepage-website-data.s3.amazonaws.com/static/image/2020/12/22/90aa7b3b-5531-4aef-8063-b68962b013cc.png",
  },
  {
    id: 53,
    pid: 13,
    image:
      "https://sirileepage-website-data.s3.amazonaws.com/static/image/2020/12/22/71a00f1a-95aa-40b7-9c74-4eea1a02bccd.png",
  },
];

interface State {
  images: PostImage[];
  progress?: number;
  files: File[];
  id?: any;
}

interface Props {}

export class PostImagePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      images: [],
      files: [],
    };
  }

  componentDidMount() {
    ipcRenderer.on("update-images", async (event: any, arg: any) => {
      console.log(arg);
      this.setState({ images: arg.images, id: arg.pid });
    });

    ipcRenderer.on("add-images", async (event: any, arg: any) => {
      const images = this.state.images;
      for (const i of arg) {
        images.push(i);
      }
      this.setState({ images: images });
    });
  }

  render() {
    const { images, progress } = this.state;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ textAlign: "center" }}>
            <Paper style={{ padding: 20, marginBottom: 20 }}>
              <h4>
                素材库{" "}
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={(e) => {
                    let fileList = e.target.files;
                    let files = [];
                    if (fileList != null) {
                      for (let index = 0; index < fileList.length; index++) {
                        files.push(fileList[index]);
                      }
                      this.setState({ files: files });
                    }
                  }}
                />
                <label htmlFor="contained-button-file">
                  <Tooltip title="Upload Images">
                    <IconButton aria-label="upload picture" component="span">
                      <PhotoCamera />
                    </IconButton>
                  </Tooltip>
                </label>
              </h4>
              {images.length === 0 && <h4> No images</h4>}
              <Fade in={progress !== undefined} mountOnEnter unmountOnExit>
                <LinearProgress variant="determinate" value={progress} />
              </Fade>
            </Paper>

            <Paper style={{ padding: 20 }}>
              {images.length !== 0 && (
                <Grid container spacing={4}>
                  {images.map((image, index) => (
                    <PostImageCard
                      key={index}
                      image={image}
                      onAdd={() => {
                        console.log("add");
                        ipcRenderer.send("add-image-to-content", image);
                      }}
                      onDelete={async () => {
                        try {
                          this.setState({ progress: 0 });
                          await deleteImage(image.id, (p) => {
                            this.setState({ progress: p / 100 });
                          });
                          const index = images.findIndex((i) => i === image);
                          images.splice(index, 1);
                          this.setState({ images, progress: undefined });
                          ipcRenderer.send("delete-image", image);
                        } catch (err) {
                          alert("Cannot delete image");
                          this.setState({ progress: undefined });
                        }
                      }}
                    />
                  ))}
                </Grid>
              )}
            </Paper>
          </div>
        </Grid>
        <ImageEditDialog />
        {this.state.id && (
          <UploadDialog
            id={this.state.id}
            files={this.state.files}
            shouldInsert={false}
            open={this.state.files.length > 0}
            close={(images) => {
              this.setState({ files: [] });
              ipcRenderer.send("add-images-to-post", images);
            }}
          />
        )}
      </Grid>
    );
  }
}

export default PostImagePage;
