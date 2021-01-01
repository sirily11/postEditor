/** @format */

import React from "react";
import { PostSettingContext } from "../../../../../model/postSettingsContext";
import { DetailSettings } from "../../../../../model/interfaces";
import { List, ListItem, ListItemText, Card } from "@material-ui/core";
import { EditorState, SelectionState, Modifier } from "draft-js";
import { insertSpaceBlock } from "../../../../../model/utils/insertBlock";

function insertAndReplaceSettings(
  editorState: EditorState,
  blockKey: string,
  word: string,
  detail: DetailSettings
): EditorState {
  let contentState = editorState.getCurrentContent();
  let currentBlock = contentState.getBlockForKey(blockKey);
  let text = currentBlock.getText();
  let start = text.lastIndexOf(word);
  let end = start + word.length;

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

  let newContentState = Modifier.replaceText(
    contentState,
    selection,
    detail.name,
    undefined,
    entityKey
  );
  let newEditorState = EditorState.push(
    editorState,
    newContentState,
    "insert-fragment"
  );
  let newEditorStateWithSpace = insertSpaceBlock(newEditorState);
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
    let search = word?.replace("@", "");
    let settings = [];
    if (postSettings?.settings) {
      for (let set of postSettings.settings) {
        for (let details of set.detailSettings) {
          if (
            details.name.toLowerCase().includes(search?.toLowerCase() ?? "")
          ) {
            settings.push(details);
          } else if (
            details.pinyin?.toLowerCase().includes(search?.toLowerCase() ?? "")
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
        let sug = suggestions[selectedIndex];
        let newEditorState = insertAndReplaceSettings(
          getEditorState(),
          blockKey,
          word,
          sug
        );
        setEditorState(newEditorState);
        setSelectedIndex(undefined);
      } else if (suggestions.length > 0) {
        let sug = suggestions[0];
        let newEditorState = insertAndReplaceSettings(
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
              let newEditorState = insertAndReplaceSettings(
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
