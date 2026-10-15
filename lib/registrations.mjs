import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const defaultDataFile = fileURLToPath(
  new URL("../data/registrations.json", import.meta.url)
)

export class InvalidEmailError extends Error {}

export function normalizeEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase()
}

export async function listRegistrations(dataFile = defaultDataFile) {
  try {
    return JSON.parse(await readFile(dataFile, "utf8"))
  } catch (error) {
    if (error.code === "ENOENT") return []
    throw error
  }
}

export async function addRegistration(email, dataFile = defaultDataFile) {
  const normalizedEmail = normalizeEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new InvalidEmailError("Enter a valid email address")
  }

  const registrations = await listRegistrations(dataFile)
  const registration = {
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  }

  registrations.push(registration)
  await mkdir(dirname(dataFile), { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(registrations, null, 2)}\n`)

  return registration
}

