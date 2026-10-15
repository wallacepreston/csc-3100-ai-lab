# Feature request

Prevent duplicate event registrations.

## Acceptance criteria

- Treat email addresses as equal after trimming whitespace and converting to lowercase.
- Reject a second registration with HTTP status `409` and the message `Already registered`.
- Keep duplicate protection after a page reload or server restart.
- Preserve successful registration and invalid-email behavior.
- Add tests that prove the duplicate case.

## Scope

Keep the JSON datastore. A production database would enforce uniqueness atomically, but this lab focuses on the request path and verification.

