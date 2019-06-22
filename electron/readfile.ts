import fs from "fs"

export function readFile(path: string) {
  let data = fs.readFileSync(path, { encoding: "base64" })
  return data
}

