import React, { Component, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Tooltip,
  Collapse,
  LinearProgress,
  Button,
  Grid,
} from "@material-ui/core";
import { Trans } from "@lingui/macro";
import CategorySelect from "./CategorySelect";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import { Category, Post } from "../model/interfaces";
import { EditorContext } from "../model/editorContext";
import { SettingConext } from "../model/settingContext";
import { Button as IconBtn } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import NewCategoryDialog from "./NewCategoryDialog";
import UpdateCategoryDialog from "./UpdateCategoryDialog";
const { dialog } = (window as any).require("electron").remote;

interface Props {
  redirect(): void;
  isCreate: boolean;
}

interface Options {
  key: any;
  value: any;
  text: any;
}

export default function SettingCardContent(props: Props) {
  const editorContext = useContext(EditorContext);
  const settingContext = useContext(SettingConext);
  const [openCategory, setOpenCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);

  const [loading, setLoading] = useState(false);
  const { categories, open, closeSetting } = settingContext;
  const { setCover, post, create } = editorContext;

  return (
    <Dialog open={open} onClose={closeSetting} fullWidth>
      <DialogTitle>
        {props.isCreate ? (
          <Trans>Create New Post</Trans>
        ) : (
          <Trans>Post Setting</Trans>
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={8}>
            <CategorySelect> </CategorySelect>
          </Grid>
          <Grid item xs={1}>
            {!post.post_category ? (
              <IconBtn
                icon="add"
                onClick={() => setOpenCategory(true)}
              ></IconBtn>
            ) : (
              <IconBtn
                icon="edit"
                onClick={() => setOpenEditCategory(true)}
              ></IconBtn>
            )}
          </Grid>
          {!props.isCreate && (
            <Grid item xs={1}>
              <Tooltip title={<Trans>Add Post Cover Image</Trans>}>
                <IconBtn
                  loading={loading}
                  icon="file image"
                  onClick={async () => {
                    let result: any | undefined = await dialog.showOpenDialog({
                      filters: [
                        { name: "Images", extensions: ["jpg", "png", "gif"] },
                      ],
                    });

                    if (!result.canceled) {
                      setLoading(true);
                      await setCover(result.filePaths[0]);
                      setLoading(false);
                    }
                  }}
                ></IconBtn>
              </Tooltip>
            </Grid>
          )}
        </Grid>
        <Collapse in={post.image_url !== undefined} mountOnEnter unmountOnExit>
          <div
            className="mx-auto"
            style={{
              width: "300px",
              height: "300px",
              backgroundSize: "cover",
              backgroundImage: `url(${post.image_url})`,
            }}
          />
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async () => {
            if (props.isCreate) {
              let success = await create();
              if (success) {
                props.redirect();
              }
            }
            closeSetting();
          }}
          disabled={post.post_category === undefined}
        >
          OK
        </Button>
        <Button onClick={closeSetting}>
          <Trans>Cancel</Trans>
        </Button>
      </DialogActions>
      <NewCategoryDialog
        open={openCategory}
        close={() => setOpenCategory(false)}
      ></NewCategoryDialog>
      {post.post_category && (
        <UpdateCategoryDialog
          open={openEditCategory}
          originalCategory={post.post_category}
          close={() => setOpenEditCategory(false)}
        />
      )}
    </Dialog>
  );
}
