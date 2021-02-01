/** @format */

import React from "react";
import cx from "clsx";
import { blueGrey } from "@material-ui/core/colors";
import NoSsr from "@material-ui/core/NoSsr";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Column, Row } from "@mui-treasury/components/flex";
import { Item } from "@mui-treasury/components/flex";
import Grid from "@material-ui/core/Grid";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import { CardActions } from "@material-ui/core";
import { EditorContext } from "../model/editorContext";
import { PostImage } from "../model/interfaces";

const useButtonStyles = makeStyles(() => ({
  root: {
    fontFamily: "'Kanit', san-serif",
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    "&:hover": {
      backgroundColor: blueGrey[50],
    },
  },
  contained: {
    borderRadius: 40,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: blueGrey[50],
    color: blueGrey[700],
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
    },
    "&:focus": {
      boxShadow: "none",
    },
  },
  containedPrimary: {
    transition:
      "250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    backgroundColor: "#ffbd80",
    color: blueGrey[900],
    "&:hover": {
      backgroundColor: "#FF9A3E",
    },
  },
}));

const useStyles = makeStyles(() => ({
  card: {
    border: "1px solid",
    borderColor: "#cfd8dc",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  titleFont: {
    fontFamily: "'Kanit', san-serif",
    color: "#37474f",
  },
  header: {
    margin: 0,
    textAlign: "center",
    fontSize: "1.25rem",
    letterSpacing: "1px",
  },
  ribbon: {
    textAlign: "center",
    color: "rgba(0,0,0,0.87)",
    letterSpacing: 1,
  },
}));

export function PostImageCard(props: {
  image: PostImage;
  onAdd: any;

  onDelete: any;
}) {
  const styles = useStyles();
  const btnStyles = useButtonStyles();
  const { image, onAdd, onDelete } = props;
  const { setShowImageEditDialog } = React.useContext(EditorContext);

  return (
    <Grid item xs={6} md={4}>
      <Card variant="outlined">
        <Box maxWidth={343}>
          <Column p={0} gap={3}>
            <CardMedia image={image.image} style={{ height: 180 }} />
            <CardContent>
              <Typography>{image.description}</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => onAdd()}>Add</Button>
              <Button
                onClick={() =>
                  setShowImageEditDialog(true, {
                    src: image.image,
                    id: image.id,
                    description: image.description,
                  })
                }>
                Edit
              </Button>
              <Button
                onClick={async () => {
                  let confirm = window.confirm("Do you want to delete");
                  if (confirm) {
                    await onDelete();
                  }
                }}>
                Delete
              </Button>
            </CardActions>
          </Column>
        </Box>
      </Card>
    </Grid>
  );
}
