import React, { Component } from "react";
import { Interface } from "readline";

interface SettingState {}

interface SettingProps {}

export class SettingContext extends Component<SettingProps, SettingState> {
  constructor(props: SettingProps) {
    super(props);
  }

  render() {
    return (
      <SettingConext.Provider value={this.state}>
        {this.props.children}
      </SettingConext.Provider>
    );
  }
}

const context: SettingState = {};

export const SettingConext = React.createContext(context);
