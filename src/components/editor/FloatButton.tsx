import React, { Component } from "react";
import Fab from "@material-ui/core/Fab";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton, Tooltip } from "@material-ui/core";
import chinese from "../../locales/zh/messages";
import { setupI18n } from "@lingui/core";
import { t } from "@lingui/macro";

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
        <Tooltip title={i18n._(t`Post Setting`)}>
          <IconButton className="ml-5">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}
