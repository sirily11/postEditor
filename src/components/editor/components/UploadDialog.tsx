import React from "react";
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
  Button
} from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { Trans } from "@lingui/macro";

interface Props {
  open: boolean;
  files: File[];
  currentUploading: string;
  currentUploadProgress: number;
  numberOfFinished: number;
  close(): void;
  insertImage(imagePath: string): void;
}

export default function UploadDialog(props: Props) {
  const isUploadEnd = props.numberOfFinished === props.files.length;
  return (
    <div>
      <Dialog open={props.open} fullWidth onClose={props.close}>
        <DialogTitle>
          <Trans>Uploading Images</Trans>
        </DialogTitle>
        <DialogContent>
          <h6>
            <Trans>Current: </Trans>
          </h6>
          <div>
            {props.currentUploading}: {props.numberOfFinished}/
            {props.files.length}{" "}
          </div>
          <LinearProgress
            value={props.currentUploadProgress}
            variant="determinate"
          />
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
              let domin =
                "https://sirilee-webpage-post-image.s3.ap-east-1.amazonaws.com";
              let folder = "postImage";
              props.files
                .map((file) => file.name)
                .forEach(async (path) => {
                  path = `${domin}/${folder}/${path}`;
                  console.log(path);
                  await props.insertImage(path);
                });
              props.close();
            }}
            disabled={!isUploadEnd}
          >
            Insert Images
          </Button>
          <Button onClick={props.close} disabled={!isUploadEnd}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
