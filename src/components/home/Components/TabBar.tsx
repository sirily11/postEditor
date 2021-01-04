/** @format */

import React, { useContext, useState } from "react";
import { DisplayProvider, DisplayContext } from "../../model/displayContext";
import {
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { SettingConext } from "../../model/settingContext";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import NewCategoryDialog from "../../setting/NewCategoryDialog";
import UpdateCategoryDialog from "../../setting/UpdateCategoryDialog";
import { EditorContext } from "../../model/editorContext";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { Category } from "../../model/interfaces";

const useStyles = makeStyles({
  drawer: {
    marginTop: 20,
    width: 250,
  },
});

export default function TabBar() {
  const [openCategory, setOpenCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [category, setCategory] = useState<Category>();
  const { deleteCategory, categories } = useContext(SettingConext);
  const classes = useStyles();
  return (
    <div>
      <DisplayContext.Consumer>
        {({ value, onChange }) => (
          <Drawer id="tabbar-container" elevation={0} variant="permanent">
            <List className={classes.drawer}>
              <ListItem>
                <ListItemText primary={"Add Category"} />
                <ListItemSecondaryAction>
                  <IconButton
                    data-testid="add-category"
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setOpenCategory(true);
                    }}>
                    <AddIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem
                button
                selected={value === -1}
                onClick={() => {
                  onChange(-1);
                }}>
                <ListItemText primary={"All"} />
              </ListItem>
              {categories.map((category) => {
                return (
                  <ListItem
                    key={`category-${category.id}`}
                    button
                    selected={value === category.id}
                    onClick={() => {
                      onChange(category.id);
                    }}>
                    <ListItemText primary={category.category} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setCategory(category);
                          setOpenEditCategory(true);
                        }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        data-testid={`delete-${category.id}`}
                        edge="end"
                        aria-label={`delete-${category.id}`}
                        onClick={async () => {
                          let confirm = window.confirm("Do you want to delete");
                          if (confirm) {
                            await deleteCategory(category);
                          }
                        }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Drawer>
        )}
      </DisplayContext.Consumer>
      <NewCategoryDialog
        open={openCategory}
        close={() => setOpenCategory(false)}
      />
      {category && (
        <UpdateCategoryDialog
          open={openEditCategory}
          originalCategory={category}
          close={() => {
            setOpenEditCategory(false);
            setCategory(undefined);
          }}
        />
      )}
    </div>
  );
}
