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
import ListIcon from "@material-ui/icons/List";

const items = [
  {
    text: "Save",
    icon: <SaveIcon />
  },
  {
    text: "Header 1",
    icon: <div>H1</div>
  },
  {
    text: "Header 2",
    icon: <div>H2</div>
  },
  {
    text: "Header 3",
    icon: <div>H3</div>
  },
  {
    text: "divider",
    icon: <div />
  },

  {
    text: "Bold",
    icon: <div>B</div>
  },
  {
    text: "List",
    icon: <ListIcon />
  }
];

export default class SideController extends Component {
  render() {
    return (
      <div>
        <Drawer variant="permanent" open={true}>
          <List>
            {items.map(({ text, icon }) => {
              if (text === "divider") {
                return <Divider key={text} />;
              } else {
                return (
                  <Tooltip title={text} placement="right" key={text}>
                    <ListItem button>
                      <ListItemIcon className="item-icon">{icon}</ListItemIcon>
                    </ListItem>
                  </Tooltip>
                );
              }
            })}
          </List>
        </Drawer>
      </div>
    );
  }
}
