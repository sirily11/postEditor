import React, { useContext } from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { Result, Post, Category } from "../components/model/interfaces";
import {
  DisplayProvider,
  DisplayContext
} from "../components/model/displayContext";
import HomePage from "../components/home/HomePage";
import { Route, HashRouter as Router } from "react-router-dom";
import TabBar from "../components/home/Components/TabBar";
import {
  SettingConext,
  SettingProvider
} from "../components/model/settingContext";
import { async } from "q";

jest.mock("axios");

describe("Test post context", () => {
  /**
   * Nothing except progress bar should be shown
   */
  test("get posts while loading", () => {
    const postResult: Result<Post> = {
      count: 3,
      next: "sss",
      results: [{ title: "p1", content: "p1" }]
    };
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });
    const context = {
      value: 0,
      searchWord: "",
      progress: 0,
      onChange: (newValue: number) => {},
      onSearch: (e: React.ChangeEvent<{}>) => {},
      fetch: () => {},
      fetchMore: () => {}
    };

    const tree = (
      <DisplayContext.Provider value={context}>
        <HomePage></HomePage>
      </DisplayContext.Provider>
    );
    const { container } = render(tree);
    // should display a prgressbar
    const progressbar = container.querySelector("#progress-bar");
    const err = container.querySelector("#err-msg");
    const list = container.querySelector("#post-list");
    const btn = container.querySelector("#load-btn");
    expect(progressbar).toBeDefined();
    expect(err).toBeNull();
    expect(list).toBeNull();
    expect(btn).toBeNull();
  });

  /**
   * Nothing except error message should be shown
   */
  test("get posts while error", () => {
    const postResult: Result<Post> = {
      count: 3,
      next: "sss",
      results: [{ title: "p1", content: "p1" }]
    };
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });
    const context = {
      value: 0,
      searchWord: "",
      errMsg: "Some error",
      progress: 100,
      onChange: (newValue: number) => {},
      onSearch: (e: React.ChangeEvent<{}>) => {},
      fetch: () => {},
      fetchMore: () => {}
    };

    const tree = (
      <DisplayContext.Provider value={context}>
        <HomePage></HomePage>
      </DisplayContext.Provider>
    );
    const { container } = render(tree);
    // should display a prgressbar
    const progressbar = container.querySelector("#progress-bar");
    const err = container.querySelector("#err-msg");
    const list = container.querySelector("#post-list");
    const btn = container.querySelector("#load-btn");
    expect(progressbar).toBeNull();
    expect(err).toBeDefined();
    expect(list).toBeNull();
    expect(btn).toBeNull();
  });

  /**
   * show list of post
   */
  test("get posts", () => {
    const postResult: Result<Post> = {
      count: 3,
      next: "sss",
      results: [{ title: "p1", content: "p1" }]
    };
    (axios.post as jest.Mock).mockResolvedValue({ data: postResult });
    const context = {
      postsResult: postResult,
      value: 0,
      searchWord: "",
      progress: 100,
      onChange: (newValue: number) => {},
      onSearch: (e: React.ChangeEvent<{}>) => {},
      fetch: () => {},
      fetchMore: () => {}
    };

    const tree = (
      <DisplayContext.Provider value={context}>
        <Router>
          <HomePage></HomePage>
        </Router>
      </DisplayContext.Provider>
    );
    const { container } = render(tree);
    // should display a prgressbar
    const progressbar = container.querySelector("#progress-bar");
    const err = container.querySelector("#err-msg");
    const list = container.querySelector("#post-list");
    const btn = container.querySelector("#load-btn") as Element;
    expect(progressbar).toBeNull();
    expect(err).toBeNull();
    expect(list).toBeDefined();
    expect(btn).toBeDefined();
    expect(btn).toBeEnabled();
  });
});

describe("test tabbar", () => {
  const postResult: Result<Post> = {
    count: 3,
    next: "sss",
    results: [
      { title: "p1", content: "p1" },
      { title: "p2", content: "p2" },
      { title: "p3", content: "p3" }
    ]
  };
  const categoryResult: Result<Category> = {
    count: 3,
    results: [
      {
        id: 1,
        category: "Tech"
      },
      {
        id: 2,
        category: "Game"
      }
    ]
  };
  (axios.post as jest.Mock).mockResolvedValue({ data: postResult });
  (axios.get as jest.Mock).mockResolvedValue({ data: categoryResult });

  test("number categories", async () => {
    const categoryResult: Result<Category> = {
      count: 3,
      results: [
        {
          id: 1,
          category: "Tech"
        },
        {
          id: 2,
          category: "Game"
        }
      ]
    };

    const value = {
      open: false,
      language: -1,
      categories: categoryResult.results,
      openSetting: () => {},
      closeSetting: () => {},
      addCategory: () => {}
    };

    const tree = (
      <SettingConext.Provider value={value}>
        <TabBar></TabBar>
      </SettingConext.Provider>
    );

    const { container } = render(tree);
    const tabs = container.querySelector(".MuiTabs-flexContainer") as Element;
    expect(tabs).toBeDefined();
    expect(
      ((tabs.firstChild as Element).firstChild as Element).children.length
    ).toBe(3);
  });

  test("number categories", async () => {
    const tree = (
      <SettingProvider>
        <TabBar></TabBar>
      </SettingProvider>
    );
    const { container, getByText } = render(tree);

    await wait(
      () => {
        const tabs = container.querySelector(
          ".MuiTabs-flexContainer"
        ) as Element;
        expect(tabs).toBeDefined();
        expect(
          ((tabs.firstChild as Element).firstChild as Element).children.length
        ).toBe(3);
        expect(getByText("Tech").textContent).toBe("Tech");
        expect(getByText("Game").textContent).toBe("Game");
      },
      { timeout: 100 }
    );
  });
});
