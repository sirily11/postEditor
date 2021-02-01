import { EditorState, convertToRaw, AtomicBlockUtils, ContentBlock, Modifier, genKey, SelectionState } from 'draft-js';
import image from "../../editor/plugin/draft-js-image-plugin";
import { DetailSettings, PostImage, Post } from "../interfaces";
import { VideoBlockData } from "../../editor/components/dialogs/UploadVideoDialog";

/**
 * insert draft-js-image-plugin
 * @param imagePath draft-js-image-plugin path
 * @param editorState draft editor state
 */
export function insertImageBlock(
  image: PostImage,
  editorState: EditorState,
): Promise<EditorState> {
  return new Promise((resolve, reject) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: image.image.replace(/ /g, "_"), id: image.id, description: image.description }
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
    resolve(newState);
  });
}


export function insertVideoBlock(
  video: VideoBlockData,
  editorState: EditorState
): Promise<EditorState> {
  return new Promise((resolve, _reject) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "video",
      "IMMUTABLE",
      { ...video, src: video.src.replace(/ /g, "_"), }
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

export function insertInternalLink(
  data: Post,
  editorState: EditorState
): Promise<EditorState> {
  return new Promise((resolve, _reject) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "internallink",
      "IMMUTABLE",
      { id: data.id, title: data.title, author: data.author, image_url: data.image_url, posted_time: data.posted_time }
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

export function insertSpaceBlock(

  editorState: EditorState
): EditorState {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const spacedContentState = Modifier.insertText(contentState, selectionState, " ");
  const newEditorState = EditorState.push(
    editorState,
    spacedContentState,
    'insert-characters',
  );
  return newEditorState;
}

export function insertSettingsBlock(
  detailSettings: DetailSettings,
  editorState: EditorState
): Promise<EditorState> {
  return new Promise((resolve, reject) => {
    const text = detailSettings.name;
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContent = Modifier.insertText(contentState, selection, text);
    const newContentWithEntity = newContent.createEntity(
      "POST-SETTINGS",
      "SEGMENTED",
      { id: detailSettings.id }
    );

    const entityKey = newContentWithEntity.getLastCreatedEntityKey();
    // create new selection with the inserted text
    const anchorOffset = selection.getAnchorOffset();
    const newSelection = new SelectionState({
      anchorKey: selection.getAnchorKey(),
      anchorOffset,
      focusKey: selection.getAnchorKey(),
      focusOffset: anchorOffset + text.length,
    });
    // and aply link entity to the inserted text
    const newContentWithLink = Modifier.applyEntity(
      newContentWithEntity,
      newSelection,
      entityKey,
    );
    // create new state with link text
    const withLinkText = EditorState.push(
      editorState,
      newContentWithLink,
      'insert-characters',
    );
    // now lets add cursor right after the inserted link
    const withProperCursor = EditorState.forceSelection(
      withLinkText,
      newContent.getSelectionAfter(),
    );

    resolve(withProperCursor);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeBlock(editorState: any, block: ContentBlock, entityKey: string) {
  const contentState = editorState.getCurrentContent();
  const newBlockMap = contentState.blockMap.delete(block.getKey());  // this is the important one that actually deletes a block
  const newContentState = contentState.set('blockMap', newBlockMap);
  //@ts-ignore
  const newEditorState = EditorState.push(editorState, newContentState, 'remove-block');
  return newEditorState;
}