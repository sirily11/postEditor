import { EditorState, RichUtils, Editor, DraftEditorCommand } from "draft-js";
import React from "react";
import ListIcon from "@material-ui/icons/List";
import { ReactComponent as SaveIcon } from "../editor/SaveIcon.svg";

export interface Action {
  text?: string;
  icon: JSX.Element;
  action: any;
}

interface MainEditorState {
  editorState: EditorState;
  handleKeyCommand: any;
  actions: Action[];
  onChange: any;
  onFocus: any;
  selected: string;
}

interface MainEditorProps {}

export class MainEditorProvider extends React.Component<
  MainEditorProps,
  MainEditorState
> {
  constructor(props: MainEditorProps) {
    super(props);
    this.state = {
      selected: "",
      editorState: EditorState.createEmpty(),
      actions: this.actions,
      onChange: this.onChange,
      onFocus: this.onFocus,
      handleKeyCommand: this.handleKeyCommand
    };
  }

  actions: Action[] = [
    {
      text: "Save",
      icon: <SaveIcon />,
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
      text: "Divider",
      icon: <div />,
      action: () => {}
    },
    {
      text: "Bold",
      icon: <div>B</div>,
      action: () => {
        this.onChange(
          RichUtils.toggleInlineStyle(this.state.editorState, "BOLD")
        );
      }
    }
  ];

  onChange = (editorState: EditorState) => {
    const style = editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.setState({ editorState: editorState, selected: isBold ? "Bold" : "" });
  };

  onFocus = () => {
    const style = this.state.editorState.getCurrentInlineStyle();
    const isBold = style.has("BOLD");
    this.setState({ selected: isBold ? "Bold" : "" });
  };

  click = (text: string) => {
    if (this.state.selected === text) {
      this.setState({ selected: "" });
    } else {
      this.setState({ selected: text });
    }
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

const actions: Action[] = [];
const handleKeyCommand: any = () => {};

export const EditorContext = React.createContext({
  editorState: EditorState.createEmpty(),
  onChange: () => {},
  handleKeyCommand: handleKeyCommand,
  onFocus: () => {},
  actions: actions,
  selected: ""
});
