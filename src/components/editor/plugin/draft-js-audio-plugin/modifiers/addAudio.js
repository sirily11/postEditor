import {
  EditorState,
  AtomicBlockUtils,
} from 'draft-js';

// eslint-disable-next-line import/no-anonymous-default-export
export default (editorState, url, extraData) => {
  const urlType = 'IMAGE';
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE', { ...extraData, src: url });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );
  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
};
