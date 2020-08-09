import {createInlineStyleButton} from 'draft-js-buttons'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import React from "react";

//@ts-ignore
export default createInlineStyleButton({
    style: 'text-alignleft',
    children: (
        <FormatAlignLeftIcon/>
    ),
});