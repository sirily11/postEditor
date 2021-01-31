import { TextAlignLeftButton, TextAlignCenterButton, TextAlignRightButton } from "./buttons";
import { ContentBlock, DraftBlockRenderMap } from "draft-js";
import { AdditionalProps, BasePlugin, DraftBlockProps, DraftBlockRenderComponent, NotImplemented } from "../base-plugin";
import TextAlignCenterComponent from "./components/TextAlignCenterComponent";

export {
    TextAlignLeftButton,
    TextAlignRightButton,
    TextAlignCenterButton,
};

interface Data {
    text: string;
    alignment: string;
}

export type TextAlignProps = DraftBlockProps<Data>;


export class TextAlignPlugin extends BasePlugin {


    blockRendererFn = <TextAlignProps>(block?: ContentBlock, additional?: AdditionalProps): DraftBlockRenderComponent | NotImplemented | undefined => {
        if (block && additional) {
            if (block.getType() === "text-left") {
                console.log("left");
            } else if (block.getType() === "text-center") {
                console.log("center");
            } else if (block.getType() === 'text-right') {
                console.log("right");
            }
        }

        return undefined;
    };
}