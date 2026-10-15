---
title: Git
description: Bảng lệnh git hay dùng nhất — làm việc hằng ngày, nhánh, xem lịch sử, và cứu khi lỡ tay (hoàn tác commit, khôi phục file, lấy lại code đã mất).
man: git(1)
order: 5
summary: "hằng ngày, nhánh, lịch sử, cứu khi lỡ tay"
---

Lệnh git dùng hằng ngày và lệnh cứu khi lỡ tay.

## Gặp vấn đề {#gap-van-de}

| Triệu chứng | Chạy |
|---|---|
| Commit nhầm, muốn bỏ commit cuối (giữ code) | `git reset --soft HEAD~1` |
| Sửa nội dung / thêm file vào commit vừa tạo | `git commit --amend` |
| Sửa hỏng một file, muốn về bản đã commit | `git restore <file>` |
| Lỡ `git add` nhầm file | `git restore --staged <file>` |
| Mất commit sau `reset` / xoá nhánh | `git reflog` → `git switch -c cuu <mã>` |
| Đang sửa dở, cần đổi nhánh gấp | `git stash` … `git stash pop` |
| `push` bị từ chối (trên server có commit mới) | `git pull --rebase` rồi `git push` |
| Xung đột khi gộp | Sửa file → `git add <file>` → `git rebase --continue` (hoặc `git merge --continue`) |
| Lỡ commit mật khẩu, token | Đổi mật khẩu **ngay**. Xoá khỏi lịch sử không đủ vì có thể đã bị sao chép |

## Hằng ngày {#hang-ngay}

| Việc | Lệnh |
|---|---|
| Trạng thái gọn | `git status -sb` |
| Xem thay đổi chưa add · đã add | `git diff` · `git diff --staged` |
| Chọn từng đoạn để add | `git add -p` |
| Commit | `git commit -m "<nội dung>"` |
| Lấy về · đẩy lên | `git pull --rebase` · `git push` |
| Nhánh mới, đẩy lần đầu | `git push -u origin <nhánh>` |
| Lấy dự án về | `git clone <url>` |

## Nhánh {#nhanh}

| Việc | Lệnh |
|---|---|
| Danh sách nhánh, mới nhất lên đầu | `git branch --sort=-committerdate` |
| Tạo và chuyển sang nhánh mới | `git switch -c <nhánh>` |
| Chuyển nhánh · về nhánh trước | `git switch <nhánh>` · `git switch -` |
| Gộp nhánh khác vào nhánh hiện tại | `git merge <nhánh>` |
| Đặt nhánh mình lên trên `main` mới nhất | `git rebase main` |
| Xoá nhánh đã gộp · xoá trên GitHub | `git branch -d <nhánh>` · `git push origin --delete <nhánh>` |
| Lấy một commit từ nhánh khác | `git cherry-pick <mã>` |

## Xem lịch sử {#lich-su}

| Việc | Lệnh |
|---|---|
| Lịch sử gọn, có nhánh | `git log --oneline --graph -20` |
| Lịch sử một file, kèm nội dung đổi | `git log -p -- <file>` |
| Ai sửa dòng nào | `git blame <file>` |
| Commit nào thêm / xoá một đoạn chữ | `git log -S "<chữ>" --oneline` |
| Xem một commit | `git show <mã>` |
| So 2 nhánh | `git diff main..<nhánh>` |
| Tìm commit gây lỗi (chia đôi) | `git bisect start` · `git bisect bad` · `git bisect good <mã>` |

## Hoàn tác {#hoan-tac}

| Muốn | Lệnh | Mất gì |
|---|---|---|
| Bỏ commit cuối, giữ code đã add | `git reset --soft HEAD~1` | Không |
| Bỏ commit cuối, giữ code chưa add | `git reset HEAD~1` | Không |
| Bỏ commit cuối **và** code | `git reset --hard HEAD~1` | Code của commit đó |
| Huỷ một commit đã push (tạo commit ngược) | `git revert <mã>` | Không |
| Bỏ mọi sửa đổi chưa commit | `git restore .` | Sửa đổi chưa commit |
| Xoá file mới chưa theo dõi (xem trước bằng `-n`) | `git clean -n` → `git clean -fd` | File mới |

> **Chú ý:** Commit đã `push` lên nhánh dùng chung thì **không** `reset` rồi `push --force`: người khác sẽ mất commit. Dùng `git revert`.

## Cấu hình một lần {#cau-hinh}

| Việc | Lệnh |
|---|---|
| Tên, email | `git config --global user.name "<tên>"` · `git config --global user.email "<email>"` |
| Nhánh mặc định `main` | `git config --global init.defaultBranch main` |
| `pull` không tạo commit merge thừa | `git config --global pull.rebase true` |
| Nhánh mới chỉ cần `git push` | `git config --global push.autoSetupRemote true` |
| Bỏ qua file ở mọi dự án | `git config --global core.excludesfile ~/.config/git/ignore` |

## Nguồn {#nguon}

- [Git documentation](https://git-scm.com/docs) · [Pro Git book](https://git-scm.com/book/en/v2)
- GitHub Docs — [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
