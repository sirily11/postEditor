/** @format */

import axios from "axios";
import { DisplayProvider } from "../../components/model/displayContext";
import { Category, Post, Result } from "../../components/model/interfaces";
import HomePage from "../../components/home/HomePage";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SettingProvider } from "../../components/model/settingContext";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const content =
  '{"blocks":[{"key":"6k8kp","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

const categoryResults: Category[] = [
  {
    id: 1,
    category: "a",
  },
  {
    id: 2,
    category: "b",
  },
];

const postResults: Result<Post> = {
  count: 2,
  results: [
    {
      title: "Hello world",
      content: content,
      images: [],
      settings: {},
      post_category: categoryResults[0],
    },
    {
      title: "Hello world 1",
      content: content,
      images: [],
      settings: {},
      post_category: categoryResults[1],
    },
  ],
};

describe("Load Failed", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  test("Load Failed", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.reject(new Error("Network error"))
    );
    const component = (
      <DisplayProvider>
        <HomePage />
      </DisplayProvider>
    );

    render(component);
    const refreshBtn = await screen.findByTestId("err-msg");
    expect(refreshBtn).toBeInTheDocument();
    fireEvent.click(refreshBtn);
    expect(mockedAxios.get).toBeCalledTimes(2);
  });
});

describe("Load homepage", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("blog/category/")) {
        return Promise.resolve({
          data: categoryResults,
          status: 200,
          statusText: "ok",
        });
      } else {
        return Promise.resolve({
          data: postResults,
          status: 200,
          statusText: "ok",
        });
      }
    });
  });

  test("", async () => {
    const component = (
      <DisplayProvider>
        <SettingProvider>
          <HomePage />
        </SettingProvider>
      </DisplayProvider>
    );

    render(component);
    expect(await screen.findByText("a")).toBeInTheDocument();
    expect(await screen.findByText("b")).toBeInTheDocument();
  });
});
