# CSC 3100 AI lab

This tiny event signup app has one missing feature: it accepts duplicate email addresses. Your pair will use Codex or Cursor to add duplicate protection, test it, and explain the change.

## Before the timer

1. Open this folder in Codex or Cursor.
2. Run `npm test`.
3. Run `npm run dev`, then open <http://localhost:4173>.
4. Read [TASK.md](TASK.md).

The app uses only Node.js. There is nothing to install.

## Give the agent durable context

Ask the agent to create these files before it changes the feature. Keep each file short.

### `AGENTS.md`

Use this for repository-wide commands, structure, and boundaries.

```md
Run `npm test` before and after a change. Keep the API response shape stable. Make the smallest change that satisfies TASK.md, then explain the evidence.
```

### `.agents/rules/registration.md`

Use rules for constraints that should apply every time.

```md
Email identity uses trimmed, lowercase text. The datastore decides whether a registration already exists. Browser validation alone is insufficient.
```

### `.agents/skills/verify-registration/SKILL.md`

Use a skill for a repeatable workflow with a clear finish line.

```md
Run the tests. Start the server and submit the same email twice with different capitalization. Record both status codes and stop the server.
```

### `.agents/memory/decisions.md`

Use memory for decisions worth carrying into later work.

```md
Duplicate means the same normalized email. A production system would also enforce uniqueness in its database and handle concurrent requests.
```

## Ten-minute workflow

1. Ask the agent to inspect the repository and propose a short plan.
2. Check the plan against TASK.md.
3. Let the agent implement one bounded change.
4. Run the tests and try the app.
5. Review the diff. Write one correction or remaining uncertainty.

Reset the demo data with `npm run reset`.

