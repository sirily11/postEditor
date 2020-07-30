/** @format */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { InputBase, Divider, Breadcrumbs } from "@material-ui/core";
import { UserContext } from "../model/userContext";
import { t, Trans } from "@lingui/macro";
import { setupI18n } from "@lingui/core";
import chinese from "../../locales/zh/messages";
import { EditorContext } from "../model/editorContext";
import FloatButton from "./FloatButton";
import { Paper } from "@material-ui/core";
import { SettingConext } from "../model/settingContext";
import Grid from "@material-ui/core/Grid";

const i18n = setupI18n({
  language: "zh",
  catalogs: {
    zh: chinese,
  },
});

export default class Title extends Component {
  render() {
    return (
      <EditorContext.Consumer>
        {({ post, setTitle }) => (
          <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 10 }}>
            <Paper
              elevation={0}
              square
              style={{
                padding: 10,
                marginBottom: 10,
                marginRight: 0,
                marginLeft: 60,
              }}>
              <Grid container style={{ margin: 10 }}>
                <Grid container>
                  <Breadcrumbs>
                    <Link to="/home">
                      <Trans>Home</Trans>
                    </Link>
                    <div>{post.title}</div>
                  </Breadcrumbs>
                </Grid>
                <Grid container>
                  <Grid item xs={8}>
                    <InputBase
                      fullWidth
                      value={post.title}
                      className="title-input-text"
                      style={{ fontSize: "30px" }}
                      placeholder={i18n._(t`Enter your title here`)}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>
                  <UserContext.Consumer>
                    {({ userName }) => {
                      return (
                        <Grid item xs={2} style={{ alignSelf: "flex-end" }}>
                          <h6>
                            <Trans>By</Trans>: {userName}
                          </h6>
                          <h6>
                            <Trans>Category</Trans>:{" "}
                            {post.post_category
                              ? post.post_category.category
                              : ""}
                          </h6>
                        </Grid>
                      );
                    }}
                  </UserContext.Consumer>
                  <Grid item xs={2}>
                    <FloatButton />
                  </Grid>
                </Grid>
                <Grid container>
                  <Divider style={{ marginTop: 30 }} className="m-4" />
                </Grid>
              </Grid>
            </Paper>
          </div>
        )}
      </EditorContext.Consumer>
    );
  }
}
