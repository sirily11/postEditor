/** @format */

import React, {Component} from "react";
import Dropzone from "react-dropzone";
import Prism from "prismjs";
import Editor, {composeDecorators} from "draft-js-plugins-editor";
import {EditorContext} from "../model/editorContext";
import {convertToRaw, getDefaultKeyBinding, KeyBindingUtil} from "draft-js";
import {
    BlockquoteButton,
    BoldButton,
    CodeBlockButton,
    HeadlineOneButton,
    HeadlineThreeButton,
    HeadlineTwoButton,
    ItalicButton,
    OrderedListButton,
    UnderlineButton,
    UnorderedListButton,
} from "draft-js-buttons";

/// plugins
import { InlineToolbarPlugin}  from "./plugin/draft-js-inline-toolbar";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";
import createImagePlugin from "draft-js-image-plugin";
import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";
import createFocusPlugin from "draft-js-focus-plugin";
import createPrismPlugin from "draft-js-prism-plugin";
import createAlignmentPlugin from "draft-js-alignment-plugin";
import createResizeablePlugin from "draft-js-resizeable-plugin";
import {PickColorButton, ColorPickerPlugin} from './plugin/color_picker'
import createLinkPlugin from "./plugin/draft-js-anchor-plugin";
import createAudioPlugin from "./plugin/audio";
import {
    TextAlignPlugin,
    TextAlignCenterButton,
    TextAlignLeftButton,
    TextAlignRightButton
} from './plugin/text-align-plugin'

/// ends of plugins
import {t} from "@lingui/macro";
import {setupI18n} from "@lingui/core";
import {Fade} from "@material-ui/core";
import chinese from "../../locales/zh/messages";
// css
import "prismjs/themes/prism.css";
import "draft-js/dist/Draft.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import "draft-js-linkify-plugin/lib/plugin.css";

import {Redirect} from "react-router";

const inlineToolbar = new InlineToolbarPlugin({})

const audioPlugin = createAudioPlugin();
const linkPlugin = createLinkPlugin();
const resizeablePlugin = createResizeablePlugin();
const inlineToolbarPlugin = inlineToolbar.createPlugin();
const alignmentPlugin = createAlignmentPlugin();
const sideToolbarPlugin = createSideToolbarPlugin({
    position: "right",
});
const prismPlugin = createPrismPlugin({
    prism: Prism,
});
const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();
const colorPlugin = new ColorPickerPlugin().createPlugin();
const textAlignPlugin = new TextAlignPlugin().createPlugin();

const decorator = composeDecorators(
    focusPlugin.decorator,
    blockDndPlugin.decorator,
    alignmentPlugin.decorator,
    resizeablePlugin.decorator,
);
const imagePlugin = createImagePlugin({decorator});

const InlineToobar = inlineToolbar.InlineToolbar;
const {SideToolbar} = sideToolbarPlugin;
const {AlignmentTool} = alignmentPlugin;

const i18n = setupI18n({
    catalogs: {
        zh: chinese,
    },
});
export default class MainEditor extends Component {
    componentWillMount() {
        this.props.initEditor(this.props._id);
    }

    componentWillUnmount() {
        this.props.clear();
    }

    myKeyBindingFn(e) {
        const {hasCommandModifier} = KeyBindingUtil;
        if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
            return "save";
        }
        return getDefaultKeyBinding(e);
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
                          isRedirect,
                      }) => {
                        if (isRedirect) {
                            return <Redirect to="/home"/>;
                        }
                        return (
                            <Fade in={!isLoading} timeout={400}>
                                <Dropzone
                                    id="dropZone"
                                    type="file"
                                    accept="image/*"
                                    onDrop={this.props.upload}>
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps()}>
                                            <input
                                                {...getInputProps()}
                                                onClick={(e) => e.preventDefault()}
                                            />
                                            <Editor
                                                editorState={editorState}
                                                onChange={onChange}
                                                onFocus={onFocus}
                                                keyBindingFn={this.myKeyBindingFn}
                                                handleKeyCommand={handleKeyCommand}
                                                autoCorrect="on"
                                                autoCapitalize="on"
                                                spellCheck={true}
                                                readOnly={false}
                                                placeholder={i18n._(t`Enter your post here`)}
                                                plugins={[
                                                    inlineToolbarPlugin,
                                                    sideToolbarPlugin,
                                                    colorPlugin,
                                                    audioPlugin,
                                                    imagePlugin,
                                                    blockDndPlugin,
                                                    focusPlugin,
                                                    prismPlugin,
                                                    alignmentPlugin,
                                                    resizeablePlugin,
                                                    linkPlugin,
                                                    textAlignPlugin,
                                                ]}
                                            />
                                            <AlignmentTool/>
                                            <InlineToobar>
                                                {(externalProps) => {
                                                    return (
                                                        <React.Fragment>
                                                            <BoldButton {...externalProps} />
                                                            <ItalicButton {...externalProps} />
                                                            <UnderlineButton {...externalProps} />
                                                            <CodeBlockButton {...externalProps} />
                                                            <linkPlugin.LinkButton {...externalProps}/>
                                                            <TextAlignLeftButton {...externalProps} />
                                                            <TextAlignCenterButton {...externalProps} />
                                                            <TextAlignRightButton {...externalProps} />
                                                            <PickColorButton {...externalProps}/>
                                                        </React.Fragment>
                                                    );
                                                }}
                                            </InlineToobar>
                                            <SideToolbar>
                                                {(externalProps) => {
                                                    return (
                                                        <React.Fragment>
                                                            <HeadlineOneButton {...externalProps}/>
                                                            <HeadlineTwoButton {...externalProps}/>
                                                            <HeadlineThreeButton {...externalProps}/>
                                                            <BlockquoteButton {...externalProps}/>
                                                            <UnorderedListButton {...externalProps}/>
                                                            <OrderedListButton {...externalProps}/>
                                                            <CodeBlockButton {...externalProps} />
                                                        </React.Fragment>
                                                    );
                                                }}
                                            </SideToolbar>

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
