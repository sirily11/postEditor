import React from "react";
import { EditorContext } from "../../model/editorContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";

export default function UploadFileDialog() {
  const {
    showUploadFileDialog,
    setShowUploadFileDialog,
    insertAudio,
  } = React.useContext(EditorContext);
  const [path, setPath] = React.useState<string>();

  return (
    <Dialog open={showUploadFileDialog} fullWidth>
      <DialogTitle>Upload File by URL</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="filled"
          label="File URL"
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
