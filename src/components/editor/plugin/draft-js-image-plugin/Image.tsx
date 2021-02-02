/** @format */

import React, { ImgHTMLAttributes, ReactElement } from "react";
import { ContentBlock, ContentState, EditorState } from "draft-js";
import clsx from "clsx";
import { ImagePluginTheme } from ".";
import { ImageEditDialog } from "../../components/dialogs/ImageEditDialog";
import { DialogTypes, EditorContext } from "../../../model/editorContext";
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

  const { src, id, description } = contentState
    .getEntity(block.getEntityAt(0))
    .getData();

  return (
    <div {...elementProps}>
      <img
        src={src}
        onContextMenu={(e) => {
          e.preventDefault();
          const menu = new Menu();
          menu.append(
            new MenuItem({
              label: "Edit Image",
              click() {
                setShowUploadDialog(true, DialogTypes.Image, {
                  src: src,
                  id: id,
                  description: description,
                });
              },
            })
          );

          menu.append(
            new MenuItem({
              label: "Full Width",
              click() {
                const entityKey = block.getEntityAt(0);
                if (entityKey) {
                  contentState.mergeEntityData(entityKey, { width: "100" });
                  setEditorState(
                    EditorState.forceSelection(
                      editorState,
                      editorState.getSelection()
                    )
                  );
                }
              },
            })
          );

          menu.append(
            new MenuItem({
              label: "Default Size",
              click() {
                const entityKey = block.getEntityAt(0);
                if (entityKey) {
                  contentState.mergeEntityData(entityKey, { width: "75" });
                  setEditorState(
                    EditorState.forceSelection(
                      editorState,
                      editorState.getSelection()
                    )
                  );
                }
              },
            })
          );

          menu.append(
            new MenuItem({
              label: "Align Left",
              click() {
                const entityKey = block.getEntityAt(0);
                if (entityKey) {
                  contentState.mergeEntityData(entityKey, {
                    alignment: "left",
                  });
                  setEditorState(
                    EditorState.forceSelection(
                      editorState,
                      editorState.getSelection()
                    )
                  );
                }
              },
            })
          );

          menu.append(
            new MenuItem({
              label: "Align Center",
              click() {
                const entityKey = block.getEntityAt(0);
                if (entityKey) {
                  contentState.mergeEntityData(entityKey, {
                    alignment: "center",
                  });
                  setEditorState(
                    EditorState.forceSelection(
                      editorState,
                      editorState.getSelection()
                    )
                  );
                }
              },
            })
          );

          menu.append(
            new MenuItem({
              label: "Align Right",
              click() {
                const entityKey = block.getEntityAt(0);
                if (entityKey) {
                  contentState.mergeEntityData(entityKey, {
                    alignment: "right",
                  });
                  setEditorState(
                    EditorState.forceSelection(
                      editorState,
                      editorState.getSelection()
                    )
                  );
                }
              },
            })
          );
          menu.popup({ window: remote.getCurrentWindow() });
        }}
      />
      <div style={{ display: "flex" }}>
        <figcaption style={{ marginLeft: "auto", marginRight: "auto" }}>
          {description}
        </figcaption>
      </div>
    </div>
  );
}
