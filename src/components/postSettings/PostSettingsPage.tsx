/** @format */

import { Card, Collapse, CssBaseline, LinearProgress } from "@material-ui/core";
import React from "react";
import { PostSettingContext } from "../model/postSettingsContext";
import SettingsDialog from "./components/SettingsDialog";
import SettingsTree from "./components/SettingsTree";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { lightBlue, lime } from "@material-ui/core/colors";
import DetailSettingsDialog from "./components/DetailSettingsDialog";

const { remote } = (window as any).require("electron");
const { Menu, MenuItem } = remote;

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: lightBlue,
    secondary: lime,
  },
});

export default function PostSettingsPage() {
  const {
    openSettingsDialog,
    isLoading,
    showAddDetailSettingsDialog,
    showAddSettingsDialog,
  } = React.useContext(PostSettingContext);

  React.useEffect(() => {
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: "Add Settings",
        click() {
          openSettingsDialog();
        },
      })
    );

    window.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        menu.popup({ window: remote.getCurrentWindow() });
      },
      false
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ margin: 10 }}>
        <h4>Post Settings</h4>
        <Collapse
          in={
            isLoading && !showAddDetailSettingsDialog && !showAddSettingsDialog
          }
          mountOnEnter
          unmountOnExit>
          <LinearProgress />
        </Collapse>
        <Card style={{ padding: 10, minHeight: "90vh" }}>
          <SettingsTree />
        </Card>
        <SettingsDialog />
        <DetailSettingsDialog />
      </div>
    </ThemeProvider>
  );
}
