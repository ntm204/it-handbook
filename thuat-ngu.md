# Thuật ngữ

Thuật ngữ hay gặp, xếp theo chữ cái. Ở các trang khác, rê chuột (hoặc chạm) vào chữ có gạch chấm để xem giải thích ngay tại chỗ.

> Đọc tài liệu gốc, giao diện thiết bị và nói chuyện với đồng nghiệp bằng đúng thuật ngữ.

| Thuật ngữ | Tiếng Việt | Giải thích |
|---|---|---|
| **ACL** | Danh sách kiểm soát truy cập | Danh sách luật cho phép hoặc chặn gói tin, hoặc quyền trên file |
| **Active Directory** | Dịch vụ thư mục của Windows | Cơ sở dữ liệu tập trung về người dùng, máy tính, nhóm và chính sách trong domain |
| **ARP** | Phân giải địa chỉ | Hỏi "IP này có MAC là gì" trong cùng một mạng |
| **Broadcast** | Gửi cho tất cả | Gói gửi tới mọi máy trong cùng mạng (cùng VLAN) |
| **CIDR** | Ký hiệu độ dài mask | Cách viết mask bằng số bit, ví dụ /24 = 255.255.255.0 |
| **CRC** | Mã kiểm tra lỗi | Lỗi CRC trên cổng mạng gần như luôn do lớp vật lý: dây, đầu bấm, nhiễu |
| **DHCP** | Cấp IP tự động | Dịch vụ cấp IP, mask, gateway, DNS cho máy khi vào mạng |
| **DMZ** | Vùng đệm | Vùng mạng nằm giữa hai vùng tin cậy khác nhau, kiểm soát mọi kết nối qua lại |
| **DNS** | Phân giải tên miền | Đổi tên (example.com) thành địa chỉ IP |
| **Domain controller** | Máy chủ điều khiển domain | Server chạy Active Directory, xác thực đăng nhập trong domain |
| **Duplex** | Chế độ truyền hai chiều | Full: gửi và nhận cùng lúc. Hai đầu lệch chế độ sinh lỗi late collision |
| **ERP** | Hệ thống quản trị doanh nghiệp | Phần mềm quản lý tài chính, kho, mua bán (SAP, Oracle…) |
| **Gateway** | Cổng ra mạng ngoài | Router mà máy gửi gói tới khi đích nằm ngoài mạng của mình |
| **Group Policy** | Chính sách nhóm | Cấu hình áp tự động từ domain xuống máy và người dùng |
| **HMI** | Màn hình vận hành | Màn hình để công nhân điều khiển, theo dõi máy móc |
| **ICMP** | Giao thức thông báo | Giao thức mà ping và traceroute dùng |
| **Inode** | Mục quản lý file | Mỗi file chiếm một inode; hết inode thì không tạo được file dù ổ còn trống |
| **Kerberos** | Giao thức xác thực | Cách domain Windows xác thực bằng vé; yêu cầu giờ hai bên không lệch quá 5 phút |
| **Loopback** | Địa chỉ của chính máy | 127.0.0.1, dùng để máy tự kết nối tới chính nó |
| **MAC** | Địa chỉ phần cứng | Địa chỉ gắn với card mạng, switch dùng nó để chuyển gói |
| **MES** | Hệ thống điều hành sản xuất | Phần mềm theo dõi, điều phối sản xuất tại xưởng |
| **NAT** | Chuyển đổi địa chỉ | Router đổi IP nội bộ thành IP công khai khi gói đi ra Internet |
| **NTP** | Đồng bộ giờ | Giao thức giữ giờ các máy khớp nhau |
| **OT** | Công nghệ vận hành | Hệ thống điều khiển máy móc sản xuất, khác với IT văn phòng |
| **PLC** | Bộ điều khiển lập trình | Máy tính công nghiệp điều khiển trực tiếp máy móc |
| **PoE** | Cấp nguồn qua dây mạng | Switch cấp điện cho camera, điện thoại IP, Wi-Fi qua chính dây mạng |
| **Port forward** | Chuyển tiếp cổng | Cho phép kết nối từ ngoài Internet đi vào một máy nội bộ |
| **RDP** | Điều khiển từ xa | Remote Desktop của Windows, cổng 3389 |
| **RSAT** | Công cụ quản trị từ xa | Bộ công cụ để quản trị Active Directory, DNS, DHCP từ máy Windows thường |
| **SCADA** | Hệ thống giám sát điều khiển | Phần mềm giám sát, thu thập dữ liệu từ nhiều PLC |
| **SMB** | Chia sẻ file Windows | Giao thức của thư mục chia sẻ \\server\share, cổng 445 |
| **SNMP** | Giám sát thiết bị | Giao thức để phần mềm giám sát đọc trạng thái switch, máy in, UPS |
| **SRV** | Bản ghi dịch vụ | Bản ghi DNS cho biết máy nào cung cấp dịch vụ; máy trạm dùng nó để tìm domain controller |
| **SSH** | Đăng nhập từ xa an toàn | Cách quản trị server Linux và thiết bị mạng qua mạng, cổng 22 |
| **STP** | Giao thức cây khung | Spanning Tree: tự khoá cổng thừa để mạng switch không có vòng lặp |
| **Subnet** | Mạng con | Một dải IP, xác định bằng địa chỉ mạng và mask |
| **systemd** | Trình quản lý hệ thống Linux | Khởi động và trông coi dịch vụ, gom log vào journal |
| **TCP** | Giao thức truyền tin cậy | Mở kết nối bằng bắt tay 3 bước, đảm bảo dữ liệu đến đủ và đúng thứ tự |
| **TLS** | Mã hoá kết nối | Lớp mã hoá của HTTPS; người bắt gói không đọc được nội dung |
| **Trunk** | Đường trục | Cổng mang nhiều VLAN, mỗi gói gắn thẻ 802.1Q |
| **UDP** | Giao thức truyền nhanh | Gửi không cần mở kết nối, không đảm bảo đến nơi (DNS, DHCP, NTP) |
| **Uplink** | Đường lên | Dây nối từ switch khu vực lên switch trung tâm |
| **VLAN** | Mạng LAN ảo | Chia một switch thành nhiều mạng riêng biệt |
| **VPN** | Mạng riêng ảo | Đường hầm mã hoá để truy cập mạng nội bộ từ xa |

## Nguồn tham khảo :id=nguon

- Định nghĩa đối chiếu với các nguồn đã dẫn ở từng trang: IETF RFC, IEEE 802.1Q, Microsoft Learn, man page Linux.
