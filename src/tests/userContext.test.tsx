import React, { useContext } from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserContext, UserProvider } from "../components/model/userContext";
import LoginPage from "../components/login/LoginPage";
import Login from "../components/login/Login";
import axios from "axios";

jest.mock("axios");

describe("Test user context", () => {
  beforeAll(() => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });
  });

  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * This will check if the password and username exist in the textfield
   * if user has choice the remember me selection before.
   */
  test("get user name and password if preset", () => {
    const context = {
      userName: "abc",
      password: "abc",
      isLogin: false,
      saveLoginInfo: false,
      onChangePassword: () => {},
      onChangeUserName: () => {},
      login: () => {},
      saveLogin: () => {}
    };
    const tree = (
      <UserContext.Provider value={context}>
        <Login></Login>
      </UserContext.Provider>
    );
    const { getByTestId, container } = render(tree);

    const userNode = container.querySelector("#username") as HTMLInputElement;
    const passwordNode = container.querySelector(
      "#password"
    ) as HTMLInputElement;

    const signInLogo = getByTestId("signin");
    // find the sign in logo
    expect(signInLogo).toBeDefined();
    expect(userNode).toBeDefined();
    expect(passwordNode).toBeDefined();
    // find the input is setted
    expect(userNode.value).toBe("abc");
    expect(passwordNode.value).toBe("abc");
  });

  test("localstorage", () => {
    localStorage.setItem("a", "1");
    let i = localStorage.getItem("a");
    expect(i).toBe("1");
  });

  test("remember me function", async () => {
    const context = {
      userName: "abc",
      password: "abc",
      isLogin: false,
      saveLoginInfo: true,
      onChangePassword: () => {},
      onChangeUserName: () => {},
      login: () => {
        localStorage.setItem("username", "abc");
      },
      saveLogin: () => {}
    };
    const tree = (
      <UserContext.Provider value={context}>
        <Login></Login>
      </UserContext.Provider>
    );
    const { getByTestId, container } = render(tree);
    const btn = container.querySelector("#signInBtn") as Element;
    expect(btn).toBeDefined();
    fireEvent.click(btn);
    // make sure the data has been saved
    await wait(() => expect(localStorage.getItem("username")).toBe("abc"));
  });

  test("login with remember me function", async () => {
    const tree = (
      <UserProvider>
        <Login></Login>
      </UserProvider>
    );
    const { container } = render(tree);
    const userNode = container.querySelector("#username") as HTMLInputElement;
    const passwrodNode = container.querySelector(
      "#password"
    ) as HTMLInputElement;
    const btn = container.querySelector("#signInBtn") as Element;
    const rememberMeBtn = container.querySelector(
      "#rememberMe"
    ) as HTMLButtonElement;

    expect(userNode).toBeDefined();
    expect(passwrodNode).toBeDefined();
    expect(btn).toBeDefined();
    expect(rememberMeBtn).toBeDefined();

    fireEvent.change(userNode, { target: { value: "abc" } });
    fireEvent.change(passwrodNode, { target: { value: "abc" } });
    fireEvent.click(rememberMeBtn);
    fireEvent.click(btn);
    expect(userNode.value).toBe("abc");
    expect(passwrodNode.value).toBe("abc");
    
  });

  test("login without remember me function", async () => {
    const tree = (
      <UserProvider>
        <Login></Login>
      </UserProvider>
    );
    const { container } = render(tree);
    const userNode = container.querySelector("#username") as HTMLInputElement;
    const passwrodNode = container.querySelector(
      "#password"
    ) as HTMLInputElement;
    const btn = container.querySelector("#signInBtn") as Element;
    const rememberMeBtn = container.querySelector(
      "#rememberMe"
    ) as HTMLButtonElement;

    expect(userNode).toBeDefined();
    expect(passwrodNode).toBeDefined();
    expect(btn).toBeDefined();

    fireEvent.change(userNode, { target: { value: "abc" } });
    fireEvent.change(passwrodNode, { target: { value: "abc" } });
    fireEvent.click(rememberMeBtn);
    fireEvent.click(btn);
    expect(userNode.value).toBe("abc");
    expect(passwrodNode.value).toBe("abc");
    expect(localStorage.getItem("username")).toBeNull();
  });

});
