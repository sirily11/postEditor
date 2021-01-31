/** @format */

import React from "react";
import { DialogTypes, EditorContext } from "../../../model/editorContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";

export default function UploadAudioDialog() {
  const {
    showUploadDialog: showUploadFileDialog,
    setShowUploadDialog: setShowUploadFileDialog,
    insertAudio,
  } = React.useContext(EditorContext);
  const [path, setPath] = React.useState<string>();

  return (
    <Dialog
      open={showUploadFileDialog?.dialogType === DialogTypes.Audio}
      fullWidth>
      <DialogTitle>Upload Audio by URL</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="filled"
          label="Audio URL"
          onChange={(e) => setPath(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setShowUploadFileDialog(false)}>Close</Button>
        <Button
          onClick={async () => {
            if (path) {
              insertAudio(path);
            }
            setShowUploadFileDialog(false);
          }}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
