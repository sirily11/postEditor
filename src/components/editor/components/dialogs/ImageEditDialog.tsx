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
import { DialogTypes, EditorContext } from "../../../model/editorContext";
import axios from "axios";
import { post } from "jquery";
const { ipcRenderer } = (window as any).require("electron");

export async function updateImageAndContent(
  postImageId: number,
  subtitle: string
): Promise<PostImage> {
  const postImageURL = getURL(`blog/post-image/${postImageId}/`);
  const token = localStorage.getItem("access");
  const result = await axios.patch<PostImage>(
    postImageURL,
    { description: subtitle },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return result.data;
}

export function ImageEditDialog() {
  const { setShowUploadDialog, showUploadDialog, post } = React.useContext(
    EditorContext
  );

  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const onClose = React.useCallback(() => {
    setShowUploadDialog(false);
  }, []);

  React.useEffect(() => {
    setDescription(showUploadDialog?.selectedData?.description ?? "");
  }, [showUploadDialog]);

  return (
    <Dialog
      fullWidth
      open={showUploadDialog?.dialogType === DialogTypes.Image}
      onClose={onClose}>
      <DialogTitle>Edit Image</DialogTitle>
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
        <Button onClick={() => onClose()}>Close</Button>
        <Button
          onClick={async () => {
            try {
              setIsLoading(true);
              const result = await updateImageAndContent(
                showUploadDialog?.selectedData.id,
                description
              );

              ipcRenderer.send("update-image-description", result);

              onClose();
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
