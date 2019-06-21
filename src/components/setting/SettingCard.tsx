import React, { Component } from "react";
import { SettingConext } from "../model/settingContext";
import { Trans } from "@lingui/macro";
import { Category } from "../model/interfaces";
import CategorySelect from "./CategorySelect";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import { EditorContext } from "../model/editorContext";
import SettingCardContent from "./SettingCardContent";

interface State {
  categories: Category[];
}

interface Props {
  isCreated: boolean;
}

export default class SettingCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SettingConext.Consumer>
          {({ open, closeSetting, categories }) => (
            <div>
              <EditorContext.Consumer>
                {({ post, setCover, getCover, setCategory }) => (
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
                    getCover={getCover}
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
