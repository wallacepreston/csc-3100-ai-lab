import assert from "node:assert/strict"
import { mkdtemp, readFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import {
  addRegistration,
  InvalidEmailError,
  normalizeEmail,
} from "../lib/registrations.mjs"

test("normalizes email identity", () => {
  assert.equal(normalizeEmail("  Mustang@CalPoly.edu "), "mustang@calpoly.edu")
})

test("persists a valid registration", async () => {
  const directory = await mkdtemp(join(tmpdir(), "csc-3100-lab-"))
  const dataFile = join(directory, "registrations.json")

  await addRegistration("mustang@calpoly.edu", dataFile)

  const registrations = JSON.parse(await readFile(dataFile, "utf8"))
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].email, "mustang@calpoly.edu")
})

test("rejects an invalid email address", async () => {
  const directory = await mkdtemp(join(tmpdir(), "csc-3100-lab-"))
  const dataFile = join(directory, "registrations.json")

  await assert.rejects(
    addRegistration("not-an-email", dataFile),
    InvalidEmailError
  )
})

