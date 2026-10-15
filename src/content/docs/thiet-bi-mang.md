---
title: Switch & Firewall
description: Bảng lệnh Cisco IOS, HPE/Aruba, FortiGate — xem cổng, VLAN, tìm máy theo MAC, lỗi cổng, cấu hình access/trunk, debug firewall.
man: switch(8)
order: 4
summary: "Cisco, HPE/Aruba, FortiGate: cổng, VLAN, tìm MAC, lỗi cổng"
---

Lệnh switch Cisco, HPE/Aruba và firewall FortiGate.

## Gặp vấn đề {#gap-van-de}

| Triệu chứng | Chạy trước |
|---|---|
| Một máy mất mạng | `show interfaces status` (cổng `notconnect`, `err-disabled`, sai VLAN) |
| Cổng bị khoá | `show interfaces status err-disabled` → sửa nguyên nhân → `shutdown` / `no shutdown` |
| Mạng chậm, chập chờn | `show interfaces counters errors` (CRC tăng = lỗi dây) |
| Tìm máy cắm ở cổng nào | `show mac address-table address <mac>` |
| Cả khu mất mạng | `show spanning-tree blockedports` · `show logging` |
| Camera / điện thoại IP không lên | `show power inline` |
| FortiGate chặn một kết nối | [Debug flow](#forti-debug) |

## Cisco: chế độ dòng lệnh {#cisco-che-do}

| Dấu nhắc | Chế độ | Vào bằng |
|---|---|---|
| `Switch>` | Người dùng | đăng nhập |
| `Switch#` | Quản trị | `enable` |
| `Switch(config)#` | Cấu hình | `configure terminal` |
| `Switch(config-if)#` | Cấu hình một cổng | `interface gi1/0/5` |

`end` về chế độ quản trị · `?` xem lệnh gõ được · trong chế độ cấu hình thêm `do` trước lệnh `show`.

## Cisco: lệnh xem {#cisco-xem}

| Việc | Lệnh |
|---|---|
| Trạng thái, VLAN, tốc độ mọi cổng | `show interfaces status` |
| IP các cổng | `show ip interface brief` |
| Danh sách VLAN | `show vlan brief` |
| Máy có MAC này cắm ở cổng nào | `show mac address-table address <mac>` |
| Thiết bị nối trực tiếp | `show cdp neighbors` · `show lldp neighbors` |
| Bộ đếm lỗi · xoá bộ đếm | `show interfaces counters errors` · `clear counters gi1/0/5` |
| Công suất PoE | `show power inline` |
| Cổng bị khoá do lỗi | `show interfaces status err-disabled` |
| Spanning tree khoá cổng nào | `show spanning-tree blockedports` |
| Log · model, phiên bản | `show logging` · `show version` |
| Lọc kết quả | `show running-config \| include vlan` |
| Lưu cấu hình | `write memory` |

| Bộ đếm tăng | Hay do |
|---|---|
| `FCS-Err` / CRC | Dây hỏng, đầu bấm lỗi, nhiễu (dây chạy cạnh motor, biến tần) |
| `Late-Col` · `Runts` | Lệch duplex giữa hai đầu |

## Cisco: cấu hình cổng {#cisco-cau-hinh}

Cổng nối máy tính (access):

```
configure terminal
interface gi1/0/5
 description PC-XUONG-A-01
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
 no shutdown
end
write memory
```

Cổng nối switch khác (trunk):

```
interface gi1/0/48
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

> **Chú ý:** Thêm VLAN vào trunk đang chạy: `switchport trunk allowed vlan add 40`. Thiếu chữ `add` là **thay cả danh sách** bằng mỗi VLAN 40, các VLAN khác mất kết nối ngay.

Sửa từ xa: chạy `reload in 10` trước. Lỡ mất kết nối, 10 phút sau switch tự khởi động lại với cấu hình cũ. Sửa xong ổn thì `reload cancel` rồi `write memory`.

## HPE / Aruba {#aruba}

| Việc | Cisco | HPE / Aruba (ArubaOS-Switch) |
|---|---|---|
| Trạng thái cổng | `show interfaces status` | `show interfaces brief` |
| VLAN | `show vlan brief` | `show vlans` |
| Tìm MAC | `show mac address-table address <mac>` | `show mac-address <mac>` |
| Thiết bị nối trực tiếp | `show cdp neighbors` | `show lldp info remote-device` |
| Lưu cấu hình | `write memory` | `write memory` |

## FortiGate {#fortigate}

| Việc | Lệnh |
|---|---|
| Model, phiên bản | `get system status` |
| CPU, RAM, số phiên | `get system performance status` |
| Trạng thái cổng | `get system interface physical` |
| Bảng định tuyến | `get router info routing-table all` |
| Ping, traceroute từ firewall | `execute ping <ip>` · `execute traceroute <ip>` |
| Bắt gói của một máy | `diagnose sniffer packet any 'host <ip>' 4` |

### Vì sao kết nối bị chặn {#forti-debug}

```
diagnose debug reset
diagnose debug flow filter addr <ip>
diagnose debug flow show function-name enable
diagnose debug enable
diagnose debug flow trace start 10
```

`Denied by forward policy check (policy 0)` = không có policy nào cho phép. Xong thì tắt debug: `diagnose debug disable` · `diagnose debug reset`.

> **Ghi chú:** Lệnh trên trang này chưa chạy thử được trên máy lab. Nguồn là tài liệu chính thức của Cisco và Fortinet bên dưới.

## Nguồn {#nguon}

- Cisco — [Catalyst 9300 command references](https://www.cisco.com/c/en/us/support/switches/catalyst-9300-series-switches/products-command-reference-list.html)
- Fortinet — [FortiGate documentation](https://docs.fortinet.com/product/fortigate)
- IEEE — [802.1Q: Bridges and Bridged Networks](https://standards.ieee.org/ieee/802.1Q/10323/) (VLAN)
