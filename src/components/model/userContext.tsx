import React, { Component } from "react";
import { getURL } from "./utils/settings";
import axios, { AxiosResponse } from "axios";

const electron = (window as any).require("electron");
const ipc: Electron.IpcRenderer = electron.ipcRenderer;

interface User {
  userID?: string;
  userName: string;
  password: string;
  isLogin: boolean;
  saveLoginInfo: boolean;
  onChangePassword(password: string): void;
  onChangeUserName(userName: string): void;
  login(): Promise<void>;
  saveLogin(value: boolean): void;
}

interface Props {}
const context: User = {
  userName: "",
  password: "",
  isLogin: false,
  saveLoginInfo: false,
  onChangePassword: () => {},
  onChangeUserName: () => {},
  login: async () => {},
  saveLogin: () => {}
};

export const UserContext = React.createContext(context);

export class UserProvider extends Component<Props, User> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: "",
      userName: "",
      isLogin: false,
      saveLoginInfo: false,
      onChangePassword: this.onChangePassword,
      onChangeUserName: this.onChangeUserName,
      login: this.login,
      saveLogin: this.saveLogin
    };
  }

  componentDidMount() {
    ipc.on("logout", () => {
      this.setState({ isLogin: false });
    });
    let userName = localStorage.getItem("username");
    let password = localStorage.getItem("password");
    console.log(userName, password);
    if (userName && password) {
      this.setState({
        userName: userName,
        password: password,
        saveLoginInfo: true
      });
    }
  }

  componentWillUnmount() {
    // ipc.removeAllListeners("logout");
    this.setState({ isLogin: false, password: "" });
  }

  onChangePassword = (password: string) => {
    this.setState({ password });
  };

  onChangeUserName = (userName: string) => {
    this.setState({ userName });
  };

  login = async () => {
    let url = getURL("api/token/");
    let bodyFormData = new FormData();
    let response: AxiosResponse;
    bodyFormData.set("username", this.state.userName);
    bodyFormData.set("password", this.state.password);
    try {
      response = await axios.post(url, bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      let data = response.data;
      let access = data.access;
      if (this.state.saveLoginInfo) {
        localStorage.setItem("username", this.state.userName);
        localStorage.setItem("password", this.state.password);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        this.setState({ password: "" });
      }
      localStorage.setItem("access", access);
      this.setState({ isLogin: true });
    } catch (err) {
      let e: string = err.toString();
      if (e.includes("401")) {
        alert("Password or Username is not correct");
      } else if (e.includes("500")) {
        alert("Server's error");
      } else {
        alert(e);
      }
    }
  };

  saveLogin = (value: boolean) => {
    this.setState({ saveLoginInfo: value });
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
