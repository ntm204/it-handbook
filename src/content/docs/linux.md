---
title: Linux
description: Bảng lệnh Linux server hay dùng nhất — tình trạng máy, dịch vụ, log, ổ đĩa, SSH, firewall. Chạy được trên Ubuntu/Debian, có ghi chú cho RHEL.
---

Lệnh quản trị server Linux dùng hằng ngày. Thử trên Ubuntu 26.04.

## Gặp vấn đề {#gap-van-de}

| Triệu chứng | Chạy trước |
|---|---|
| Server chậm | `uptime` · `top` |
| Ổ đầy | `df -h && df -i` |
| Xoá file rồi mà ổ không trống ra | `sudo lsof +L1` |
| Dịch vụ không chạy | `systemctl status <dịch-vụ>` |
| Máy vừa tự khởi động lại | `journalctl -b -1 -p err` |
| Không kết nối được vào cổng của server | `sudo ss -tulpn` · `sudo ufw status` |

## Tình trạng máy trong 60 giây {#60-giay}

Thứ tự của Brendan Gregg (Netflix) khi vừa SSH vào server có vấn đề. Lệnh có dấu \* nằm trong gói `sysstat`.

| Việc | Lệnh |
|---|---|
| Tải đang tăng hay giảm (1, 5, 15 phút) | `uptime` |
| Kernel có báo lỗi (hết RAM, lỗi ổ) | `sudo dmesg -T \| tail` |
| CPU bận, chờ ổ (`wa`), thiếu RAM (`si`/`so`) | `vmstat 1` |
| Tiến trình nào ăn CPU \* | `pidstat 1` |
| Ổ đĩa có quá tải (`%util`, `await`) \* | `iostat -xz 1` |
| RAM thực sự còn (cột `available`) | `free -h` |
| Card mạng có chạm trần \* | `sar -n DEV 1` |

## Tiến trình {#tien-trinh}

| Việc | Lệnh |
|---|---|
| Tốn RAM nhất · tốn CPU nhất | `ps aux --sort=-%mem \| head` · `ps aux --sort=-%cpu \| head` |
| Tìm theo tên | `pgrep -fl <tên>` |
| Dừng · dừng cưỡng bức | `kill <PID>` · `kill -9 <PID>` |
| Tiến trình nào giữ cổng | `sudo ss -tulpn \| grep :<cổng>` |
| Kết nối đang mở tới server | `sudo ss -tnp state established` |

## Dịch vụ & log {#dich-vu}

| Việc | Lệnh |
|---|---|
| Trạng thái + log gần nhất | `systemctl status <dịch-vụ>` |
| Khởi động lại · nạp lại cấu hình | `sudo systemctl restart <dịch-vụ>` · `sudo systemctl reload <dịch-vụ>` |
| Chạy ngay và tự chạy khi bật máy | `sudo systemctl enable --now <dịch-vụ>` |
| Dịch vụ đang lỗi | `systemctl --failed` |
| Theo dõi log trực tiếp | `journalctl -u <dịch-vụ> -f` |
| Log 1 giờ qua | `journalctl -u <dịch-vụ> --since "1 hour ago"` |
| Chỉ lỗi, từ lần khởi động này | `journalctl -p err -b` |
| Dọn log, giữ 7 ngày | `sudo journalctl --vacuum-time=7d` |

Kiểm tra cấu hình **trước** khi restart, ví dụ `sudo nginx -t`.

## Ổ đĩa {#o-dia}

| Việc | Lệnh |
|---|---|
| Đầy dung lượng hay đầy số file (inode) | `df -h && df -i` |
| Thư mục nặng nhất | `sudo du -xh --max-depth=1 / \| sort -rh \| head` |
| File đã xoá nhưng vẫn bị giữ | `sudo lsof +L1` |
| Làm rỗng log đang ghi (thay vì `rm`) | `sudo truncate -s 0 <file>.log` |
| Các ổ, phân vùng | `lsblk -f` |

:::caution
`rm` một file log đang được ghi **không giải phóng dung lượng**: tiến trình vẫn giữ nó. Dùng `truncate`, hoặc restart tiến trình đó.
:::

## SSH & chép file {#ssh}

| Việc | Lệnh |
|---|---|
| Tạo khoá (một lần) | `ssh-keygen -t ed25519` |
| Đăng nhập bằng khoá từ nay | `ssh-copy-id <user>@<ip>` |
| Chép, chỉ chép phần thay đổi | `rsync -avz --progress <thư-mục>/ <user>@<ip>:<đích>/` |
| Chép nhanh một file | `scp <file> <user>@<ip>:/tmp/` |

`rsync`: `src/` chép phần **bên trong**, `src` chép **cả thư mục**. Lưu server trong `~/.ssh/config` để chỉ cần `ssh web1`:

```
Host web1
  HostName 192.168.10.20
  User minh
```

## Firewall (ufw) {#firewall}

| Việc | Lệnh |
|---|---|
| Mở SSH (làm **trước** khi bật) | `sudo ufw allow 22/tcp` |
| Chỉ cho một dải IP vào cổng | `sudo ufw allow from 192.168.10.0/24 to any port 5432` |
| Bật · xem luật kèm số | `sudo ufw enable` · `sudo ufw status numbered` |
| Xoá luật số 3 | `sudo ufw delete 3` |

## Người dùng & quyền {#nguoi-dung}

| Việc | Lệnh |
|---|---|
| Tạo người dùng · cho dùng sudo | `sudo adduser <tên>` · `sudo usermod -aG sudo <tên>` |
| Thuộc nhóm nào · được sudo gì | `id <tên>` · `sudo -l` |
| Đổi chủ · đổi quyền | `sudo chown <user>:<nhóm> <file>` · `chmod 640 <file>` |

Quyền dạng số: đọc 4 + ghi 2 + chạy 1, lần lượt cho chủ · nhóm · người khác. `640` = chủ đọc ghi, nhóm đọc, người khác không.

## Thông tin & phần mềm {#thong-tin}

| Việc | Ubuntu / Debian | RHEL / Rocky |
|---|---|---|
| Tên máy, hệ điều hành, kernel | `hostnamectl` | `hostnamectl` |
| IP các card mạng | `ip -br a` | `ip -br a` |
| Cập nhật · nâng cấp | `sudo apt update && sudo apt upgrade` | `sudo dnf upgrade` |
| Cài · gỡ | `sudo apt install <gói>` · `sudo apt remove <gói>` | `sudo dnf install <gói>` · `sudo dnf remove <gói>` |
| Lệnh này thuộc gói nào | `dpkg -S $(command -v <lệnh>)` | `rpm -qf $(command -v <lệnh>)` |

## Lịch chạy (cron) {#cron}

```
# phút giờ ngày tháng thứ  lệnh                      (sửa: crontab -e)
  0    2   *    *     *    /opt/scripts/backup.sh     # 2:00 mỗi ngày
  */15 *   *    *     1-5  /opt/scripts/check.sh      # 15 phút một lần, thứ 2–6
```

Cron có rất ít biến môi trường: luôn dùng **đường dẫn tuyệt đối**.

## Nguồn {#nguon}

- Brendan Gregg, Netflix — [Linux Performance Analysis in 60,000 Milliseconds](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55)
- [systemctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/systemctl.1.html) · [journalctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/journalctl.1.html) · [lsof(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/lsof.8.html) · [ss(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/ss.8.html) · [crontab(5)](https://manpages.ubuntu.com/manpages/noble/en/man5/crontab.5.html)
- Canonical — [Ubuntu Server documentation](https://documentation.ubuntu.com/server/) · [UFW](https://help.ubuntu.com/community/UFW)
