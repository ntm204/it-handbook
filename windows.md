# Windows & Active Directory

Mở **cmd** hoặc **PowerShell** bằng `Win+R` → gõ `cmd` hoặc `powershell`.
Lệnh cần quyền quản trị: chuột phải → **Run as administrator**.

## Mạng (cmd)

| Việc | Lệnh |
|---|---|
| IP, gateway, DNS, MAC | `ipconfig /all` |
| Xin lại IP | `ipconfig /release` rồi `ipconfig /renew` |
| Xoá cache DNS | `ipconfig /flushdns` |
| Ping liên tục (dừng: Ctrl+C) | `ping -t <ip>` |
| Đường đi | `tracert <ip>` |
| Đường đi kèm tỉ lệ mất gói | `pathping <ip>` |
| Tra DNS | `nslookup <tên>` |
| Cổng đang mở kèm PID | `netstat -ano` |
| Ai đang dùng cổng 3389 | `netstat -ano \| findstr :3389` |

## Máy & tiến trình (cmd)

| Việc | Lệnh |
|---|---|
| Thông tin máy, ngày cài, bản cập nhật | `systeminfo` |
| Tên máy · tài khoản đang đăng nhập | `hostname` · `whoami` |
| Danh sách tiến trình | `tasklist` |
| Tắt tiến trình theo PID / tên | `taskkill /PID <pid> /F` · `taskkill /IM <tên>.exe /F` |
| Khởi động lại ngay | `shutdown /r /t 0` |
| Sửa file hệ thống bị lỗi | `sfc /scannow` |
| Sửa bộ cài Windows (chạy trước sfc nếu sfc báo lỗi) | `DISM /Online /Cleanup-Image /RestoreHealth` |
| Kiểm tra ổ đĩa (lần khởi động sau) | `chkdsk C: /f` |

## Domain & chia sẻ (cmd)

| Việc | Lệnh |
|---|---|
| Áp lại Group Policy ngay | `gpupdate /force` |
| Máy và user đang nhận policy nào | `gpresult /r` |
| Thông tin tài khoản domain (khoá chưa, hết hạn chưa) | `net user <tên> /domain` |
| Gắn ổ mạng | `net use Z: \\<server>\<share> /persistent:yes` |
| Xem · gỡ ổ mạng | `net use` · `net use Z: /delete` |
| Chép thư mục lớn, chép tiếp khi đứt | `robocopy <nguồn> <đích> /E /Z /R:2 /W:5 /LOG:C:\robocopy.log` |
| Đồng bộ y hệt (xoá ở đích những gì nguồn không có) | `robocopy <nguồn> <đích> /MIR` |

> `/MIR` **xoá** file ở đích nếu nguồn không có. Kiểm tra kỹ nguồn và đích trước khi chạy.

## Mở nhanh công cụ quản trị (Win+R)

| Gõ | Mở |
|---|---|
| `ncpa.cpl` | Card mạng |
| `services.msc` | Dịch vụ |
| `eventvwr.msc` | Nhật ký sự kiện (log) |
| `compmgmt.msc` | Quản lý máy: ổ đĩa, user cục bộ, thư mục chia sẻ |
| `devmgmt.msc` | Thiết bị, driver |
| `control printers` | Máy in |
| `mstsc /v:<ip>` | Remote Desktop tới máy khác |
| `dsa.msc` | Users and Computers (trên máy quản trị domain) |
| `gpmc.msc` | Quản lý Group Policy |
| `dnsmgmt.msc` · `dhcpmgmt.msc` | Quản lý DNS · DHCP server |

## PowerShell

```powershell
Test-NetConnection <ip> -Port 445            # thử kết nối tới cổng (thay cho telnet)
Get-NetIPConfiguration                       # IP, gateway, DNS
Resolve-DnsName <tên>                        # tra DNS
Get-Service | Where-Object Status -eq Running
Restart-Service Spooler                      # khởi động lại dịch vụ máy in
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Get-WinEvent -LogName System -MaxEvents 20   # 20 sự kiện hệ thống gần nhất
Get-ComputerInfo | Select-Object OsName, OsVersion, CsName
```

**Điều khiển máy khác từ xa:**

```powershell
Enter-PSSession -ComputerName <máy>                          # vào dòng lệnh của máy khác
Invoke-Command -ComputerName <máy1>,<máy2> -ScriptBlock { ipconfig /flushdns }   # chạy trên nhiều máy
```

## Active Directory (PowerShell)

Chạy trên máy có công cụ quản trị AD (RSAT) hoặc trên domain controller.

```powershell
Get-ADUser <tên> -Properties LockedOut, LastLogonDate, PasswordExpired
Search-ADAccount -LockedOut                  # mọi tài khoản đang bị khoá
Unlock-ADAccount <tên>                       # mở khoá
Set-ADAccountPassword <tên> -Reset -NewPassword (Read-Host -AsSecureString "Mật khẩu mới")
Set-ADUser <tên> -ChangePasswordAtLogon $true   # bắt đổi mật khẩu khi đăng nhập
Get-ADGroupMember "<nhóm>"                   # thành viên nhóm
Add-ADGroupMember "<nhóm>" -Members <tên>    # thêm vào nhóm
Get-ADComputer -Filter * | Measure-Object    # đếm số máy trong domain
```

## Máy in kẹt lệnh in

Lệnh in bị kẹt, xoá trong hàng đợi không được. Chạy cmd bằng quyền quản trị:

```bat
net stop spooler
del /Q %systemroot%\System32\spool\PRINTERS\*
net start spooler
```
