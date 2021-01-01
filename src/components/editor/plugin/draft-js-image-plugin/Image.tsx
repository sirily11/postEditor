/** @format */

import React, { ImgHTMLAttributes, ReactElement } from "react";
import { ContentBlock, ContentState } from "draft-js";
import clsx from "clsx";
import { ImagePluginTheme } from ".";
import { ImageEditDialog } from "./ImageEditDialog";
import { EditorContext } from "../../../model/editorContext";
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
}

export default function Image(props: ImageProps): ReactElement {
  const { block, className, theme = {}, ...otherProps } = props;
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
    ...elementProps
  } = otherProps;
  const combinedClassName = clsx(theme.image, className);
  const {
    showEditImageDialog,
    setShowImageEditDialog,
    selectedImageData,
  } = React.useContext(EditorContext);

  const { src, id, description } = contentState
    .getEntity(block.getEntityAt(0))
    .getData();

  return (
    <div
      {...elementProps}
      onContextMenu={(e) => {
        e.preventDefault();
        const menu = new Menu();
        menu.append(
          new MenuItem({
            label: "Edit Image",
            click() {
              setShowImageEditDialog(true, {
                src: src,
                id: id,
                description: description,
              });
            },
          })
        );
        menu.popup({ window: remote.getCurrentWindow() });
      }}>
      <img src={src} role="presentation" />
      <div style={{ display: "flex" }}>
        <figcaption style={{ marginLeft: "auto", marginRight: "auto" }}>
          {description}
        </figcaption>
      </div>
    </div>
  );
}
