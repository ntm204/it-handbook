# Xử lý sự cố

## Nguyên tắc chung

1. **Hỏi rõ phạm vi:** một máy, một phòng, hay cả nhà máy? Từ lúc nào? Vừa thay đổi gì?
2. **Kiểm tra từ dưới lên:** dây → IP → gateway → DNS → ứng dụng.
3. **Mỗi lần chỉ đổi một thứ**, rồi kiểm tra lại.
4. **Sao lưu trước khi sửa** cấu hình thiết bị hoặc server.
5. **Ghi lại:** triệu chứng, nguyên nhân, cách xử lý, cách phòng ngừa.

Phạm vi càng rộng thì lỗi càng nằm ở **thiết bị chung**: một máy lỗi thì xem máy đó, cả phòng lỗi thì xem switch phòng đó, cả nhà máy lỗi thì xem core switch, firewall, đường Internet.

---

## 1. Một máy không vào được mạng

| # | Kiểm tra | Lệnh / cách | Nếu lỗi |
|---|---|---|---|
| 1 | Đèn cổng mạng ở máy và switch | Nhìn | Đổi dây, đổi cổng switch |
| 2 | Có IP không | `ipconfig` | `169.254.x.x` → không xin được IP: kiểm tra dây, VLAN của cổng switch, DHCP server |
| 3 | Ping gateway | `ping <gateway>` | Sai VLAN, sai IP tĩnh |
| 4 | Ping ra ngoài | `ping 8.8.8.8` | Firewall chặn máy này |
| 5 | Phân giải tên | `nslookup google.com` | Sai DNS |

**Hay gặp:** dây lỏng hoặc đứt, người dùng tự đặt IP tĩnh trùng máy khác, cổng switch bị err-disabled, Wi-Fi bắt nhầm mạng khách.

Tìm máy đang cắm ở cổng switch nào: lấy MAC bằng `ipconfig /all`, rồi trên switch chạy `show mac address-table address <mac>`.

## 2. Cả một khu vực mất mạng

1. Mọi máy cùng mất, hay chỉ một số? Cùng nối về **một switch** không?
2. Ra tủ mạng: switch có điện không, đèn uplink có sáng không.
3. Trên core switch: `show interfaces status`, xem cổng uplink xuống khu vực đó có `connected` không.
4. `show logging`: tìm dòng báo cổng lên xuống liên tục (flapping), hoặc **loop**.

**Hay gặp:** mất điện tủ mạng hoặc UPS hết pin, dây uplink đứt (chuột cắn, xe nâng cán), **có người cắm vòng dây** gây loop làm cả mạng chậm hoặc tê liệt.

## 3. Vào được bằng IP nhưng không vào được bằng tên

```bat
nslookup <tên-server>
nslookup <tên-server> <ip-dns-server>
ipconfig /flushdns
```

**Hay gặp:** máy dùng DNS công cộng (8.8.8.8) nên không phân giải được tên nội bộ, server DNS nội bộ bị dừng, bản ghi DNS sai.

## 4. Không vào được thư mục chia sẻ (`\\server\share`)

| # | Kiểm tra | Lệnh |
|---|---|---|
| 1 | Server còn sống | `ping <server>` |
| 2 | Cổng SMB mở | `Test-NetConnection <server> -Port 445` |
| 3 | Đúng tài khoản không | `net use` (xem đang kết nối bằng tài khoản nào) |
| 4 | Có quyền không | Chuột phải thư mục trên server → Properties → Security |

**Hay gặp:** user chưa được thêm vào nhóm có quyền, tài khoản bị khoá hoặc hết hạn mật khẩu, Windows nhớ mật khẩu cũ (xoá trong **Credential Manager**).

## 5. Máy in không in

1. In được từ máy khác không? Được → lỗi ở máy này. Không → lỗi ở máy in.
2. `ping <ip-máy-in>`: không ping được → máy in mất mạng hoặc đổi IP.
3. Hàng đợi bị kẹt → [xoá hàng đợi](windows.md?id=máy-in-kẹt-lệnh-in).
4. Máy in báo lỗi trên màn hình: hết giấy, kẹt giấy, hết mực.

**Hay gặp:** máy in nhận IP động nên đổi IP (nên đặt IP cố định), hàng đợi kẹt, driver sai.

## 6. Không đăng nhập được domain / tài khoản bị khoá

```powershell
Get-ADUser <tên> -Properties LockedOut, PasswordExpired, Enabled
Unlock-ADAccount <tên>
```

**Hay gặp:**
- Nhập sai mật khẩu nhiều lần.
- Điện thoại vẫn đăng nhập email bằng mật khẩu cũ, nên tài khoản **bị khoá lại liên tục**.
- Giờ trên máy lệch quá 5 phút so với server: Kerberos từ chối đăng nhập. Kiểm tra bằng `w32tm /query /status`.
- Máy bị mất liên kết với domain: báo lỗi *trust relationship*, phải gỡ máy khỏi domain rồi join lại.

## 7. Server Linux đầy ổ

```bash
df -h                                          # phân vùng nào đầy
sudo du -sh /var/* | sort -rh | head           # thư mục nào nặng
sudo du -sh /var/log/* | sort -rh | head
journalctl --disk-usage
sudo journalctl --vacuum-time=7d               # dọn log hệ thống cũ
docker system df                               # nếu có Docker
```

> Đừng xoá file log đang được ghi bằng `rm`: chương trình vẫn giữ file nên **không giải phóng dung lượng**. Làm rỗng file thay vì xoá: `sudo truncate -s 0 <file>`.

**Hay gặp:** log không được xoay vòng (logrotate), file backup cũ tích tụ, image Docker cũ.

## 8. Server hoặc ứng dụng chậm

| Kiểm tra | Lệnh | Bất thường khi |
|---|---|---|
| Tải CPU | `uptime` | load average lớn hơn số nhân CPU kéo dài |
| Tiến trình nặng | `htop` | Một tiến trình chiếm gần hết CPU hoặc RAM |
| RAM | `free -h` | Cột `available` gần 0, swap dùng nhiều |
| Ổ đĩa | `df -h` | Gần 100% |
| Log lỗi | `journalctl -p err --since "1 hour ago"` | Lỗi lặp lại |

## 9. Web / ứng dụng nội bộ không truy cập được

Kiểm tra lần lượt từ máy người dùng tới server:

```bash
ping <server>                              # 1. server còn sống
nc -zv <server> 443                        # 2. cổng có mở
curl -I https://<tên-web>                  # 3. web có trả lời (xem mã trạng thái)
```

Trên server:

```bash
systemctl status <dịch-vụ>                 # 4. dịch vụ còn chạy
ss -tulpn | grep 443                       # 5. có chương trình đang nghe cổng
journalctl -u <dịch-vụ> -n 50              # 6. log lỗi gần nhất
```

| Mã HTTP | Nghĩa là |
|---|---|
| 200 | Bình thường |
| 301, 302 | Chuyển hướng |
| 401, 403 | Chưa đăng nhập / không có quyền |
| 404 | Sai đường dẫn |
| 500 | Lỗi bên trong ứng dụng → xem log ứng dụng |
| 502, 504 | Proxy (nginx) không gọi được ứng dụng phía sau → ứng dụng đã dừng hoặc quá tải |

## 10. Camera mất hình

1. Một camera hay nhiều camera? Nhiều camera cùng một switch PoE → kiểm tra switch đó.
2. `ping <ip-camera>`: không ping được → mất điện PoE, dây, hoặc camera hỏng.
3. Ping được nhưng đầu ghi không có hình → kiểm tra cổng RTSP: `Test-NetConnection <ip-camera> -Port 554`, rồi kiểm tra tài khoản camera trên đầu ghi.
4. Switch PoE quá tải công suất: một số cổng sẽ bị ngắt điện, thường xảy ra khi lắp thêm camera.

---

## Mẫu báo cáo sự cố

```
Sự cố:        Mất mạng khu xưởng A
Thời gian:    08:15 – 09:02 (47 phút)
Ảnh hưởng:    30 máy, 2 máy chấm công; dây chuyền không bị ảnh hưởng
Nguyên nhân:  Dây uplink từ core xuống switch xưởng A bị xe nâng cán đứt
Xử lý:        Thay dây tạm, chuyển uplink sang cổng dự phòng
Phòng ngừa:   Đi lại dây trong máng bảo vệ, cấu hình 2 đường uplink
Người xử lý:  <tên>
```
