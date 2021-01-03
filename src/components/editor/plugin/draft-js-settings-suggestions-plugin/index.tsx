/** @format */

import React from "react";
import { AdditionalProps, BasePlugin, NotImplemented } from "../base-plugin";
import { DraftHandleValue, EditorState, getDefaultKeyBinding } from "draft-js";
import createStore from "./utils/createStore";
import SuggestionPanel from "./components/SuggestionPanel/index";
import { defaultTheme } from "./components/SuggestionPanel/theme";
import {
  SyntheticKeyboardEvent,
  EditorCommand,
} from "../base-plugin/interfaces";

export class SettingSuggestionsPlugin extends BasePlugin {
  isOpen = false;
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

  keyBindingFn = (
    e?: SyntheticKeyboardEvent,
    additional?: AdditionalProps
  ): EditorCommand | null | NotImplemented | undefined => {
    if (this.isOpen) {
      if (e?.keyCode === 40) {
        e.preventDefault();
        this.store.updateItem("command", "down");
        // console.log("keyboard", e?.keyCode);
      } else if (e?.keyCode === 38) {
        e.preventDefault();
        this.store.updateItem("command", "up");
      }
    }
    if (e) {
      return getDefaultKeyBinding(e);
    }
    return null;
  };

  handleReturn = (
    e?: SyntheticKeyboardEvent,
    editorState?: EditorState,
    additional?: AdditionalProps
  ): DraftHandleValue | NotImplemented | undefined => {
    if (this.isOpen) {
      this.store.updateItem("command", "enter");
      return "handled";
    }
    return "not-handled";
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

        if (blockType !== "POST-SETTINGS") {
          let matches = blockText.match(/@\S+/g);

          if (matches) {
            this.store.updateItem("blockKey", currentBlock.getKey());
            this.store.updateItem("selection", e.getSelection());
            this.store.updateItem("onOpen", true);
            this.store.updateItem("word", matches[0]);
            this.isOpen = true;
          } else {
            this.store.updateItem("onOpen", false);
            this.isOpen = false;
          }
        }
      }
      return e;
    }
  };
}
