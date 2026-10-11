# Linux server

Lệnh cho Ubuntu/Debian. Bản Red Hat (RHEL, Rocky, AlmaLinux) chỉ khác ở quản lý gói: dùng `dnf` thay cho `apt`.

> Đọc xong: biết server đang có vấn đề gì trong 60 giây; quản lý dịch vụ, log, ổ đĩa, quyền; SSH và chép file an toàn.

## Đọc tình trạng server trong 60 giây

Quy trình của Brendan Gregg (Netflix) khi vừa SSH vào một server có vấn đề. Chạy lần lượt, mỗi lệnh trả lời một câu hỏi:

| # | Lệnh | Trả lời câu hỏi |
|---|---|---|
| 1 | `uptime` | Tải hệ thống đang tăng hay giảm (so 3 số: 1, 5, 15 phút) |
| 2 | `sudo dmesg -T \| tail` | Kernel có báo lỗi không: hết RAM (OOM), lỗi ổ đĩa, lỗi mạng |
| 3 | `vmstat 1` | CPU bận (`us`, `sy`), chờ ổ đĩa (`wa`), thiếu RAM (`si`, `so` khác 0) |
| 4 | `mpstat -P ALL 1` | Có nhân CPU nào bị dồn tải không |
| 5 | `pidstat 1` | Tiến trình nào ăn CPU |
| 6 | `iostat -xz 1` | Ổ đĩa có quá tải không (`%util` gần 100, `await` cao) |
| 7 | `free -h` | Còn RAM thực sự (cột `available`) |
| 8 | `sar -n DEV 1` | Card mạng có chạm trần băng thông không |
| 9 | `sar -n TCP,ETCP 1` | Có nhiều kết nối mới, có gửi lại gói (`retrans/s`) không |
| 10 | `htop` | Nhìn tổng thể lần cuối |

?> Lệnh 4, 5, 6, 8, 9 nằm trong gói `sysstat`: `sudo apt install sysstat`. Bấm <kbd>Ctrl</kbd>+<kbd>C</kbd> để dừng các lệnh chạy liên tục.

## Thông tin máy

| Việc | Lệnh |
|---|---|
| Tên máy, hệ điều hành, kernel | `hostnamectl` |
| IP các card mạng (gọn) | `ip -br a` |
| RAM · CPU | `free -h` · `lscpu` |
| Dịch vụ nào làm khởi động chậm | `systemd-analyze blame` |
| Ai đang đăng nhập | `who` |

## Dịch vụ (systemd)

```bash
systemctl status nginx                 # trạng thái và vài dòng log gần nhất
sudo systemctl restart nginx           # khởi động lại
sudo systemctl reload nginx            # nạp lại cấu hình, không ngắt kết nối đang có
sudo systemctl enable --now nginx      # bật ngay và tự chạy khi khởi động máy
systemctl --failed                     # dịch vụ đang lỗi
systemctl list-units --type=service --state=running
```

?> Sửa file cấu hình của dịch vụ xong, kiểm tra cú pháp **trước khi** restart: `sudo nginx -t`, `sudo sshd -t`. Restart với cấu hình sai là dịch vụ chết.

## Log

```bash
journalctl -u nginx -f                       # theo dõi trực tiếp
journalctl -u nginx --since "1 hour ago"
journalctl -p err -b                         # chỉ lỗi, từ lần khởi động gần nhất
journalctl -b -1 -p err                      # lỗi của lần khởi động TRƯỚC (máy tự khởi động lại thì xem cái này)
journalctl --disk-usage
sudo journalctl --vacuum-time=7d             # chỉ giữ log 7 ngày
```

## Ổ đĩa

| Việc | Lệnh |
|---|---|
| Dung lượng các phân vùng | `df -h` |
| Hết **inode** (còn dung lượng mà vẫn báo đầy) | `df -i` |
| Thư mục nặng nhất | `sudo du -xh --max-depth=1 / \| sort -rh \| head` |
| File lớn hơn 500 MB | `sudo find / -xdev -type f -size +500M` |
| **File đã xoá nhưng vẫn chiếm chỗ** | `sudo lsof +L1` |
| Danh sách ổ, phân vùng | `lsblk` |

!> Xoá file log đang được ghi bằng `rm` **không giải phóng dung lượng**: tiến trình vẫn giữ file, `lsof +L1` sẽ hiện nó kèm chữ `(deleted)`. Làm rỗng file thay vì xoá: `sudo truncate -s 0 <file>`, hoặc restart tiến trình đang giữ file.

## Tiến trình

| Việc | Lệnh |
|---|---|
| Tốn RAM nhất · tốn CPU nhất | `ps aux --sort=-%mem \| head` · `ps aux --sort=-%cpu \| head` |
| Tìm theo tên | `pgrep -fl <tên>` |
| Dừng · dừng cưỡng bức | `kill <PID>` · `kill -9 <PID>` |
| Tiến trình nào đang dùng cổng | `sudo ss -tulpn \| grep :<cổng>` |
| Kết nối đang mở tới server | `sudo ss -tnp state established` |

?> `kill` (mặc định gửi SIGTERM) cho chương trình cơ hội dọn dẹp và lưu dữ liệu. Chỉ dùng `kill -9` khi `kill` không có tác dụng.

## Người dùng & quyền

```bash
sudo adduser <tên>
sudo usermod -aG sudo <tên>            # thêm vào nhóm sudo; thiếu -a sẽ BỊ XOÁ khỏi các nhóm khác
id <tên>                               # thuộc những nhóm nào
sudo -l                                # mình được chạy gì bằng sudo
```

**Đọc quyền** trong `ls -l`, ví dụ `-rwxr-x---`:

| Vị trí | Ký tự | Ai | Quyền | Số |
|---|---|---|---|---|
| 2–4 | `rwx` | Chủ sở hữu | đọc, ghi, chạy | 4+2+1 = **7** |
| 5–7 | `r-x` | Nhóm | đọc, chạy | 4+0+1 = **5** |
| 8–10 | `---` | Người khác | không | **0** |

→ `chmod 750 <file>`. Đổi chủ: `sudo chown <user>:<nhóm> <file>`.

## Phần mềm

| Việc | Ubuntu / Debian | RHEL / Rocky |
|---|---|---|
| Cập nhật danh sách · nâng cấp | `sudo apt update && sudo apt upgrade` | `sudo dnf upgrade` |
| Cài · gỡ | `sudo apt install <gói>` · `sudo apt remove <gói>` | `sudo dnf install <gói>` · `sudo dnf remove <gói>` |
| Lệnh này thuộc gói nào | `dpkg -S $(command -v <lệnh>)` | `rpm -qf $(command -v <lệnh>)` |

## SSH & chép file

```bash
ssh-keygen -t ed25519                              # tạo khoá, một lần trên máy mình
ssh-copy-id <user>@<ip>                            # từ nay đăng nhập bằng khoá
rsync -avz --progress <thư-mục>/ <user>@<ip>:/backup/<thư-mục>/   # chỉ chép phần thay đổi, chạy lại được
scp <file> <user>@<ip>:/tmp/                       # chép nhanh một file
```

Lưu sẵn server trong `~/.ssh/config`, từ đó chỉ cần `ssh web1`:

```
Host web1
  HostName 192.168.10.20
  User minh
```

?> Dấu `/` cuối thư mục nguồn trong `rsync` quan trọng: `src/` chép **nội dung bên trong**, `src` chép **cả thư mục** `src`.

## Firewall (ufw)

```bash
sudo ufw allow 22/tcp                                     # mở SSH TRƯỚC
sudo ufw allow from 192.168.10.0/24 to any port 5432      # chỉ cho một dải IP vào Postgres
sudo ufw enable
sudo ufw status numbered
```

!> Bật `ufw` trên server từ xa mà quên mở cổng 22 là **mất kết nối SSH ngay lập tức**, phải ra tận máy mới vào lại được.

## Lịch chạy định kỳ (cron)

```
# phút  giờ  ngày  tháng  thứ   lệnh                    (crontab -e để sửa)
  0     2    *     *      *     /opt/scripts/backup.sh   # 2:00 mỗi ngày
  */15  *    *     *      1-5   /opt/scripts/check.sh    # mỗi 15 phút, thứ 2 đến thứ 6
```

?> Cron chạy với biến môi trường tối thiểu: luôn dùng **đường dẫn tuyệt đối** cho lệnh và file trong script.

## Nguồn tham khảo

- Brendan Gregg, Netflix — [Linux Performance Analysis in 60,000 Milliseconds](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55)
- systemd — [systemctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/systemctl.1.html) · [journalctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/journalctl.1.html)
- [lsof(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/lsof.8.html) · [ss(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/ss.8.html) · [crontab(5)](https://manpages.ubuntu.com/manpages/noble/en/man5/crontab.5.html)
- Canonical — [Ubuntu Server documentation](https://documentation.ubuntu.com/server/) · [UFW](https://help.ubuntu.com/community/UFW)
