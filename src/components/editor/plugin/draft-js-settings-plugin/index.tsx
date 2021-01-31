/** @format */

import React from "react";

import DefaultLink from "./components/SettingsText";
import settingStrategy, { matchesEntityType } from "./settingsStrategy";
import { defaultTheme } from "./theme";
import { AnchorPluginConfig } from "./utils/interfaces";

export default (config: AnchorPluginConfig = {}) => {
  const { theme = defaultTheme, placeholder, Link, linkTarget } = config;

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };

  const DecoratedDefaultLink = (props: any) => (
    <DefaultLink {...props} style={theme} target={linkTarget} />
  );

  return {
    // @ts-ignore
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    decorators: [
      {
        strategy: settingStrategy,
        matchesEntityType,
        component: Link || DecoratedDefaultLink,
      },
    ],
  };
};
