#!/usr/bin/env python3
"""Apply the kDrive archive rule to the team folder.

Files follow YYYYMMDD-TITLE-Vx.ext. Per folder, keep the newest version of each
TITLE and the two versions before it. Move every older version into the
folder's _archive subfolder. Every folder with versioned files gets an _archive.

Usage: INFOMANIAK_TOKEN=... KDRIVE_ID=... python3 scripts/kdrive_archive.py [--apply] [--root ID]
Without --apply the script only prints what it would do.
"""
import json, os, re, sys, urllib.request

API = "https://api.infomaniak.com/3/drive/{drive}"
NAME = re.compile(r"^(\d{8})-(.+)-V(\d+)(\.[^.]+)?$")
KEEP = 3  # newest version plus the two before it
ARCHIVE = "_archive"

token, drive = os.environ["INFOMANIAK_TOKEN"], os.environ["KDRIVE_ID"]
apply = "--apply" in sys.argv
root = int(sys.argv[sys.argv.index("--root") + 1]) if "--root" in sys.argv else 12  # Common documents › Shared


def call(method, path, body=None):
    req = urllib.request.Request(API.format(drive=drive) + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    data = json.load(urllib.request.urlopen(req))
    if data.get("result") != "success":
        raise RuntimeError(f"{method} {path}: {data.get('error')}")
    return data


def children(folder):
    items, cursor = [], None
    while True:
        data = call("GET", f"/files/{folder}/files?limit=200" + (f"&cursor={cursor}" if cursor else ""))
        items += data["data"]
        if not data.get("has_more"):
            return items
        cursor = data["cursor"]


def process(folder, path):
    items = children(folder)
    dirs = [i for i in items if i["type"] == "dir"]
    groups = {}
    for f in items:
        m = f["type"] == "file" and NAME.match(f["name"])
        if m:
            groups.setdefault((m[2], (m[4] or "").lower()), []).append((int(m[3]), f))
    if groups:
        archive = next((d for d in dirs if d["name"] == ARCHIVE), None)
        if archive is None:
            print(f"create  {path}/{ARCHIVE}")
            archive = call("POST", f"/files/{folder}/directory", {"name": ARCHIVE})["data"] if apply else {"id": None}
        for versions in groups.values():
            newest = max(v for v, _ in versions)
            for v, f in versions:
                if v <= newest - KEEP:
                    print(f"archive {path}/{f['name']}  (newest V{newest})")
                    if apply:
                        call("POST", f"/files/{f['id']}/move/{archive['id']}")
    for d in dirs:
        if d["name"] != ARCHIVE:
            process(d["id"], f"{path}/{d['name']}")


process(root, "")
if not apply:
    print("dry run; pass --apply to make the changes")
