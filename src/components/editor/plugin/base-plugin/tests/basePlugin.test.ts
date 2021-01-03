import {AdditionalProps, BasePlugin, DraftBlockRenderComponent, NotImplemented} from "../index";
import {ContentBlock}                                                           from "draft-js";

class TestPlugin extends BasePlugin {


    blockRendererFn = (block?: ContentBlock, additional?: AdditionalProps): (DraftBlockRenderComponent | NotImplemented | undefined) => "B";
    blockStyleFn = (block?: ContentBlock, additional?: AdditionalProps): (string | NotImplemented | undefined) => "A"

    createPlugin(): { [p: string]: any }
    {
        return super.createPlugin();
    }
}

describe("Test Base plugin", () => {
    it("Test Plugin", () => {
        let plugin = new TestPlugin();
        let result = plugin.createPlugin();
        expect(result.blockStyleFn).toBeDefined()
        expect(result.blockRendererFn).toBeDefined()
    })
})