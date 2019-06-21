import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
  DialogContent,
  Tooltip,
  Collapse
} from "@material-ui/core";
import { Trans } from "@lingui/macro";
import CategorySelect from "./CategorySelect";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import { Category } from "../model/interfaces";

interface Props {
  open: boolean;
  onClose: () => {};
  isCreat: boolean;
  categories: Category[];
  category: number;
  setCategory(category: number, categoryName: string): void;
  setCover(cover: File): void;
  getCover(): string | null;
}

export default function SettingCardContent(props: Props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      className="container"
    >
      <DialogTitle>
        {props.isCreat ? (
          <Trans>Create New Post</Trans>
        ) : (
          <Trans>Post Setting</Trans>
        )}
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-8">
            <CategorySelect
              categories={props.categories}
              selectedCategory={props.category}
              handleChange={props.setCategory}
            />
          </div>
          <div className="col-4">
            <Tooltip title={<Trans>Add Post Cover Image</Trans>}>
              <IconButton>
                <AddPhotoAlternate />
                <input
                  type="file"
                  accept="image/*"
                  style={{ position: "absolute", opacity: 0 }}
                  onChange={(e) => {
                    let file = e.target.files && e.target.files[0];
                    if (file) props.setCover(file);
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <Collapse in={props.getCover !== null} mountOnEnter unmountOnExit>
          <div
            className="mx-auto"
            style={{
              width: "300px",
              height: "300px",
              backgroundSize: "cover",
              backgroundImage: `url(${props.getCover})`
            }}
          />
        </Collapse>
      </DialogContent>

      <DialogActions>
        <Button> OK</Button>
        <Button onClick={props.onClose}>
          <Trans>Cancel</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
