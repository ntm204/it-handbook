#!/usr/bin/env python3
"""Sinh assets/meta.json: ngày cập nhật của từng trang .md (hiện ở đầu trang).
Trang đang có thay đổi chưa commit → hôm nay; còn lại → ngày commit gần nhất."""
import datetime, json, pathlib, subprocess

root = pathlib.Path(__file__).resolve().parent.parent
git = lambda *a: subprocess.run(["git", *a], cwd=root, capture_output=True, text=True).stdout
changed = set(git("diff", "--cached", "--name-only").split()) | set(git("diff", "--name-only").split()) \
        | set(git("ls-files", "--others", "--exclude-standard").split())
today = datetime.date.today().isoformat()
meta = {}
for f in sorted(root.glob("**/*.md")):
    rel = f.relative_to(root).as_posix()
    if rel.startswith("_") or "/_" in rel:
        continue
    meta[rel] = today if rel in changed else (git("log", "-1", "--format=%cs", "--", rel).strip() or today)
(root / "assets" / "meta.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False) + "\n")
