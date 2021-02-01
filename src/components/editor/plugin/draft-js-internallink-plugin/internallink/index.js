/** @format */

import unionClassNames from "union-class-names";
import React, { Component } from "react";
import UploadVideoDialog from "../../../components/dialogs/UploadVideoDialog";
import { DialogTypes, EditorContext } from "../../../../model/editorContext";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import { getURL } from "../../../../model/utils/settings";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    cursor: "pointer",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function Internallink(props) {
  const classes = useStyles();
  const { block, className, theme = {}, ...otherProps } = props;
  // leveraging destructuring to omit certain properties from props
  const {
    blockProps, // eslint-disable-line no-unused-vars
    customStyleMap, // eslint-disable-line no-unused-vars
    customStyleFn, // eslint-disable-line no-unused-vars
    decorator, // eslint-disable-line no-unused-vars
    forceSelection, // eslint-disable-line no-unused-vars
    offsetKey, // eslint-disable-line no-unused-vars
    selection, // eslint-disable-line no-unused-vars
    tree, // eslint-disable-line no-unused-vars
    contentState,
    blockStyleFn,
    ...elementProps
  } = otherProps;
  const combinedClassName = unionClassNames(theme.image, className);
  const { id, title, image_url, author } = contentState
    .getEntity(block.getEntityAt(0))
    .getData();

  const { updateInternalLink } = React.useContext(EditorContext);

  return (
    <div>
      <Card
        className={classes.root}
        variant="outlined"
        onContextMenu={(e) => {
          e.preventDefault();
          const menu = new Menu();
          menu.append(
            new MenuItem({
              label: "Update data",
              click() {
                let url = getURL(`blog/post/${id}`);
                Axios.get(url).then((res) => {
                  let post = res.data;
                  updateInternalLink(post);
                });
              },
            })
          );
          menu.popup({ window: remote.getCurrentWindow() });
        }}>
        <CardMedia className={classes.cover} image={image_url} />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {author.username}
            </Typography>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
