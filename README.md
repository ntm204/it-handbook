# Sổ tay IT

Tra cứu và học thực chiến về hệ thống, server, mạng. Chỉ giữ những gì dùng được ngay, mỗi trang đều dẫn nguồn chính thống.

<div class="cards">
<a class="card" href="#/nghe-nghiep"><span class="card-step">01 · ĐỊNH HƯỚNG</span><span class="card-title">Lộ trình nghề</span><span class="card-desc">Các vị trí, IT trong nhà máy, mô hình tách mạng IT/OT, thứ tự học, chứng chỉ.</span></a>
<a class="card" href="#/mang"><span class="card-step">02 · NỀN TẢNG</span><span class="card-title">Mạng</span><span class="card-desc">Một máy vào mạng ra sao, chia subnet, cổng, lệnh tương đương giữa các hệ điều hành.</span></a>
<a class="card" href="#/linux"><span class="card-step">03 · HỆ ĐIỀU HÀNH</span><span class="card-title">Linux server</span><span class="card-desc">Đọc tình trạng server trong 60 giây, dịch vụ, log, ổ đĩa, quyền, SSH.</span></a>
<a class="card" href="#/windows"><span class="card-step">04 · HỆ ĐIỀU HÀNH</span><span class="card-title">Windows &amp; Active Directory</span><span class="card-desc">Lệnh cmd, PowerShell, quản lý tài khoản domain, truy tìm nguồn gây khoá tài khoản.</span></a>
<a class="card" href="#/thiet-bi-mang"><span class="card-step">05 · THIẾT BỊ</span><span class="card-title">Switch &amp; Firewall</span><span class="card-desc">Cisco IOS, HPE/Aruba, FortiGate: xem, cấu hình VLAN, tìm lỗi cổng, lần dấu gói tin.</span></a>
<a class="card" href="#/xu-ly-su-co"><span class="card-step">06 · THỰC CHIẾN</span><span class="card-title">Xử lý sự cố</span><span class="card-desc">Quy trình 7 bước chuẩn CompTIA và 10 sự cố hay gặp nhất, kèm mẫu báo cáo.</span></a>
</div>

## Cách đọc

| Ký hiệu | Ý nghĩa |
|---|---|
| `<ip>`, `<tên>` | Thay bằng giá trị của bạn, ví dụ `<ip>` → `192.168.1.10` |
| `sudo` · **Run as administrator** | Lệnh cần quyền quản trị (Linux · Windows) |
| Hộp **i** | Ghi chú nên biết |
| Hộp **!** | Cảnh báo: làm sai có thể mất dữ liệu hoặc mất kết nối |
| Hộp **◎** | Mục tiêu: đọc xong trang bạn làm được gì |

Thuật ngữ giữ tiếng Anh kèm giải thích, vì giao diện thiết bị và tài liệu gốc đều dùng tiếng Anh.

## Thực hành ở đâu

| Mảng | Môi trường | Bắt đầu |
|---|---|---|
| Linux, mạng | Máy Linux `lab` (Ubuntu trong OrbStack) | `orb -m lab` |
| Switch, router Cisco | Cisco Packet Tracer, miễn phí với tài khoản Networking Academy | [netacad.com](https://www.netacad.com/cisco-packet-tracer) |
| PowerShell | Chạy được trên Mac (lệnh Active Directory cần Windows) | `brew install powershell` → `pwsh` |
| Bắt gói tin | Wireshark trên Mac | mở ứng dụng Wireshark |
