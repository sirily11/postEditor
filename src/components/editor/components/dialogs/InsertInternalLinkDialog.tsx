/** @format */

import React from "react";
import { DialogTypes, EditorContext } from "../../../model/editorContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  InputBase,
  CircularProgress,
  List,
  ListItem,
  Divider,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { v4 } from "uuid";
import { Box, ListItemText } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import { getURL } from "../../../model/utils/settings";
import Axios from "axios";
import { Post } from "../../../model/interfaces";
import { ListSubheader } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function InsertInternalLinkDialog() {
  const {
    showUploadDialog,
    setShowUploadDialog,
    insertInternalLink,
  } = React.useContext(EditorContext);

  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<Post[]>([]);
  const onClose = React.useCallback(() => {
    setShowUploadDialog(false);
    setResults([]);
    setValue("");
  }, []);

  const search = React.useCallback(async () => {
    let url = getURL("blog/post/?search=" + encodeURI(value));

    try {
      setIsLoading(true);
      let results = await Axios.get(url);
      console.log(results);
      setResults(results.data.results);
    } catch (err) {
      alert(`${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [value]);

  return (
    <Dialog
      open={showUploadDialog?.dialogType === DialogTypes.InternalLink}
      onClose={onClose}
      fullWidth>
      <DialogTitle>Insert Internal Link</DialogTitle>
      <DialogContent>
        <div className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Search posts"
            inputProps={{ "aria-label": "search google maps" }}
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          {isLoading ? (
            <CircularProgress />
          ) : (
            <IconButton
              onClick={search}
              className={classes.iconButton}
              aria-label="search">
              <SearchIcon />
            </IconButton>
          )}
        </div>
        <Divider />
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Results
            </ListSubheader>
          }>
          {results.map((r, i) => (
            <ListItem key={`result-${i}`} button>
              <ListItemText primary={r.title} secondary={r.author?.username} />
              <ListItemSecondaryAction>
                <Button
                  onClick={() => {
                    insertInternalLink(r);
                  }}>
                  Add
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
