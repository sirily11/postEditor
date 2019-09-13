import {
  EditorState,
  RichUtils,
  DraftEditorCommand,
  convertToRaw,
  convertFromRaw,
  genKey,
  ContentBlock
} from "draft-js";
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { t, Trans } from "@lingui/macro";
import { setupI18n, number } from "@lingui/core";
import { draftToMarkdown } from "../editor/plugin/markdown-draft-js";
import chinese from "../../locales/zh/messages";
import axios, { AxiosResponse } from "axios";
import { getURL } from "../setting/settings";
import markdownToDraft from "../editor/plugin/markdown-draft-js/markdown-to-draft";
import { Post, Category } from "./interfaces";
import { IpcRenderer, NativeImage } from "electron";
import { insertImageBlock } from "./utils/insertImageBlock";
import {
  computeDownloadProgress,
  computeUploadProgress,
  dataURItoBlob
} from "./utils/uploadUtils";

const fs = (window as any).require("fs");
const electron = (window as any).require("electron");
const nativeImage = electron.nativeImage;

const i18n = setupI18n({
  catalogs: {
    zh: chinese
  }
});

export interface Action {
  text: string;
  icon: JSX.Element;
  action: any;
  disabled?: any;
}

interface MainEditorState {
  // Indicate if the post is loading
  isLoading: boolean;
  //Progress
  progress?: number;
  // will back to the homepage
  isRedirect: boolean;
  snackBarMessage: string;
  // post
  post: Post;
  // editor's state
  editorState: EditorState;
  // number of changes to indicate whether to do the auto save
  handleKeyCommand: any;
  // side bar actions
  actions: Action[];
  onChange: any;
  onFocus: any;
  setTitle: any;
  selected: string[];
  hideMessage: any;
  clear(): void;
  create(): Promise<boolean>;
  initEditor(_id: string, isLocal: boolean): void;
  setCover(cover: string): void;
  setCategory(category: Category): void;
  insertImage(imagePath: string): void;
}

interface MainEditorProps {}

export class MainEditorProvider extends React.Component<
  MainEditorProps,
  MainEditorState
> {
  constructor(props: MainEditorProps) {
    super(props);
    this.state = {
      progress: 0,
      isRedirect: false,
      isLoading: false,
      post: {
        title: "New Post",
        content: "New Post"
      },
      snackBarMessage: "",
      selected: [],
      editorState: EditorState.createEmpty(),
      actions: this.actions,
      onChange: this.onChange,
      onFocus: this.onFocus,
      setTitle: this.setTitle,
      setCategory: this.setCategory,
      initEditor: this.initEditor,
      hideMessage: this.hideMessage,
      handleKeyCommand: this.handleKeyCommand,
      insertImage: this.insertImage,
      clear: this.clear,
      setCover: this.setCover,
      create: this.create
    };
  }

  actions: Action[] = [
    {
      text: i18n._(t`Save`),
      icon: <SaveAltIcon />,
      action: async () => {
        await this.save();
      }
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
    },
    {
      text: "Divider 3",
      icon: <div />,
      action: async () => {}
    },
    {
      text: i18n._(t`Delete from cloud`),
      icon: <CloudOffIcon />,
      action: async () => {
        await this.deleteFromCloud();
      }
    }
  ];

  clear = () => {
    this.setState({
      isRedirect: false,
      post: {
        title: "",
        content: "",
        post_category: undefined
      },
      editorState: EditorState.createEmpty()
    });
  };

  insertImage = async (imagePath: string) => {
    let newEditorState = await insertImageBlock(
      imagePath,
      this.state.editorState
    );
    this.setState({ editorState: newEditorState });
  };

  initEditor = async (id: string | undefined) => {
    if (!id) return;
    this.setState({ isLoading: true });
    // get data from internet
    let response = await axios.get<Post>(getURL("post/" + id), {
      onDownloadProgress: (ProgressEvent) => {
        computeDownloadProgress(ProgressEvent, (progress: number) =>
          this.setState({ progress })
        );
      }
    });
    let postData = response.data;

    if (postData) {
      let raw = markdownToDraft(postData.content);
      let editorState = EditorState.createWithContent(convertFromRaw(raw));
      let imageURL = postData.image_url ? postData.image_url : "";
      this.setState({
        isLoading: false,
        progress: 0,
        post: postData,
        editorState: editorState
      });
    }
  };

  setCategory = async (category: Category) => {
    let post = this.state.post;
    let token = localStorage.getItem("access");
    let url = getURL(`post/${post.id}/`);
    let result = await axios.patch<Post>(
      url,
      { category: category.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    this.setState({ post: result.data });
  };

  /**
   * Set post cover
   */
  setCover = async (cover: string) => {
    let post = this.state.post;
    let url = getURL(`post/${post.id}/`);
    let token = localStorage.getItem("access");
    let form = new FormData();
    const image: NativeImage = nativeImage.createFromPath(cover);
    const dataURL = image.toDataURL();
    form.append("image_url", dataURItoBlob(dataURL), "cover.jpg");

    let result = await axios.patch<Post>(url, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    this.setState({ post: result.data });
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
  onChange = async (editorState: EditorState) => {
    const style = editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.toggle("Bold", isBold);
    this.setState({
      editorState: editorState
    });
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

  private async deleteFromCloud() {
    try {
      let token = localStorage.getItem("access");
      let post = this.preparePost();

      let url = getURL("post/" + post.id);
      axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      this.setState({ isRedirect: true });
    } catch (err) {}
  }

  /**
   * Convert raw data to markdown and then
   * set the markdown to the post content
   */
  private preparePost() {
    // get post from content state
    let editorState = this.state.editorState;
    // convert content state to markdown
    let raw = convertToRaw(editorState.getCurrentContent());
    let content = draftToMarkdown(raw, undefined);

    let post = this.state.post;
    return {
      id: post.id,
      title: post.title === "" ? "New Post" : post.title,
      content: content === "" ? "New Post" : content,
      category: post.post_category && post.post_category.id
    };
  }

  create = async (): Promise<boolean> => {
    try {
      let token = localStorage.getItem("access");
      let url = getURL("post/");
      let data = this.preparePost();
      delete data.id;
      console.log(data);
      let result = await axios.post<Post>(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (result.status === 201) {
        this.setState({ post: result.data });
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    return false;
  };

  /**
   * Save the post to the cloud
   */
  private async save() {
    try {
      this.setState({ isLoading: true, progress: 0 });
      let token = localStorage.getItem("access");
      let data = this.preparePost();
      console.log(data);

      let url = getURL(`post/${data.id}/`);
      let response = await axios.patch<Post>(url, data, {
        onUploadProgress: (evt) => {
          computeUploadProgress(evt, (progress: number) => {
            this.setState({ progress });
          });
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      this.showMessage("Updated");
    } catch (err) {
      this.showMessage(err.toString());
    } finally {
      this.setState({ isLoading: false, progress: 0 });
    }
  }

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
  isRedirect: false,
  isLoading: false,
  snackBarMessage: "",
  post: {
    title: "",
    content: ""
  },
  editorState: EditorState.createEmpty(),
  onChange: () => {},
  handleKeyCommand: () => {},
  onFocus: () => {},
  setTitle: (newTitle: string) => {},
  hideMessage: () => {},
  setCover: (cover: string) => {},
  initEditor: (id, isLocal) => {},
  setCategory: (category: Category) => {},
  clear: () => {},
  insertImage: () => {},
  create: () => {
    return Promise.resolve(false);
  },
  actions: [],
  selected: []
};

export const EditorContext = React.createContext(context);
