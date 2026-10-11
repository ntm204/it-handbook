# Switch & Firewall

Lệnh dòng lệnh cho switch Cisco IOS, HPE/Aruba và firewall FortiGate: xem trạng thái, cấu hình VLAN, tìm lỗi cổng, lần dấu gói tin bị chặn.

> Đọc xong: tìm ra một máy đang cắm ở cổng nào; cấu hình cổng access, trunk; đọc bộ đếm lỗi để biết hỏng dây hay hỏng thiết bị; biết vì sao firewall chặn một kết nối.

## Trước khi sửa thiết bị mạng

1. **Xem trước, sửa sau:** chạy `show` để hiểu hiện trạng.
2. **Sao lưu cấu hình**, ghi lại sẽ sửa gì và vì sao.
3. **Mỗi lần một thay đổi**, kiểm tra xong mới làm tiếp.

!> Sửa từ xa thì cẩn thận với **cổng uplink và VLAN quản trị** đang dùng để kết nối tới thiết bị: tắt nhầm là mất kết nối, phải ra tận tủ mạng.

?> Mẹo an toàn trên Cisco khi sửa từ xa: chạy `reload in 10` trước. Lỡ mất kết nối thì 10 phút sau switch tự khởi động lại với cấu hình đã lưu. Sửa xong, mọi thứ ổn thì `reload cancel` rồi `write memory`.

## Cisco IOS

| Dấu nhắc | Chế độ | Vào bằng |
|---|---|---|
| `Switch>` | Người dùng, chỉ xem cơ bản | đăng nhập |
| `Switch#` | Quản trị | `enable` |
| `Switch(config)#` | Cấu hình chung | `configure terminal` |
| `Switch(config-if)#` | Cấu hình một cổng | `interface gi1/0/5` |

`end` để về chế độ quản trị · `?` ở bất kỳ đâu để xem lệnh gõ được · trong chế độ cấu hình muốn chạy `show` thì thêm `do` phía trước.

### Xem

| Việc | Lệnh |
|---|---|
| Trạng thái, VLAN, tốc độ mọi cổng | `show interfaces status` |
| IP các cổng | `show ip interface brief` |
| Danh sách VLAN | `show vlan brief` |
| **Máy có MAC này cắm ở cổng nào** | `show mac address-table address <mac>` |
| Thiết bị nối trực tiếp (Cisco · đa hãng) | `show cdp neighbors` · `show lldp neighbors` |
| **Bộ đếm lỗi các cổng** | `show interfaces counters errors` |
| **Công suất PoE từng cổng** (camera, điện thoại IP, Wi-Fi) | `show power inline` |
| Cổng bị khoá do lỗi | `show interfaces status err-disabled` |
| Spanning tree: cổng nào đang chặn | `show spanning-tree blockedports` |
| Log · model, phiên bản | `show logging` · `show version` |

Lọc kết quả: `show running-config | include vlan` · `show running-config | section interface`.

### Đọc bộ đếm lỗi

| Bộ đếm tăng | Nguyên nhân hay gặp |
|---|---|
| `FCS-Err` / CRC | **Lớp vật lý**: dây hỏng, đầu bấm lỗi, nhiễu điện từ (dây chạy cạnh motor, biến tần) |
| `Late-Col` | Lệch chế độ duplex giữa hai đầu (một đầu tự động, một đầu đặt cứng) |
| `Runts` | Duplex lệch hoặc card mạng lỗi |
| Lỗi tăng đều theo thời gian | Sự cố đang diễn ra; số cũ không tăng thì có thể chỉ là lỗi từ trước |

?> Xoá bộ đếm bằng `clear counters gi1/0/5`, đợi vài phút rồi xem lại: lỗi có tăng hay không mới là căn cứ, con số tích luỹ từ lâu chưa nói lên điều gì.

### Cấu hình cổng cho máy tính (access)

```
configure terminal
vlan 20
 name SANXUAT
interface gi1/0/5
 description PC-XUONG-A-01
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
 no shutdown
end
write memory
```

`spanning-tree portfast`: cổng nối máy tính lên ngay, không chờ khoảng 30 giây. **Chỉ dùng cho cổng nối thiết bị đầu cuối**, không dùng cho cổng nối switch khác.

### Cổng nối giữa hai switch (trunk)

```
interface gi1/0/48
 description UPLINK-CORE
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

!> Thêm VLAN vào trunk đang chạy phải dùng `switchport trunk allowed vlan add 40`. Gõ thiếu chữ `add` sẽ **thay toàn bộ danh sách** bằng mỗi VLAN 40, mọi VLAN khác trên đường trunk đó mất kết nối ngay.

### Cổng bị khoá (err-disabled)

Sửa nguyên nhân trước (ví dụ có người cắm switch mini, cắm vòng dây), rồi mở lại cổng:

```
interface gi1/0/5
 shutdown
 no shutdown
```

## HPE / Aruba (ArubaOS-Switch)

| Việc | Cisco | HPE / Aruba |
|---|---|---|
| Trạng thái cổng | `show interfaces status` | `show interfaces brief` |
| VLAN | `show vlan brief` | `show vlans` |
| Tìm MAC | `show mac address-table address <mac>` | `show mac-address <mac>` |
| Hàng xóm | `show cdp neighbors` | `show lldp info remote-device` |
| Lưu cấu hình | `write memory` | `write memory` |

## FortiGate

| Việc | Lệnh |
|---|---|
| Model, phiên bản, thời gian chạy | `get system status` |
| CPU, RAM, số phiên | `get system performance status` |
| Trạng thái cổng | `get system interface physical` |
| Bảng định tuyến | `get router info routing-table all` |
| Ping, traceroute từ firewall | `execute ping <ip>` · `execute traceroute <ip>` |
| Bắt gói tin của một máy | `diagnose sniffer packet any 'host <ip>' 4` |

**Vì sao một kết nối bị chặn** (lần dấu đường đi của gói qua firewall):

```
diagnose debug reset
diagnose debug flow filter addr <ip>
diagnose debug flow show function-name enable
diagnose debug enable
diagnose debug flow trace start 10
```

Đọc kết quả: `Denied by forward policy check (policy 0)` nghĩa là không có policy nào cho phép, rơi vào luật chặn mặc định. Xong thì **tắt debug** để không làm chậm firewall:

```
diagnose debug disable
diagnose debug reset
```

Sao lưu cấu hình: giao diện web → biểu tượng tài khoản góc trên bên phải → **Configuration → Backup**.

## Nguồn tham khảo

- Cisco — [Catalyst 9300 command references](https://www.cisco.com/c/en/us/support/switches/catalyst-9300-series-switches/products-command-reference-list.html) · [Cisco Packet Tracer](https://www.netacad.com/cisco-packet-tracer)
- Fortinet — [FortiGate documentation](https://docs.fortinet.com/product/fortigate)
