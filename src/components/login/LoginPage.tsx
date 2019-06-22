import React, { Component } from "react";
import { UserContext } from "../model/userContext";
import LoginCard from "./Login";

export default class LoginPage extends Component {
  render() {
    return (
      <UserContext.Consumer>
        {({ isLogin }) => <LoginCard />}
      </UserContext.Consumer>
    );
  }
}
