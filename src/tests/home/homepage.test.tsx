/** @format */

import axios from "axios";
import { DisplayProvider } from "../../components/model/displayContext";
import { Category, Post, Result } from "../../components/model/interfaces";
import HomePage from "../../components/home/HomePage";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SettingProvider } from "../../components/model/settingContext";
import TabBar from "../../components/home/Components/TabBar";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const content =
  '{"blocks":[{"key":"6k8kp","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

const categoryResults: Result<Category> = {
  count: 2,
  results: [
    {
      id: 1,
      category: "a",
    },
    {
      id: 2,
      category: "b",
    },
  ],
};

const postResults: Result<Post> = {
  count: 2,
  results: [
    {
      title: "Hello world",
      content: content,
      images: [],
      settings: {},
      post_category: categoryResults.results[0],
    },
    {
      title: "Hello world 1",
      content: content,
      images: [],
      settings: {},
      post_category: categoryResults.results[1],
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
  afterEach(() => {
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

  test("Test load posts and categories", async () => {
    const component = (
      <DisplayProvider>
        <SettingProvider>
          <HomePage />
        </SettingProvider>
      </DisplayProvider>
    );

    render(component);
    expect(await screen.findByText("b")).toBeInTheDocument();
  });

  test("Test add new category", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        id: 3,
        category: "new category",
      },
    });

    const component = (
      <DisplayProvider>
        <SettingProvider>
          <HomePage />
        </SettingProvider>
      </DisplayProvider>
    );

    render(component);
    const addCategoryButton = await screen.findByTestId("add-category");
    fireEvent.click(addCategoryButton);
    const categoryField = (await screen.findByTestId(
      "category-field"
    )) as HTMLInputElement;
    const addBtn = await screen.findByTestId("add");

    expect(categoryField).toBeInTheDocument();

    fireEvent.change(categoryField, { target: { value: "new category" } });
    expect(categoryField.value).toBe("new category");

    fireEvent.click(addBtn);
    expect(await screen.findByText("new category")).toBeInTheDocument();
  });

  test("delete category", async () => {
    mockedAxios.delete.mockResolvedValue({
      data: {
        id: 2,
        category: "b",
      },
    });

    const component = (
      <DisplayProvider>
        <SettingProvider>
          <TabBar />
        </SettingProvider>
      </DisplayProvider>
    );

    render(component);
    window.confirm = jest.fn(() => true);
    let deleteBtn = await screen.findByTestId("delete-1");
    expect(await screen.findByText("a")).toBeInTheDocument();
    expect(await screen.findByText("b")).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(window.confirm).toBeCalledTimes(1);
    expect(await screen.findByText("a")).not.toBeInTheDocument();
    expect(await screen.findByText("b")).toBeInTheDocument();
  });
});
