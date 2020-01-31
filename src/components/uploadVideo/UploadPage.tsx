import React from "react";
import {Container, Grid} from 'semantic-ui-react'
import {UploadField} from "./components/uploadField";
import {UploadFileList} from "./components/uploadFileList";


export function UploadPage() {

    return <Container>
        <Grid style={{width: "100%"}}>
            <UploadField/>
            <UploadFileList/>
        </Grid>
    </Container>
}