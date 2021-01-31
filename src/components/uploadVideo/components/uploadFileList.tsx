/** @format */

import React, { useContext, useState } from "react";
import { UploadVideoConext } from "../../model/uploadVideoContext";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@material-ui/core";
import { Segment } from "semantic-ui-react";

export function UploadFileList() {
  const uploadVideoContext = useContext(UploadVideoConext);
  if (uploadVideoContext.uploadFiles.length === 0) {
    return <div />;
  }

  return (
    <Segment style={{ width: "100%" }}>
      <List>
        {uploadVideoContext.uploadFiles.map((f, i) => (
          <ListItem button key={`file-${i}`}>
            <ListItemText key={f.file.name}>
              {f.file.name}
              <hr></hr>
              {f.task_description ?? ""}
              {f.transcode_progress && (
                <LinearProgress
                  color={"secondary"}
                  variant="determinate"
                  value={f.transcode_progress ?? 0}
                />
              )}
              <LinearProgress variant="determinate" value={f.progress ?? 0} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Segment>
  );
}
