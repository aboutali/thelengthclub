# Project notes

## kDrive file naming

Name every file on the team kDrive `YYYYMMDD-TITLE-Vx.ext`.

- `YYYYMMDD`: date of this version, Zürich time.
- `TITLE`: words separated by spaces. Use no hyphens inside the title.
- `Vx`: version number, starting at `V1`. Raise it for each new version and give the new version the current date.
- Keep the newest version and the two versions before it next to each other.
- Give every folder with versioned files a subfolder named `_archive`.
- Move every older version into that `_archive`. Example: at V5, move V2 and older; keep V3, V4 and V5.
- Delete nothing without asking.

After each upload of a new version, run `python3 scripts/kdrive_archive.py` for a dry run. Then run it with `--apply`. The script needs `INFOMANIAK_TOKEN` and `KDRIVE_ID`.

Example: `20260929-Onepager DE-V1.pdf`.

Team folder layout (Common documents › Shared): `01 Strategy`, `02 B2B Outreach` (with `Print materials`), `03 Operations`, `04 Meeting notes`.
