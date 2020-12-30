/** @format */

import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { PostSettingContext } from "../../model/postSettingsContext";
import { TreeItem, TreeView } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import { IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { ContentSettings, DetailSettings } from "../../model/interfaces";
const { remote } = (window as any).require("electron");
const { Menu, MenuItem } = remote;

const useStyle = makeStyles({
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: 300,
    flexShrink: 0,
  },
  container: {
    marginLeft: 300,
    padding: 0,
  },
  iconContainer: {
    display: "flex",
    width: "100%",
  },
  centerIcon: {
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default function SettingsTree() {
  const classes = useStyle();
  const {
    postSettings,
    openSettingsDialog,
    openDetailSettingsDialog,
    selectedDetailSettings,
    selectedSettings,
    deleteSettings,
    deleteDetailSettings,
  } = React.useContext(PostSettingContext);

  const settingsDetailContextMenu = (
    e: any,
    settings: ContentSettings,
    detail: DetailSettings
  ) => {
    e.preventDefault();
    const menu = new Menu();

    menu.append(
      new MenuItem({
        label: "Edit Detail",
        click() {
          openDetailSettingsDialog(settings, detail);
        },
      })
    );
    menu.append(
      new MenuItem({
        label: "Delete",
        async click() {
          let settingsIndex = postSettings?.settings?.findIndex(
            (s) => s.id === settings.id
          );
          let detailIndex = settings.detailSettings.findIndex(
            (ds) => ds.id === detail.id
          );

          await deleteDetailSettings(settingsIndex!, detailIndex);
        },
      })
    );
    menu.popup({ window: remote.getCurrentWindow() });
  };

  const settingsContextMenu = async (e: any, settings: ContentSettings) => {
    e.preventDefault();
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: "Add Detail",
        async click() {
          openDetailSettingsDialog(settings);
        },
      })
    );
    menu.append(
      new MenuItem({
        label: "Edit",
        async click() {
          openSettingsDialog(settings);
        },
      })
    );
    menu.append(
      new MenuItem({
        label: "Delete",
        async click() {
          let index = postSettings?.settings?.findIndex(
            (s) => s.id === settings.id
          );
          await deleteSettings(index!);
        },
      })
    );
    menu.popup({ window: remote.getCurrentWindow() });
  };

  if (postSettings === undefined) {
    return <div></div>;
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}>
      {postSettings.settings?.map((settings, index) => (
        <TreeItem
          nodeId={`settings-${index}`}
          key={`settings-${index}`}
          onContextMenu={(e) => settingsContextMenu(e, settings)}
          label={
            <div>
              <Typography style={{ fontSize: 18, fontWeight: "bold" }}>
                {settings.name}
              </Typography>
              <Typography variant="caption">{settings.description}</Typography>
            </div>
          }>
          {settings.detailSettings.map((ds, di) => (
            <TreeItem
              nodeId={`ds-${index}`}
              key={`ds-${index}`}
              endIcon={
                <Tooltip title="Add to text">
                  <AddBoxIcon />
                </Tooltip>
              }
              onIconClick={() => {}}
              onContextMenu={(e) => settingsDetailContextMenu(e, settings, ds)}
              label={
                <div>
                  <Typography variant="h6">{ds.name}</Typography>
                  <Typography variant="caption">{ds.description}</Typography>
                </div>
              }
            />
          ))}
          {/* <div className={classes.iconContainer}>
            <Tooltip title={"Edit settings"}>
              <IconButton onClick={() => {}} className={classes.centerIcon}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={"Add details"}>
              <IconButton
                onClick={async () => {}}
                className={classes.centerIcon}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div> */}
        </TreeItem>
      ))}
    </TreeView>
  );
}
