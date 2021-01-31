/** @format */

import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  LinearProgress,
  DialogContent,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  DialogActions,
  Button,
} from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { Trans } from "@lingui/macro";
import { uploadImage } from "../../../model/utils/uploadUtils";
import { EditorContext } from "../../../model/editorContext";

interface Props {
  open: boolean;
  files: File[];
  close(): void;
}

export default function UploadDialog(props: Props) {
  const [numFinished, setNumFinished] = useState(0);
  const [currentUpload, setCurrentUpload] = useState<string>();
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const editContext = useContext(EditorContext);

  const isUploadEnd = numFinished === props.files.length;

  return (
    <div>
      <Dialog
        open={props.open}
        fullWidth
        onClose={() => {
          setNumFinished(0);
          setCurrentProgress(0);
          setCurrentProgress(0);
          props.close();
        }}>
        <DialogTitle>
          <Trans>Uploading Files</Trans>
        </DialogTitle>
        <DialogContent>
          <h6>Current: {currentUpload}</h6>
          <div>
            {numFinished}/{props.files.length}{" "}
          </div>
          <LinearProgress value={currentProgress} variant="determinate" />
          <h6 className="mt-2">
            <Trans>Files:</Trans>
          </h6>
          <List>
            {props.files.map((file) => (
              <div key={`uploadItem-${file.path}`}>
                <ListItem>
                  <ListItemIcon>
                    <AttachmentIcon />
                  </ListItemIcon>
                  <ListItemText primary={file.name} />
                </ListItem>
                <Divider variant="inset" />
              </div>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              for (const path of props.files) {
                setCurrentUpload(path.path);
                const image: any = await uploadImage(
                  path,
                  editContext.post.id as string,
                  (progress) => setCurrentProgress(progress)
                );
                editContext.insertImage(image);
                setNumFinished(numFinished + 1);
              }
              setNumFinished(0);
              setCurrentProgress(0);
              setCurrentProgress(0);
              props.close();
              props.close();
            }}>
            Insert Files
          </Button>
          <Button onClick={props.close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
