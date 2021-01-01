/** @format */

import {
  withStyles,
  fade,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Collapse,
  LinearProgress,
} from "@material-ui/core";
import React from "react";
import { PostImage } from "../../../model/interfaces";
import { getURL } from "../../../model/utils/settings";
import TextField from "@material-ui/core/TextField";
import { EditorContext } from "../../../model/editorContext";
import axios from "axios";
const { ipcRenderer } = (window as any).require("electron");

export function ImageEditDialog(props: {

}) {
  const {  } = props;
  const {
    showEditImageDialog,
    setShowImageEditDialog,
    selectedImageData,
  } = React.useContext(EditorContext);

  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    setDescription(selectedImageData?.description ?? "");
  }, [selectedImageData]);

  async function updateImageAndContent(
    postImageId: number,
    subtitle: string
  ): Promise<PostImage> {
    const postImageURL = getURL(`blog/post-image/${postImageId}/`);
    let token = localStorage.getItem("access");
    let result = await axios.patch<PostImage>(
      postImageURL,
      { description: subtitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return result.data;
  }

  return (
    <Dialog
      fullWidth
      open={showEditImageDialog}
      onClose={() => setShowImageEditDialog(false)}>
      <DialogTitle>Edit Image </DialogTitle>
      <DialogContent>
        <Collapse mountOnEnter unmountOnExit in={isLoading}>
          <LinearProgress />
        </Collapse>
        <TextField
          color="secondary"
          label="Image Caption"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowImageEditDialog(false)}>Close</Button>
        <Button
          onClick={async () => {
            try {
              setIsLoading(true);
              let result = await updateImageAndContent(
                selectedImageData.id,
                description
              );
              ipcRenderer.send("update-image-description", result);
          
              setShowImageEditDialog(false);
            } catch (err) {
              alert(err);
            } finally {
              setIsLoading(false);
            }
          }}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
