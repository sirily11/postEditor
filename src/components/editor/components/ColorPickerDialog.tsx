import React from "react";
import {EditorContext} from "../../model/editorContext";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from "@material-ui/core";

export default function ColorPickerDialog() {
    const {
        showColorPickerDialog,
        setShowColorPickerDialog,
    } = React.useContext(EditorContext);
    return (
        <Dialog open={showColorPickerDialog} fullWidth>
            <DialogTitle>Set Text Color</DialogTitle>
            <DialogContent>

            </DialogContent>

            <DialogActions>
                <Button onClick={() => setShowColorPickerDialog(false)}>Close</Button>
                <Button
                    onClick={async () => {
                        setShowColorPickerDialog(false);
                    }}>
                    Set
                </Button>
            </DialogActions>
        </Dialog>
    );
}
