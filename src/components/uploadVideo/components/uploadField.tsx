import React, { useContext, useState } from "react";
import { Header, Icon, Segment, Select } from "semantic-ui-react";
import { UploadFile, UploadVideoConext } from "../../model/uploadVideoContext";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup
} from "@material-ui/core";
import { SettingConext } from "../../model/settingContext";

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

const awsRegion = [
  { text: "Asia Pacific (Hong Kong)", value: "ap-east-1" },
  { text: "US East (N. Virginia)", value: "us-east-1" },
  { text: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
  { text: "US West (N. California)", value: "us-west-1" }
];

export function UploadField() {
  const uploadVideoContext = useContext(UploadVideoConext);
  const settingContext = useContext(SettingConext);
  const classes = useStyles();
  const [access_id, setAccess] = useState(uploadVideoContext.access_id);
  const [secret_id, setSecret] = useState(uploadVideoContext.secret_id);
  const [bucket, setBucket] = useState(uploadVideoContext.bucket_name);
  const [category, setCategory] = useState<number>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [region, setRegion] = useState(
    localStorage.getItem("region") ?? awsRegion[0].value
  );
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
        <Select
          value={region}
          placeholder={"AWS Region"}
          onChange={(e, { value }) => {
            setRegion(value as string);
          }}
          options={awsRegion}
        />
      </form>
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
        <Select
          value={category}
          placeholder={"Category"}
          onChange={(e, { value }) => {
            setCategory(value as number);
          }}
          options={settingContext.categories.map((c) => {
            return { text: c.category, value: c.id };
          })}
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
            will_transcode,
            title,
            content,
            category,
            region
          );
        }}
      >
        Upload
      </Button>
    </Segment>
  );
}
