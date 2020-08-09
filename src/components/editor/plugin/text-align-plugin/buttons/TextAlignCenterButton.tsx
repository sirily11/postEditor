import {createInlineStyleButton} from 'draft-js-buttons'
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import React from "react";

//@ts-ignore
export default createInlineStyleButton({
    style: 'text-aligncenter',
    children: (
        <FormatAlignCenterIcon/>
    ),
});