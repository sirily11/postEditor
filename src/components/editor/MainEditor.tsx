import React, { Component } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import { EditorContext } from "../model/editorContext";

interface Props {}

export default class MainEditor extends Component {
  render() {
    return (
      <div className="mx-4 mb-1" style={{}}>
        <EditorContext.Consumer>
          {({ editorState, onChange,onFocus, handleKeyCommand }) => (
            <Editor
              editorState={editorState}
              onChange={onChange}
              onFocus={onFocus}
              handleKeyCommand={handleKeyCommand}
              autoCorrect="on"
              autoCapitalize="on"
              spellCheck={true}
              placeholder="Enter your post here"
            />
          )}
        </EditorContext.Consumer>
      </div>
    );
  }
}
