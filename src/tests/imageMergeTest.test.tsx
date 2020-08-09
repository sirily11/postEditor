import { insertImageBlock } from "../components/model/utils/insertImageBlock";
import {
  EditorState,
  RichUtils,
  DraftEditorCommand,
  convertToRaw,
  convertFromRaw,
  genKey,
  ContentBlock,
  ContentState
} from "draft-js";

describe("Test insert draft-js-image-plugin", () => {
  const initialState: any = {
    entityMap: {
      "0": {
        type: "IMAGE",
        mutability: "IMMUTABLE",
        data: {
          src: "/images/canada-landscape-small.jpg"
        }
      }
    },
    blocks: [
      {
        key: "9gm3s",
        text:
          "You can have images in your text field which are draggable. Hover over the draft-js-image-plugin press down your mouse button and drag it to another position inside the editor.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      },
      {
        key: "ov7r",
        text: " ",
        type: "atomic",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 1,
            key: 0
          }
        ],
        data: {}
      }
    ]
  };
  let editorState: EditorState = EditorState.createEmpty();

  beforeEach(() => {
    editorState = EditorState.createWithContent(convertFromRaw(initialState));
  });

  test("Insert draft-js-image-plugin", async () => {
    let newState: EditorState = await insertImageBlock(
      "test_image.png",
      editorState
    );
    let raw = convertToRaw(newState.getCurrentContent());
    expect(raw.entityMap[1]).toBeDefined();
    expect(raw.blocks.length).toBe(4);
  });
});
