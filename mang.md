# Mạng

## Mô hình TCP/IP

| Tầng | Gồm | Kiểm tra bằng |
|---|---|---|
| 4. Ứng dụng | HTTP, DNS, SMB, RDP, SSH | `curl`, `nslookup`, mở thử dịch vụ |
| 3. Giao vận | TCP, UDP, **cổng** | `nc -zv`, `Test-NetConnection` |
| 2. Mạng | **IP**, định tuyến, ICMP | `ping`, `traceroute` |
| 1. Liên kết & vật lý | Dây, Wi-Fi, switch, **MAC**, **VLAN** | Đèn cổng mạng, `ip link`, `show interfaces` |

Sự cố mạng nên kiểm tra **từ dưới lên**: dây trước, ứng dụng sau.

## Địa chỉ IP

**Dải IP nội bộ** (không ra Internet trực tiếp):

| Dải | Thường dùng ở |
|---|---|
| `10.0.0.0/8` | Doanh nghiệp lớn, nhà máy |
| `172.16.0.0/12` | Doanh nghiệp, Docker |
| `192.168.0.0/16` | Gia đình, văn phòng nhỏ |

**Bảng subnet hay dùng:**

| CIDR | Subnet mask | Số máy dùng được |
|---|---|---|
| /30 | 255.255.255.252 | 2 (nối 2 router) |
| /29 | 255.255.255.248 | 6 |
| /28 | 255.255.255.240 | 14 |
| /27 | 255.255.255.224 | 30 |
| /26 | 255.255.255.192 | 62 |
| /25 | 255.255.255.128 | 126 |
| /24 | 255.255.255.0 | 254 |
| /23 | 255.255.254.0 | 510 |
| /22 | 255.255.252.0 | 1022 |

Công thức: số máy = 2^(32 − CIDR) − 2 (trừ địa chỉ mạng và địa chỉ broadcast).

Ví dụ `192.168.10.0/26` chia được 4 mạng: `.0`, `.64`, `.128`, `.192`. Mạng đầu dùng `.1` đến `.62`, broadcast là `.63`.

## Cổng hay gặp

| Cổng | Dịch vụ | Cổng | Dịch vụ |
|---|---|---|---|
| 20, 21 | FTP | 389 / 636 | LDAP / LDAPS (Active Directory) |
| 22 | SSH | 443 | HTTPS |
| 23 | Telnet (không mã hoá) | 445 | SMB (thư mục chia sẻ Windows) |
| 25 | SMTP (gửi mail) | 502 | Modbus TCP (máy móc công nghiệp) |
| 53 | DNS | 554 | RTSP (camera) |
| 67, 68 | DHCP | 1433 | SQL Server |
| 80 | HTTP | 3306 | MySQL |
| 88 | Kerberos (đăng nhập domain) | 3389 | Remote Desktop |
| 123 | NTP (đồng bộ giờ) | 5432 | PostgreSQL |
| 161 | SNMP (giám sát thiết bị) | 8080 | Web phụ, proxy |

## Lệnh tương đương giữa các hệ điều hành

| Việc | Linux | Windows | macOS | Cisco |
|---|---|---|---|---|
| Xem IP | `ip a` | `ipconfig /all` | `ifconfig` | `show ip interface brief` |
| Bảng định tuyến | `ip route` | `route print` | `netstat -rn` | `show ip route` |
| Ping | `ping -c 4 <ip>` | `ping <ip>` | `ping -c 4 <ip>` | `ping <ip>` |
| Đường đi | `traceroute <ip>` | `tracert <ip>` | `traceroute <ip>` | `traceroute <ip>` |
| Tra DNS | `dig <tên>` | `nslookup <tên>` | `dig <tên>` | — |
| Bảng ARP (IP ↔ MAC) | `ip neigh` | `arp -a` | `arp -a` | `show arp` |
| Cổng đang mở | `ss -tulpn` | `netstat -ano` | `lsof -nP -iTCP -sTCP:LISTEN` | — |
| Thử kết nối tới cổng | `nc -zv <ip> <cổng>` | `Test-NetConnection <ip> -Port <cổng>` | `nc -zv <ip> <cổng>` | `telnet <ip> <cổng>` |
| Xin lại IP (DHCP) | `sudo dhclient -r; sudo dhclient` | `ipconfig /release` rồi `ipconfig /renew` | `sudo ipconfig set en0 DHCP` | — |
| Xoá cache DNS | `resolvectl flush-caches` | `ipconfig /flushdns` | `sudo dscacheutil -flushcache` | — |

## Quy trình kiểm tra mạng (5 bước)

Làm **theo thứ tự**, bước nào lỗi thì dừng lại xử lý bước đó.

| # | Kiểm tra | Lệnh (Windows) | Lỗi thì nghĩ tới |
|---|---|---|---|
| 1 | Có kết nối vật lý không | Đèn cổng mạng, biểu tượng mạng | Dây, cổng switch, card mạng, Wi-Fi |
| 2 | Có IP đúng không | `ipconfig` | IP dạng `169.254.x.x` = không xin được DHCP |
| 3 | Ra được gateway không | `ping <gateway>` | Sai VLAN, sai subnet, switch hỏng |
| 4 | Ra Internet bằng IP không | `ping 8.8.8.8` | Firewall, router, nhà mạng |
| 5 | Phân giải tên được không | `nslookup google.com` | DNS server, cấu hình DNS |

Ping được `8.8.8.8` mà không vào được web theo tên → lỗi **DNS**.

## Bắt gói tin

**tcpdump** (Linux, macOS):

```bash
sudo tcpdump -i any host 192.168.1.10          # mọi gói của một máy
sudo tcpdump -i any port 53                    # chỉ DNS
sudo tcpdump -i any -nn 'tcp port 443'         # HTTPS, không đổi IP sang tên
sudo tcpdump -i any -w capture.pcap            # ghi ra file để mở bằng Wireshark
```

**Bộ lọc hiển thị trong Wireshark:**

| Lọc | Ý nghĩa |
|---|---|
| `ip.addr == 192.168.1.10` | Gói đi hoặc đến máy này |
| `tcp.port == 445` | Gói SMB |
| `dns` | Chỉ DNS |
| `dhcp` | Quá trình xin IP |
| `arp` | Hỏi đáp IP ↔ MAC |
| `tcp.analysis.retransmission` | Gói phải gửi lại (mạng chập chờn) |
| `tcp.flags.reset == 1` | Kết nối bị từ chối hoặc cắt ngang |

## Bài lab: tự dựng mạng 2 máy

Trong máy `lab` (`orb -m lab`), dùng **network namespace** để tạo 2 "máy" ảo nối với nhau bằng dây ảo `veth`:

```bash
sudo ip netns add a                                      # máy a
sudo ip netns add b                                      # máy b
sudo ip link add veth-a type veth peer name veth-b       # sợi dây ảo có 2 đầu
sudo ip link set veth-a netns a                          # cắm đầu này vào máy a
sudo ip link set veth-b netns b                          # đầu kia vào máy b
sudo ip -n a addr add 10.0.0.1/24 dev veth-a             # đặt IP
sudo ip -n b addr add 10.0.0.2/24 dev veth-b
sudo ip -n a link set veth-a up                          # bật card mạng
sudo ip -n b link set veth-b up
sudo ip netns exec a ping -c 3 10.0.0.2                  # máy a ping máy b
sudo ip netns del a && sudo ip netns del b               # dọn dẹp
```

Thử đổi IP máy b sang `10.0.1.2/24` rồi ping lại: báo `Network is unreachable`, vì **khác subnet** và chưa có router.
