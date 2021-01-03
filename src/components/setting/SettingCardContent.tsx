/** @format */

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
  CircularProgress,
} from "@material-ui/core";
import { Trans } from "@lingui/macro";
import CategorySelect from "./CategorySelect";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import { Category, Post } from "../model/interfaces";
import { EditorContext } from "../model/editorContext";
import { SettingConext } from "../model/settingContext";
import { Button as IconBtn } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { string0To255 } from "aws-sdk/clients/customerprofiles";

interface Props {
  redirect(id: string0To255): void;
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
          <Trans>Create A New Post</Trans>
        ) : (
          <Trans>Post Setting</Trans>
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <CategorySelect> </CategorySelect>
          </Grid>
          {!props.isCreate && (
            <Grid item xs={12}>
              <form>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={async (e) => {
                    if (e.target.files) {
                      try {
                        setLoading(true);
                        await setCover(e.target.files[0]);
                      } catch (err) {
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}></input>
              </form>
            </Grid>
          )}
        </Grid>
        <Collapse in={loading} mountOnEnter unmountOnExit>
          <LinearProgress />
        </Collapse>
        <Collapse in={post?.image_url !== undefined} mountOnEnter unmountOnExit>
          <div
            className="mx-auto"
            style={{
              width: "300px",
              height: "300px",
              backgroundSize: "cover",
              backgroundImage: `url(${post?.image_url})`,
            }}
          />
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeSetting}>
          <Trans>Cancel</Trans>
        </Button>
        <Button
          onClick={async () => {
            if (props.isCreate) {
              let id = await create();
              if (id) {
                props.redirect(id);
              }
            }
            closeSetting();
          }}
          disabled={post?.post_category === undefined}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
