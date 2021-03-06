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

const getPath = (urlSrc?: string) => {
  if (urlSrc) {
    const url = new URL(urlSrc);
    let pathName = url.pathname;
    const base = path.dirname(pathName);
    const fileName = path.basename(pathName);
    pathName = path.join(base, `small-${fileName}`);
    return `http://${url.hostname}${pathName}`;
  }
};

export default function PostItem(props: Props) {
  const content: RawDraftContentState = JSON.parse(props.post.content);
  content.blocks = content.blocks.slice(
    0,
    content.blocks.length > 3 ? 3 : content.blocks.length
  );
  const plaintext = convertFromRaw(content).getPlainText();
  return (
    <div>
      <ListItem
        alignItems="flex-start"
        button
        onClick={() => {
          window.location.href = `#/edit/${props.post.id}`;
        }}>
        <ListItemAvatar style={{ marginRight: 10 }}>
          <Card>
            {props.post.image_url ? (
              <CardMedia
                image={props.post.image_url}
                style={{ width: 100, height: 100 }}
              />
            ) : (
              <div style={{ width: 100, height: 100 }}></div>
            )}
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
          secondary={<span className="text">{plaintext}</span>}
        />
        <IconButton>
          <NavigateNextIcon />
        </IconButton>
      </ListItem>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} variant="inset" />
    </div>
  );
}
