import React from "react";
import { Category } from "../model/interfaces";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Props {
  categories: Category[];
  selectedCategory: number;
  handleChange(category: number, categoryName: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing(4),
      width: "100%"
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  })
);

export default function CategorySelect(props: Props) {
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>
          <Trans>Category</Trans>
        </InputLabel>
        <Select
          value={props.selectedCategory}
          onChange={(event) => {
            let categoryID = event.target.value as number;
            let categoryName = props.categories.find((category) => {
              return category._id === categoryID;
            });
            if (categoryName) {
              props.handleChange(categoryID, categoryName.category);
            }
          }}
        >
          {props.categories.map((category) => (
            <MenuItem key={`category-${category._id}`} value={category._id}>
              {category.category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
