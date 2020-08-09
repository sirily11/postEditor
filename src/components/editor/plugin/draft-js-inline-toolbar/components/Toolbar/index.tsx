/* eslint-disable react/no-array-index-key */
import React from 'react';
import {getVisibleSelectionRect} from 'draft-js';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
} from 'draft-js-buttons';


interface Props {
    store: any;
    className?: string;
    theme: any;
    children: any[]
}

export default class Toolbar extends React.Component<Props> {
    static defaultProps = {
        children: (externalProps: Props) => (
            // may be use React.Fragment instead of div to improve perfomance after React 16
            <div>
                {/**@ts-ignore  */}
                <ItalicButton {...externalProps} />
                {/**@ts-ignore  */}
                <BoldButton {...externalProps} />
                {/**@ts-ignore  */}
                <UnderlineButton {...externalProps} />
                {/**@ts-ignore  */}
                <CodeButton {...externalProps} />
            </div>
        ),
    };

    state = {
        isVisible: false,
        position: undefined,

        /**
         * If this is set, the toolbar will render this instead of the children
         * prop and will also be shown when the editor loses focus.
         * @type {Component}
         */
        overrideContent: undefined,
    };
    private toolbar?: any;

    UNSAFE_componentWillMount() {
        this.props.store.subscribeToItem('selection', this.onSelectionChanged);
    }

    componentWillUnmount() {
        this.props.store.unsubscribeFromItem('selection', this.onSelectionChanged);
    }

    /**
     * This can be called by a child in order to render custom content instead
     * of the children prop. It's the responsibility of the callee to call
     * this function again with `undefined` in order to reset `overrideContent`.
     * @param {Component} overrideContent
     */
    onOverrideContent = (overrideContent: any) => {
        this.setState({overrideContent});
    };

    onSelectionChanged = () => {
        // need to wait a tick for window.getSelection() to be accurate
        // when focusing editor with already present selection
        setTimeout(() => {
            if (!this.toolbar) return;

            // The editor root should be two levels above the node from
            // `getEditorRef`. In case this changes in the future, we
            // attempt to find the node dynamically by traversing upwards.
            const editorRef = this.props.store.getItem('getEditorRef')();
            if (!editorRef) return;

            // This keeps backwards compatibility with React 15
            let editorRoot =
                editorRef.refs && editorRef.refs.editor
                    ? editorRef.refs.editor
                    : editorRef.editor;
            while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
                editorRoot = editorRoot.parentNode;
            }
            const editorRootRect = editorRoot.getBoundingClientRect();

            const selectionRect = getVisibleSelectionRect(window);
            if (!selectionRect) return;

            // The toolbar shouldn't be positioned directly on top of the selected text,
            // but rather with a small offset so the caret doesn't overlap with the text.
            const extraTopOffset = -5;
            const extraLeftOffset = 10;
            // number of toolbar items
            let length = 0;
            try {
                //@ts-ignore
                length = this.props.children().props.children.length
            } catch (e) {

            }
            const position = {
                top:
                    editorRoot.offsetTop -
                    this.toolbar.offsetHeight +
                    (selectionRect.top - editorRootRect.top) +
                    extraTopOffset,
                left:
                    editorRoot.offsetLeft +
                    (selectionRect.left - editorRootRect.left) +
                    selectionRect.width / 2,
            };

            // if the left toolbar show too close to the left edge,
            // move it to the right
            let width = length * 36 / 2
            if (position.left - width <= 0) {
                position.left = width + extraLeftOffset
            }

            if(position.left + width * 2 > window.innerWidth - 30){
                position.left = window.innerWidth - extraLeftOffset - width * 2
            }

            // console.info("position", position)
            // console.info("window", window.innerWidth)
            // console.info("width", width)
            this.setState({position});
        });
    };

    getStyle() {
        const {store} = this.props;
        const {overrideContent, position} = this.state;
        const selection = store
            .getItem('getEditorState')()
            .getSelection();
        // overrideContent could for example contain a text input, hence we always show overrideContent
        // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
        const isVisible: boolean =
            (!selection.isCollapsed() && selection.getHasFocus()) || overrideContent;
        //@ts-ignore
        const style: any = {...position};
        if (isVisible) {
            style.visibility = 'visible';
            style.transform = 'translate(-50%) scale(1)';
            style.transition = 'transform 0.15s cubic-bezier(.3,1.2,.2,1)';
        } else {
            style.transform = 'translate(-50%) scale(0)';
            style.visibility = 'hidden';
        }

        return style;
    }

    handleToolbarRef = (node: any) => {
        this.toolbar = node;
    };

    render() {
        const {theme, store} = this.props;
        const {overrideContent: OverrideContent} = this.state;
        const childrenProps = {
            theme: theme.buttonStyles,
            getEditorState: store.getItem('getEditorState'),
            setEditorState: store.getItem('setEditorState'),
            onOverrideContent: this.onOverrideContent,
        };

        return (
            <div
                className={theme.toolbarStyles.toolbar}
                style={this.getStyle()}
                ref={this.handleToolbarRef}
            >
                {OverrideContent ? (
                    //@ts-ignore
                    <OverrideContent {...childrenProps} />
                ) : (
                    //@ts-ignore
                    this.props.children(childrenProps)
                )}
            </div>
        );
    }
}