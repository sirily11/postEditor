import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Divider
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { EditorContext } from "../model/editorContext";

export default class SideController extends Component {
  render() {
    return (
      <div>
        <Drawer variant="permanent" open={true}>
          <List>
            <EditorContext.Consumer>
              {({actions, selected }) => {
                return actions.map((action) => {
                  if (action.text === "Divider") {
                    return <Divider />;
                  } else {
                    return (
                      <Tooltip title={action.text} placement="right">
                        <ListItem
                          button={true}
                          onClick={action.action}
                          selected={selected === action.text}
                        >
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
      </div>
    );
  }
}
