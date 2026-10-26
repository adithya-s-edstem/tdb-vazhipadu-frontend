# Workflow

## Lifecycle of a ticket

1. **Ticket** – a GitHub issue written from `.github/ISSUE_TEMPLATE/ticket.md`, linking to docs. Each problem has
   exactly one issue in its milestone (see [milestones.md](milestones.md)).
2. **Branch** – from latest `main`: the branch named in the problem spec, or `chore/<issue-number>-<slug>` for work
   outside the problems.
3. **Commits** – small, meaningful, imperative: `Add offering search`, `Show order total in rupees`.
   Never `fix`, `changes`, `wip` or `final`.
4. **PR** – into `main`, body from `.github/pull_request_template.md`, `Closes #<issue>`.
5. **Review** – functional check first, then style and quality. At least one inline comment on a specific line.
6. **Address** – each comment gets a follow-up commit or a short reply explaining why no change is needed.
7. **Merge** – squash merge, delete branch, then pull `main` before the next dependent ticket starts.

## Rules

- All work, including docs and setup, goes through an issue and a PR. No direct commits to `main`.
- One problem, one issue, one branch, one PR.
- `npm run build`, `npm run lint` and `npm test -- --run` pass before a PR is opened.
- Every PR fills in **Assumptions** even if the answer is "None".
- PRs merge in milestone order. A ticket that depends on another waits for that merge, then rebases on `main`.

## Definition of done

- Every acceptance criterion in the linked spec has a passing test or a written walkthrough in the PR.
- Build, lint and tests are green.
- Review findings are resolved.
- Any new lasting decision is in `docs/architecture/decisions.md`.
