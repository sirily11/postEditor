import React from "react";
import PaletteIcon from '@material-ui/icons/Palette';
import ColorPicker from "./ColorPicker";

interface Props {
    getEditorState: any;
    onOverrideContent: any;
    setEditorState: any;
    theme: any
}

export default function PickColorButton(props: Props) {
    const {theme, onOverrideContent} = props;
    return (
        <div className={theme.buttonWrapper} onMouseDown={(e) => {
            e.preventDefault()
        }}>
            <button className={theme.button} onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const content = (props: Props) =>
                    <ColorPicker {...props}/>
                onOverrideContent(content)
            }}>
                <PaletteIcon/>
            </button>
        </div>

    );
}
