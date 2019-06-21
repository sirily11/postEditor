import React from "react";
import { DisplayProvider, DisplayContext } from "../../model/displayContext";
import { Tabs, Tab, Paper } from "@material-ui/core";

export default function TabBar() {
  return (
    <DisplayContext.Consumer>
      {({ value, onChange, tabs }) => (
        <Paper
          className="row"
          id="tabbar-container"
          elevation={0}
          style={{ position: "sticky", top: 70, zIndex: 1000 }}
        >
          <Tabs value={value} onChange={onChange} className="mx-auto">
            {tabs.map((tab) => {
              return <Tab key={tab.name} label={tab.name} />;
            })}
          </Tabs>
        </Paper>
      )}
    </DisplayContext.Consumer>
  );
}
