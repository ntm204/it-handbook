---
title: "Linux server"
description: "Lệnh cho Ubuntu/Debian. Bản Red Hat (RHEL, Rocky, AlmaLinux) chỉ khác ở quản lý gói: dùng dnf thay cho apt."
---

Lệnh cho Ubuntu/Debian. Bản Red Hat (RHEL, Rocky, AlmaLinux) chỉ khác ở quản lý gói: dùng `dnf` thay cho `apt`.

> Biết server đang có vấn đề gì trong 60 giây; quản lý dịch vụ, log, ổ đĩa, quyền; SSH và chép file an toàn.

<p class="related">Liên quan: <a href="../xu-ly-su-co/#su-co-7">Server đầy ổ</a> · <a href="../xu-ly-su-co/#su-co-8">Server chậm</a> · <a href="../lab/03-day-o/">Lab 3: server đầy ổ</a> · <a href="../lab/04-dich-vu-systemd/">Lab 4: tự viết dịch vụ</a></p>

## Hiểu {#hieu}
### Dịch vụ và log: systemd {#systemd}
Trên Linux hiện đại, **systemd** là chương trình chạy đầu tiên khi khởi động. Nó khởi động và trông coi mọi dịch vụ khác.

| Khái niệm | Nghĩa là |
|---|---|
| **Unit** | Một thứ systemd quản lý: dịch vụ (`nginx.service`), lịch chạy (`.timer`), điểm gắn ổ (`.mount`) |
| **enable** / **start** | `enable`: tự chạy khi khởi động máy · `start`: chạy ngay bây giờ. Hai việc độc lập |
| **journal** | Nơi systemd gom log của mọi dịch vụ, đọc bằng `journalctl` |
| **Restart=** | systemd tự khởi động lại dịch vụ khi nó chết, nếu được cấu hình |

:::note
Dịch vụ "đang chạy nhưng khởi động lại máy thì mất": đã `start` mà chưa `enable`.
:::

### Quyền file {#quyen-file}
Đọc quyền trong `ls -l`, ví dụ `-rwxr-x---`:

| Vị trí | Ký tự | Ai | Quyền | Số |
|---|---|---|---|---|
| 2–4 | `rwx` | Chủ sở hữu | đọc, ghi, chạy | 4+2+1 = **7** |
| 5–7 | `r-x` | Nhóm | đọc, chạy | 4+0+1 = **5** |
| 8–10 | `---` | Người khác | không | **0** |

→ Đặt bằng `chmod 750 <file>`. Đổi chủ bằng `sudo chown <user>:<nhóm> <file>`.

Với **thư mục**, `x` nghĩa là được **đi vào** thư mục. Có `r` mà không có `x` thì chỉ xem được tên file, không mở được file bên trong.

### Ổ đĩa đầy theo hai cách {#o-day}
| Kiểu đầy | Thấy bằng | Hay do |
|---|---|---|
| Hết **dung lượng** | `df -h` gần 100% | Log, backup, file tạm, image Docker |
| Hết **inode** (số lượng file) | `df -i` gần 100%, trong khi `df -h` vẫn còn trống | Hàng triệu file nhỏ: session, cache, mail queue |

Hết inode cũng báo `No space left on device` y như hết dung lượng, nên rất dễ chẩn đoán nhầm.

## Làm {#lam}
### Đọc tình trạng server trong 60 giây {#server-60-giay}
Quy trình của Brendan Gregg (Netflix) khi vừa SSH vào một server có vấn đề:

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

:::note
Lệnh 4, 5, 6, 8, 9 nằm trong gói `sysstat`. Bấm <kbd>Ctrl</kbd>+<kbd>C</kbd> để dừng các lệnh chạy liên tục.
:::

### Quản lý dịch vụ {#dich-vu}
```bash
systemctl status nginx                 # trạng thái và vài dòng log gần nhất
sudo nginx -t                          # kiểm tra cấu hình TRƯỚC khi restart
sudo systemctl restart nginx           # khởi động lại
sudo systemctl reload nginx            # nạp lại cấu hình, không ngắt kết nối đang có
sudo systemctl enable --now nginx      # chạy ngay và tự chạy khi khởi động máy
systemctl --failed                     # dịch vụ đang lỗi
```

### Đọc log {#log}
```bash
journalctl -u nginx -f                       # theo dõi trực tiếp
journalctl -u nginx --since "1 hour ago"
journalctl -p err -b                         # chỉ lỗi, từ lần khởi động gần nhất
journalctl -b -1 -p err                      # lỗi của lần khởi động TRƯỚC (máy vừa tự khởi động lại)
sudo journalctl --vacuum-time=7d             # chỉ giữ log 7 ngày
```

### Xử lý ổ đầy {#xu-ly-o-day}
```bash
df -h && df -i                                   # đầy dung lượng hay đầy inode
sudo du -xh --max-depth=1 / | sort -rh | head    # thư mục nặng nhất, đi sâu dần
sudo lsof +L1                                    # file đã xoá nhưng vẫn bị giữ
sudo truncate -s 0 /var/log/<file>.log           # làm rỗng log thay vì xoá
```

:::caution
Xoá file log đang được ghi bằng `rm` **không giải phóng dung lượng**: tiến trình vẫn giữ file, `lsof +L1` hiện nó kèm chữ `(deleted)`. Làm rỗng bằng `truncate`, hoặc restart tiến trình đang giữ file. Thực hành: [Lab 3](../lab/03-day-o/).
:::

### SSH & chép file {#ssh}
```bash
ssh-keygen -t ed25519                              # tạo khoá, một lần trên máy mình
ssh-copy-id <user>@<ip>                            # từ nay đăng nhập bằng khoá
rsync -avz --progress <thư-mục>/ <user>@<ip>:/backup/<thư-mục>/   # chỉ chép phần thay đổi
scp <file> <user>@<ip>:/tmp/                       # chép nhanh một file
```

Lưu sẵn server trong `~/.ssh/config`, từ đó chỉ cần `ssh web1`:

```
Host web1
  HostName 192.168.10.20
  User minh
```

:::note
Dấu `/` cuối thư mục nguồn trong `rsync` quan trọng: `src/` chép **nội dung bên trong**, `src` chép **cả thư mục** `src`.
:::

### Firewall (ufw) {#firewall}
```bash
sudo ufw allow 22/tcp                                     # mở SSH TRƯỚC
sudo ufw allow from 192.168.10.0/24 to any port 5432      # chỉ cho một dải IP vào Postgres
sudo ufw enable
sudo ufw status numbered
```

:::caution
Bật `ufw` trên server từ xa mà quên mở cổng 22 là **mất kết nối SSH ngay lập tức**.
:::

### Chạy định kỳ (cron) {#cron}
```
# phút  giờ  ngày  tháng  thứ   lệnh                    (crontab -e để sửa)
  0     2    *     *      *     /opt/scripts/backup.sh   # 2:00 mỗi ngày
  */15  *    *     *      1-5   /opt/scripts/check.sh    # mỗi 15 phút, thứ 2 đến thứ 6
```

:::note
Cron chạy với biến môi trường tối thiểu: luôn dùng **đường dẫn tuyệt đối** trong script.
:::

## Tra {#tra}
### Thông tin máy {#thong-tin}
| Việc | Lệnh |
|---|---|
| Tên máy, hệ điều hành, kernel | `hostnamectl` |
| IP các card mạng (gọn) | `ip -br a` |
| RAM · CPU | `free -h` · `lscpu` |
| Dịch vụ nào làm khởi động chậm | `systemd-analyze blame` |
| Ai đang đăng nhập | `who` |

### Tiến trình {#tien-trinh}
| Việc | Lệnh |
|---|---|
| Tốn RAM nhất · tốn CPU nhất | `ps aux --sort=-%mem \| head` · `ps aux --sort=-%cpu \| head` |
| Tìm theo tên | `pgrep -fl <tên>` |
| Dừng · dừng cưỡng bức | `kill <PID>` · `kill -9 <PID>` |
| Tiến trình nào đang dùng cổng | `sudo ss -tulpn \| grep :<cổng>` |
| Kết nối đang mở tới server | `sudo ss -tnp state established` |

### Người dùng {#nguoi-dung}
| Việc | Lệnh |
|---|---|
| Tạo người dùng | `sudo adduser <tên>` |
| Thêm vào nhóm sudo | `sudo usermod -aG sudo <tên>` |
| Thuộc những nhóm nào | `id <tên>` |
| Mình được chạy gì bằng sudo | `sudo -l` |

:::caution
`usermod -G` thiếu chữ `-a` sẽ **xoá người dùng khỏi mọi nhóm khác**, chỉ giữ lại nhóm vừa ghi.
:::

### Phần mềm {#phan-mem}
| Việc | Ubuntu / Debian | RHEL / Rocky |
|---|---|---|
| Cập nhật danh sách · nâng cấp | `sudo apt update && sudo apt upgrade` | `sudo dnf upgrade` |
| Cài · gỡ | `sudo apt install <gói>` · `sudo apt remove <gói>` | `sudo dnf install <gói>` · `sudo dnf remove <gói>` |
| Lệnh này thuộc gói nào | `dpkg -S $(command -v <lệnh>)` | `rpm -qf $(command -v <lệnh>)` |

## Tự kiểm tra {#tu-kiem-tra}
<details>
<summary><code>df -h</code> còn 40% trống nhưng tạo file vẫn báo <code>No space left on device</code>. Vì sao?</summary>

Hết **inode**. Kiểm tra bằng `df -i`, rồi tìm thư mục có quá nhiều file nhỏ.

</details>

<details>
<summary>Đã <code>rm</code> file log 20 GB nhưng <code>df -h</code> không giảm. Làm gì?</summary>

Tiến trình vẫn giữ file đã xoá. `sudo lsof +L1` để tìm tiến trình đó, restart nó; lần sau dùng `truncate -s 0` thay vì `rm`.

</details>

<details>
<summary>Dịch vụ chạy bình thường, nhưng khởi động lại server thì không tự chạy. Thiếu gì?</summary>

Chưa `enable`. Chạy `sudo systemctl enable <dịch-vụ>` (hoặc `enable --now` để vừa bật vừa chạy).

</details>

<details>
<summary>File có quyền <code>640</code>, chủ là <code>minh</code>, nhóm <code>dev</code>. Ai đọc được, ai sửa được?</summary>

`6` = minh đọc và ghi · `4` = nhóm dev chỉ đọc · `0` = người khác không có quyền gì.

</details>

## Cần nhớ {#can-nho}
1. Vào server có vấn đề: `uptime` → `dmesg -T` → `vmstat 1` → `iostat -xz 1` → `free -h`.
2. Ổ đầy có hai kiểu: hết dung lượng (`df -h`) và hết inode (`df -i`). File đã xoá vẫn bị giữ: `lsof +L1`.
3. Kiểm tra cấu hình **trước khi** restart dịch vụ; mở cổng 22 **trước khi** bật firewall.

## Nguồn tham khảo {#nguon}
- Brendan Gregg, Netflix — [Linux Performance Analysis in 60,000 Milliseconds](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55)
- systemd — [systemctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/systemctl.1.html) · [journalctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/journalctl.1.html)
- [lsof(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/lsof.8.html) · [ss(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/ss.8.html) · [crontab(5)](https://manpages.ubuntu.com/manpages/noble/en/man5/crontab.5.html)
- Canonical — [Ubuntu Server documentation](https://documentation.ubuntu.com/server/) · [UFW](https://help.ubuntu.com/community/UFW)
