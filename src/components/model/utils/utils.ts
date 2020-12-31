import React, { useState, useEffect } from "react";
import { Result, Post } from "../interfaces";
import { getURL } from "./settings";
import axios from "axios";
import { EditorState, SelectionState } from "draft-js";

/**
 * Search post by key word
 * @param keyword Search Keyword
 */
export async function searchPost(keyword: string): Promise<Result<Post>> {
  let url = getURL("blog/post/?search=" + encodeURIComponent(keyword));
  let result = await axios.get<Result<Post>>(url);
  return result.data;
}

export function dataURLtoFile(dataurl: any, filename: string) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
