import React, { Component, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  IconButton,
  DialogContent,
  Tooltip,
  Collapse,
  LinearProgress
} from "@material-ui/core";
import { Trans } from "@lingui/macro";
import CategorySelect from "./CategorySelect";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import { Category, Post } from "../model/interfaces";
import { EditorContext } from "../model/editorContext";
import { SettingConext } from "../model/settingContext";

interface Props {
  open: boolean;
  onClose: () => {};
  isCreat: boolean;
  categories: Category[];
  category: number;
  previewCover: any;
  setCategory(category: number, categoryName: string): void;
  setCover(cover: File): void;
  redirect(): void;
  sendCover(post: Post): void;
}

export default function SettingCardContent(props: Props) {
  const editorContext = useContext(EditorContext);
  const settingContext = useContext(SettingConext);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      className="container"
    >
      <Collapse in={settingContext.progress !== undefined}>
        <LinearProgress variant="determinate" value={settingContext.progress} />
      </Collapse>
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
          {!props.isCreat && (
            <div className="col-1">
              <Tooltip title={<Trans>Add Post Cover Image</Trans>}>
                <IconButton>
                  <AddPhotoAlternate />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ position: "absolute", opacity: 0 }}
                    onChange={(e) => {
                      let file = e.target.files && e.target.files[0];
                      if (file) {
                        props.setCover(file);
                        settingContext.setImage(file);
                      }
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
        <Collapse in={props.previewCover !== ""} mountOnEnter unmountOnExit>
          <div
            className="mx-auto"
            style={{
              width: "300px",
              height: "300px",
              backgroundSize: "cover",
              backgroundImage: `url(${props.previewCover})`
            }}
          />
        </Collapse>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={
            props.isCreat
              ? props.redirect
              : () => props.sendCover(editorContext.post)
          }
          disabled={props.category === -1}
        >
          {" "}
          OK
        </Button>
        <Button onClick={props.onClose}>
          <Trans>Cancel</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
