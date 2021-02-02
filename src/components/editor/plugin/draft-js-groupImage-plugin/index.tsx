/** @format */

import React, { ComponentType, ReactElement } from "react";
import ImageComponent, { ImageProps } from "./Image";
import { EditorPlugin } from "draft-js-plugins-editor";

export interface ImagePluginTheme {
  image?: string;
}

const defaultTheme: ImagePluginTheme = {};

export interface ImagePluginConfig {
  decorator?(component: ComponentType<ImageProps>): ComponentType<ImageProps>;
  theme?: ImagePluginTheme;
  imageComponent?: ComponentType<ImageProps>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ImageEditorPlugin = EditorPlugin & {};

export default (config: ImagePluginConfig = {}): ImageEditorPlugin => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Image = config.imageComponent || ImageComponent;
  if (config.decorator) {
    Image = config.decorator(Image);
  }

  return {
    blockRendererFn: (block, { getEditorState, setEditorState }) => {
      if (block.getType() === "atomic") {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === "groupimage") {
          const ThemedImage = (props: ImageProps): ReactElement => (
            <Image
              {...props}
              theme={theme}
              setEditorState={setEditorState}
              contentState={contentState}
              editorState={getEditorState()}
            />
          );
          return {
            component: ThemedImage,
            editable: false,
          };
        }
        return null;
      }

      return null;
    },
  };
};

export const Image = ImageComponent;
