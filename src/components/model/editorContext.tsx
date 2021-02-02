/** @format */

import {
  convertFromRaw,
  convertToRaw,
  DraftEditorCommand,
  EditorState,
  RichUtils,
} from "draft-js";
import React from "react";

import { t } from "@lingui/macro";
//@ts-nocheck
import { setupI18n } from "@lingui/core";
import chinese from "../../locales/zh/messages";
import axios from "axios";
import { getURL } from "./utils/settings";
import { Category, Post, PostImage, DetailSettings } from "./interfaces";
import {
  insertAudioBlock,
  insertImageBlock,
  insertSettingsBlock,
  removeBlock,
} from "./utils/insertBlock";
import {
  computeDownloadProgress,
  computeUploadProgress,
} from "./utils/uploadUtils";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import path from "path";
import { ContentBlock, SelectionState, Modifier } from "draft-js";
import { UpdateSettingSignal } from "./interfaces";
import {
  insertSpaceBlock,
  insertVideoBlock,
  insertInternalLink,
} from "./utils/insertBlock";

/// Icons
import DeleteIcon from "@material-ui/icons/Delete";
import HeadSetIcon from "@material-ui/icons/Headset";
import SaveIcon from "@material-ui/icons/Save";
import AttachmentIcon from "@material-ui/icons/Attachment";
import MovieIcon from "@material-ui/icons/Movie";

import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import LinkIcon from "@material-ui/icons/Link";

/// end icons

import { VideoBlockData } from "../editor/components/dialogs/UploadVideoDialog";
import { GroupImage } from "../editor/components/dialogs/UploadImageGroup";
import Image from "../editor/plugin/draft-js-image-plugin/Image";
import { insertGroupImage } from "./utils/insertBlock";

const { ipcRenderer } = (window as any).require("electron");

const ColorThief = (window as any).require("colorthief");

const i18n = setupI18n({
  catalogs: {
    zh: chinese,
  },
});

export type DialogData = GroupImage | VideoBlockData | PostImage | any;

export enum DialogTypes {
  Image,
  Video,
  Audio,
  File,
  InternalLink,
  ImageGroup,
}

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
  showUploadDialog?: {
    dialogType: DialogTypes;
    open: boolean;
    selectedData?: DialogData;
  };

  selected: string[];

  showEditImageDialog: boolean;

  selectedImageData?: any;

  setShowUploadDialog(
    v: boolean,
    dialogType?: DialogTypes,
    selectedData?: DialogData
  ): void;

  // change pst's title
  setTitle(newTitle: string): any;

  hideMessage(): any;

  // clear
  clear(): void;

  // create post
  create(): Promise<string | undefined>;

  initEditor(_id: string, isLocal: boolean): void;

  // change cover
  setCover(cover: File): Promise<void>;

  // change category
  setCategory(category: Category): void;

  // insert inline draft-js-image-plugin
  insertImage(postImage: PostImage): void;

  insertVideo(video: VideoBlockData): void;

  insertInternalLink(data: Post): void;

  updateInternalLink(post: Post): void;

  updateVideo(video: VideoBlockData): void;

  insertAudio(audioPath: string): void;

  updateImage(newImageData: PostImage): Promise<void>;

  insertGroupImages(group: GroupImage): void;

  updateGroupImages(group: GroupImage): void;

  setShowImageEditDialog(open: boolean, data?: DialogData): void;
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
        images: [],
        settings: {},
      },
      snackBarMessage: "",
      selected: [],
      editorState: EditorState.createEmpty(),
      hasInit: false,
      actions: this.actions,
      setShowUploadDialog: this.setShowUploadDialog,
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
      updateImage: this.updateImage,
      setShowImageEditDialog: this.setShowImageEditDialog,
      insertVideo: this.insertVideo,
      updateVideo: this.updateVideo,
      updateInternalLink: this.updateInternalLink,
      insertInternalLink: this.insertInternalLink,
      insertGroupImages: this.insertGroupImage,
      updateGroupImages: this.updateGroupImages,
      showEditImageDialog: false,
    };

    this.saveAPIDebounced = AwesomeDebouncePromise(
      async () => await this.save(),
      2000
    );
  }

  componentDidMount() {
    ipcRenderer.on("save", async (e: any, arg: any) => {
      console.log("save");
      await this.save();
    });

    ipcRenderer.on(
      "update-image-description",
      async (e: any, arg: PostImage) => {
        const index = this.state.post.images.findIndex((i) => i.id === arg.id);
        if (index !== undefined) {
          const post = this.state.post;
          post.images[index] = arg;
          this.setState({ post: post });
          ipcRenderer.send("update-images", {
            images: post.images,
            pid: post.id,
          });
        }
        await this.updateImage(arg);
      }
    );

    ipcRenderer.on("add-image-to-content", (e: any, arg: PostImage) => {
      this.insertImage(arg);
    });

    ipcRenderer.on("add-settings-block", (e: any, arg: DetailSettings) => {
      this.insertSettingsBlock(arg);
    });

    ipcRenderer.on(
      "update-setting-block",
      (e: any, arg: UpdateSettingSignal) => {
        for (const ds of arg.contents) {
          if (arg.action === "update") {
            this.replaceText(ds);
          } else {
            this.replaceText({
              name: "deleted",
              description: "deleted",
              id: ds.id,
              pinyin: "deleted",
            });
          }
        }
      }
    );

    ipcRenderer.on("delete-image", (e: any, arg: PostImage) => {
      this.deleteImage(arg.id);
      const { post } = this.state;
      let index = post.images.findIndex((i) => i.id === arg.id);
      post.images.splice(index, 1);
      this.setState({ post });
    });

    ipcRenderer.on("add-images-to-post", (e: any, arg: PostImage[]) => {
      const { post } = this.state;
      for (let image of arg) {
        post.images.push(image);
      }
      this.setState({ post });
    });
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
      text: "Insert File",
      icon: <AttachmentIcon />,
      action: () => {
        this.setShowUploadDialog(true, DialogTypes.File);
      },
    },
    {
      text: "Insert Audio",
      icon: <HeadSetIcon />,
      action: () => {
        this.setShowUploadDialog(true, DialogTypes.Audio);
      },
    },
    {
      text: "Insert Video",
      icon: <MovieIcon />,
      action: () => {
        this.setShowUploadDialog(true, DialogTypes.Video);
      },
    },
    {
      text: "Insert Internal Link",
      icon: <LinkIcon />,
      action: () => {
        this.setShowUploadDialog(true, DialogTypes.InternalLink);
      },
    },
    {
      text: "Insert Image Group",
      icon: <PhotoLibraryIcon />,
      action: () => {
        this.setShowUploadDialog(true, DialogTypes.ImageGroup);
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

  insertGroupImage = async (group: GroupImage) => {
    const newEditorState = await insertGroupImage(
      group,
      this.state.editorState
    );
    this.setState({ editorState: newEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  updateGroupImages = async (group: GroupImage) => {
    const editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();

    const blocks: SelectionState[] = [];
    const data: any[] = [];

    contentState.getBlockMap().forEach((block) => {
      block?.findEntityRanges(
        (c) => {
          const charEntity = c.getEntity();
          if (charEntity) {
            const entity = contentState.getEntity(charEntity);
            if (entity.getType() === "groupimage") {
              const videoId = entity.getData().id;
              if (videoId === group.id) {
                data.push(entity.getData());
                return true;
              }
            }
          }
          return false;
        },
        (s, e) => {
          const selection = SelectionState.createEmpty(block.getKey()).merge({
            focusOffset: e,
            anchorOffset: s,
          });
          blocks.push(selection);
        }
      );
    });

    blocks.forEach((block, index) => {
      const newData = group;
      contentState = contentState.createEntity(
        "groupimage",
        "IMMUTABLE",
        newData
      );
      const newEntityKey = contentState.getLastCreatedEntityKey();
      contentState = Modifier.applyEntity(contentState, block, newEntityKey);
    });
    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "change-block-data"
    );
    this.setState({
      editorState: newEditorState,
    });
    await this.save();
  };

  /**
   * Show Dialog for post image editing
   * @param open is open
   * @param data Post image data
   */
  setShowImageEditDialog = (open: boolean, data: any): void => {
    if (open) {
      this.setState({ showEditImageDialog: open, selectedImageData: data });
    } else {
      this.setState({
        showEditImageDialog: false,
        selectedImageData: undefined,
      });
    }
  };

  /**
   * Update video block data
   * @param newVideo Update displayed image's data
   */
  updateVideo = async (newVideo: VideoBlockData) => {
    const editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();

    const blocks: SelectionState[] = [];
    const data: any[] = [];

    contentState.getBlockMap().forEach((block) => {
      block?.findEntityRanges(
        (c) => {
          const charEntity = c.getEntity();
          if (charEntity) {
            const entity = contentState.getEntity(charEntity);
            if (entity.getType() === "video") {
              const videoId = entity.getData().id;
              if (videoId === newVideo.id) {
                data.push(entity.getData());
                return true;
              }
            }
          }
          return false;
        },
        (s, e) => {
          const selection = SelectionState.createEmpty(block.getKey()).merge({
            focusOffset: e,
            anchorOffset: s,
          });
          blocks.push(selection);
        }
      );
    });

    blocks.forEach((block, index) => {
      const newData = newVideo;
      contentState = contentState.createEntity("video", "IMMUTABLE", newData);
      const newEntityKey = contentState.getLastCreatedEntityKey();
      contentState = Modifier.applyEntity(contentState, block, newEntityKey);
    });
    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "change-block-data"
    );
    this.setState({
      editorState: newEditorState,
    });
    await this.save();
  };

  /**
   * Update internal link data
   * @param post Post data
   */
  updateInternalLink = async (post: Post) => {
    const editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();

    const blocks: SelectionState[] = [];
    const data: any[] = [];

    contentState.getBlockMap().forEach((block) => {
      block?.findEntityRanges(
        (c) => {
          const charEntity = c.getEntity();
          if (charEntity) {
            const entity = contentState.getEntity(charEntity);
            if (entity.getType() === "internallink") {
              const linkId = entity.getData().id;
              if (linkId === post.id) {
                data.push(entity.getData());
                return true;
              }
            }
          }
          return false;
        },
        (s, e) => {
          const selection = SelectionState.createEmpty(block.getKey()).merge({
            focusOffset: e,
            anchorOffset: s,
          });
          blocks.push(selection);
        }
      );
    });

    blocks.forEach((block, index) => {
      const newData = {
        id: post.id,
        title: post.title,
        image_url: post.image_url,
        author: post.author,
        posted_time: post.posted_time,
      };
      contentState = contentState.createEntity(
        "internallink",
        "IMMUTABLE",
        newData
      );
      const newEntityKey = contentState.getLastCreatedEntityKey();
      contentState = Modifier.applyEntity(contentState, block, newEntityKey);
    });
    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "change-block-data"
    );
    this.setState({
      editorState: newEditorState,
    });
    await this.save();
  };

  /**
   * Update post image block data
   * @param newPostImage Update displayed image's data
   */
  updateImage = async (newPostImage: PostImage) => {
    const editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();

    const blocks: SelectionState[] = [];
    const data: any[] = [];

    contentState.getBlockMap().forEach((block) => {
      block?.findEntityRanges(
        (c) => {
          const charEntity = c.getEntity();
          if (charEntity) {
            const entity = contentState.getEntity(charEntity);
            if (entity.getType() === "image") {
              const imageId = entity.getData().id;
              if (imageId === newPostImage.id) {
                data.push(entity.getData());
                return true;
              }
            }
          }
          return false;
        },
        (s, e) => {
          const selection = SelectionState.createEmpty(block.getKey()).merge({
            focusOffset: e,
            anchorOffset: s,
          });
          blocks.push(selection);
        }
      );
    });

    blocks.forEach((block, index) => {
      const newData = {
        ...data[index],
        description: newPostImage.description,
      };
      contentState = contentState.createEntity("image", "IMMUTABLE", newData);
      const newEntityKey = contentState.getLastCreatedEntityKey();
      contentState = Modifier.applyEntity(contentState, block, newEntityKey);
    });
    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "change-block-data"
    );
    this.setState({
      editorState: newEditorState,
    });
    await this.save();
  };

  setShowUploadDialog = (
    v: boolean,
    dialogType: DialogTypes,
    selectedData?: DialogData
  ) => {
    if (!v) {
      this.setState({
        showUploadDialog: undefined,
      });
    } else {
      this.setState({
        showUploadDialog: {
          open: v,
          dialogType: dialogType,
          selectedData: selectedData,
        },
      });
    }
  };

  clear = () => {
    const clearPost: Post = {
      id: undefined,
      title: "",
      content: "",
      post_category: undefined,
      images: [],
      settings: {},
    };
    this.setState({
      isRedirect: false,
      hasInit: false,
      post: clearPost,
      editorState: EditorState.createEmpty(),
    });
    ipcRenderer.send("update-images", { images: [] });
    ipcRenderer.send("load-post", clearPost);
  };
  /**
   * Replace current post's settings' text
   * @param detail Detail
   */
  replaceText = (detail: DetailSettings) => {
    const editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();

    const blocks: SelectionState[] = [];
    const entityKeys: string[] = [];

    contentState.getBlockMap().forEach((block) => {
      block?.findEntityRanges(
        (c) => {
          const charEntity = c.getEntity();
          if (charEntity) {
            const entity = contentState.getEntity(charEntity);
            if (entity.getType() === "POST-SETTINGS") {
              const block_id = entity.getData().id;

              if (block_id === detail.id) {
                entityKeys.push(charEntity);
                return true;
              }
            }
          }
          return false;
        },
        (s, e) => {
          const selection = SelectionState.createEmpty(block.getKey()).merge({
            focusOffset: e,
            anchorOffset: s,
          });
          blocks.push(selection);
        }
      );
    });

    blocks.forEach((selection, index) => {
      const entityKey = entityKeys[index];
      contentState = Modifier.replaceText(
        contentState,
        selection,
        detail.name,
        undefined,
        entityKey
      );
    });

    this.setState({
      editorState: EditorState.push(
        editorState,
        contentState,
        "insert-fragment"
      ),
    });

    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  /**
   *  Delete all occurances of image
   * @param imageID Image's id
   */
  deleteImage = async (imageID: number) => {
    // var rawContent = convertToRaw(this.state.editorState.getCurrentContent());
    // rawContent.entityMap
    const contentState = this.state.editorState.getCurrentContent();
    const blocks: { block: ContentBlock; entityKey: string }[] = [];

    contentState.getBlockMap().forEach((block) => {
      block?.findEntityRanges(
        (c) => {
          const charEntity = c.getEntity();
          if (charEntity) {
            const entity = contentState.getEntity(charEntity);
            if (entity.getData().id === imageID) {
              blocks.push({ block: block, entityKey: charEntity });
            }
          }

          return true;
        },
        (s, e) => {}
      );
    });

    let editorState = this.state.editorState;
    for (const block of blocks) {
      editorState = removeBlock(editorState, block.block, block.entityKey);
    }
    this.setState({ editorState });
  };

  // this will insert draft-js-image-plugin with draft-js-image-plugin url
  insertImage = async (postImage: PostImage) => {
    const newEditorState = await insertImageBlock(
      postImage,
      this.state.editorState
    );
    this.setState({ editorState: newEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  // this will insert draft-js-audio-plugin
  insertAudio = async (audioPath: string) => {
    const newEditorState = await insertAudioBlock(
      audioPath,
      this.state.editorState
    );
    this.setState({ editorState: newEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  // this will insert draft-js-video-plugin
  insertVideo = async (video: VideoBlockData) => {
    const newEditorState = await insertVideoBlock(
      video,
      this.state.editorState
    );
    this.setState({ editorState: newEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  // this will insert draft-js-internal-link-plugin
  insertInternalLink = async (data: Post) => {
    const newEditorState = await insertInternalLink(
      data,
      this.state.editorState
    );
    this.setState({ editorState: newEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  /**
   * Insert setting's block to the editor
   * @param settings Post settings
   */
  insertSettingsBlock = async (settings: DetailSettings) => {
    const newEditorState = await insertSettingsBlock(
      settings,
      this.state.editorState
    );
    const spacedEditorState = insertSpaceBlock(newEditorState);
    this.setState({ editorState: spacedEditorState });
    setTimeout(async () => {
      await this.save();
    }, 50);
  };

  initEditor = async (id: string | undefined) => {
    if (!id) return;
    this.setState({ isLoading: true });
    // get data from internet
    const url = "blog/post/" + id;
    const response = await axios.get<Post>(getURL(url), {
      onDownloadProgress: (ProgressEvent) => {
        computeDownloadProgress(ProgressEvent, (progress: number) =>
          this.setState({ progress })
        );
      },
    });
    const postData = response.data;
    postData.settings = JSON.parse(postData.settings as string);
    if (postData) {
      // @ts-ignore
      const editorState = EditorState.createWithContent(
        convertFromRaw(
          postData.content !== "" ? JSON.parse(postData.content) : {}
        )
      );
      ipcRenderer.send("load-post", postData);
      ipcRenderer.send("update-images", {
        pid: postData.id,
        images: postData.images,
      });
      this.setState({
        isLoading: false,
        progress: 0,
        post: postData,
        editorState: editorState,
        prevState: editorState,
      });
    }
  };

  /**
   * Set current post's category
   * @param category Post category
   */
  setCategory = async (category: Category) => {
    const post = this.state.post;
    if (post.id) {
      const token = localStorage.getItem("access");
      const url = getURL(`blog/post/${post.id}/`);
      const result = await axios.patch<Post>(
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
    const post = this.state.post;
    const filename = `${uuidv4()}${path.extname(cover.name)}`;
    const url = getURL(`blog/post/${post.id}/`);
    const colorURL = getURL("blog/cover-color/");
    const [red, green, blue] = await ColorThief.getColor(cover.path);
    console.log(red, green, blue);

    const token = localStorage.getItem("access");
    const form = new FormData();

    form.append("image_url", cover, filename);

    try {
      const result = await axios.patch<Post>(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      /// set cover color
      const colorData = {
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
        const prev = prevState
          ? convertToRaw(prevState.getCurrentContent())
          : undefined;
        const current = convertToRaw(editorState.getCurrentContent());
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
    const post = this.state.post;
    post.title = newTitle;
    this.setState({ post });
  };

  /**
   * Toggole the side bar to match the inline style
   */
  toggle = (name: string, status: boolean) => {
    const selected = this.state.selected;
    if (status) {
      if (!selected.includes(name)) {
        selected.push(name);
      }
    } else {
      const index = selected.indexOf(name);
      if (index > -1) {
        selected.splice(index, 1);
      }
    }
    this.setState({ selected: selected });
  };

  /**
   * Create New Post
   */
  create = async (): Promise<string | undefined> => {
    try {
      const token = localStorage.getItem("access");
      const url = getURL("blog/post/");
      const data = this.preparePost();
      delete data.id;
      const result = await axios.post<Post>(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (result.status === 201) {
        return result.data.id!;
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };

  handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ): string => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
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

  private async deleteFromCloud() {
    try {
      const confirm = window.confirm("Do you want to delete?");
      if (confirm) {
        const token = localStorage.getItem("access");
        const post = this.preparePost();

        const url = getURL("blog/post/" + post.id);
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.setState({ isRedirect: true });
      }
    } catch (err) {
      alert(err);
    }
  }

  /**
   * Convert raw data to string and then
   * set the string to the post content
   */
  private preparePost() {
    // get post from content state
    const editorState = this.state.editorState;
    // convert content state to markdown
    const raw = convertToRaw(editorState.getCurrentContent());
    // @ts-ignore
    // let content = draftToMarkdown(raw, undefined);
    const content = JSON.stringify(raw);

    const post = this.state.post;
    return {
      id: post.id,
      title: post.title === "" ? "New Post" : post.title,
      content: content,
      category: post.post_category && post.post_category.id,
    };
  }

  /**
   * Save the post to the cloud
   */
  private async save() {
    try {
      if (this.state.post.id === undefined) return;
      this.setState({ isLoading: true, progress: 0 });

      const token = localStorage.getItem("access");
      const data = this.preparePost();

      const url = getURL(`blog/post/${data.id}/`);
      await axios.patch<Post>(url, data, {
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
}

//@ts-ignore
const context: MainEditorState = {};

export const EditorContext = React.createContext(context);
