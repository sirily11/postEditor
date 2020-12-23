import { EditorState, convertToRaw, AtomicBlockUtils, ContentBlock, Modifier } from 'draft-js';
import image from "../../editor/plugin/draft-js-image-plugin";

/**
 * insert draft-js-image-plugin
 * @param imagePath draft-js-image-plugin path
 * @param editorState draft editor state
 */
export function insertImageBlock(
  imagePath: string,
  editorState: EditorState,
  imageID: number
): Promise<EditorState> {
  return new Promise((resolve, reject) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: imagePath.replace(/ /g, "_"), id: imageID }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    const newState = AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      " "
    );
    resolve(newState);
  });
}

export function insertAudioBlock(
  audioPath: string,
  editorState: EditorState
): Promise<EditorState> {
  return new Promise((resolve, reject) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "audio",
      "IMMUTABLE",
      { src: audioPath.replace(/ /g, "_") }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    const newState = AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      " "
    );
    let raw = convertToRaw(newState.getCurrentContent());
    resolve(newState);
  });
}

export function removeBlock(editorState: any, block: ContentBlock, entityKey: string) {
  const contentState = editorState.getCurrentContent()
  const newBlockMap = contentState.blockMap.delete(block.getKey())  // this is the important one that actually deletes a block
  const newContentState = contentState.set('blockMap', newBlockMap)
  //@ts-ignore
  const newEditorState = EditorState.push(editorState, newContentState, 'remove-block')
  return newEditorState
}