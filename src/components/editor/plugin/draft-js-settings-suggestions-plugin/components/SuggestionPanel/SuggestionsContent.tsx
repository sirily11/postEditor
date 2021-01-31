/** @format */

import React from "react";
import { PostSettingContext } from "../../../../../model/postSettingsContext";
import { DetailSettings } from "../../../../../model/interfaces";
import { List, ListItem, ListItemText, Card } from "@material-ui/core";
import { EditorState, SelectionState, Modifier } from "draft-js";
import { insertSpaceBlock } from "../../../../../model/utils/insertBlock";
import pinyin from "pinyin";

function insertAndReplaceSettings(
  editorState: EditorState,
  blockKey: string,
  word: string,
  detail: DetailSettings
): EditorState {
  const contentState = editorState.getCurrentContent();
  const currentBlock = contentState.getBlockForKey(blockKey);
  const text = currentBlock.getText();
  const start = text.lastIndexOf(word);
  const end = start + word.length;

  const newContentWithEntity = contentState.createEntity(
    "POST-SETTINGS",
    "SEGMENTED",
    { id: detail.id }
  );

  const entityKey = newContentWithEntity.getLastCreatedEntityKey();
  const selection = SelectionState.createEmpty(currentBlock.getKey()).merge({
    focusOffset: end,
    anchorOffset: start,
  });

  const newContentState = Modifier.replaceText(
    contentState,
    selection,
    detail.name,
    undefined,
    entityKey
  );
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    "insert-fragment"
  );
  const newEditorStateWithSpace = insertSpaceBlock(newEditorState);
  const newContentStateWithSpace = newEditorStateWithSpace.getCurrentContent();

  const withProperCursor = EditorState.forceSelection(
    newEditorStateWithSpace,
    newContentStateWithSpace.getSelectionAfter()
  );

  return withProperCursor;
}

export default function SuggestionsContent(props: {
  word: string;
  blockKey: string;
  getEditorState: any;
  setEditorState: any;
  command: { id: string; command: string };
}) {
  const { word, blockKey, getEditorState, setEditorState, command } = props;
  const { postSettings } = React.useContext(PostSettingContext);
  const [suggestions, setSuggestions] = React.useState<DetailSettings[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number>();
  // Compute suggestions
  React.useEffect(() => {
    setSelectedIndex(undefined);
    const search = word?.replace("@", "");
    const pinyinSearch = pinyin(search ?? "", {
      style: pinyin.STYLE_NORMAL,
    }).reduce((p, c) => p + c, "");

    const settings = [];
    if (postSettings?.settings) {
      for (const set of postSettings.settings) {
        for (const details of set.detailSettings) {
          if (
            details.name.toLowerCase().includes(search?.toLowerCase() ?? "")
          ) {
            settings.push(details);
          } else if (
            details.pinyin?.toLowerCase().includes(search?.toLowerCase() ?? "")
          ) {
            settings.push(details);
          } else if (
            details.pinyin?.toLowerCase().includes(pinyinSearch.toLowerCase())
          ) {
            settings.push(details);
          }
        }
      }
      setSuggestions(settings);
    }
  }, [postSettings, word]);
  // handle key command
  React.useEffect(() => {
    if (command.command === "up") {
      if (selectedIndex !== undefined) {
        setSelectedIndex(Math.max(0, selectedIndex - 1));
      } else {
        setSelectedIndex(suggestions.length - 1);
      }
    } else if (command.command === "down") {
      if (selectedIndex !== undefined) {
        setSelectedIndex(Math.min(selectedIndex + 1, suggestions.length - 1));
      } else {
        setSelectedIndex(0);
      }
    } else if (command.command === "enter") {
      if (selectedIndex !== undefined) {
        const sug = suggestions[selectedIndex];
        const newEditorState = insertAndReplaceSettings(
          getEditorState(),
          blockKey,
          word,
          sug
        );
        setEditorState(newEditorState);
        setSelectedIndex(undefined);
      } else if (suggestions.length > 0) {
        const sug = suggestions[0];
        const newEditorState = insertAndReplaceSettings(
          getEditorState(),
          blockKey,
          word,
          sug
        );
        setEditorState(newEditorState);
        setSelectedIndex(undefined);
      }
    }
  }, [command]);

  return (
    <Card style={{ width: 200 }} variant="outlined">
      {suggestions.length === 0 ? (
        <ListItemText primary="No suggestion"></ListItemText>
      ) : (
        <div></div>
      )}
      {/* {JSON.stringify(command)} */}
      <List>
        {suggestions.map((sug, index) => (
          <ListItem
            key={index}
            button
            selected={index === selectedIndex}
            onClick={() => {
              const newEditorState = insertAndReplaceSettings(
                getEditorState(),
                blockKey,
                word,
                sug
              );
              setEditorState(newEditorState);
              setSelectedIndex(undefined);
            }}>
            <ListItemText
              primary={sug.name}
              secondary={sug.description}></ListItemText>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
