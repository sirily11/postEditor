import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  Fade,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { Form, Checkbox, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { getURL } from "./settings";
import { SettingConext } from "../model/settingContext";
import { Category } from "../model/interfaces";
import { DisplayContext } from "../model/displayContext";
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
      <Form style={{ margin: 30 }}>
        <Form.Input
          placeholder="Category"
          name="category"
          value={category}
          onChange={(e, { name, value }) => setCategory(value)}
        />
      </Form>
      <DialogActions>
        <Button onClick={close}>close</Button>
        <Button
          type="submit"
          onClick={async () => {
            await updateCategory({ ...originalCategory, category: category });
            await fetch();
            close();
          }}
        >
          update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
