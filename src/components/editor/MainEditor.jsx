import React, { Component } from "react";
import Editor from "draft-js-plugins-editor";
import { EditorContext } from "../model/editorContext";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";
import { t } from "@lingui/macro";
import { setupI18n } from "@lingui/core";
import chinese from "../../locales/zh/messages";

import "draft-js/dist/Draft.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";

const inlineToolbarPlugin = createInlineToolbarPlugin();
const sideToolbarPlugin = createSideToolbarPlugin({
  position: "right"
});
const { InlineToolbar } = inlineToolbarPlugin;
const { SideToolbar } = sideToolbarPlugin;

const i18n = setupI18n({
  language: "zh",
  catalogs: {
    zh: chinese
  }
});

export default class MainEditor extends Component {
  render() {
    return (
      <div className="mx-4 mb-1 main-editor">
        <EditorContext.Consumer>
          {({ editorState, onChange, onFocus, handleKeyCommand }) => (
            <div>
              <Editor
                editorState={editorState}
                onChange={onChange}
                onFocus={onFocus}
                handleKeyCommand={handleKeyCommand}
                autoCorrect="on"
                autoCapitalize="on"
                spellCheck={true}
                placeholder={i18n._(t`Enter your post here`)} 
                plugins={[inlineToolbarPlugin, sideToolbarPlugin]}
              />
              <InlineToolbar />
              <SideToolbar />
            </div>
          )}
        </EditorContext.Consumer>
      </div>
    );
  }
}
