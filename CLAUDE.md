# Project notes

This public repo holds the website only: `index.html`, `css`, `js`, `book`, `favicon.svg`, `og-image.png`.

Put internal material in the private repo `aboutali/thelengthclub-internal`: sales texts, print files, social media material, client lists, scripts and kDrive details.

When you add a new top-level website file or folder, add it to the "Collect site files" step in `.github/workflows/deploy.yml`.

## Work in parallel

Two people work on this repo at the same time, each with their own Claude Code sessions.

1. Start each task from the newest `main`. Run `git fetch origin main` and branch from `origin/main`.
2. Use one branch per task. Never commit to `main` directly.
3. Push only your own branch. Never force-push `main` or a branch the other person pushed to.
4. Merge into `main` through a pull request. Keep pull requests small and merge them soon.
5. Before you merge, merge `origin/main` into your branch. Open the page locally and check it.
6. A push rejected as non-fast-forward means the other person pushed first. Fetch, merge, check and push again.
7. In a conflict, keep both people's changes. Ask the user when both changed the same sentence or value.

The hook `.claude/hooks/git_guard.py` enforces rules 2 and 3 for every Claude Code session. It blocks a commit on `main`, a push to `main` and every force push. Never disable, edit around or bypass this hook. If it blocks a step, follow its message.

Each merge into `main` deploys the site. A newer deploy cancels a running one, so the site always shows the newest `main`.

The team rules for kDrive live in the private repo `aboutali/thelengthclub-internal`.
