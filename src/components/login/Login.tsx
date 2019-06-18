import React, { Component } from "react";

interface LoginProps {}

interface LoginState {}

export default class Login extends Component<LoginProps, LoginState> {

    constructor(loginProps: LoginProps){
        super(loginProps);
    }

  render() {
    return <div>hello world</div>;
  }
}
