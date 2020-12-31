/** @format */

import React from "react";
import { PostSettingContext } from "../../../../../model/postSettingsContext";
import { DetailSettings } from "../../../../../model/interfaces";
import { List, ListItem, ListItemText, Card } from "@material-ui/core";

export default function SuggestionsContent(props: { word: string }) {
  const { word } = props;
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
          <ListItem key={index} button>
            <ListItemText
              primary={sug.name}
              secondary={sug.description}></ListItemText>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
