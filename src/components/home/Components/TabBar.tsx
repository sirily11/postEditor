import React, { useContext } from "react";
import { DisplayProvider, DisplayContext } from "../../model/displayContext";
import {
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { SettingConext } from "../../model/settingContext";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

const useStyles = makeStyles({
  drawer: {
    marginTop: 20,
    width: 300,
  },
});

export default function TabBar() {
  const settingContext = useContext(SettingConext);
  const classes = useStyles();
  return (
    <DisplayContext.Consumer>
      {({ value, onChange }) => (
        <Drawer id="tabbar-container" elevation={0} variant="permanent">
          <List className={classes.drawer}>
            <ListItem
              button
              selected={value === -1}
              onClick={() => {
                onChange(-1);
              }}
            >
              <ListItemText primary={"All"} />
            </ListItem>
            {settingContext.categories.map((category) => {
              return (
                <ListItem
                  button
                  selected={value === category.id}
                  onClick={() => {
                    onChange(category.id);
                  }}
                >
                  <ListItemText primary={category.category} />
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      )}
    </DisplayContext.Consumer>
  );
}
