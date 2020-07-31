import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Divider,
  Card,
  IconButton,
  Paper,
} from "@material-ui/core";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";

import { EditorContext } from "../model/editorContext";
import UploadFileDialog from "./components/UploadFileDialog";

export default function SideController() {
  return (
    <div>
      <Drawer variant="permanent" open={true}>
        <List id="sidebar" style={{ overflow: "hidden" }}>
          <EditorContext.Consumer>
            {({ actions, selected }) => {
              return actions.map((action) => {
                if (action.text.includes("Divider")) {
                  return <Divider key={action.text} />;
                } else {
                  return (
                    <Tooltip
                      title={action.text}
                      placement="right"
                      key={action.text}>
                      <ListItem
                        button={true}
                        onClick={action.action}
                        selected={selected.includes(action.text)}>
                        <ListItemIcon className="item-icon">
                          {action.icon}
                        </ListItemIcon>
                      </ListItem>
                    </Tooltip>
                  );
                }
              });
            }}
          </EditorContext.Consumer>
        </List>
      </Drawer>
      <UploadFileDialog />
    </div>
  );
}
