import React, { Component } from "react";
import SideController from "./SideController";
import { UserContext } from "../model/userContext";
import { TextField } from "@material-ui/core";
import Title from "./Title";
import MainEditor from "./MainEditor";

export default class EditorPage extends Component {
  render() {
    return (
      <div>
        <SideController />
        <div className="content">
          <Title />
          <MainEditor />
        </div>
      </div>
    );
  }
}
