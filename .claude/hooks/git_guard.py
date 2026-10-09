#!/usr/bin/env python3
"""PreToolUse hook: stop Claude from changing main directly.

Blocks three git commands, because two people work on this repo at once:
- a commit while main is checked out,
- a push to main,
- a force push to any branch.
Exit code 2 blocks the Bash call and shows the message to Claude.
"""
import json, re, shlex, subprocess, sys

PROTECTED = {"main", "master"}
FORCE = ("--force", "-f", "--force-with-lease", "--force-if-includes", "--mirror", "--all", "--delete", "-d")
RULE = "Team rule (CLAUDE.md, 'Work in parallel'): "


def block(reason):
    print(RULE + reason, file=sys.stderr)
    sys.exit(2)


def branch(cwd):
    try:
        return subprocess.run(["git", "-C", cwd, "rev-parse", "--abbrev-ref", "HEAD"],
                              capture_output=True, text=True, timeout=5).stdout.strip()
    except Exception:
        return ""


def targets_main(ref, cwd):
    dest = ref.lstrip("+").split(":")[-1].removeprefix("refs/heads/")
    return (branch(cwd) if dest in ("HEAD", "@") else dest) in PROTECTED


def check(words, cwd):
    i = words.index("git") + 1
    while i < len(words) and words[i].startswith("-"):  # global options such as -C dir or -c key=value
        if words[i] in ("-C", "-c") and i + 1 < len(words):
            if words[i] == "-C":
                cwd = words[i + 1]
            i += 1
        i += 1
    if i >= len(words):
        return
    sub, args = words[i], words[i + 1:]
    if sub == "commit" and branch(cwd) in PROTECTED:
        block("never commit on main. Create a branch from origin/main first: git switch -c <branch> origin/main.")
    if sub == "push":
        if any(a == f or a.startswith(f + "=") for a in args for f in FORCE) or any(a.startswith("+") for a in args):
            block("never force-push, delete branches or push all refs. Fetch, merge origin/main into your branch and push again.")
        refs = [a for a in args if not a.startswith("-")][1:]  # the first plain word is the remote
        if any(targets_main(r, cwd) for r in refs) or (not refs and branch(cwd) in PROTECTED):
            block("never push to main. Push your own branch and merge it through a pull request.")


def main():
    data = json.load(sys.stdin)
    command = (data.get("tool_input") or {}).get("command", "")
    if "git" not in command:
        return
    cwd = data.get("cwd") or "."
    for part in re.split(r"&&|\|\||;|\||\n", command):
        try:
            words = shlex.split(part)
        except ValueError:
            words = part.split()
        if words[:1] == ["cd"] and len(words) > 1:
            cwd = words[1] if words[1].startswith("/") else f"{cwd}/{words[1]}"
        elif "git" in words:
            check(words, cwd)


main()
