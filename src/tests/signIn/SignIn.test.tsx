/** @format */
import React from "react";
import axios from "axios";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserContext, UserProvider } from "../../components/model/userContext";
import { LoginPage } from "../../components/login/LoginPage";
import "@testing-library/jest-dom";
import { HashRouter } from "react-router-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("test sign in page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Test doesn't have stored username and password", async () => {
    mockedAxios.post.mockResolvedValue({ data: { access: "abcde" } });
    let component = (
      //@ts-ignore
      <UserProvider>
        <LoginPage />
      </UserProvider>
    );
    render(component);
    const password = screen.getByTestId("password") as HTMLInputElement;
    const username = screen.getByTestId("username") as HTMLInputElement;
    const loginButton = screen.getByTestId("signInBtn");

    fireEvent.change(username, { target: { value: "username" } });
    fireEvent.change(password, { target: { value: "password" } });
    expect(username.value).toBe("username");
    expect(password.value).toBe("password");
    expect(loginButton).toHaveTextContent("Sign In");

    fireEvent.click(loginButton);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  test("Test doesn't have stored username and password and click store", async () => {
    mockedAxios.post.mockResolvedValue({ data: { access: "abcde" } });
    let component = (
      //@ts-ignore
      <UserProvider>
        <LoginPage />
      </UserProvider>
    );
    render(component);
    const password = screen.getByTestId("password") as HTMLInputElement;
    const username = screen.getByTestId("username") as HTMLInputElement;
    const loginButton = screen.getByTestId("signInBtn");
    const rememberMeBtn = screen.getByTestId("rememberMe");
    const spy = jest.spyOn(Storage.prototype, "setItem");

    fireEvent.change(username, { target: { value: "username" } });
    fireEvent.change(password, { target: { value: "password" } });
    expect(username.value).toBe("username");
    expect(password.value).toBe("password");
    expect(loginButton).toHaveTextContent("Sign In");

    fireEvent.click(rememberMeBtn);
    fireEvent.click(loginButton);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
