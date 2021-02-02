/** @format */

import React, { ImgHTMLAttributes, ReactElement } from "react";
import { ContentBlock, ContentState, EditorState } from "draft-js";
import clsx from "clsx";
import { ImagePluginTheme } from ".";
import { ImageEditDialog } from "../../components/dialogs/ImageEditDialog";
import { DialogTypes, EditorContext } from "../../../model/editorContext";
import {
  GroupImage,
  GroupTypes,
} from "../../components/dialogs/UploadImageGroup";
import {
  Paper,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Card,
  CardContent,
  Slide,
  GridList,
  GridListTile,
  ListSubheader,
} from "@material-ui/core";

const { remote } = (window as any).require("electron");
const { Menu, MenuItem } = remote;

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  block: ContentBlock;
  className?: string;
  theme?: ImagePluginTheme;
  contentState: ContentState;

  //removed props
  blockStyleFn: unknown;
  blockProps: unknown;
  customStyleMap: unknown;
  customStyleFn: unknown;
  decorator: unknown;
  forceSelection: unknown;
  offsetKey: unknown;
  selection: unknown;
  tree: unknown;
  preventScroll: unknown;
  setEditorState(state: EditorState): void;
  editorState: EditorState;
}

export default function Image(props: ImageProps): ReactElement {
  const { block, className, theme = {}, setEditorState, ...otherProps } = props;
  // leveraging destructuring to omit certain properties from props
  const {
    blockProps, // eslint-disable-line @typescript-eslint/no-unused-vars
    customStyleMap, // eslint-disable-line @typescript-eslint/no-unused-vars
    customStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
    decorator, // eslint-disable-line @typescript-eslint/no-unused-vars
    forceSelection, // eslint-disable-line @typescript-eslint/no-unused-vars
    offsetKey, // eslint-disable-line @typescript-eslint/no-unused-vars
    selection, // eslint-disable-line @typescript-eslint/no-unused-vars
    tree, // eslint-disable-line @typescript-eslint/no-unused-vars
    blockStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
    preventScroll, // eslint-disable-line @typescript-eslint/no-unused-vars
    contentState,
    editorState,
    ...elementProps
  } = otherProps;
  const { setShowUploadDialog } = React.useContext(EditorContext);
  const [index, setIndex] = React.useState(0);

  const { id, images, type } = contentState
    .getEntity(block.getEntityAt(0))
    .getData() as GroupImage;

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        const menu = new Menu();
        menu.append(
          new MenuItem({
            label: "Edit Group Image",
            click() {
              setShowUploadDialog(
                true,
                DialogTypes.ImageGroup,
                contentState
                  .getEntity(block.getEntityAt(0))
                  .getData() as GroupImage
              );
            },
          })
        );

        menu.popup({ window: remote.getCurrentWindow() });
      }}>
      <GridList cellHeight={160} cols={3}>
        <GridListTile key="Subheader" cols={3} style={{ height: "auto" }}>
          <ListSubheader component="h3">{type}</ListSubheader>
        </GridListTile>
        {images.map((img, index) => (
          <GridListTile key={img.id} cols={index % 5 == 0 ? 2 : 1}>
            <CardMedia
              image={img.image}
              style={{ height: "100%", width: "100%" }}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
