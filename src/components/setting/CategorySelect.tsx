import React, { useContext } from "react";
import { Category } from "../model/interfaces";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { EditorContext } from "../model/editorContext";
import { SettingConext } from "../model/settingContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(4),
      width: "90%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function CategorySelect() {
  const classes = useStyles();
  const editorContext = useContext(EditorContext);
  const settingContext = useContext(SettingConext);
  const { post, setCategory } = editorContext;
  const { categories } = settingContext;

  return (
    <FormControl className="w-90" fullWidth>
      <InputLabel>
        <Trans>Category</Trans>
      </InputLabel>
      <Select
        value={post.post_category ? post.post_category.id : undefined}
        onChange={async (event) => {
          const category = categories.find((c) => c.id === event.target.value);
          if (category) {
            console.log("set catrgory", category);
            await setCategory(category);
          }
        }}
      >
        {categories.map((category) => (
          <MenuItem key={`category-${category.id}`} value={category.id}>
            {category.category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
