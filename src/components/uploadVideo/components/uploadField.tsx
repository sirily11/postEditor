import React, { useContext, useState } from "react";
import { Header, Icon, Segment } from "semantic-ui-react";
import { UploadFile, UploadVideoConext } from "../../model/uploadVideoContext";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup
} from "@material-ui/core";

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

export function UploadField() {
  const uploadVideoContext = useContext(UploadVideoConext);
  const classes = useStyles();
  const [access_id, setAccess] = useState(uploadVideoContext.access_id);
  const [secret_id, setSecret] = useState(uploadVideoContext.secret_id);
  const [bucket, setBucket] = useState(uploadVideoContext.bucket_name);
  const [will_transcode, setWillTransCode] = useState(false);

  return (
    <Segment style={{ width: "100%" }}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          value={access_id}
          id="outlined-basic"
          label="Access ID"
          variant="outlined"
          onChange={(e) => setAccess(e.target.value)}
        />
        <TextField
          value={secret_id}
          id="outlined-basic"
          label="Secret ID"
          variant="outlined"
          onChange={(e) => setSecret(e.target.value)}
        />
        <TextField
          value={bucket}
          id="outlined-basic"
          label="Bucket Name"
          variant="outlined"
          onChange={(e) => setBucket(e.target.value)}
        />
      </form>
      <FormGroup row>
        <FormControlLabel
          style={{ margin: "10px" }}
          control={
            <Checkbox
              checked={will_transcode}
              onChange={(e) => setWillTransCode(e.target.checked)}
              value="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          }
          label="Transcode"
        />
      </FormGroup>
      <input
        className={classes.input}
        type="file"
        multiple
        name="Upload file"
        accept={"video/*"}
        onChange={async (e) => {
          let files = e.target.files;
          if (files) {
            // eslint-disable-next-line array-callback-return
            let uploadFiles: UploadFile[] = [];
            // @ts-ignore
            for (let f of files) {
              uploadFiles.push({
                file: f,
                will_transcode: will_transcode,
                transcoded_files: []
              });
            }
            await uploadVideoContext.upload(uploadFiles);
          }
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={async (e) => {
          await uploadVideoContext.confirmUpload(
            access_id,
            secret_id,
            bucket,
            will_transcode
          );
        }}
      >
        Upload
      </Button>
    </Segment>
  );
}
