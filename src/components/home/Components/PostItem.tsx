import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  IconButton
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Trans } from "@lingui/macro";
import { Post } from "../../model/interfaces";
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
  return (
    <Link to={`/edit/${props.post.id}`}>
      <ListItem alignItems="flex-start" button>
        <ListItemAvatar>
          <Avatar alt={props.post.title} src={props.post.image_url} />
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
          secondary={props.post.content.substring(0, 150)}
        />
        <IconButton>
          <NavigateNextIcon />
        </IconButton>
      </ListItem>
      <Divider variant="inset" />
    </Link>
  );
}
