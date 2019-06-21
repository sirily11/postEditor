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

const i18n = setupI18n({
  language: "zh",
  catalogs: {
    zh: chinese
  }
});

export default class Title extends Component {
  render() {
    return (
      <EditorContext.Consumer>
        {({ post, setTitle }) => (
          <Paper
            elevation={0}
            // style={{ top: 0, position: "sticky", zIndex: 1000 }}
          >
            <div className="mx-4">
              <Breadcrumbs>
                <Link to="/home">
                  <Trans>Home</Trans>
                </Link>
                <div>{post.title}</div>
              </Breadcrumbs>
            </div>
            <div className="row mx-4 my-2 sticky-top">
              <InputBase
                value={post.title}
                className="title-input-text"
                style={{ fontSize: "30px" }}
                placeholder={i18n._(t`Enter your title here`)}
                onChange={(e) => setTitle(e.target.value)}
              />

              <UserContext.Consumer>
                {({ userName }) => {
                  return (
                    <div style={{ alignSelf: "flex-end" }}>
                      <h6>
                        <Trans>By</Trans>: {userName}
                      </h6>
                      <h6>
                        <Trans>Category</Trans>: {post.category_name}
                      </h6>
                    </div>
                  );
                }}
              </UserContext.Consumer>
              <FloatButton />
            </div>
            <Divider className="m-4" />
          </Paper>
        )}
      </EditorContext.Consumer>
    );
  }
}
