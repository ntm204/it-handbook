# Windows & Active Directory

Lệnh cmd và PowerShell cho máy trạm, file server và domain. Mở bằng <kbd>Win</kbd>+<kbd>R</kbd> → `cmd` hoặc `powershell`; lệnh quản trị: chuột phải → **Run as administrator**.

> Chẩn đoán mạng trên Windows; sửa máy mất liên kết domain mà không phải gỡ khỏi domain; tìm ra máy đang làm khoá tài khoản; xem ai đang giữ file trên file server.

<p class="related">Liên quan: <a href="#/xu-ly-su-co?id=su-co-6">Không đăng nhập domain</a> · <a href="#/xu-ly-su-co?id=su-co-4">Thư mục chia sẻ</a> · <a href="#/xu-ly-su-co?id=su-co-5">Máy in</a></p>

## Mạng :id=mang

| Việc | Lệnh |
|---|---|
| IP, gateway, DNS, MAC | `ipconfig /all` |
| Xin lại IP · xoá cache DNS | `ipconfig /release` → `ipconfig /renew` · `ipconfig /flushdns` |
| Thử kết nối tới cổng | `Test-NetConnection <ip> -Port 445` |
| Đường đi kèm tỉ lệ mất gói | `pathping <ip>` |
| Cổng đang mở kèm PID | `netstat -ano \| findstr LISTENING` |
| Ai đang dùng cổng 3389 | `netstat -ano \| findstr :3389` → `tasklist /FI "PID eq <pid>"` |
| **Báo cáo lịch sử Wi-Fi** (rớt mạng lúc nào, vì sao) | `netsh wlan show wlanreport` |
| Đặt lại toàn bộ cấu hình mạng (khi lỗi lạ, đã thử mọi cách) | `netsh winsock reset` và `netsh int ip reset`, rồi khởi động lại |

?> `netsh wlan show wlanreport` tạo file HTML tại `C:\ProgramData\Microsoft\Windows\WlanReport\wlan-report-latest.html`, ghi lại từng lần mất kết nối Wi-Fi trong 3 ngày. Đây là bằng chứng cụ thể khi người dùng than "Wi-Fi hay rớt".

## Máy & hệ thống

| Việc | Lệnh |
|---|---|
| Thông tin máy, ngày cài, bản vá | `systeminfo` |
| Tên máy · tài khoản và nhóm | `hostname` · `whoami /groups` |
| Tắt tiến trình | `taskkill /PID <pid> /F` · `taskkill /IM <tên>.exe /F` |
| Sửa file hệ thống | `DISM /Online /Cleanup-Image /RestoreHealth` rồi `sfc /scannow` |
| Kiểm tra ổ đĩa (chạy khi khởi động lại) | `chkdsk C: /f` |
| Khởi động lại ngay | `shutdown /r /t 0` |

?> Chạy **DISM trước, sfc sau**: `sfc` sửa file hệ thống bằng kho gốc của Windows, còn DISM sửa chính kho gốc đó. Kho hỏng thì `sfc` báo không sửa được.

## Mở nhanh công cụ (Win+R)

| Gõ | Mở | Gõ | Mở |
|---|---|---|---|
| `ncpa.cpl` | Card mạng | `dsa.msc` | AD Users and Computers |
| `services.msc` | Dịch vụ | `gpmc.msc` | Quản lý Group Policy |
| `eventvwr.msc` | Nhật ký sự kiện | `dnsmgmt.msc` | DNS server |
| `compmgmt.msc` | Ổ đĩa, user, thư mục chia sẻ | `dhcpmgmt.msc` | DHCP server |
| `devmgmt.msc` | Thiết bị, driver | `fsmgmt.msc` | Thư mục chia sẻ, phiên đang mở |

## Domain: đăng nhập & Group Policy

| Việc | Lệnh |
|---|---|
| Áp lại Group Policy · xem policy đang nhận | `gpupdate /force` · `gpresult /r` |
| Xoá vé Kerberos (vừa được thêm quyền mà chưa có tác dụng) | `klist purge` rồi đăng xuất, đăng nhập lại |
| Kiểm tra giờ, đồng bộ lại giờ | `w32tm /query /status` · `w32tm /resync` |
| Máy còn liên kết domain không | `nltest /sc_verify:<tên-domain>` |
| **Sửa mất liên kết domain, không cần gỡ ra join lại** | `Test-ComputerSecureChannel -Repair -Credential (Get-Credential)` |

!> Giờ trên máy lệch quá **5 phút** so với domain controller (mặc định của Kerberos) là không đăng nhập domain được. Máy mất pin CMOS hoặc không đồng bộ giờ hay gặp lỗi này.

?> Lỗi *"The trust relationship between this workstation and the primary domain failed"*: cách cũ là gỡ máy khỏi domain rồi join lại, mất profile và mất thời gian. Lệnh `Test-ComputerSecureChannel -Repair` (chạy bằng quyền quản trị cục bộ, nhập tài khoản domain admin) sửa tại chỗ trong vài giây. Lệnh này có trong Windows PowerShell 5.1 (`powershell`), không có trong PowerShell 7 (`pwsh`).

## Active Directory (PowerShell) :id=active-directory

Chạy trên domain controller hoặc máy đã cài RSAT.

```powershell
Get-ADUser <tên> -Properties LockedOut, LastLogonDate, PasswordExpired, PasswordLastSet
Search-ADAccount -LockedOut                          # mọi tài khoản đang bị khoá
Unlock-ADAccount <tên>
Set-ADAccountPassword <tên> -Reset -NewPassword (Read-Host -AsSecureString "Mật khẩu mới")
Set-ADUser <tên> -ChangePasswordAtLogon $true
Get-ADGroupMember "<nhóm>" | Select-Object Name
Add-ADGroupMember "<nhóm>" -Members <tên>
Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly   # tài khoản 90 ngày không đăng nhập
```

**Tìm máy đang làm khoá tài khoản** (mở khoá xong lại bị khoá):

```powershell
Get-WinEvent -ComputerName <PDC> -FilterHashtable @{LogName='Security'; Id=4740} -MaxEvents 20 |
  Select-Object TimeCreated, @{n='User';e={$_.Properties[0].Value}}, @{n='Từ máy';e={$_.Properties[1].Value}}
```

Event **4740** ghi lại tên máy gửi mật khẩu sai. Thủ phạm hay gặp: điện thoại còn lưu mật khẩu email cũ, ổ mạng đã gắn bằng mật khẩu cũ, dịch vụ chạy bằng tài khoản người dùng. `<PDC>` là domain controller giữ vai trò PDC emulator, tìm bằng `(Get-ADDomain).PDCEmulator`.

## File server

| Việc | Lệnh (trên file server) |
|---|---|
| **Ai đang mở file** (báo "file đang được người khác dùng") | `Get-SmbOpenFile \| Where-Object Path -like "*<tên-file>*"` |
| Đóng file đó | `Close-SmbOpenFile -FileId <id>` |
| Ai đang kết nối vào server | `Get-SmbSession` |
| Danh sách thư mục chia sẻ | `Get-SmbShare` |

**Gắn ổ mạng và chép dữ liệu** (trên máy trạm):

```bat
net use Z: \\<server>\<share> /persistent:yes
robocopy <nguồn> <đích> /E /Z /MT:16 /R:2 /W:5 /LOG:C:\robocopy.log
```

| Tham số robocopy | Ý nghĩa |
|---|---|
| `/E` | Chép cả thư mục con, kể cả thư mục rỗng |
| `/Z` | Đứt mạng thì chép tiếp từ chỗ dừng |
| `/MT:16` | Chép 16 luồng song song, nhanh hơn nhiều với nhiều file nhỏ |
| `/R:2 /W:5` | Lỗi thì thử lại 2 lần, mỗi lần cách 5 giây (mặc định là 1 triệu lần) |
| `/MIR` | Đồng bộ y hệt: **xoá** ở đích những gì nguồn không có |

!> `/MIR` với nguồn và đích bị đảo ngược sẽ **xoá sạch dữ liệu thật**. Chạy thử với `/L` trước (chỉ liệt kê, không chép, không xoá).

## DHCP server

```powershell
Get-DhcpServerv4ScopeStatistics            # mỗi dải IP đã dùng bao nhiêu %
Get-DhcpServerv4Lease -ScopeId <dải>       # máy nào đang giữ IP nào
```

Dải IP dùng gần 100% → máy mới không xin được IP (nhận `169.254.x.x`). Rút ngắn thời gian thuê IP (lease) hoặc mở rộng dải.

## Máy in kẹt lệnh in :id=may-in-ket

```bat
net stop spooler
del /Q %systemroot%\System32\spool\PRINTERS\*
net start spooler
```

## Cần nhớ :id=can-nho

1. Lệch giờ quá **5 phút** là không đăng nhập domain được: kiểm tra bằng `w32tm /query /status`.
2. Tài khoản bị khoá lặp lại: xem **event 4740** trên PDC để biết máy nào gửi mật khẩu sai.
3. `robocopy /MIR` xoá ở đích những gì nguồn không có: luôn chạy thử với `/L` trước.

## Nguồn tham khảo :id=nguon

- Microsoft Learn — [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands) · [robocopy](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy) · [netsh](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netsh) · [klist](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/klist) · [nltest](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc731935(v=ws.11))
- Microsoft Learn — [Test-ComputerSecureChannel](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/test-computersecurechannel?view=powershell-5.1) · [ActiveDirectory module](https://learn.microsoft.com/en-us/powershell/module/activedirectory/) · [Get-SmbOpenFile](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbopenfile) · [Get-DhcpServerv4ScopeStatistics](https://learn.microsoft.com/en-us/powershell/module/dhcpserver/get-dhcpserverv4scopestatistics)
- Microsoft Learn — [Event 4740: A user account was locked out](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4740) · [Maximum tolerance for computer clock synchronization](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/maximum-tolerance-for-computer-clock-synchronization) · [Windows Time service tools](https://learn.microsoft.com/en-us/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings)
