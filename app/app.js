const form = document.querySelector("[data-form]")
const status = document.querySelector("[data-status]")
const count = document.querySelector("[data-count]")

async function refreshCount() {
  const response = await fetch("/api/registrations")
  const payload = await response.json()
  count.textContent = payload.registrations.length
}

form.addEventListener("submit", async event => {
  event.preventDefault()
  status.dataset.tone = ""
  status.textContent = "Submitting…"

  const email = new FormData(form).get("email")
  const response = await fetch("/api/registrations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  })
  const payload = await response.json()

  if (!response.ok) {
    status.dataset.tone = "error"
    status.textContent = payload.error ?? "Registration failed"
    return
  }

  status.dataset.tone = "success"
  status.textContent = `Seat reserved for ${payload.registration.email}`
  form.reset()
  await refreshCount()
})

refreshCount()

