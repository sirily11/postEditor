/**
 * /* eslint-disable react/no-array-index-key
 *
 * @format
 */

import React from "react";
import { getVisibleSelectionRect } from "draft-js";
import SuggestionsContent from "./SuggestionsContent";
import { v4 as uuidv4, v4 } from "uuid";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
} from "draft-js-buttons";

interface Props {
  store: any;
  className?: string;
  theme: any;
  children: any[];
}

export default class SuggestionPanel extends React.Component<Props> {
  state = {
    isVisible: false,
    position: undefined,
    command: {},
    /**
     * If this is set, the toolbar will render this instead of the children
     * prop and will also be shown when the editor loses focus.
     * @type {Component}
     */
    overrideContent: undefined,
  };
  private toolbar?: any;

  UNSAFE_componentWillMount() {
    this.props.store.subscribeToItem("selection", this.onSelectionChanged);
    this.props.store.subscribeToItem("onOpen", this.onOpen);
    this.props.store.subscribeToItem("command", this.handleCommand);
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem("selection", this.onSelectionChanged);
    this.props.store.unsubscribeFromItem("onOpen", this.onOpen);
    this.props.store.unsubscribeFromItem("command", this.handleCommand);
  }

  handleCommand = () => {
    const command = this.props.store.getItem("command");
    this.setState({ command: { id: v4(), command: command } });
  };

  onOpen = () => {
    const isOpen = this.props.store.getItem("onOpen");
    this.setState({ isVisible: isOpen });
  };

  onSelectionChanged = () => {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(() => {
      if (!this.toolbar) return;

      // The editor root should be two levels above the node from
      // `getEditorRef`. In case this changes in the future, we
      // attempt to find the node dynamically by traversing upwards.
      const editorRef = this.props.store.getItem("getEditorRef")();
      if (!editorRef) return;

      // This keeps backwards compatibility with React 15
      let editorRoot =
        editorRef.refs && editorRef.refs.editor
          ? editorRef.refs.editor
          : editorRef.editor;
      while (editorRoot.className.indexOf("DraftEditor-root") === -1) {
        editorRoot = editorRoot.parentNode;
      }
      const editorRootRect = editorRoot.getBoundingClientRect();

      const selectionRect = getVisibleSelectionRect(window);
      if (!selectionRect) return;

      // The toolbar shouldn't be positioned directly on top of the selected text,
      // but rather with a small offset so the caret doesn't overlap with the text.
      const extraTopOffset = 40;
      const extraLeftOffset = 100;
      // number of toolbar items
      let length = 0;
      try {
        //@ts-ignore
        length = this.props.children().props.children.length;
      } catch (e) {
        console.error(e);
      }
      const position = {
        top:
          editorRoot.offsetTop + (selectionRect.top - editorRootRect.top) + 30,

        left:
          editorRoot.offsetLeft +
          (selectionRect.left - editorRootRect.left) +
          selectionRect.width,
      };

      // if the left toolbar show too close to the left edge,
      // move it to the right
      const width = (length * 36) / 2;
      if (position.left - width <= 0) {
        position.left = width + extraLeftOffset;
      }

      if (position.left + width * 2 > window.innerWidth - 30) {
        position.left = window.innerWidth - extraLeftOffset - width * 2;
      }

      // console.info("position", position);
      // console.info("window", window.innerWidth)
      // console.info("width", width)
      this.setState({ position });
    });
  };

  getStyle() {
    const { store } = this.props;
    const { overrideContent, position, isVisible } = this.state;
    const selection = store.getItem("getEditorState")().getSelection();
    // overrideContent could for example contain a text input, hence we always show overrideContent
    // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
    //@ts-ignore
    const style: any = { ...position };
    if (isVisible) {
      style.visibility = "visible";
      style.transform = "translate(-50%) scale(1)";
      style.transition = "transform 0.15s cubic-bezier(.3,1.2,.2,1)";
    } else {
      style.transform = "translate(-50%) scale(0)";
      style.visibility = "hidden";
    }
    // console.log(style);
    return style;
  }

  handleToolbarRef = (node: any) => {
    this.toolbar = node;
  };

  render() {
    const { theme, store } = this.props;
    const { command } = this.state;

    const word = store.getItem("word");
    const blockKey = store.getItem("blockKey");

    return (
      <div
        className={theme.toolbarStyles.toolbar}
        style={this.getStyle()}
        ref={this.handleToolbarRef}>
        <SuggestionsContent
          word={word}
          blockKey={blockKey}
          getEditorState={store.getItem("getEditorState")}
          setEditorState={store.getItem("setEditorState")}
          //@ts-ignore
          command={command}
        />
      </div>
    );
  }
}
