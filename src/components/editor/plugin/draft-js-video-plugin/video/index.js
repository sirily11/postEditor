/** @format */

import unionClassNames from "union-class-names";
import React, { Component } from "react";
import UploadVideoDialog from "../../../components/dialogs/UploadVideoDialog";
import { DialogTypes, EditorContext } from "../../../../model/editorContext";
import { Tooltip } from "@material-ui/core";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

export default function Video(props) {
  const { block, className, theme = {}, ...otherProps } = props;
  // leveraging destructuring to omit certain properties from props
  const {
    blockProps, // eslint-disable-line no-unused-vars
    customStyleMap, // eslint-disable-line no-unused-vars
    customStyleFn, // eslint-disable-line no-unused-vars
    decorator, // eslint-disable-line no-unused-vars
    forceSelection, // eslint-disable-line no-unused-vars
    offsetKey, // eslint-disable-line no-unused-vars
    selection, // eslint-disable-line no-unused-vars
    tree, // eslint-disable-line no-unused-vars
    contentState,
    blockStyleFn,
    ...elementProps
  } = otherProps;
  const combinedClassName = unionClassNames(theme.image, className);
  const { src, captions, description } = contentState
    .getEntity(block.getEntityAt(0))
    .getData();
  const { setShowUploadDialog } = React.useContext(EditorContext);

  return (
    <Tooltip style={{ cursor: "grab" }} title={description} placement="bottom">
      <video
        controls
        src={src}
        className="video"
        onContextMenu={(e) => {
          e.preventDefault();
          const menu = new Menu();
          menu.append(
            new MenuItem({
              label: "Edit Video",
              click() {
                setShowUploadDialog(
                  true,
                  DialogTypes.Video,
                  contentState.getEntity(block.getEntityAt(0)).getData()
                );
              },
            })
          );
          menu.popup({ window: remote.getCurrentWindow() });
        }}>
        {captions.map((c, i) => (
          <track key={i} label={c.lang} src={c.src} />
        ))}
      </video>
    </Tooltip>
  );
}
