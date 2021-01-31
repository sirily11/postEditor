/** @format */

import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@material-ui/core";
import React from "react";
import { v4 } from "uuid";
import { ContentSettings, DetailSettings } from "../../model/interfaces";
import { PostSettingContext } from "../../model/postSettingsContext";
import pinyin from "pinyin";

export default function DetailSettingsDialog() {
  const {
    addDetailSettingsTo,
    updateDetailSettings,
    postSettings,
    selectedSettings,
    selectedDetailSettings,
    closeDetailSettingsDialog,
    showAddDetailSettingsDialog,
    isLoading,
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
        {selectedSettings ? "Edit" : "Add"} Detail Settings{" "}
        <Collapse mountOnEnter unmountOnExit in={isLoading}>
          <LinearProgress />
        </Collapse>
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
            const settingsIndex = postSettings?.settings?.findIndex(
              (s) => s.id === selectedSettings?.id
            );
            const pinyinText: string = pinyin(name, {
              style: pinyin.STYLE_NORMAL,
            }).reduce<string>((prev, curr) => prev + "" + curr, "");

            if (selectedDetailSettings) {
              const updatedSettings: DetailSettings = {
                id: selectedDetailSettings!.id,
                name: name,
                description: desc,
                pinyin: pinyinText,
              };
              const detailIndex = selectedSettings!.detailSettings.findIndex(
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
                pinyin: pinyinText,
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
