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
import DeleteIcon from "@material-ui/icons/Delete";

export interface VideoBlockData {
  id?: string;
  src: string;
  description: string;
  captions: CaptionBlockData[];
}

export interface CaptionBlockData {
  src: string;
  lang: string;
}

export default function UploadVideoDialog() {
  const {
    showUploadDialog,
    setShowUploadDialog,
    insertVideo,
    updateVideo,
  } = React.useContext(EditorContext);
  const [initValue, setInitValue] = React.useState<
    VideoBlockData | undefined
  >();

  const onClose = React.useCallback(() => {
    setShowUploadDialog(false);
    setInitValue(undefined);
  }, []);

  React.useEffect(() => {
    if (showUploadDialog?.selectedData) {
      setInitValue(showUploadDialog.selectedData);
    } else {
      setInitValue({
        src: "",
        description: "",
        captions: [],
      });
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
          validate={(values) => {
            const errors: Partial<VideoBlockData> = {};
            const pattern = new RegExp(
              "^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$",
              "i"
            );
            if (!values.src) {
              errors.src = "Required";
            } else {
              let vaild = !!pattern.test(values.src);
              if (!vaild) {
                errors.src = "Invild URL";
              }
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            if (!showUploadDialog?.selectedData) {
              insertVideo({ ...values, id: v4() });
            } else {
              updateVideo(values);
            }

            setSubmitting(false);
            onClose();
          }}>
          {({ submitForm, isSubmitting, touched, errors, values }) => (
            <Form>
              <DialogTitle>Upload Video by URL</DialogTitle>
              <DialogContent>
                <Field
                  component={TextField}
                  fullWidth
                  name="src"
                  label="Video URL"
                  color="secondary"
                />

                <Field
                  component={TextField}
                  fullWidth
                  name="description"
                  label="Video Description"
                  color="secondary"
                />

                <FieldArray
                  name="captions"
                  render={(arrayHelpers) => (
                    <div>
                      <Grid container>
                        {values.captions.map((s, i) => (
                          <Grid
                            key={i}
                            container
                            spacing={2}
                            style={{ marginBottom: 10 }}>
                            <Grid item xs={6}>
                              <Field
                                name={`captions.${i}.src`}
                                component={TextField}
                                color="secondary"
                                fullWidth
                                label="Caption Src"
                                variant="filled"
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <Field
                                name={`captions.${i}.lang`}
                                component={TextField}
                                color="secondary"
                                fullWidth
                                label="Caption Lanugage"
                                variant="filled"
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton
                                onClick={() => {
                                  arrayHelpers.remove(i);
                                }}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                      <Button
                        onClick={() => {
                          arrayHelpers.push(v4());
                        }}>
                        Add Subtitle
                      </Button>
                    </div>
                  )}
                />
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
