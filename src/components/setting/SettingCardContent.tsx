import React, { Component, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
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
import {
  Grid,
  Input,
  Select,
  Container,
  Button,
  Icon
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import NewCategoryDialog from "./NewCategoryDialog";
import fs from "fs";

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

  const { categories, open, closeSetting } = settingContext;
  const { setCover, post, create } = editorContext;

  return (
    <Dialog open={open} onClose={closeSetting} fullWidth className="container">
      <DialogTitle>
        {props.isCreate ? (
          <Trans>Create New Post</Trans>
        ) : (
          <Trans>Post Setting</Trans>
        )}
      </DialogTitle>

      <Grid style={{ margin: 30, overflow: "hidden" }}>
        <Grid.Row>
          <Grid.Column width={10}>
            <CategorySelect> </CategorySelect>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button icon="add" onClick={() => setOpenCategory(true)}></Button>
          </Grid.Column>
          {!props.isCreate && (
            <Grid.Column width={4}>
              <Tooltip title={<Trans>Add Post Cover Image</Trans>}>
                <Button
                  icon="file image"
                  onClick={async () => {
                    let result:
                      | string
                      | undefined = await dialog.showOpenDialog({
                      filters: [
                        { name: "Images", extensions: ["jpg", "png", "gif"] }
                      ]
                    });
                    if (result !== undefined) {
                      // console.log(result);
                      setCover(result[0]);
                    }
                  }}
                ></Button>
              </Tooltip>
            </Grid.Column>
          )}
        </Grid.Row>
        <Collapse in={post.image_url !== undefined} mountOnEnter unmountOnExit>
          <div
            className="mx-auto"
            style={{
              width: "300px",
              height: "300px",
              backgroundSize: "cover",
              backgroundImage: `url(${post.image_url})`
            }}
          />
        </Collapse>
      </Grid>

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
    </Dialog>
  );
}
