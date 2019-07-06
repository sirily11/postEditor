import React from "react";
import { EditorContext } from "../../model/editorContext";
import { Snackbar } from "@material-ui/core";

export default function MessageBar() {
  return (
    <div>
      <EditorContext.Consumer>
        {({ snackBarMessage, hideMessage }) => (
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            message={snackBarMessage}
            open={snackBarMessage !== ""}
            onClose={hideMessage}
            autoHideDuration={2000}
          />
        )}
      </EditorContext.Consumer>
    </div>
  );
}
