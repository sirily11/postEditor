import React, { Component } from "react";
import { TextField, InputBase, Divider } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { UserContext } from "../model/userContext";

export default class Title extends Component {
  render() {
    return (
      <div>
        <div className="row mx-4 my-2 sticky-top">
          <InputBase
            className="title-input-text"
            style={{ fontSize: "30px" }}
            placeholder="Enter your title here"
          />

          <UserContext.Consumer>
            {({ userName }) => {
              return (
                <div style={{ alignSelf: "flex-end" }}>By: {userName}</div>
              );
            }}
          </UserContext.Consumer>
        </div>
        <Divider className="m-4" />
      </div>
    );
  }
}
