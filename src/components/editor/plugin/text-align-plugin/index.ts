import {CSSProperties} from "react";
import {TextAlignLeftButton, TextAlignCenterButton, TextAlignRightButton} from "./buttons";
import {ContentBlock, DraftInlineStyle} from "draft-js";
import {Map} from "immutable";
import {AdditionalProps, BasePlugin} from "../base-plugin";

export {
    TextAlignLeftButton,
    TextAlignRightButton,
    TextAlignCenterButton,
}


export class TextAlignPlugin extends BasePlugin {


    customStyleMap: { [name: string]: CSSProperties } = {
        "text-alignleft": {
            textAlign: "left"
        },
        "text-alignright": {
            textAlign: "right"
        },
        "text-aligncenter": {
            textAlign: "center"
        },
    };

}

// export default () => {
//
//     const blockRenderMap = Map({
//         'unstyled': {
//             element: 'div'
//         }
//     });
//
//     return {
//         blockRenderMap: blockRenderMap,
//         customStyleMap: <{ [name: string]: CSSProperties }>{
//             "text-alignleft": {
//                 textAlign: "left"
//             },
//             "text-alignright": {
//                 textAlign: "right"
//             },
//             "text-aligncenter": {
//                 textAlign: "center"
//             },
//         },
//     };
// };