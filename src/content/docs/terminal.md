---
title: Terminal & Neovim
description: Phím tắt dòng lệnh (bash/zsh), tmux, vim/Neovim — bộ phím dùng được trên mọi server Linux và máy dev.
man: terminal(1)
order: 7
summary: "phím tắt dòng lệnh, tìm và lọc, tmux, vim, LazyVim"
---

Phím tắt dòng lệnh, tmux và vim/Neovim. Đều dùng được khi SSH vào server.

## Dòng lệnh (bash, zsh) {#dong-lenh}

| Việc | Phím / lệnh |
|---|---|
| Về đầu dòng · cuối dòng | `Ctrl+A` · `Ctrl+E` |
| Xoá một từ phía trước · xoá tới đầu dòng | `Ctrl+W` · `Ctrl+U` |
| Tìm lệnh cũ | `Ctrl+R`, gõ tiếp, `Ctrl+R` để lùi tiếp |
| Xoá màn hình | `Ctrl+L` |
| Dừng lệnh đang chạy | `Ctrl+C` |
| Chạy lại lệnh trước · lệnh trước với `sudo` | `!!` · `sudo !!` |
| Tham số cuối của lệnh trước | `Alt+.` hoặc `!$` |
| Về thư mục trước | `cd -` |
| Chạy lệnh tiếp chỉ khi lệnh trước thành công | `<lệnh 1> && <lệnh 2>` |
| Lưu kết quả ra file · nối thêm | `<lệnh> > file.txt` · `<lệnh> >> file.txt` |
| Xem ví dụ dùng một lệnh | `tldr <lệnh>` (cần cài) · `man <lệnh>` |

## Tìm & lọc {#tim-loc}

| Việc | Lệnh |
|---|---|
| Tìm chữ trong thư mục | `grep -rn "<chữ>" .` · nhanh hơn: `rg "<chữ>"` |
| Tìm file theo tên | `find . -name "*.log"` · nhanh hơn: `fd log` |
| Theo dõi file log | `tail -f <file>` |
| Lọc dòng có chữ | `<lệnh> \| grep <chữ>` |
| Đếm dòng | `<lệnh> \| wc -l` |
| Đọc JSON | `curl -s <url> \| jq .` |

## tmux {#tmux}

Giữ phiên làm việc khi mất kết nối SSH. Phím mở đầu `Ctrl+B`, thả ra rồi bấm phím lệnh.

| Việc | Lệnh / phím |
|---|---|
| Mở phiên · danh sách · quay lại | `tmux new -s <tên>` · `tmux ls` · `tmux a -t <tên>` |
| Thoát, phiên vẫn chạy | `Ctrl+B` `d` |
| Chia dọc · chia ngang | `Ctrl+B` `%` · `Ctrl+B` `"` |
| Chuyển ô · phóng to một ô | `Ctrl+B` mũi tên · `Ctrl+B` `z` |
| Cửa sổ mới · chuyển cửa sổ | `Ctrl+B` `c` · `Ctrl+B` `0`–`9` |
| Cuộn xem lại (thoát bằng `q`) | `Ctrl+B` `[` |

## vim / Neovim {#vim}

`vi` có trên gần như mọi server. Học hết cơ bản trong 30 phút: `vimtutor`.

| Việc | Phím |
|---|---|
| Vào chế độ gõ · gõ ở cuối dòng · dòng mới | `i` · `A` · `o` |
| Về chế độ lệnh | `Esc` |
| Lưu · thoát · lưu và thoát · thoát không lưu | `:w` · `:q` · `:wq` · `:q!` |
| Đầu file · cuối file · tới dòng 42 | `gg` · `G` · `42G` |
| Nhảy theo từ · đầu dòng · cuối dòng | `w` / `b` · `0` · `$` |
| Xoá dòng · copy dòng · dán | `dd` · `yy` · `p` |
| Hoàn tác · làm lại | `u` · `Ctrl+R` |
| Tìm (tiếp: `n`) | `/<chữ>` |
| Thay cả file | `:%s/cũ/mới/g` |
| Chọn nhiều dòng | `V` rồi di chuyển |

### LazyVim (Neovim) {#lazyvim}

Bấm `Space` rồi chờ: menu hiện mọi phím tắt.

| Việc | Phím |
|---|---|
| Tìm file · tìm chữ trong dự án | `Space f f` · `Space /` |
| Cây thư mục | `Space e` |
| Chuyển file đang mở · đóng file | `Shift+H` / `Shift+L` · `Space b d` |
| Terminal ngay trong Neovim | `Ctrl+/` |
| Git (lazygit) | `Space g g` |
| Tới định nghĩa · xem tài liệu | `g d` · `K` |
| Format file | `Space c f` |
| Tìm và thay trong cả dự án | `Space s r` |
| Thoát hết | `Space q q` |

## Nguồn {#nguon}

- GNU — [Bash Reference Manual: Readline](https://www.gnu.org/software/bash/manual/html_node/Command-Line-Editing.html)
- [tmux(1)](https://man.openbsd.org/tmux.1) · [Vim documentation](https://vimhelp.org/) · [LazyVim keymaps](https://www.lazyvim.org/keymaps)
