# Máy Mac này

**Tiếng Việt** · [English](may-mac.en.md)

Lệnh đã dùng thật khi setup và vận hành máy Mac này, xếp theo việc cần làm. Cấu hình máy nằm trong repo `dotfiles`.
`<...>` là phần bạn thay bằng giá trị của mình.

---

## 1. Tìm hiểu máy

| Việc | Lệnh |
|---|---|
| Phiên bản macOS | `sw_vers` |
| Model, chip, RAM | `system_profiler SPHardwareDataType` |
| Pin: dung lượng, số lần sạc | `system_profiler SPPowerDataType \| grep -E "Cycle\|Condition\|Capacity"` |
| Dung lượng ổ cứng | `df -h /` |
| Thư mục nào nặng nhất | `du -sh ~/* \| sort -rh \| head` |
| Kiến trúc CPU | `uname -m` |

## 2. File & thư mục

| Việc | Lệnh |
|---|---|
| Liệt kê kể cả file ẩn | `ll` (= `ls -la`) |
| Cây thư mục | `lt` |
| Tìm file theo tên | `fd <tên>` |
| Tìm chữ trong code | `rg "<chữ>"` · `rgf <chữ>` (mở luôn ở VS Code) |
| Xem file có tô màu | `cat <file>` (đã gán sang `bat`) |
| Chuyển vào Thùng rác | `trash <file>` (an toàn hơn `rm`) |
| Tạo liên kết · xem liên kết trỏ đâu | `ln -s <gốc> <đích>` · `readlink <đích>` |
| Cho file chạy được | `chmod +x <file>` |
| Mở trong Finder · VS Code | `open .` · `code .` |

## 3. Tiến trình & cổng

| Việc | Lệnh |
|---|---|
| Ai đang chiếm cổng | `port 3000` (= `lsof -nP -iTCP:3000 -sTCP:LISTEN`) |
| Tìm tiến trình theo tên | `pgrep -fl <tên>` |
| Dừng tiến trình | `kill <PID>` · cứng đầu: `kill -9 <PID>` |
| Xem CPU, RAM | `btop` |
| Khởi động lại Dock / Finder | `killall Dock` · `killall Finder` |

## 4. Mạng

| Việc | Lệnh |
|---|---|
| IP trong mạng nội bộ | `ipconfig getifaddr en0` |
| Kiểm tra kết nối | `ping -c 4 google.com` |
| Đường đi tới máy chủ | `mtr google.com` (cần `sudo`) · `traceroute google.com` |
| Tra DNS | `dig google.com` · `dig +short google.com` |
| Kiểm tra cổng mở không | `nc -zv <host> <cổng>` |
| Xem header HTTP | `curl -I https://example.com` |
| Chỉ lấy mã trạng thái | `curl -s -o /dev/null -w "%{http_code}\n" <url>` |
| Quét cổng | `nmap <host>` |

## 5. Cài đặt macOS bằng lệnh

| Việc | Lệnh |
|---|---|
| Đọc một cài đặt | `defaults read com.apple.dock autohide` |
| Đổi một cài đặt | `defaults write com.apple.dock autohide -bool true && killall Dock` |
| Pin: Low Power Mode khi dùng pin | `sudo pmset -b lowpowermode 1` |
| Xem cài đặt nguồn | `pmset -g` |
| Mở một trang System Settings | `open "x-apple.systempreferences:com.apple.Battery-Settings.extension"` |
| Áp lại toàn bộ cài đặt | `./macos/defaults.sh` |

## 6. Cài & gỡ phần mềm

| Việc | Lệnh |
|---|---|
| Tìm · xem thông tin | `brew search <tên>` · `brew info <tên>` |
| Cài theo danh sách | `brew bundle` (trong thư mục dotfiles) |
| Kiểm tra máy khớp danh sách | `brew bundle check --verbose` |
| Gói nào có bản mới · cập nhật | `brew outdated` · `brew upgrade` |
| Ai đang dùng gói này | `brew uses --installed <tên>` |
| **Kiểm kê toàn máy** | `mac audit` |
| **Gỡ an toàn** | `mac rm <tên>` |
| **Dọn dẹp** | `mac clean` |
| Extension VS Code | `code --list-extensions` · `code --install-extension <id>` |

## 7. Ngôn ngữ (mise)

| Việc | Lệnh |
|---|---|
| Đang dùng phiên bản nào | `mise ls` |
| Thêm ngôn ngữ cho cả máy | `mise use -g go` |
| Cố định phiên bản cho một dự án | `mise use node@22` (trong thư mục dự án) |
| Cập nhật | `mise upgrade` |

## 8. Git & GitHub

| Việc | Lệnh |
|---|---|
| Trạng thái · lịch sử | `gs` · `gl` |
| Lưu thay đổi | `git add -A && git commit -m "<nội dung>" && git push` |
| Lấy code mới | `git pull` |
| Đổi nhánh | `gb` (chọn bằng menu) |
| Giao diện git | `lg` |
| Hoàn tác commit đã đẩy (an toàn) | `git revert <commit>` |
| Bỏ commit cuối, giữ code | `git undo` |
| Đăng nhập GitHub · kiểm tra | `gh auth login` · `gh auth status` |
| Tạo repo private từ thư mục hiện tại | `gh repo create <tên> --private --source=. --push` |
| Clone · liệt kê repo | `gh repo clone <user>/<repo>` · `gh repo list` |

## 9. Docker & máy Linux

| Việc | Lệnh |
|---|---|
| Bật · tắt dịch vụ của dự án | `docker compose up -d` · `docker compose down` |
| Trạng thái · log | `docker compose ps` · `docker compose logs -f <dịch vụ>` |
| Vào trong container | `docker compose exec <dịch vụ> sh` |
| Docker chiếm bao nhiêu chỗ | `docker system df` |
| Database học tập | `db up -d` · `db down` · `db ps` |
| Kết nối Postgres · Redis | `psql postgres://dev:dev@localhost:15432/dev` · `redis-cli -p 16379 ping` |
| Máy Linux: vào · liệt kê | `orb -m lab` · `orb list` |
| Chạy một lệnh trong máy Linux | `orb -m lab <lệnh>` |

## 10. Chạy dự án (ví dụ chatty)

```sh
npm ci                                   # cài đúng phiên bản trong package-lock (lần đầu)
cp .env.example apps/server/.env         # tạo file môi trường (lần đầu)
docker compose up -d postgres mailpit    # bật database
npm run dev:server                       # terminal 1
npm run dev:web                          # terminal 2 (Cmd+D để chia màn hình)
```

Mở nhanh HTML: `open index.html` · có tự tải lại: `npx vite --open`.

## 11. Shell

| Việc | Lệnh |
|---|---|
| Nạp lại cấu hình shell | `reload` |
| Lệnh này nằm ở đâu | `command -v <lệnh>` |
| Xem PATH | `echo $PATH \| tr ':' '\n'` |
| Tìm lệnh cũ | `Ctrl+R` |
| Chạy lại lệnh trước với sudo | `sudo !!` |
| Ví dụ cách dùng một lệnh | `tldr <lệnh>` · đầy đủ: `man <lệnh>` |

## 12. Sổ tay & tmux

| Việc | Lệnh |
|---|---|
| Mở sổ tay trên máy | `docs` |
| Mở cho điện thoại cùng Wi-Fi · tắt | `docs lan` · `docs stop` |
| Mở phiên tmux · quay lại | `tmux new -s <tên>` · `tmux a -t <tên>` |
| Thoát tmux, phiên vẫn chạy | <kbd>Ctrl</kbd>+<kbd>B</kbd> rồi <kbd>d</kbd> |
