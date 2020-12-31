/** @format */

import React from "react";
import { AdditionalProps, BasePlugin, NotImplemented } from "../base-plugin";
import { EditorState } from "draft-js";
import createStore from "./utils/createStore";
import SuggestionPanel from "./components/SuggestionPanel/index";
import { defaultTheme } from "./components/SuggestionPanel/theme";

export class SettingSuggestionsPlugin extends BasePlugin {
  theme: any;
  store = createStore({
    isVisible: false,
  });

  constructor({ theme }: { theme?: any }) {
    super();
    this.theme = theme ?? defaultTheme;
  }

  Pannel = (props: any) => {
    return <SuggestionPanel {...props} store={this.store} theme={this.theme} />;
  };

  initialize = (
    additional?: AdditionalProps
  ): void | undefined | NotImplemented => {
    if (additional) {
      const { getEditorRef, getEditorState, setEditorState } = additional;
      this.store.updateItem("getEditorState", getEditorState);
      this.store.updateItem("setEditorState", setEditorState);
      this.store.updateItem("getEditorRef", getEditorRef);
    }
  };

  onChange = (
    e?: EditorState,
    additional?: AdditionalProps
  ): EditorState | NotImplemented | undefined => {
    if (e) {
      const contentState = e.getCurrentContent();
      const selectionState = e.getSelection();
      const currentBlock = contentState.getBlockForKey(
        selectionState.getAnchorKey()
      );

      if (selectionState.isCollapsed()) {
        let blockText = currentBlock.getText();
        let blockType = currentBlock.getType();

        if (blockType === "unstyled") {
          let matches = blockText.match(/@\S+/g);
          if (matches) {
            this.store.updateItem("selection", e.getSelection());
            this.store.updateItem("onOpen", true);
            this.store.updateItem("word", matches[0]);
          } else {
            this.store.updateItem("onOpen", false);
          }
        }
      }
      return e;
    }
  };
}
