
import React, { useState, useEffect } from "react";
import { Result, Post } from "../interfaces";
import { getURL } from "./settings";
import axios from "axios";
import { ContentState, EditorState, SelectionState, ContentBlock, EntityInstance } from "draft-js";

/**
 * Search post by key word
 * @param keyword Search Keyword
 */
export async function searchPost(keyword: string): Promise<Result<Post>> {
  const url = getURL("blog/post/?search=" + encodeURIComponent(keyword));
  const result = await axios.get<Result<Post>>(url);
  return result.data;
}

export function dataURLtoFile(dataurl: any, filename: string): File {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function findBlocks(contentState: ContentState, findEntityFn: (entity: EntityInstance) => boolean): { blocks: SelectionState[], data: any[], entityKeys: string[]; } {
  let data: any[] = [];
  let blocks: SelectionState[] = [];
  let entityKeys: string[] = [];

  contentState.getBlockMap().forEach((block) => {
    block?.findEntityRanges(
      (c) => {
        const charEntity = c.getEntity();
        if (charEntity) {
          const entity = contentState.getEntity(charEntity);
          if (findEntityFn(entity)) {
            data.push(entity.getData());
            entityKeys.push(charEntity);
            return true;
          }
        }
        return false;
      },
      (s, e) => {
        const selection = SelectionState.createEmpty(block.getKey()).merge({
          focusOffset: e,
          anchorOffset: s,
        });
        blocks.push(selection);
      }
    );
  });

  return {
    blocks: blocks,
    data: data,
    entityKeys: entityKeys
  };

}