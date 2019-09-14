import {
    EditorState,
    convertToRaw,
    AtomicBlockUtils
} from "draft-js";

/**
 * insert image
 * @param imagePath image path 
 * @param editorState draft editor state
 */
export function insertImageBlock(imagePath: string, editorState: EditorState): Promise<EditorState> {
    return new Promise((resolve, reject) => {

        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            "image",
            'IMMUTABLE',
            { src: imagePath.replace(/ /g, '_') }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            { currentContent: contentStateWithEntity }
        );
        const newState = AtomicBlockUtils.insertAtomicBlock(
            newEditorState,
            entityKey,
            ' '
        )
        let raw = convertToRaw(newState.getCurrentContent())
        resolve(newState)
    })
}   