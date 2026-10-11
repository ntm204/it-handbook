# Sổ tay IT

Hệ thống, server, mạng: lệnh đúng, quy trình chuẩn, nguồn chính thống. Đọc để làm được việc, không để biết cho vui.

## Đang gặp sự cố

| Triệu chứng | Kiểm tra đầu tiên |
|---|---|
| [Một máy không vào được mạng](xu-ly-su-co.md?id=su-co-1) | `ipconfig /all` |
| [Cả khu mất mạng, mạng chậm bất thường](xu-ly-su-co.md?id=su-co-2) | `show interfaces status` |
| [Tài khoản domain bị khoá liên tục](xu-ly-su-co.md?id=su-co-6) | `Search-ADAccount -LockedOut` |
| [Không vào được thư mục chia sẻ](xu-ly-su-co.md?id=su-co-4) | `Test-NetConnection <server> -Port 445` |
| [Máy in không in](xu-ly-su-co.md?id=su-co-5) | `ping <ip-máy-in>` |
| [Server Linux đầy ổ](xu-ly-su-co.md?id=su-co-7) | `df -h` |
| [Server chậm](xu-ly-su-co.md?id=su-co-8) | `uptime` |
| [Camera mất hình](xu-ly-su-co.md?id=su-co-10) | `ping <ip-camera>` |

Bấm triệu chứng để xem cách xử lý, bấm lệnh để copy. Tất cả 10 sự cố: [Xử lý sự cố](xu-ly-su-co.md).

## Học theo thứ tự

<div class="path">
<a href="#/nghe-nghiep"><span class="n">01</span><span class="t">Lộ trình nghề</span><span class="d">Vị trí nào, học gì trước, chứng chỉ nào đáng thi; mạng nhà máy chia tầng ra sao.</span></a>
<a href="#/mang"><span class="n">02</span><span class="t">Mạng</span><span class="d">Một máy vào mạng diễn ra thế nào; triệu chứng nào ứng với bước nào; chia subnet.</span></a>
<a href="#/linux"><span class="n">03</span><span class="t">Linux server</span><span class="d">Đọc tình trạng server trong 60 giây; dịch vụ, log, ổ đĩa, quyền, SSH.</span></a>
<a href="#/windows"><span class="n">04</span><span class="t">Windows &amp; AD</span><span class="d">Lệnh cmd, PowerShell; tài khoản domain; file server.</span></a>
<a href="#/thiet-bi-mang"><span class="n">05</span><span class="t">Switch &amp; Firewall</span><span class="d">Cisco, HPE/Aruba, FortiGate: VLAN, lỗi cổng, vì sao gói tin bị chặn.</span></a>
<a href="#/xu-ly-su-co"><span class="n">06</span><span class="t">Xử lý sự cố</span><span class="d">Quy trình 7 bước chuẩn CompTIA và 10 sự cố hay gặp nhất.</span></a>
</div>

## Thực hành

6 bài lab có làm mẫu và đáp án: [Lab thực hành](lab/README.md). Gặp thuật ngữ lạ: [Thuật ngữ](thuat-ngu.md).

## Tiến độ của bạn

<div id="review-due"></div>

Ôn lại theo lịch 1 ngày, 7 ngày, 30 ngày sau khi học giúp nhớ lâu hơn nhiều so với đọc lại liền một lúc. Trang tự nhắc khi đến hạn.

## Dùng trang này nhanh hơn

| | |
|---|---|
| <kbd>/</kbd> | Tìm ở bất kỳ đâu: tên lệnh, triệu chứng, thông báo lỗi |
| Bấm vào lệnh trong bảng | Copy ngay |
| `<ip>`, `<tên>` | Thay bằng giá trị của bạn |
| Chữ có gạch chấm | Rê chuột để xem giải thích thuật ngữ |
| Hộp **i** · hộp **!** | Nên biết · làm sai có thể mất dữ liệu hoặc mất kết nối |
| **In trang** · **In bảng tra** | Bản in A4, mang theo khi đi xử lý sự cố |

## Thực hành

| Mảng | Ở đâu |
|---|---|
| Linux, mạng | Máy `lab`: `orb -m lab` |
| Switch Cisco | [Cisco Packet Tracer](https://www.netacad.com/cisco-packet-tracer), miễn phí |
| PowerShell | `brew install powershell` → `pwsh` (lệnh Active Directory cần Windows) |
| Bắt gói tin | Wireshark |
