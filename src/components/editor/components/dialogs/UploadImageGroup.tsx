/** @format */

import React from "react";
import { DialogTypes, EditorContext } from "../../../model/editorContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
} from "@material-ui/core";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { v4 } from "uuid";
import { Box } from "@material-ui/core";
import {
  Autocomplete,
  ToggleButtonGroup,
  AutocompleteRenderInputParams,
} from "formik-material-ui-lab";
import { PostImage } from "../../../model/interfaces";
import { ToggleButton } from "@material-ui/lab";
import AppsIcon from "@material-ui/icons/Apps";

export enum GroupTypes {
  Slide,
  Grid,
}

export interface GroupImage {
  id: string;
  images: PostImage[];
  type: GroupTypes;
}

export default function UploadVideoDialog() {
  const {
    showUploadDialog,
    setShowUploadDialog,
    insertVideo,
    updateVideo,
  } = React.useContext(EditorContext);
  const [initValue, setInitValue] = React.useState<GroupImage | undefined>();

  const onClose = React.useCallback(() => {
    setShowUploadDialog(false);
    setInitValue(undefined);
  }, []);

  React.useEffect(() => {
    if (showUploadDialog?.selectedData) {
      setInitValue(showUploadDialog.selectedData as GroupImage);
    } else {
      //
    }
  }, [showUploadDialog]);

  return (
    <Dialog
      open={showUploadDialog?.dialogType === DialogTypes.Video}
      onClose={onClose}
      fullWidth>
      {initValue && (
        <Formik
          initialValues={initValue}
          onSubmit={(values, { setSubmitting }) => {
            if (!showUploadDialog?.selectedData) {
              //
            } else {
              //
            }
            console.log(values);
            setSubmitting(false);
            onClose();
          }}>
          {({ submitForm, isSubmitting, touched, errors, values }) => (
            <Form>
              <DialogTitle>Insert Group Images</DialogTitle>
              <DialogContent>
                <Field
                  component={ToggleButtonGroup}
                  name="toggle"
                  type="checkbox">
                  <ToggleButton value="left" aria-label="left aligned">
                    <AppsIcon />
                  </ToggleButton>
                </Field>
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => {
                    onClose();
                  }}>
                  Close
                </Button>
                <Button type="submit">Upload</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
