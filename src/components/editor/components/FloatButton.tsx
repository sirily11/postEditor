import React, { Component } from "react";
import Fab from "@material-ui/core/Fab";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton, Tooltip } from "@material-ui/core";
import chinese from "../../../locales/zh/messages";
import { setupI18n } from "@lingui/core";
import { t } from "@lingui/macro";
import { SettingConext } from "../../model/settingContext";

const i18n = setupI18n({
  language: "zh",
  catalogs: {
    zh: chinese
  }
});

export default class FloatButton extends Component {
  render() {
    return (
      <div>
        <SettingConext.Consumer>
          {({ openSetting }) => (
            <Tooltip title={i18n._(t`Post Setting`)}>
              <IconButton className="ml-5" onClick={openSetting}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
        </SettingConext.Consumer>
      </div>
    );
  }
}
