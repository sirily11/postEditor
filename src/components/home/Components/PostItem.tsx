/** @format */

import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  CardMedia,
  Card,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Trans } from "@lingui/macro";
import { Post } from "../../model/interfaces";
import {
  Editor,
  EditorState,
  convertFromRaw,
  RawDraftContentState,
} from "draft-js";
import * as path from "path";

interface Props {
  post: Post;
}

let getPath = (urlSrc?: string) => {
  if (urlSrc) {
    let url = new URL(urlSrc);
    let pathName = url.pathname;
    let base = path.dirname(pathName);
    let fileName = path.basename(pathName);
    pathName = path.join(base, `small-${fileName}`);
    return `http://${url.hostname}${pathName}`;
  }
};

export default function PostItem(props: Props) {
  let content: RawDraftContentState = JSON.parse(props.post.content);
  content.blocks = content.blocks.slice(
    0,
    content.blocks.length > 3 ? 3 : content.blocks.length
  );
  let plaintext = convertFromRaw(content).getPlainText();
  return (
    <Link to={`/edit/${props.post.id}`}>
      <ListItem alignItems="flex-start" button>
        <ListItemAvatar style={{ marginRight: 10 }}>
          <Card>
            <CardMedia
              image={props.post.image_url}
              style={{ width: 100, height: 100 }}
            />
          </Card>
        </ListItemAvatar>
        <ListItemText
          primary={
            <div className="pb-1">
              {props.post.title}
              <Chip
                className="ml-1"
                label={
                  <div style={{ color: "white" }}>
                    {props.post.post_category
                      ? props.post.post_category.category
                      : ""}
                  </div>
                }
                color="primary"
                size="small"
              />
            </div>
          }
          secondary={
            <p className="text">{convertFromRaw(content).getPlainText()}</p>
          }
        />
        <IconButton>
          <NavigateNextIcon />
        </IconButton>
      </ListItem>
      <Divider style={{ marginTop: 10 }} variant="inset" />
    </Link>
  );
}
