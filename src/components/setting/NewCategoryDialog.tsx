/** @format */

import React, { useState, useContext } from "react";
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
import TextField from "@material-ui/core/TextField";
interface Props {
  open: boolean;
  close(): void;
}

export default function NewCategoryDialog(props: Props) {
  const { open, close } = props;
  const [category, setCategory] = useState("");
  const { addCategory } = useContext(SettingConext);
  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent style={{ margin: 30 }}>
        <TextField
          fullWidth
          variant="filled"
          label="Category"
          inputProps={{ "data-testid": "category-field" }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>close</Button>
        <Button
          data-testid="add"
          type="submit"
          onClick={async () => {
            const res = await axios.post<Category>(getURL("blog/category/"), {
              category: category,
            });
            addCategory(res.data);
            close();
          }}>
          add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
