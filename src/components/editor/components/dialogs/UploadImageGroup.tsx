/** @format */

import React from "react";
import { DialogTypes, EditorContext } from "../../../model/editorContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CardMedia,
  Tooltip,
  Typography,
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
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
  TableSelection,
} from "@devexpress/dx-react-grid-material-ui";
import {
  Column,
  DataTypeProvider,
  DataTypeProviderProps,
  IntegratedPaging,
  PagingState,
  SelectionState,
} from "@devexpress/dx-react-grid";
import SlideshowIcon from "@material-ui/icons/Slideshow";

export enum GroupTypes {
  Slide = "slide",
  Grid = "grid",
}

export interface GroupImage {
  id: string;
  images: PostImage[];
  type: GroupTypes;
}

//@ts-ignore
const ImageComponent = ({ value }) => (
  <CardMedia image={value} style={{ height: 100, width: "100%" }} />
);

const ImageTypeProvider = (props: DataTypeProviderProps) => (
  <DataTypeProvider formatterComponent={ImageComponent} {...props} />
);

export default function UploadImageGroupDialog() {
  const {
    showUploadDialog,
    setShowUploadDialog,
    post,
    insertGroupImages,
    updateGroupImages,
  } = React.useContext(EditorContext);
  const [initValue, setInitValue] = React.useState<GroupImage | undefined>();
  const [selectedImages, setSelectedImages] = React.useState<number[]>([]);

  const onClose = React.useCallback(() => {
    setShowUploadDialog(false);
    setInitValue(undefined);
    setSelectedImages([]);
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line no-debugger
    if (showUploadDialog?.selectedData) {
      setInitValue(showUploadDialog.selectedData as GroupImage);
      let ids = [];
      for (let s of (showUploadDialog.selectedData as GroupImage).images) {
        let index = post.images.findIndex((i) => i.id === s.id);
        if (index >= 0) {
          ids.push(index);
        }
      }
      setSelectedImages(ids);
    } else {
      //
      const data: GroupImage = {
        id: v4(),
        images: [],
        type: GroupTypes.Grid,
      };
      setInitValue(data);
    }
  }, [showUploadDialog]);

  const rows = post.images.map((img, i) => {
    return {
      id: img.id,
      image: img.image,
      description: img.description,
    };
  });

  const columns: Column[] = [
    { name: "id", title: "ID" },
    {
      name: "image",
      title: "Image",
    },
    { name: "description", title: "Description" },
  ];

  return (
    <Dialog
      open={showUploadDialog?.dialogType === DialogTypes.ImageGroup}
      onClose={onClose}
      fullWidth>
      <DialogTitle>Insert Group Images</DialogTitle>
      {initValue && (
        <Formik
          initialValues={initValue}
          onSubmit={(values, { setSubmitting }) => {
            const data: GroupImage = {
              type: values.type,
              id: values.id,
              images: post.images.filter((img, i) =>
                selectedImages.includes(i)
              ),
            };
            if (!showUploadDialog?.selectedData) {
              insertGroupImages(data);
            } else {
              updateGroupImages(data);
            }
            setSubmitting(false);
            onClose();
          }}>
          {({ submitForm, isSubmitting, touched, errors, values }) => (
            <Form>
              <DialogContent>
                <Typography>Group Type</Typography>
                <Field
                  style={{ marginBottom: 10 }}
                  component={ToggleButtonGroup}
                  name="type"
                  exclusive
                  type="text">
                  <ToggleButton value="grid">
                    <Tooltip title="grid">
                      <AppsIcon />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="slide">
                    <Tooltip title="slide">
                      <SlideshowIcon />
                    </Tooltip>
                  </ToggleButton>
                </Field>

                <Grid rows={rows} columns={columns}>
                  <PagingState defaultCurrentPage={0} pageSize={3} />
                  <IntegratedPaging />
                  <ImageTypeProvider for={["image"]} />
                  <Table />
                  <SelectionState
                    selection={selectedImages}
                    onSelectionChange={(selections) => {
                      setSelectedImages(selections as number[]);
                    }}
                  />
                  <TableHeaderRow />
                  <TableSelection />
                  <PagingPanel />
                </Grid>
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
