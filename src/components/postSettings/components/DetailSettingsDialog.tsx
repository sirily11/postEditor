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
import { v4 } from "uuid";
import { ContentSettings, DetailSettings } from "../../model/interfaces";
import { PostSettingContext } from "../../model/postSettingsContext";

export default function DetailSettingsDialog() {
  const {
    addDetailSettingsTo,
    updateDetailSettings,
    postSettings,
    selectedSettings,
    selectedDetailSettings,
    closeDetailSettingsDialog,
    showAddDetailSettingsDialog,
  } = React.useContext(PostSettingContext);

  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");

  React.useEffect(() => {
    setName(selectedDetailSettings?.name ?? "");
    setDesc(selectedDetailSettings?.description ?? "");
  }, [selectedDetailSettings]);

  return (
    <Dialog
      open={showAddDetailSettingsDialog}
      onClose={() => closeDetailSettingsDialog()}
      fullWidth>
      <DialogTitle>
        {selectedSettings ? "Edit" : "Add"} Detail's Settings{" "}
      </DialogTitle>
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
        <Button onClick={() => closeDetailSettingsDialog()}>Close</Button>
        <Button
          onClick={async () => {
            let settingsIndex = postSettings?.settings?.findIndex(
              (s) => s.id === selectedSettings?.id
            );
            if (selectedDetailSettings) {
              let updatedSettings: DetailSettings = {
                id: selectedSettings!.id,
                name: name,
                description: desc,
              };
              let detailIndex = selectedSettings!.detailSettings.findIndex(
                (ds) => ds.id === selectedDetailSettings.id
              );

              await updateDetailSettings(
                settingsIndex!,
                detailIndex,
                updatedSettings
              );
            } else {
              await addDetailSettingsTo(settingsIndex!, {
                id: v4(),
                name: name,
                description: desc,
              });
            }

            closeDetailSettingsDialog();
            setName("");
            setDesc("");
          }}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
