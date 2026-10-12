---
title: "Lab 4 · Tự viết dịch vụ"
description: "Viết một dịch vụ systemd từ đầu, cho nó tự chạy khi khởi động máy và tự hồi sinh khi bị giết."
---

Viết một dịch vụ systemd từ đầu, cho nó tự chạy khi khởi động máy và **tự hồi sinh** khi bị giết.

> Hiểu một file unit gồm những gì; dùng thành thạo `enable`, `status`, `journalctl`; thấy systemd tự khởi động lại dịch vụ.

<p class="related">Kiến thức: <a href="../../linux/#systemd">systemd</a> · <a href="../../linux/#dich-vu">Quản lý dịch vụ</a> · <a href="../../linux/#log">Đọc log</a></p>

## Làm mẫu {#lam-mau}
### 1 · Chương trình cần chạy {#chuong-trinh}
```bash
sudo tee /usr/local/bin/nhip-tim.sh > /dev/null <<'S'
#!/bin/sh
# Mỗi 5 giây ghi một dòng vào log
while true; do echo "server còn sống: $(date +%T)"; sleep 5; done
S
sudo chmod +x /usr/local/bin/nhip-tim.sh
```

### 2 · File unit {#unit}
```bash
sudo tee /etc/systemd/system/nhip-tim.service > /dev/null <<'U'
[Unit]
Description=Lab 4 - dịch vụ nhịp tim

[Service]
ExecStart=/usr/local/bin/nhip-tim.sh
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
U
```

| Dòng | Nghĩa |
|---|---|
| `ExecStart` | Lệnh chạy dịch vụ (đường dẫn tuyệt đối) |
| `Restart=always` | Chết vì bất kỳ lý do gì cũng chạy lại |
| `RestartSec=3` | Đợi 3 giây trước khi chạy lại |
| `WantedBy=multi-user.target` | `enable` sẽ cho dịch vụ tự chạy khi máy khởi động bình thường |

### 3 · Nạp, bật, xem {#bat}
```bash
sudo systemctl daemon-reload            # systemd đọc lại các file unit
sudo systemctl enable --now nhip-tim
systemctl status nhip-tim
journalctl -u nhip-tim -f               # Ctrl+C để thoát
```

```
nhip-tim.sh[8333]: server còn sống: 23:26:09
nhip-tim.sh[8333]: server còn sống: 23:26:14
```

### 4 · Giết dịch vụ, xem nó hồi sinh {#hoi-sinh}
```bash
sudo kill -9 $(systemctl show -p MainPID --value nhip-tim)
sleep 5
journalctl -u nhip-tim -n 5
```

```
nhip-tim.service: Main process exited, code=killed, status=9/KILL
nhip-tim.service: Scheduled restart job, restart counter is at 1.
Started nhip-tim.service - Lab 4 - dịch vụ nhịp tim.
```

PID đổi (8333 → 8348): systemd đã tự chạy lại sau 3 giây.

## Tự làm {#tu-lam}
Sửa dịch vụ để **chỉ** tự chạy lại khi bị lỗi (thoát với mã khác 0 hoặc bị giết), còn khi dừng bình thường thì thôi. Kiểm tra bằng cách sửa xong rồi `systemctl stop` xem có tự chạy lại không.

<details>
<summary>Đáp án</summary>

Đổi `Restart=always` thành `Restart=on-failure`, rồi:

```bash
sudo systemctl daemon-reload
sudo systemctl restart nhip-tim
sudo systemctl stop nhip-tim       # dừng bình thường → không tự chạy lại
systemctl is-active nhip-tim       # inactive
```

Sửa file unit xong luôn phải `daemon-reload`, nếu không systemd vẫn dùng bản cũ.

</details>

## Dọn dẹp {#don-dep}
```bash
sudo systemctl disable --now nhip-tim
sudo rm /etc/systemd/system/nhip-tim.service /usr/local/bin/nhip-tim.sh
sudo systemctl daemon-reload
```

## Cần nhớ {#can-nho}
1. Sửa file unit → `daemon-reload` → `restart`.
2. `enable` (tự chạy khi khởi động) và `start` (chạy ngay) là hai việc khác nhau; `enable --now` làm cả hai.
3. Dịch vụ quan trọng nên có `Restart=on-failure` để tự hồi phục.

## Nguồn tham khảo {#nguon}
- systemd — [systemd.service(5)](https://manpages.ubuntu.com/manpages/noble/en/man5/systemd.service.5.html) · [systemctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/systemctl.1.html) · [journalctl(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/journalctl.1.html)
