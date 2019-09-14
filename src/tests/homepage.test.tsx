import React, { useContext } from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { Result, Post } from "../components/model/interfaces";
import {
  DisplayProvider,
  DisplayContext
} from "../components/model/displayContext";
import HomePage from "../components/home/HomePage";

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
   * Nothing except progress bar should be shown
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
});
