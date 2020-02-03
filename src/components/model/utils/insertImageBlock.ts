import {
    EditorState,
    convertToRaw,
    AtomicBlockUtils
} from "draft-js";
import image from "../../editor/plugin/image";

/**
 * insert image
 * @param imagePath image path 
 * @param editorState draft editor state
 */
export function insertImageBlock(imagePath: string, editorState: EditorState, imageID: number): Promise<EditorState> {
    return new Promise((resolve, reject) => {

        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            "image",
            'IMMUTABLE',
            { src: imagePath.replace(/ /g, '_'), id: imageID }
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