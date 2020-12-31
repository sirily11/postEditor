/** @format */

import React from "react";
import { PostSettingContext } from "../../../../../model/postSettingsContext";
import { DetailSettings } from "../../../../../model/interfaces";
import { List, ListItem, ListItemText, Card } from "@material-ui/core";
import { EditorState, SelectionState, Modifier } from "draft-js";

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

  const entityKey = contentState.getLastCreatedEntityKey();
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

  return EditorState.push(editorState, newContentState, "insert-fragment");
}

export default function SuggestionsContent(props: {
  word: string;
  blockKey: string;
  getEditorState: any;
  setEditorState: any;
}) {
  const { word, blockKey, getEditorState, setEditorState } = props;
  const { postSettings } = React.useContext(PostSettingContext);
  const [suggestions, setSuggestions] = React.useState<DetailSettings[]>([]);
  React.useEffect(() => {
    let search = word?.replace("@", "");
    let settings = [];
    if (postSettings?.settings) {
      for (let set of postSettings.settings) {
        for (let details of set.detailSettings) {
          if (
            details.name.toLowerCase().includes(search?.toLowerCase() ?? "")
          ) {
            settings.push(details);
          }
        }
      }
      setSuggestions(settings);
    }
  }, [postSettings, word]);

  return (
    <Card>
      <List>
        {suggestions.map((sug, index) => (
          <ListItem
            key={index}
            button
            onClick={() => {
              let newEditorState = insertAndReplaceSettings(
                getEditorState(),
                blockKey,
                word,
                sug
              );
              setEditorState(newEditorState);
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
