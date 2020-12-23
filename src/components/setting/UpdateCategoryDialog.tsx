/** @format */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  Fade,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
} from "@material-ui/core";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { getURL } from "../model/utils/settings";
import { SettingConext } from "../model/settingContext";
import { Category } from "../model/interfaces";
import { DisplayContext } from "../model/displayContext";
import TextField from "@material-ui/core/TextField";
interface Props {
  originalCategory: Category;
  open: boolean;
  close(): void;
}

export default function UpdateCategoryDialog(props: Props) {
  const { open, close, originalCategory } = props;
  const [category, setCategory] = useState(originalCategory.category);
  const { updateCategory } = useContext(SettingConext);
  const { fetch } = useContext(DisplayContext);

  useEffect(() => {
    setCategory(originalCategory.category);
  }, [originalCategory]);

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent style={{ margin: 30 }}>
        <TextField
          fullWidth
          variant="filled"
          label="Category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>close</Button>
        <Button
          type="submit"
          onClick={async () => {
            await updateCategory({ ...originalCategory, category: category });
            await fetch();
            close();
          }}>
          update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
