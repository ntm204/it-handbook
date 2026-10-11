# Linux server

Lệnh dùng cho Ubuntu/Debian. Bản Red Hat (RHEL, Rocky, AlmaLinux) khác ở phần quản lý gói: dùng `dnf` thay cho `apt`.

## Thông tin máy

| Việc | Lệnh |
|---|---|
| Tên máy, hệ điều hành | `hostnamectl` |
| Phiên bản | `cat /etc/os-release` |
| Chạy được bao lâu, tải hệ thống | `uptime` |
| RAM | `free -h` |
| CPU | `lscpu` |
| Ai đang đăng nhập | `who` |

## Ổ đĩa

| Việc | Lệnh |
|---|---|
| Dung lượng các phân vùng | `df -h` |
| Thư mục nào nặng nhất | `sudo du -sh /var/* \| sort -rh \| head` |
| Danh sách ổ và phân vùng | `lsblk` |
| Ổ nào gắn ở đâu | `findmnt` |
| File lớn hơn 500 MB | `sudo find / -xdev -type f -size +500M` |
| Cấu hình tự gắn ổ khi khởi động | `/etc/fstab` |

## Tiến trình

| Việc | Lệnh |
|---|---|
| Xem trực tiếp CPU, RAM | `htop` |
| 10 tiến trình tốn RAM nhất | `ps aux --sort=-%mem \| head` |
| 10 tiến trình tốn CPU nhất | `ps aux --sort=-%cpu \| head` |
| Tìm theo tên | `pgrep -fl <tên>` |
| Dừng · dừng cưỡng bức | `kill <PID>` · `kill -9 <PID>` |
| Chương trình nào đang mở file / cổng | `sudo lsof <file>` · `sudo lsof -i :<cổng>` |

## Dịch vụ (systemd)

```bash
systemctl status nginx                 # trạng thái, vài dòng log gần nhất
sudo systemctl restart nginx           # khởi động lại
sudo systemctl stop nginx              # dừng
sudo systemctl enable --now nginx      # bật ngay và tự chạy khi khởi động máy
sudo systemctl disable nginx           # không tự chạy khi khởi động
systemctl --failed                     # dịch vụ đang lỗi
systemctl list-units --type=service --state=running   # dịch vụ đang chạy
```

## Log

```bash
journalctl -u nginx -f                 # log của một dịch vụ, chạy liên tục
journalctl -u nginx --since "1 hour ago"
journalctl -p err -b                   # chỉ lỗi, từ lần khởi động gần nhất
journalctl --disk-usage                # log chiếm bao nhiêu chỗ
sudo journalctl --vacuum-time=7d       # chỉ giữ log 7 ngày
sudo tail -f /var/log/syslog           # log hệ thống dạng file
```

## Người dùng & quyền

```bash
sudo adduser <tên>                     # tạo người dùng
sudo usermod -aG sudo <tên>            # cho quyền quản trị
sudo passwd <tên>                      # đổi mật khẩu
id <tên>                               # thuộc nhóm nào
sudo -l                                # mình được chạy gì bằng sudo
```

**Đọc quyền file** (`ls -l`):

```
-rwxr-x---  1 minh  dev  1024 ...  deploy.sh
 │  │  │       │     │
 │  │  │       │     └─ nhóm sở hữu
 │  │  │       └─ người sở hữu
 │  │  └─ người khác: không có quyền
 │  └─ nhóm: đọc, chạy
 └─ chủ sở hữu: đọc, ghi, chạy
```

| Lệnh | Ý nghĩa |
|---|---|
| `chmod 755 <file>` | Chủ: đầy đủ. Nhóm và người khác: đọc, chạy |
| `chmod 640 <file>` | Chủ: đọc, ghi. Nhóm: đọc. Người khác: không |
| `chmod +x <file>` | Cho chạy được |
| `sudo chown <user>:<nhóm> <file>` | Đổi chủ sở hữu |

r = 4, w = 2, x = 1. Ví dụ 7 = 4+2+1 = rwx, 5 = 4+1 = r-x.

## Cài phần mềm

| Việc | Ubuntu/Debian | RHEL/Rocky |
|---|---|---|
| Cập nhật danh sách gói | `sudo apt update` | — |
| Nâng cấp tất cả | `sudo apt upgrade` | `sudo dnf upgrade` |
| Cài | `sudo apt install <gói>` | `sudo dnf install <gói>` |
| Gỡ | `sudo apt remove <gói>` | `sudo dnf remove <gói>` |
| Tìm | `apt search <từ>` | `dnf search <từ>` |

## Mạng trên server

```bash
ip a                                   # IP các card mạng
ip route                               # gateway
ss -tulpn                              # cổng đang mở, chương trình nào mở
cat /etc/resolv.conf                   # DNS đang dùng
ls /etc/netplan/                       # cấu hình IP tĩnh (Ubuntu)
sudo netplan apply                     # áp cấu hình mạng mới
```

## SSH & chép file

```bash
ssh <user>@<ip>                        # đăng nhập từ xa
ssh-keygen -t ed25519                  # tạo khoá (một lần)
ssh-copy-id <user>@<ip>                # đăng nhập bằng khoá, không cần mật khẩu
scp <file> <user>@<ip>:/tmp/           # chép một file lên server
rsync -avz --progress <thư mục>/ <user>@<ip>:/backup/   # đồng bộ thư mục (chỉ chép phần thay đổi)
```

Lưu sẵn server hay dùng trong `~/.ssh/config`, sau đó chỉ cần gõ `ssh web1`:

```
Host web1
  HostName 192.168.10.20
  User minh
```

## Firewall

```bash
sudo ufw status verbose                # trạng thái
sudo ufw allow 22/tcp                  # mở SSH — LUÔN làm trước khi bật ufw
sudo ufw allow from 192.168.10.0/24 to any port 5432   # chỉ cho một dải IP vào Postgres
sudo ufw enable
sudo nft list ruleset                  # xem luật ở tầng thấp (nftables)
```

## Chạy định kỳ (cron)

```bash
crontab -e                             # sửa lịch
crontab -l                             # xem lịch
```

```
# phút  giờ  ngày  tháng  thứ   lệnh
  0     2    *     *      *     /opt/scripts/backup.sh     # 2 giờ sáng mỗi ngày
  */15  *    *     *      *     /opt/scripts/check.sh      # mỗi 15 phút
```

## Nén & sao lưu

```bash
tar czf backup-$(date +%F).tar.gz /etc        # nén thư mục, tên file kèm ngày
tar xzf backup.tar.gz                         # giải nén
tar tzf backup.tar.gz                         # xem bên trong, không giải nén
```
