import {
  EditorState,
  RichUtils,
  DraftEditorCommand,
  convertToRaw,
  convertFromRaw
} from "draft-js";
import React from "react";
import ListIcon from "@material-ui/icons/List";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { t, Trans } from "@lingui/macro";
import { setupI18n } from "@lingui/core";
import { draftToMarkdown } from "../editor/plugin/markdown-draft-js";
import chinese from "../../locales/zh/messages";
import { insertPost, getLocalPost, updatePost } from "./localDB";
import axios from "axios";
import { getURL } from "../setting/settings";
import markdownToDraft from "../editor/plugin/markdown-draft-js/markdown-to-draft";
import { Post } from "./interfaces";

const i18n = setupI18n({
  language: "zh",
  catalogs: {
    zh: chinese
  }
});

export interface Action {
  text: string;
  icon: JSX.Element;
  action: any;
}

interface MainEditorState {
  isLoading: boolean;
  snackBarMessage: string;
  post: Post;
  editorState: EditorState;
  handleKeyCommand: any;
  actions: Action[];
  onChange: any;
  onFocus: any;
  setTitle: any;
  selected: string[];
  hideMessage: any;
  initEditor(_id: string, isLocal: boolean): void;
  getCover(): string | null;
  setCover(cover: File): void;
  setCategory(category: number, categoryName: string): void;
}

interface MainEditorProps {}

export class MainEditorProvider extends React.Component<
  MainEditorProps,
  MainEditorState
> {
  constructor(props: MainEditorProps) {
    super(props);
    this.state = {
      isLoading: false,
      post: {
        title: "",
        content: "",
        category: -1,
        isLocal: false
      },
      snackBarMessage: "",
      selected: [],
      editorState: EditorState.createEmpty(),
      actions: this.actions,
      onChange: this.onChange,
      onFocus: this.onFocus,
      setTitle: this.setTitle,
      setCover: this.setCover,
      getCover: this.getCover,
      setCategory: this.setCategory,
      initEditor: this.initEditor,
      hideMessage: this.hideMessage,
      handleKeyCommand: this.handleKeyCommand
    };
  }

  actions: Action[] = [
    {
      text: i18n._(t`Save`),
      icon: <SaveIcon />,
      action: async () => {
        try {
          let editorState = this.state.editorState;
          let raw = convertToRaw(editorState.getCurrentContent());
          let content = draftToMarkdown(raw, undefined);
          let post = this.state.post;
          post.content = content;

          if (this.state.post) {
            await updatePost(post);
          } else {
            await insertPost(1, post);
          }
          this.showMessage("Post has been Saved");
        } catch (err) {
          this.showMessage(err.toString());
        }
      }
    },
    {
      text: i18n._(t`Save to local`),
      icon: <SaveAltIcon />,
      action: () => {}
    },
    {
      text: "Divider 1",
      icon: <div />,
      action: () => {}
    },

    {
      text: "Header 1",
      icon: <div>H1</div>,
      action: () => {}
    },
    {
      text: "Header 2",
      icon: <div>H2</div>,
      action: () => {}
    },
    {
      text: "Header 3",
      icon: <div>H3</div>,
      action: () => {}
    },
    {
      text: "Divider 2",
      icon: <div />,
      action: () => {}
    },
    {
      text: "Bold",
      icon: <div>B</div>,
      action: () => {
        let newState = RichUtils.toggleInlineStyle(
          this.state.editorState,
          "BOLD"
        );
        this.setState({ editorState: newState });
      }
    }
  ];

  initEditor = async (_id: string | undefined, isLocal: boolean) => {
    let postData: Post | undefined;
    if (!_id) return;
    this.setState({ isLoading: true });
    if (isLocal) {
      postData = await getLocalPost(_id);
    } else {
      let response = await axios.get(getURL("get/post/" + _id));
      postData = response.data;
    }
    if (postData) {
      let raw = markdownToDraft(postData.content);
      let editorState = EditorState.createWithContent(convertFromRaw(raw));
      postData._id = _id;
      postData.isLocal = isLocal;
      this.setState({
        isLoading: false,
        post: postData,
        editorState: editorState
      });
    }
  };

  /**
   * Get post cover
   */
  getCover = (): string | null => {
    let post = this.state.post;
    let reader = new FileReader();
    if (post.cover) {
      reader.readAsDataURL(post.cover);
      reader.onloadend = () => {
        let imageFile = reader.result;
        return imageFile;
      };
    }
    return null;
  };

  setCategory = (category: number, categoryName: string) => {
    console.log("Set category", category);
    let post = this.state.post;
    post.category = category;
    post.category_name = categoryName;
    this.setState({ post });
  };

  /**
   * Set post cover
   */
  setCover = (cover: File) => {
    console.log("Set Cover", cover);
    let post = this.state.post;
    post.cover = cover;
    this.setState({ post });
  };

  /**
   * Show snackbar and display message
   * @param message Message content
   */
  showMessage = (message: string) =>
    this.setState({ snackBarMessage: message });

  // Hide sanckbar and clear the message state
  hideMessage = () => this.setState({ snackBarMessage: "" });

  /**
   * This function will be called when user
   * enter content inside the editor
   * @param editorState Editor state produced by draft js
   */
  onChange = (editorState: EditorState) => {
    const style = editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.toggle("Bold", isBold);
    this.setState({ editorState });
  };

  /**
   * This function will be called when user click
   * on the text inside the editor.
   * This will change the look of the side bar
   */
  onFocus = () => {
    const style = this.state.editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.toggle("Bold", isBold);
  };

  /**
   * Set the title for the post
   */
  setTitle = (newTitle: string) => {
    let post = this.state.post;
    post.title = newTitle;
    this.setState({ post });
  };

  /**
   * Toggole the side bar to match the inline style
   */
  toggle = (name: string, status: boolean) => {
    let selected = this.state.selected;
    if (status) {
      if (!selected.includes(name)) {
        selected.push(name);
      }
    } else {
      let index = selected.indexOf(name);
      if (index > -1) {
        selected.splice(index, 1);
      }
    }
    this.setState({ selected: selected });
  };

  handleKeyCommand(
    command: DraftEditorCommand,
    editorState: EditorState
  ): string {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  render() {
    return (
      <EditorContext.Provider value={this.state}>
        {this.props.children}
      </EditorContext.Provider>
    );
  }
}

const context: MainEditorState = {
  isLoading: false,
  snackBarMessage: "",
  post: {
    title: "",
    isLocal: false,
    content: "",
    category: -1
  },
  editorState: EditorState.createEmpty(),
  onChange: () => {},
  handleKeyCommand: () => {},
  onFocus: () => {},
  setTitle: (newTitle: string) => {},
  hideMessage: () => {},
  setCover: (cover: File) => {},
  getCover: (): string | null => {
    return null;
  },
  initEditor: (id, isLocal) => {},
  setCategory: (category: number, categoryName: string) => {},
  actions: [],
  selected: []
};

export const EditorContext = React.createContext(context);
