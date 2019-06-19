import React from "react";
import { Post } from "../HomePage";
import { Link } from "react-router-dom";
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

interface Props {
  post: Post;
}

export default function PostItem(props: Props) {
  return (
    <div>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt={props.post.title}
            src="https://via.placeholder.com/150/92c952"
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <div className="pb-1">
              {props.post.title}
              <Chip
                className="ml-1"
                label={
                  <div style={{ color: "white" }}>
                    {props.post.category_name}
                  </div>
                }
                color="primary"
                size="small"
              />
              {props.post.isLocal && (
                <Chip
                  className="ml-1"
                  label={
                    <div style={{ color: "white" }}>
                      {props.post.category_name}
                    </div>
                  }
                  color="primary"
                  size="small"
                />
              )}
            </div>
          }
          secondary={props.post.content.substring(0, 150)}
        />
        <IconButton>
          <Link to="/edit">
            <NavigateNextIcon />
          </Link>
        </IconButton>
      </ListItem>
      <Divider variant="inset" />
    </div>
  );
}
