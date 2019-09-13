import React, { useContext } from "react";
import { DisplayProvider, DisplayContext } from "../../model/displayContext";
import { Tabs, Tab, Paper } from "@material-ui/core";
import { SettingConext } from "../../model/settingContext";

export default function TabBar() {
  const settingContext = useContext(SettingConext);
  return (
    <DisplayContext.Consumer>
      {({ value, onChange }) => (
        <Paper
          className="row"
          id="tabbar-container"
          elevation={0}
          style={{ position: "sticky", top: 70, zIndex: 1000 }}
        >
          <Tabs
            value={value === -1 ? 1 : value}
            onChange={onChange}
            className="mx-auto"
          >
            {settingContext.categories.map((category) => {
              return (
                <Tab
                  key={category.id}
                  label={category.category}
                  value={category.id}
                  disableFocusRipple
                />
              );
            })}
          </Tabs>
        </Paper>
      )}
    </DisplayContext.Consumer>
  );
}
