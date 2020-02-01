import React from "react";
import { Container, Grid } from "semantic-ui-react";
import { UploadField } from "./components/uploadField";
import { UploadFileList } from "./components/uploadFileList";

export function UploadPage() {
  return (
    <Container fluid>
      <Grid style={{ width: "100%" }}>
        <Grid.Column width={8}>
          <UploadField />
        </Grid.Column>
        <Grid.Column width={8}>
          <UploadFileList />
        </Grid.Column>
      </Grid>
    </Container>
  );
}
