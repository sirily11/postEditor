import axios from "axios"
import { searchPost } from "../components/model/utils/utils"
import { Result, Post } from '../components/model/interfaces';

jest.mock("axios")

describe("Test utils", () => {
    const rsp: Result<Post> = { count: 1, results: [{ title: "Some title", content: "1234" }] };
    (axios.get as jest.Mock).mockResolvedValue({ data: rsp })
    test("Test search function", async () => {
        let result = await searchPost("Hello")
        expect(result.count).toBe(1)
        expect(result.results).toBe(rsp.results)
    })


})  