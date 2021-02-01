/** @format */

import decorateComponentWithProps from "decorate-component-with-props";
import InternalLinkComponent from "./internallink";
import linkStyles from "./internallink.css";

const defaultTheme = {
  internallink: linkStyles.internallink,
};

export default (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Internallink = InternalLinkComponent;
  if (config.decorator) {
    Internallink = config.decorator(Internallink);
  }
  const ThemedLink = decorateComponentWithProps(Internallink, { theme });
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === "internallink") {
          return {
            component: ThemedLink,
            editable: false,
          };
        }
        return null;
      }

      return null;
    },
  };
};
