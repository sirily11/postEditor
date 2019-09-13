import React, { useState, useContext } from "react";
import {
  Dialog,
  Fade,
  DialogContent,
  DialogActions,
  DialogTitle
} from "@material-ui/core";
import { Form, Checkbox, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { getURL } from "./settings";
import { SettingConext } from "../model/settingContext";
import { Category } from "../model/interfaces";
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
            let res = await axios.post<Category>(getURL("category/"), {
              category: category
            });
            addCategory(res.data);
            close();
          }}
        >
          add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
