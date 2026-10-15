---
title: Mạng
description: Bảng lệnh kiểm tra mạng cho Linux, Windows, macOS, Cisco — IP, DNS, cổng, đường đi, bắt gói tin — kèm bảng subnet và cổng hay gặp.
---

Lệnh kiểm tra mạng, đặt cạnh nhau cho Linux, Windows, macOS và Cisco.

## Gặp vấn đề {#gap-van-de}

Kiểm tra **từ dưới lên**: dây → IP → gateway → Internet → DNS → cổng dịch vụ.

| Triệu chứng | Chạy trước |
|---|---|
| Máy nhận IP `169.254.x.x` | Không xin được IP (DHCP): `ipconfig /release` → `ipconfig /renew` |
| Có IP nhưng không ra ngoài | `ping <gateway>` rồi `ping 8.8.8.8` |
| Ping được `8.8.8.8`, vào web theo tên không được | Lỗi DNS: `nslookup <tên>` |
| Web / dịch vụ không vào được | `nc -zv <ip> <cổng>` · Windows: `Test-NetConnection <ip> -Port <cổng>` |
| Mạng chập chờn, lúc được lúc không | `mtr -rwc 50 <ip>` · Windows: `pathping <ip>` |
| Nghi trùng IP | `arp -a`, Wireshark lọc `arp.duplicate-address-detected` |

`Connection refused` = cổng đóng (dịch vụ không chạy) · `timed out` = bị firewall chặn hoặc sai đường.

## Lệnh theo hệ điều hành {#lenh}

| Việc | Linux | Windows | macOS | Cisco |
|---|---|---|---|---|
| Xem IP | `ip -br a` | `ipconfig /all` | `ifconfig` | `show ip interface brief` |
| Bảng định tuyến | `ip route` | `route print` | `netstat -rn` | `show ip route` |
| Đường đi | `traceroute <ip>` | `tracert <ip>` | `traceroute <ip>` | `traceroute <ip>` |
| Đường đi kèm % mất gói | `mtr -rwc 50 <ip>` | `pathping <ip>` | `mtr -rwc 50 <ip>` | — |
| Tra DNS | `dig <tên>` | `nslookup <tên>` | `dig <tên>` | — |
| IP ↔ MAC (ARP) | `ip neigh` | `arp -a` | `arp -a` | `show arp` |
| Cổng đang mở | `ss -tulpn` | `netstat -ano` | `lsof -nP -iTCP -sTCP:LISTEN` | — |
| Thử kết nối tới cổng | `nc -zv <ip> <cổng>` | `Test-NetConnection <ip> -Port <cổng>` | `nc -zv <ip> <cổng>` | `telnet <ip> <cổng>` |
| Xin lại IP | `sudo networkctl renew <card>` | `ipconfig /release` → `/renew` | `sudo ipconfig set en0 DHCP` | — |
| Xoá cache DNS | `resolvectl flush-caches` | `ipconfig /flushdns` | `sudo dscacheutil -flushcache` | — |

## DNS & web {#dns-web}

| Việc | Lệnh |
|---|---|
| Hỏi một DNS server cụ thể | `dig @<dns-server> <tên>` · `nslookup <tên> <dns-server>` |
| Chỉ lấy IP | `dig +short <tên>` |
| Xem header HTTP | `curl -I https://<tên>` |
| Chỉ lấy mã trạng thái | `curl -s -o /dev/null -w "%{http_code}\n" <url>` |
| Thời gian từng bước (DNS, kết nối, TLS) | `curl -s -o /dev/null -w "dns %{time_namelookup} tcp %{time_connect} tls %{time_appconnect} tổng %{time_total}\n" <url>` |
| Hạn chứng chỉ HTTPS | `openssl s_client -connect <tên>:443 -servername <tên> </dev/null 2>/dev/null \| openssl x509 -noout -dates` |

## Bắt gói tin {#bat-goi-tin}

| Việc | Lệnh |
|---|---|
| Gói của một máy | `sudo tcpdump -i any host <ip>` |
| Gói tới một cổng | `sudo tcpdump -i any port 53` |
| Lưu ra file để mở bằng Wireshark | `sudo tcpdump -i any -w ra.pcap host <ip>` |
| Quét cổng một máy | `nmap <ip>` |
| Tìm máy đang bật trong dải | `nmap -sn 192.168.1.0/24` |
| Đo băng thông giữa 2 máy | máy A `iperf3 -s` · máy B `iperf3 -c <ip-A>` |

| Bộ lọc Wireshark | Hiện |
|---|---|
| `ip.addr == 192.168.1.10` | Gói đi hoặc đến máy này |
| `dhcp` · `dns` | Xin IP · truy vấn DNS |
| `arp.duplicate-address-detected` | Trùng IP |
| `tcp.analysis.retransmission` | Gói phải gửi lại: mạng mất gói |
| `tcp.flags.reset == 1` | Kết nối bị từ chối hoặc cắt ngang |

## Chia subnet {#subnet}

| CIDR | Mask | Số máy dùng được |
|---|---|---|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /29 | 255.255.255.248 | 6 |
| /30 | 255.255.255.252 | 2 |

| Dải đặc biệt | Ý nghĩa |
|---|---|
| `10.0.0.0/8` · `172.16.0.0/12` · `192.168.0.0/16` | IP nội bộ |
| `127.0.0.0/8` | Chính máy mình |
| `169.254.0.0/16` | Tự gán khi không xin được IP |
| `100.64.0.0/10` | Nhà mạng NAT thêm một tầng (CGNAT) |

## Cổng hay gặp {#cong}

| Cổng | Dịch vụ |
|---|---|
| 22 | SSH |
| 53 | DNS |
| 67 / 68 | DHCP |
| 80 / 443 | HTTP / HTTPS |
| 88 | Kerberos (đăng nhập domain) |
| 123 | NTP (đồng bộ giờ) |
| 161 | SNMP (giám sát thiết bị) |
| 389 / 636 | LDAP / LDAPS |
| 445 | SMB (chia sẻ Windows) |
| 502 | Modbus TCP |
| 554 | RTSP (camera) |
| 1433 · 3306 · 5432 | SQL Server · MySQL · PostgreSQL |
| 3389 | Remote Desktop |
| 6379 | Redis |

## Nguồn {#nguon}

- IETF — [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918) (IP nội bộ) · [RFC 3927](https://www.rfc-editor.org/rfc/rfc3927) (link-local) · [RFC 6598](https://www.rfc-editor.org/rfc/rfc6598) (CGNAT) · [RFC 4632](https://www.rfc-editor.org/rfc/rfc4632) (CIDR)
- IANA — [Service Name and Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)
- [tcpdump(1)](https://www.tcpdump.org/manpages/tcpdump.1.html) · [Wireshark Display Filter Reference](https://www.wireshark.org/docs/dfref/)
