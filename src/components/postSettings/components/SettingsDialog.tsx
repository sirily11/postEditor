/** @format */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React from "react";
import { PostSettingContext } from "../../model/postSettingsContext";
import { v4 as uuidv4, v4 } from "uuid";
import { ContentSettings } from "../../model/interfaces";

export default function SettingsDialog() {
  const {
    addSettings,
    updateSettings,
    postSettings,
    selectedSettings,
    closeSettingsDialog,
    showAddSettingsDialog,
  } = React.useContext(PostSettingContext);

  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");

  React.useEffect(() => {
    setName(selectedSettings?.name ?? "");
    setDesc(selectedSettings?.description ?? "");
  }, [selectedSettings]);

  return (
    <Dialog
      open={showAddSettingsDialog}
      onClose={() => closeSettingsDialog()}
      fullWidth>
      <DialogTitle>{selectedSettings ? "Edit" : "Add"} Settings </DialogTitle>
      <DialogContent>
        <TextField
          variant="filled"
          fullWidth
          label="Name"
          style={{ marginBottom: 10 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="filled"
          fullWidth
          label="Description"
          rows={4}
          rowsMax={4}
          multiline
          style={{ marginBottom: 10 }}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeSettingsDialog()}>Close</Button>
        <Button
          onClick={async () => {
            if (selectedSettings) {
              let updatedSettings: ContentSettings = {
                id: selectedSettings.id,
                name: name,
                description: desc,
                detailSettings: selectedSettings.detailSettings,
              };
              let index = postSettings?.settings?.findIndex(
                (s) => s.id === selectedSettings.id
              );

              await updateSettings(index!, updatedSettings);
            } else {
              await addSettings({
                id: v4(),
                name: name,
                description: desc,
                detailSettings: [],
              });
            }

            closeSettingsDialog();
            setName("");
            setDesc("");
          }}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
