# Git Workflow

This repository uses a structured, incremental feature workflow and semantic commit messages. Each commit represents one complete feature or logical unit of work.

## Branching Strategy

- Create a branch per feature: `feature/<feature-name>`
- Bug fixes: `fix/<bug-name>`
- Docs-only changes: `docs/<topic>`
- Refactors: `refactor/<area>`

## Commit Message Convention (Semantic)

- Format: `type: short imperative description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Examples:
  - `feat: add player improvement endpoint`
  - `fix: handle 404 on get team by user`
  - `docs: document rate limits for players API`

### Commit Body

- Explain the WHAT and WHY
- Link issues/tickets if available
- Describe tests added and coverage

## Atomic Commits

- One commit = one self-contained feature or logical change
- Include only related changes; avoid mixing unrelated updates
- Add tests in the same commit

## Workflow Steps

1. Update main
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create feature branch
   ```bash
   git checkout -b feature/<feature-name>
   ```
3. Implement feature (code + tests)
4. Stage and commit
   ```bash
   git add -A
   git commit -m "feat: <short description>" -m "\
   WHAT: Describe changes.\n\
   WHY: Reasoning and context.\n\
   TESTS: Outline unit/integration tests.\n\
   "
   ```
5. Push branch
   ```bash
   git push -u origin feature/<feature-name>
   ```
6. Open Pull Request with summary, checklist and link to issues

## Commit Template (Optional)

Configure a local commit message template to guide authors:

```bash
git config commit.template .gitmessage.txt
```

## Hooks (Optional)

Use repo hooks to run tests before push:

```bash
git config core.hooksPath .githooks
```

## CI & Governance

- GitHub Action validates semantic commit messages with Commitlint
- CI runs build and tests for all services on PR and push

## Pull Request Checklist

- [ ] One feature or logical change only
- [ ] Commit message follows semantic convention
- [ ] Tests added/updated and passing
- [ ] API docs updated (Swagger/README) if applicable
- [ ] No unrelated changes

