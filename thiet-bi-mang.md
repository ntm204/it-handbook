# Switch & Firewall

## Nguyên tắc trước khi sửa thiết bị mạng

1. **Xem trước, sửa sau:** chạy `show` để hiểu hiện trạng.
2. **Sao lưu cấu hình** trước khi sửa.
3. **Sửa từng thay đổi một**, kiểm tra xong mới sửa tiếp.
4. Sửa từ xa thì **cẩn thận với cổng và VLAN mình đang dùng để kết nối**: tắt nhầm là mất kết nối, phải ra tận nơi.
5. Ghi lại đã sửa gì, lúc nào, vì sao.

## Cisco IOS

**Các chế độ dòng lệnh:**

| Dấu nhắc | Chế độ | Vào bằng |
|---|---|---|
| `Switch>` | Người dùng: chỉ xem cơ bản | đăng nhập |
| `Switch#` | Quản trị: xem mọi thứ | `enable` |
| `Switch(config)#` | Cấu hình chung | `configure terminal` |
| `Switch(config-if)#` | Cấu hình một cổng | `interface gi0/5` |

`exit` lùi một cấp, `end` về thẳng chế độ quản trị. Bấm `?` ở bất kỳ đâu để xem lệnh tiếp theo có thể gõ.

**Xem (dùng nhiều nhất):**

| Việc | Lệnh |
|---|---|
| Cấu hình đang chạy | `show running-config` |
| IP và trạng thái các cổng | `show ip interface brief` |
| Trạng thái cổng, VLAN, tốc độ | `show interfaces status` |
| Danh sách VLAN | `show vlan brief` |
| Chi tiết một cổng (lỗi, tốc độ) | `show interfaces gi0/5` |
| **Máy có MAC này cắm ở cổng nào** | `show mac address-table address <mac>` |
| Thiết bị Cisco nối trực tiếp | `show cdp neighbors` |
| Cổng bị khoá do lỗi | `show interfaces status err-disabled` |
| Log | `show logging` |
| Model, phiên bản, thời gian chạy | `show version` |
| Bảng định tuyến · ARP | `show ip route` · `show arp` |

Lọc kết quả: `show running-config | include vlan` · `show running-config | section interface`.

**Cấu hình cổng cho một máy tính (access):**

```
configure terminal
vlan 20
 name SANXUAT
interface gi0/5
 description PC-XUONG-A-01
 switchport mode access
 switchport access vlan 20
 no shutdown
end
write memory
```

**Cổng nối giữa hai switch (trunk):**

```
interface gi0/48
 description UPLINK-CORE
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

**Mở lại cổng bị khoá (err-disabled):** sửa nguyên nhân trước (ví dụ có người cắm switch nhỏ hoặc cắm vòng dây), sau đó:

```
interface gi0/5
 shutdown
 no shutdown
```

**Lưu cấu hình:** `write memory` (hoặc `copy running-config startup-config`). Không lưu thì khởi động lại switch sẽ mất hết thay đổi.

Đang ở chế độ cấu hình mà muốn chạy lệnh `show`: thêm `do` phía trước, ví dụ `do show vlan brief`.

## HPE / Aruba (khác Cisco ở vài lệnh)

| Việc | Cisco | HPE / Aruba (ArubaOS-Switch) |
|---|---|---|
| Trạng thái cổng | `show interfaces status` | `show interfaces brief` |
| VLAN | `show vlan brief` | `show vlans` |
| Tìm MAC | `show mac address-table address <mac>` | `show mac-address <mac>` |
| Lưu cấu hình | `write memory` | `write memory` |

## FortiGate

| Việc | Lệnh |
|---|---|
| Phiên bản, model, thời gian chạy | `get system status` |
| Trạng thái các cổng | `get system interface physical` |
| Bảng định tuyến | `get router info routing-table all` |
| Xem policy | `show firewall policy` |
| Ping · traceroute từ firewall | `execute ping <ip>` · `execute traceroute <ip>` |
| Bắt gói tin của một máy | `diagnose sniffer packet any 'host <ip>' 4` |

**Vì sao gói tin bị chặn** (theo dõi đường đi của gói qua firewall):

```
diagnose debug reset
diagnose debug flow filter addr <ip>
diagnose debug flow show function-name enable
diagnose debug enable
diagnose debug flow trace start 10
```

Xem kết quả: dòng `Denied by forward policy` nghĩa là bị policy chặn. Xong thì **tắt debug** để tránh làm chậm firewall:

```
diagnose debug disable
diagnose debug reset
```

Sao lưu cấu hình: giao diện web → góc trên bên phải → **Configuration → Backup**.
