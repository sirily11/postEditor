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
import { insertPost } from "./localDB";
import { Post } from "../home/HomePage";
import axios from "axios";
import { getURL } from "../setting/settings";
import { RouteComponentProps, withRouter } from "react-router";
import markdownToDraft from "../editor/plugin/markdown-draft-js/markdown-to-draft";

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
  title: string;
  editorState: EditorState;
  handleKeyCommand: any;
  actions: Action[];
  onChange: any;
  onFocus: any;
  setTitle: any;
  selected: string[];
}
interface RouterProps {
  _id: string;
}

export interface MainEditorProps extends RouteComponentProps<RouterProps> {}

export class MainEditorProvider extends React.Component<
  MainEditorProps,
  MainEditorState
> {
  constructor(props: MainEditorProps) {
    super(props);
    this.state = {
      title: "",
      selected: [],
      editorState: EditorState.createEmpty(),
      actions: this.actions,
      onChange: this.onChange,
      onFocus: this.onFocus,
      setTitle: this.setTitle,
      handleKeyCommand: this.handleKeyCommand
    };
  }

  actions: Action[] = [
    {
      text: i18n._(t`Save`),
      icon: <SaveIcon />,
      action: async () => {
        let editorState = this.state.editorState;
        let raw = convertToRaw(editorState.getCurrentContent());

        let content = draftToMarkdown(raw, undefined);
        let post: Post = {
          title: this.state.title,
          content: content,
          isLocal: true
        };
        console.log(post);
        await insertPost(1, post);
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

  async componentWillMount() {
    let id = this.props.match.params._id;
    let response = await axios.get(getURL("get/post/" + id));
    let postData: Post = response.data;
    let raw = markdownToDraft(postData.content);
    let editorState = EditorState.createWithContent(convertFromRaw(raw));
    this.setState({ title: postData.title, editorState: editorState });
  }

  onChange = (editorState: EditorState) => {
    const style = editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.toggle("Bold", isBold);
    this.setState({ editorState });
  };

  onFocus = () => {
    const style = this.state.editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.toggle("Bold", isBold);
  };

  setTitle = (newTitle: string) => {
    this.setState({ title: newTitle });
  };

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

  click = (text: string) => {};

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
  editorState: EditorState.createEmpty(),
  onChange: () => {},
  handleKeyCommand: () => {},
  onFocus: () => {},
  setTitle: (newTitle: string) => {},
  actions: [],
  selected: [],
  title: ""
};

export const EditorContext = React.createContext(context);
