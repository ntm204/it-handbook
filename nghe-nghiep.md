# Bản đồ nghề hệ thống & mạng

## Vì sao AI khó thay thế mảng này

- **Phải chạm vào thiết bị thật:** cắm dây, thay switch hỏng, đọc đèn cổng mạng, thay ổ cứng, đi dây mạng trong xưởng.
- **Mạng nội bộ không ra Internet:** nhiều hệ thống nhà máy bị cách ly, AI không truy cập được.
- **Dữ liệu nhạy cảm:** cấu hình firewall, tài khoản, sơ đồ mạng không được đưa ra ngoài.
- **Chịu trách nhiệm khi sự cố:** dây chuyền dừng 1 giờ là thiệt hại lớn. Cần người hiểu hệ thống, quyết định nhanh và chịu trách nhiệm.
- **Mỗi nơi một kiểu:** hệ thống chắp vá qua nhiều năm, chỉ người đang vận hành mới nắm.

AI giúp tra lệnh và giải thích lỗi. Người làm nghề vẫn phải **hiểu hệ thống, chẩn đoán và ra quyết định**.

## Các vị trí

| Vị trí | Làm gì hằng ngày | Công cụ chính |
|---|---|---|
| **IT Helpdesk / Support** | Sửa máy tính, máy in, Office, email, Wi-Fi, cấp tài khoản | Windows, cmd, Remote Desktop, phần mềm ticket |
| **System Admin (Windows)** | Quản lý domain, phân quyền, file server, backup, cập nhật | Active Directory, Group Policy, PowerShell, VMware/Hyper-V |
| **System Admin (Linux)** | Vận hành server web/ứng dụng/database, giám sát, log | Bash, systemd, SSH, Docker |
| **Network Admin / Engineer** | Switch, router, firewall, VLAN, VPN, Wi-Fi, giám sát mạng | Cisco/HPE/Aruba CLI, FortiGate, Wireshark |
| **IT nhà máy (khu công nghiệp)** | Tổng hợp tất cả ở trên, thường 1–3 người lo cả nhà máy | Tất cả ở trên + camera, chấm công, ERP/MES |
| **OT / ICS** | Mạng điều khiển máy móc sản xuất: PLC, SCADA, HMI | Modbus, Profinet, OPC UA, mạng OT tách riêng |
| **DevOps / Cloud** | Tự động hoá triển khai, hạ tầng cloud | Linux, Docker, CI/CD, AWS/Azure |

## Đặc thù IT ở khu công nghiệp

- **Windows chiếm đa số:** máy văn phòng, domain Active Directory, file server, máy in mạng.
- **Nhiều khu vực, nhiều VLAN:** văn phòng, xưởng, kho, camera, Wi-Fi khách, mạng máy móc.
- **Hệ thống quanh sản xuất:** ERP (SAP, Oracle…), MES, máy chấm công, camera và đầu ghi (NVR), cân điện tử, máy in mã vạch.
- **Mạng IT và OT:** máy móc sản xuất nằm ở mạng riêng. Không được để mạng văn phòng ảnh hưởng tới dây chuyền.
- **Vận hành 24/7:** nhà máy chạy ca, sự cố ban đêm vẫn phải xử lý, thường qua điện thoại hoặc truy cập từ xa.
- **Phòng server và tủ mạng:** UPS, điều hoà, đi dây, dán nhãn, sơ đồ đấu nối.
- **Tuân thủ:** khoá USB, phân quyền dữ liệu, sao lưu, kiểm toán của tập đoàn mẹ.
- **Ngoại ngữ:** công ty FDI (Hàn, Nhật, Trung, Đài) thường yêu cầu báo cáo bằng tiếng Anh hoặc tiếng của công ty mẹ.

## Lộ trình học

| # | Học gì | Đủ khi bạn làm được |
|---|---|---|
| 1 | Nền tảng mạng: TCP/IP, subnet, DNS, DHCP, VLAN | Chia subnet bằng tay, giải thích một máy vào web đi qua những bước nào |
| 2 | Linux cơ bản | SSH vào server, xem log, quản lý dịch vụ, xử lý đầy ổ |
| 3 | Windows & Active Directory | Tạo user, phân quyền thư mục, áp Group Policy, xử lý tài khoản bị khoá |
| 4 | Switch (Cisco CLI) | Cấu hình VLAN, cổng access/trunk, tìm một máy đang cắm ở cổng nào |
| 5 | Firewall & VPN | Viết policy, NAT, VPN cho nhân viên làm từ xa |
| 6 | Ảo hoá & sao lưu | Tạo và sao lưu máy ảo, khôi phục dữ liệu |
| 7 | Script tự động hoá: Bash, PowerShell, Python | Viết script làm thay việc lặp lại hằng ngày |

## Chứng chỉ phổ biến

| Chứng chỉ | Mảng | Ghi chú |
|---|---|---|
| **CCNA** (Cisco) | Mạng | Được tuyển dụng ở Việt Nam đánh giá cao nhất cho mảng mạng |
| CompTIA A+ / Network+ | Nền tảng phần cứng, mạng | Trung lập, không gắn hãng |
| RHCSA / LPIC-1 | Linux | RHCSA thi thực hành trên máy thật |
| Fortinet FCA / FCP | Firewall FortiGate | FortiGate rất phổ biến ở nhà máy |
| Microsoft (Windows Server Hybrid) | Windows Server, AD | Hợp với môi trường nhiều Windows |

## Kỹ năng ngoài lệnh

- **Ghi chép:** sơ đồ mạng, danh sách IP, mật khẩu thiết bị (trong trình quản lý mật khẩu), nhật ký thay đổi.
- **Báo cáo sự cố:** thời gian, ảnh hưởng, nguyên nhân, cách xử lý, cách phòng ngừa.
- **Giao tiếp:** giải thích cho người không chuyên, báo cáo cho quản lý.
- **Bình tĩnh khi dừng chuyền:** làm theo quy trình, không đoán mò.
