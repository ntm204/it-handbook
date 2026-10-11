# Lab thực hành

Đọc để hiểu, làm lab để **làm được**. Mỗi bài có làm mẫu kèm kết quả thật, rồi một bài tự làm có đáp án.

> Biến kiến thức trong các trang 02–05 thành kỹ năng: tự dựng, tự phá, tự sửa trong môi trường an toàn.

| Lab | Làm gì | Kiến thức | Ở đâu |
|---|---|---|---|
| [L1 · Hai mạng và một router](lab/01-mang-hai-may.md) | Dựng 2 subnet, nối bằng router | [Định tuyến, subnet](mang.md?id=chia-subnet) | Máy `lab` |
| [L2 · Quan sát DNS và TCP](lab/02-quan-sat-goi-tin.md) | Bắt gói tin DNS, bắt tay TCP, gói bị từ chối | [Luồng kết nối](mang.md?id=luong-ket-noi) | Máy `lab` |
| [L3 · Server đầy ổ](lab/03-day-o.md) | Làm đầy ổ, tìm file bị giữ, hết inode | [Ổ đầy hai kiểu](linux.md?id=o-day) | Máy `lab` |
| [L4 · Tự viết dịch vụ](lab/04-dich-vu-systemd.md) | Tạo dịch vụ systemd tự hồi sinh | [systemd](linux.md?id=systemd) | Máy `lab` |
| [L5 · Chặn và mở cổng](lab/05-firewall.md) | Firewall nftables: drop khác reject thế nào | [Triệu chứng TCP](mang.md?id=luong-ket-noi) | Máy `lab` |
| [L6 · VLAN trên switch Cisco](lab/06-vlan-cisco.md) | 2 switch, 2 VLAN, trunk, định tuyến giữa VLAN | [VLAN](mang.md?id=vlan) | Packet Tracer |

## Trước khi bắt đầu

| | |
|---|---|
| Vào máy Linux | `orb -m lab` |
| Cần hai cửa sổ cùng lúc (L2, L5) | `tmux new -s lab`, rồi <kbd>Ctrl</kbd>+<kbd>B</kbd> <kbd>\|</kbd> để chia đôi |
| Làm hỏng máy | Không sao: `orb delete lab`, tạo lại theo [hướng dẫn](linux.md) |

?> Các lab L1–L5 đã chạy thử trên máy `lab` (Ubuntu 26.04). Kết quả của bạn có thể khác ở số PID, thời gian, địa chỉ IPv6, nhưng diễn biến phải giống.
