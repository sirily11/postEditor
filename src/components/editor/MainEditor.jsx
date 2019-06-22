import React, { Component } from "react";
import Dropzone from "react-dropzone";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import { EditorContext } from "../model/editorContext";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";
import createImagePlugin from "./plugin/image";
import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";
import createFocusPlugin from "draft-js-focus-plugin";
import { t } from "@lingui/macro";
import { setupI18n } from "@lingui/core";
import { Fade } from "@material-ui/core";
import chinese from "../../locales/zh/messages";
import "draft-js/dist/Draft.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";

import { Redirect } from "react-router";
import CustomImageBlock from "./components/CustomImageBlock";

const inlineToolbarPlugin = createInlineToolbarPlugin();
const sideToolbarPlugin = createSideToolbarPlugin({
  position: "right"
});
const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const { InlineToolbar } = inlineToolbarPlugin;
const { SideToolbar } = sideToolbarPlugin;

const i18n = setupI18n({
  catalogs: {
    zh: chinese
  }
});

export default class MainEditor extends Component {
  componentWillMount() {
    this.props.initEditor(this.props._id, this.props.isLocal);
  }

  componentWillUnmount() {
    this.props.clear();
  }

  render() {
    return (
      <div className="mx-4 mb-1 main-editor h-100">
        <EditorContext.Consumer>
          {({
            editorState,
            onChange,
            onFocus,
            handleKeyCommand,
            isLoading,
            isRedirect
          }) => {
            if (isRedirect) {
              return <Redirect to="/home" />;
            }

            return (
              <Fade in={!isLoading} timeout={400}>
                <Dropzone
                  id="dropZone"
                  type="file"
                  accept="image/*"
                  onDrop={this.props.upload}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input
                        {...getInputProps()}
                        onClick={(e) => e.preventDefault()}
                      />
                      <Editor
                        editorState={editorState}
                        onChange={onChange}
                        onFocus={onFocus}
                        handleKeyCommand={handleKeyCommand}
                        autoCorrect="on"
                        autoCapitalize="on"
                        spellCheck={true}
                        blockRendererFn={this.myBlockRenderer}
                        placeholder={i18n._(t`Enter your post here`)}
                        plugins={[
                          inlineToolbarPlugin,
                          sideToolbarPlugin,
                          imagePlugin,
                          blockDndPlugin,
                          focusPlugin
                        ]}
                      />
                      <InlineToolbar />
                      <SideToolbar />
                    </div>
                  )}
                </Dropzone>
              </Fade>
            );
          }}
        </EditorContext.Consumer>
      </div>
    );
  }
}
