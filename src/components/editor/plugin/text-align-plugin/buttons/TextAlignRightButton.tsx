import {createInlineStyleButton} from 'draft-js-buttons'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import React from "react";

//@ts-ignore
export default createInlineStyleButton({
    style: 'text-alignright',
    children: (
        <FormatAlignRightIcon/>
    ),
});