import { mkdir, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const dataFile = fileURLToPath(
  new URL("../data/registrations.json", import.meta.url)
)

await mkdir(dirname(dataFile), { recursive: true })
await writeFile(dataFile, "[]\n")
console.log("Demo registrations reset")

