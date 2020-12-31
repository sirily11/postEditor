/** @format */

import React, { Component } from "react";
import { SettingConext } from "../model/settingContext";
import { Trans } from "@lingui/macro";
import { Category } from "../model/interfaces";
import CategorySelect from "./CategorySelect";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import { EditorContext } from "../model/editorContext";
import SettingCardContent from "./SettingCardContent";
import { Redirect } from "react-router";

interface State {
  redirect: boolean;
}

interface Props {
  isCreated: boolean;
}

export default class SettingCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  render() {
    return (
      <div>
        <SettingConext.Consumer>
          {({ open, closeSetting, categories }) => (
            <div>
              <EditorContext.Consumer>
                {({ post, setCover, setCategory }) => (
                  <SettingCardContent
                    isCreate={this.props.isCreated}
                    redirect={(id) => {
                      closeSetting();
                      window.location.href = `#/edit/${id}`;
                    }}
                  />
                )}
              </EditorContext.Consumer>
            </div>
          )}
        </SettingConext.Consumer>
      </div>
    );
  }
}
