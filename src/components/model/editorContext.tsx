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
import {
  insertPost,
  getLocalPost,
  updatePost,
  deletePost
} from "./utils/localDB";
import axios, { AxiosResponse } from "axios";
import { getURL } from "../setting/settings";
import markdownToDraft from "../editor/plugin/markdown-draft-js/markdown-to-draft";
import { Post } from "./interfaces";
import { IpcRenderer } from "electron";
import { url } from "inspector";
import { insertImageBlock } from "./utils/insertImageBlock";

const fs = (window as any).require("fs");
const electron = (window as any).require("electron");
const ipc: IpcRenderer = electron.ipcRenderer;

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
  isLoading: boolean;
  isRedirect: boolean;
  snackBarMessage: string;
  post: Post;
  editorState: EditorState;
  numberOfChanges: number;
  handleKeyCommand: any;
  actions: Action[];
  previewCover: string;
  onChange: any;
  onFocus: any;
  setTitle: any;
  selected: string[];
  hideMessage: any;
  clear(): void;
  initEditor(_id: string, isLocal: boolean): void;
  setCover(cover: File): void;
  setCategory(category: number, categoryName: string): void;
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
      isRedirect: false,
      isLoading: false,
      numberOfChanges: 0,
      post: {
        title: "",
        content: "",
        category: -1,
        isLocal: true
      },
      previewCover: "",
      snackBarMessage: "",
      selected: [],
      editorState: EditorState.createEmpty(),
      actions: this.actions,
      onChange: this.onChange,
      onFocus: this.onFocus,
      setTitle: this.setTitle,
      setCover: this.setCover,
      setCategory: this.setCategory,
      initEditor: this.initEditor,
      hideMessage: this.hideMessage,
      handleKeyCommand: this.handleKeyCommand,
      insertImage: this.insertImage,
      clear: this.clear
    };
  }

  actions: Action[] = [
    {
      text: i18n._(t`Save`),
      icon: <SaveIcon />,
      action: async () => {
        await this.save();
      }
    },
    {
      text: i18n._(t`Publish`),
      icon: <CloudUploadIcon />,
      action: async () => {
        await this.send();
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
    },
    {
      text: "Divider 3",
      icon: <div />,
      action: async () => {}
    },
    {
      text: i18n._(t`Delete`),
      icon: <DeleteIcon />,
      action: async () => {
        await this.delete();
      }
    },
    {
      text: i18n._(t`Delete from cloud`),
      icon: <CloudOffIcon />,
      action: async () => {
        if (this.state.post.isLocal && !this.state.post.onlineID) {
          this.showMessage(
            i18n._(t`This is a local post and you cannot delete it`)
          );
        } else {
          await this.deleteFromCloud();
        }
      }
    }
  ];

  componentDidMount() {
    ipc.on("close", () => {
      this.save();
    });
  }

  clear = () => {
    this.setState({
      isRedirect: false,
      previewCover: "",
      numberOfChanges: 0,
      post: { title: "", content: "", category: 0, isLocal: false },
      editorState: EditorState.createEmpty()
    });
  };

  insertImage = async (imagePath: string) => {
    let newEditorState = await insertImageBlock(
      imagePath,
      this.state.editorState
    );
    console.log(
      "Insert image",
      convertToRaw(newEditorState.getCurrentContent())
    );
    this.setState({ editorState: newEditorState });
  };

  initEditor = async (_id: string | undefined, isLocal: boolean) => {
    let postData: Post | undefined;
    if (!_id) return;
    this.setState({ isLoading: true });
    // Get data from local database
    if (isLocal) {
      postData = await getLocalPost(_id);
      // Set preview image
      this.setPreviewData(postData);
    } else {
      // get data from internet
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
  getCover = (cover: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(cover);
      reader.onloadend = () => {
        let imageFile = reader.result;
        resolve(imageFile);
      };
    });
  };

  setCategory = (category: number, categoryName: string) => {
    let post = this.state.post;
    post.category = category;
    post.category_name = categoryName;
    this.setState({ post });
  };

  /**
   * Set post cover
   */
  setCover = async (cover: File) => {
    let post = this.state.post;
    post.cover = cover.path;
    let imageData = await this.getCover(cover);
    this.setState({ post: post, previewCover: imageData });
    await this.save();
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
    let numberOfChange = this.state.numberOfChanges;
    this.toggle("Bold", isBold);
    this.setState({
      editorState: editorState,
      numberOfChanges: numberOfChange + 1
    });
    // Auto save if the number of change is
    // greater than 20
    if (this.state.numberOfChanges > 20) {
      await this.save();
      this.setState({ numberOfChanges: 0 });
    }
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

  private async setPreviewData(postData: Post) {
    if (postData.cover) {
      let imageData = fs.readFileSync(postData.cover, { encoding: "base64" });
      imageData = `data:image/png;base64,${imageData}`;
      this.setState({ previewCover: imageData });
    }
  }

  private async delete() {
    if (this.state.post.isLocal) {
      try {
        await deletePost(this.state.post);
        this.setState({ isRedirect: true });
        setTimeout(() => {
          this.setState({ isRedirect: false });
        }, 100);
      } catch (err) {
        console.error(err);
      }
    }
  }

  private async deleteFromCloud() {
    // TODO get token from local storage
    try {
      let token = localStorage.getItem("access");
      let post = this.preparePost();
      if (post.isLocal && post.onlineID) {
        let url = getURL("delete/post/" + post.onlineID);
        axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (!post.isLocal) {
        let url = getURL("delete/post/" + post._id);
        axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      this.setState({ isRedirect: true });
    } catch (err) {}
  }

  async save() {
    try {
      let post = this.preparePost();
      if (this.state.post.isLocal) {
        await updatePost(post);
      } else {
        post.onlineID = post._id;
        delete post._id;
        post.isLocal = true;
        let savedPost = await insertPost(1, post);
        post._id = savedPost._id;
      }
      this.setState({ numberOfChanges: 0 });
      this.showMessage("Post has been Saved");
    } catch (err) {
      this.showMessage(err.toString());
    }
  }

  /**
   * Convert raw data to markdown and then
   * set the markdown to the post content
   */
  private preparePost() {
    let editorState = this.state.editorState;
    let raw = convertToRaw(editorState.getCurrentContent());
    let content = draftToMarkdown(raw, undefined);
    console.log(content);
    let post = this.state.post;
    post.content = content;
    return post;
  }

  private async send() {
    // TODO get token from local storage
    try {
      let url = "";
      let response: AxiosResponse;
      let token = localStorage.getItem("access");
      let post = this.preparePost();
      let data = {
        category: post.category,
        title: post.title,
        content: post.content
      };
      // Newly created post
      if (post.isLocal && !post.onlineID) {
        url = getURL("create/post");
        response = await axios.post(url, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.showMessage("Created");
      }
      // not saved online post
      else if (!post.isLocal && !post.onlineID) {
        url = getURL("update/post/" + post._id);
        response = await axios.patch(url, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.showMessage("Updated");
      }
      // saved online post
      else {
        url = getURL("update/post/" + post.onlineID);
        response = await axios.patch(url, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.showMessage("Updated");
      }

      let backData: Post = response.data;
      post.onlineID = backData._id;
      this.setState({ post });
    } catch (err) {
      this.showMessage(err.toString());
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
  numberOfChanges: 0,
  snackBarMessage: "",
  post: {
    title: "",
    isLocal: false,
    content: "",
    category: -1
  },
  editorState: EditorState.createEmpty(),
  previewCover: "",
  onChange: () => {},
  handleKeyCommand: () => {},
  onFocus: () => {},
  setTitle: (newTitle: string) => {},
  hideMessage: () => {},
  setCover: (cover: File) => {},
  initEditor: (id, isLocal) => {},
  setCategory: (category: number, categoryName: string) => {},
  clear: () => {},
  insertImage: () => {},
  actions: [],
  selected: []
};

export const EditorContext = React.createContext(context);
