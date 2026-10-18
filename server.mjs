import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  addRegistration,
  DuplicateRegistrationError,
  InvalidEmailError,
  listRegistrations,
} from "./lib/registrations.mjs"

const root = fileURLToPath(new URL(".", import.meta.url))
const appDirectory = join(root, "app")
const port = Number(process.env.PORT ?? 4173)

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json" })
  response.end(JSON.stringify(payload))
}

async function readJson(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  return JSON.parse(Buffer.concat(chunks).toString("utf8"))
}

async function handleApi(request, response, pathname) {
  if (request.method === "GET" && pathname === "/api/registrations") {
    const registrations = await listRegistrations()
    sendJson(response, 200, { registrations })
    return true
  }

  if (request.method === "POST" && pathname === "/api/registrations") {
    try {
      const body = await readJson(request)
      const registration = await addRegistration(body.email)
      sendJson(response, 201, { registration })
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        sendJson(response, 400, { error: error.message })
      } else if (error instanceof DuplicateRegistrationError) {
        sendJson(response, 409, { error: error.message })
      } else if (error instanceof SyntaxError) {
        sendJson(response, 400, { error: "Send valid JSON" })
      } else {
        console.error(error)
        sendJson(response, 500, { error: "Registration failed" })
      }
    }
    return true
  }

  return false
}

async function serveFile(response, pathname) {
  const fileName = pathname === "/" ? "index.html" : pathname.slice(1)
  if (!new Set(["index.html", "app.js", "styles.css"]).has(fileName)) {
    response.writeHead(404)
    response.end("Not found")
    return
  }

  const body = await readFile(join(appDirectory, fileName))
  response.writeHead(200, {
    "content-type": contentTypes[extname(fileName)] ?? "application/octet-stream",
  })
  response.end(body)
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname
    if (await handleApi(request, response, pathname)) return
    await serveFile(response, pathname)
  } catch (error) {
    console.error(error)
    sendJson(response, 500, { error: "Unexpected server error" })
  }
})

server.listen(port, () => {
  console.log(`CSC 3100 AI lab running at http://localhost:${port}`)
})

