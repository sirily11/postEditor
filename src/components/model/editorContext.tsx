/** @format */

import {
  EditorState,
  RichUtils,
  DraftEditorCommand,
  convertToRaw,
  convertFromRaw,
  genKey,
  ContentBlock,
  CompositeDecorator,
} from "draft-js";
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { t, Trans } from "@lingui/macro";
import { setupI18n, number } from "@lingui/core";
import { draftToMarkdown } from "../editor/plugin/markdown-draft-js";
import chinese from "../../locales/zh/messages";
import axios, { AxiosResponse } from "axios";
import { getURL } from "../setting/settings";
import markdownToDraft from "../editor/plugin/markdown-draft-js/markdown-to-draft";
import { Post, Category } from "./interfaces";
import { IpcRenderer, NativeImage } from "electron";
import { insertImageBlock, insertAudioBlock } from "./utils/insertImageBlock";
import { RawDraftContentState } from "draft-js";
import { deleteImage } from "./utils/uploadUtils";
import {
  computeDownloadProgress,
  computeUploadProgress,
  dataURItoBlob,
} from "./utils/uploadUtils";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import path from "path";

const electron = (window as any).require("electron");
const ColorThief = (window as any).require("colorthief");
const fs = (window as any).require("fs").promises;
const nativeImage = electron.nativeImage;

const i18n = setupI18n({
  catalogs: {
    zh: chinese,
  },
});

export interface Action {
  text: string;
  icon: JSX.Element;
  action: any;
  disabled?: any;
}

interface MainEditorState {
  hasInit: boolean;
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
  prevState?: EditorState;
  // number of changes to indicate whether to do the auto save
  handleKeyCommand: any;
  // side bar actions
  actions: Action[];
  // handle keyboard's input
  onChange: any;
  // when editor is clicked
  onFocus: any;
  showUploadFileDialog: boolean;
  setShowUploadFileDialog(v: boolean): void;
  // change pst's title
  setTitle(newTitle: string): any;
  selected: string[];
  hideMessage(): any;
  // clear
  clear(): void;
  // create post
  create(): Promise<boolean>;
  initEditor(_id: string, isLocal: boolean): void;
  // change cover
  setCover(cover: File): Promise<void>;
  // change category
  setCategory(category: Category): void;
  // insert inline image
  insertImage(imagePath: string, imageID: number): void;
  insertAudio(audioPath: string): void;
}

interface MainEditorProps {}

export class MainEditorProvider extends React.Component<
  MainEditorProps,
  MainEditorState
> {
  saveAPIDebounced: () => any;
  constructor(props: MainEditorProps) {
    super(props);
    this.state = {
      progress: 0,
      isRedirect: false,
      isLoading: false,
      post: {
        title: "New Post",
        content: "New Post",
      },
      snackBarMessage: "",
      selected: [],
      editorState: EditorState.createEmpty(),
      hasInit: false,
      actions: this.actions,
      showUploadFileDialog: false,
      setShowUploadFileDialog: this.setShowUploadFileDialog,
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
      create: this.create,
      insertAudio: this.insertAudio,
    };

    this.saveAPIDebounced = AwesomeDebouncePromise(
      async () => await this.save(),
      2000
    );
  }

  actions: Action[] = [
    {
      text: i18n._(t`Save`),
      icon: <SaveIcon />,
      action: async () => {
        await this.save();
      },
    },
    {
      text: "Divider 1",
      icon: <div />,
      action: () => {},
    },
    {
      text: "Insert files",
      icon: <AttachmentIcon />,
      action: () => {
        this.setShowUploadFileDialog(true);
      },
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
      },
    },
    {
      text: "Divider 3",
      icon: <div />,
      action: async () => {},
    },
    {
      text: i18n._(t`Delete from cloud`),
      icon: <DeleteIcon />,
      action: async () => {
        await this.deleteFromCloud();
      },
    },
  ];

  setShowUploadFileDialog = (v: boolean) => {
    this.setState({
      showUploadFileDialog: v,
    });
  };

  clear = () => {
    this.setState({
      isRedirect: false,
      hasInit: false,
      post: {
        id: undefined,
        title: "",
        content: "",
        post_category: undefined,
      },
      editorState: EditorState.createEmpty(),
    });
  };

  // this will insert image with image url
  insertImage = async (imagePath: string, imageID: number) => {
    let newEditorState = await insertImageBlock(
      imagePath,
      this.state.editorState,
      imageID
    );
    this.setState({ editorState: newEditorState, prevState: newEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  // this will insert audio
  insertAudio = async (audioPath: string) => {
    let newEditorState = await insertAudioBlock(
      audioPath,
      this.state.editorState
    );
    this.setState({ editorState: newEditorState, prevState: newEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  initEditor = async (id: string | undefined) => {
    if (!id) return;
    this.setState({ isLoading: true });
    // get data from internet
    let response = await axios.get<Post>(getURL("blog/post/" + id), {
      onDownloadProgress: (ProgressEvent) => {
        computeDownloadProgress(ProgressEvent, (progress: number) =>
          this.setState({ progress })
        );
      },
    });
    let postData = response.data;

    if (postData) {
      // let raw = markdownToDraft(postData.content);
      // @ts-ignore
      let editorState = EditorState.createWithContent(
        convertFromRaw(
          postData.content !== "" ? JSON.parse(postData.content) : {}
        )
      );
      let imageURL = postData.image_url ?? "";
      this.setState({
        isLoading: false,
        progress: 0,
        post: postData,
        editorState: editorState,
        prevState: editorState,
      });
    }
  };

  setCategory = async (category: Category) => {
    let post = this.state.post;
    if (post.id) {
      let token = localStorage.getItem("access");
      let url = getURL(`blog/post/${post.id}/`);
      let result = await axios.patch<Post>(
        url,
        { category: category.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.setState({ post: result.data });
    } else {
      post.post_category = category;
      this.setState({ post });
    }
  };

  /**
   * Set post cover
   */
  setCover = async (cover: File) => {
    let post = this.state.post;
    let filename = `${uuidv4()}${path.extname(cover.name)}`;
    let url = getURL(`blog/post/${post.id}/`);
    let colorURL = getURL("blog/cover-color/");
    const [red, green, blue] = await ColorThief.getColor(cover.path);
    console.log(red, green, blue);

    let token = localStorage.getItem("access");
    let form = new FormData();

    form.append("image_url", cover, filename);

    try {
      let result = await axios.patch<Post>(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      /// set cover color
      let colorData = {
        post: post.id,
        red: red,
        blue: blue,
        green: green,
      };
      await axios.post(colorURL, colorData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({ post: result.data });
    } catch (err) {
      console.log(err);
      window.alert("Cannot upload!");
    }
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
    const { post, hasInit, prevState } = this.state;
    // toggle bold
    const style = editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.toggle("Bold", isBold);
    this.setState({
      editorState: editorState,
    });

    if (post.id) {
      if (hasInit) {
        let prev = prevState
          ? convertToRaw(prevState.getCurrentContent())
          : undefined;
        let current = convertToRaw(editorState.getCurrentContent());
        if (JSON.stringify(prev) !== JSON.stringify(current)) {
          await this.saveAPIDebounced();
        }
      }
      if (!hasInit) {
        this.setState({ hasInit: true });
      }
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
    const isList = style.has("unordered-list-item");
    this.toggle("Bold", isBold);
    this.toggle("unordered-list-item", isList);
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

  private getDeletedImages(
    prevState: RawDraftContentState,
    currentState: RawDraftContentState
  ): { id: number; src: string }[] {
    let images: any[] = [];
    let currentStateBlockKey = currentState.blocks.map((b) => b.key);
    let deletedBlocks = prevState.blocks.filter(
      (b) => !currentStateBlockKey.includes(b.key) && b.type === "atomic"
    );
    for (let block of deletedBlocks) {
      let entity = prevState.entityMap[block.entityRanges[0].key];
      if (entity.type === "image") {
        images.push(entity.data);
      }
    }
    return images;
  }

  private async deleteFromCloud() {
    try {
      let confirm = window.confirm("Do you want to delete?");
      if (confirm) {
        let token = localStorage.getItem("access");
        let post = this.preparePost();

        let url = getURL("blog/post/" + post.id);
        axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.setState({ isRedirect: true });
      }
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
    // @ts-ignore
    // let content = draftToMarkdown(raw, undefined);
    let content = JSON.stringify(raw);

    let post = this.state.post;
    return {
      id: post.id,
      title: post.title === "" ? "New Post" : post.title,
      content: content,
      category: post.post_category && post.post_category.id,
    };
  }

  /**
   * Create New Post
   */
  create = async (): Promise<boolean> => {
    try {
      let token = localStorage.getItem("access");
      let url = getURL("blog/post/");
      let data = this.preparePost();
      delete data.id;
      let result = await axios.post<Post>(url, data, {
        headers: { Authorization: `Bearer ${token}` },
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
  };

  /**
   * Save the post to the cloud
   */
  private async save() {
    try {
      this.setState({ isLoading: true, progress: 0 });
      if (this.state.prevState) {
        let deletedImages = this.getDeletedImages(
          convertToRaw(this.state.prevState.getCurrentContent()),
          convertToRaw(this.state.editorState.getCurrentContent())
        );
        for (let image of deletedImages) {
          await deleteImage(image.id, (progress) =>
            this.setState({ progress: progress })
          );
        }
      }

      let token = localStorage.getItem("access");
      let data = this.preparePost();

      let url = getURL(`blog/post/${data.id}/`);
      let response = await axios.patch<Post>(url, data, {
        onUploadProgress: (evt) => {
          computeUploadProgress(evt, (progress: number) => {
            this.setState({ progress });
          });
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      this.showMessage("Updated");
    } catch (err) {
      this.showMessage(err.toString());
    } finally {
      this.setState({
        isLoading: false,
        progress: 0,
        prevState: this.state.editorState,
      });
    }
  }

  handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ): string => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if ((command as any) === "save") {
      this.save();
    }

    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  render() {
    return (
      <EditorContext.Provider value={this.state}>
        {this.props.children}
      </EditorContext.Provider>
    );
  }
}

//@ts-ignore
const context: MainEditorState = {};

export const EditorContext = React.createContext(context);
