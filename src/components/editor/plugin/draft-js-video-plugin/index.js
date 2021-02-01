/** @format */

import decorateComponentWithProps from "decorate-component-with-props";
import VideoComponent from "./video";
import imageStyles from "./videoStyles.css";

const defaultTheme = {
  image: imageStyles.image,
};

export default (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Video = VideoComponent;
  if (config.decorator) {
    Video = config.decorator(Video);
  }
  const ThemedVideo = decorateComponentWithProps(Video, { theme });
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === "video") {
          return {
            component: ThemedVideo,
            editable: false,
          };
        }
        return null;
      }

      return null;
    },
  };
};
