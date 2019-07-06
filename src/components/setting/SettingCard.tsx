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
      redirect: false
    };
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={`/edit`} />;
    }
    return (
      <div>
        <SettingConext.Consumer>
          {({ open, closeSetting, categories, sendCover, setImage }) => (
            <div>
              <EditorContext.Consumer>
                {({ post, setCover, setCategory, previewCover }) => (
                  <SettingCardContent
                    open={open}
                    onClose={closeSetting}
                    categories={categories}
                    isCreat={this.props.isCreated}
                    category={post.category}
                    setCategory={(category, categoryName) => {
                      console.log(category, categoryName);
                      setCategory(category, categoryName);
                    }}
                    setCover={setCover}
                    previewCover={previewCover}
                    sendCover={sendCover}
                    redirect={() => {
                      closeSetting();
                      this.setState({ redirect: true });
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
