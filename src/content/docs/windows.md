---
title: Windows & AD
description: Bảng lệnh Windows và Active Directory cho IT văn phòng, nhà máy — mạng, đăng nhập domain, tài khoản bị khoá, file server, máy in, robocopy.
---

Lệnh Windows và Active Directory hay dùng. Lệnh `Get-…`, `Set-…` chạy trong PowerShell; lệnh AD chạy trên domain controller hoặc máy có RSAT.

## Gặp vấn đề {#gap-van-de}

| Triệu chứng | Chạy trước |
|---|---|
| *The trust relationship … failed* | `Test-ComputerSecureChannel -Repair -Credential (Get-Credential)` |
| Tài khoản bị khoá | `Search-ADAccount -LockedOut` · `Unlock-ADAccount <tên>` |
| Mở khoá xong lại bị khoá | Tìm máy gửi mật khẩu sai: [event 4740](#khoa-lien-tuc) |
| Lỗi giờ, lỗi Kerberos | `w32tm /resync` |
| Vừa được thêm quyền mà chưa vào được | `klist purge` rồi đăng xuất, đăng nhập lại |
| Không vào được thư mục chia sẻ | `Test-NetConnection <server> -Port 445` |
| *File đang được người khác mở* | `Get-SmbOpenFile` trên file server |
| Máy in kẹt lệnh in | [Xoá hàng đợi in](#may-in) |
| Wi-Fi hay rớt | `netsh wlan show wlanreport` |
| Máy mới nhận `169.254.x.x` | DHCP hết IP: `Get-DhcpServerv4ScopeStatistics` |

## Mạng {#mang}

| Việc | Lệnh |
|---|---|
| IP, gateway, DNS, MAC | `ipconfig /all` |
| Xin lại IP · xoá cache DNS | `ipconfig /release` → `ipconfig /renew` · `ipconfig /flushdns` |
| Thử kết nối tới cổng | `Test-NetConnection <ip> -Port 445` |
| Đường đi kèm % mất gói | `pathping <ip>` |
| Cổng đang mở kèm PID · PID là chương trình gì | `netstat -ano \| findstr LISTENING` · `tasklist /FI "PID eq <pid>"` |
| Báo cáo lịch sử Wi-Fi 3 ngày | `netsh wlan show wlanreport` |
| Đặt lại mạng (khi đã thử mọi cách) | `netsh winsock reset` · `netsh int ip reset` |

## Máy & hệ thống {#he-thong}

| Việc | Lệnh |
|---|---|
| Thông tin máy, ngày cài, bản vá | `systeminfo` |
| Tài khoản và nhóm đang dùng | `whoami /groups` |
| Tắt tiến trình | `taskkill /PID <pid> /F` · `taskkill /IM <tên>.exe /F` |
| Sửa file hệ thống (DISM trước) | `DISM /Online /Cleanup-Image /RestoreHealth` · `sfc /scannow` |
| Kiểm tra ổ khi khởi động lại | `chkdsk C: /f` |
| Áp lại Group Policy | `gpupdate /force` |
| Khởi động lại ngay | `shutdown /r /t 0` |

## Active Directory {#ad}

| Việc | Lệnh |
|---|---|
| Thông tin tài khoản | `Get-ADUser <tên> -Properties LockedOut, LastLogonDate, PasswordExpired` |
| Mọi tài khoản đang bị khoá · mở khoá | `Search-ADAccount -LockedOut` · `Unlock-ADAccount <tên>` |
| Đặt lại mật khẩu | `Set-ADAccountPassword <tên> -Reset -NewPassword (Read-Host -AsSecureString "Mật khẩu mới")` |
| Bắt đổi mật khẩu khi đăng nhập | `Set-ADUser <tên> -ChangePasswordAtLogon $true` |
| Thành viên nhóm · thêm vào nhóm | `Get-ADGroupMember "<nhóm>"` · `Add-ADGroupMember "<nhóm>" -Members <tên>` |
| Tài khoản 90 ngày không đăng nhập | `Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly` |
| Máy còn liên kết domain không | `nltest /sc_verify:<tên-domain>` |

`Test-ComputerSecureChannel -Repair` sửa lỗi mất liên kết domain tại chỗ, không cần gỡ máy ra join lại. Chạy trong Windows PowerShell 5.1 (`powershell`), không có trong PowerShell 7.

### Tài khoản bị khoá liên tục {#khoa-lien-tuc}

Có một máy đang gửi mật khẩu cũ (điện thoại lưu mật khẩu email cũ, ổ mạng gắn bằng mật khẩu cũ…). Event **4740** ghi tên máy đó:

```powershell
$pdc = (Get-ADDomain).PDCEmulator
Get-WinEvent -ComputerName $pdc -FilterHashtable @{LogName='Security'; Id=4740} -MaxEvents 20 |
  Select-Object TimeCreated, @{n='User';e={$_.Properties[0].Value}}, @{n='Từ máy';e={$_.Properties[1].Value}}
```

## File server & chép dữ liệu {#file-server}

| Việc | Lệnh |
|---|---|
| Gắn ổ mạng | `net use Z: \\<server>\<share> /persistent:yes` |
| Ai đang kết nối · thư mục chia sẻ | `Get-SmbSession` · `Get-SmbShare` |
| Ai đang giữ file | `Get-SmbOpenFile \| Where-Object Path -like "*<tên-file>*"` |
| Đóng file đang bị giữ | `Close-SmbOpenFile -FileId <id>` |
| Chép lớn, đứt mạng chép tiếp | `robocopy <nguồn> <đích> /E /Z /MT:16 /R:2 /W:5 /LOG:C:\robocopy.log` |
| Chạy thử, chỉ liệt kê | thêm `/L` |

:::caution
`robocopy /MIR` xoá ở đích những gì nguồn không có. Đảo ngược nguồn và đích là **mất sạch dữ liệu thật**. Luôn chạy thử với `/L` trước.
:::

### Máy in kẹt lệnh in {#may-in}

```bat
net stop spooler
del /Q %systemroot%\System32\spool\PRINTERS\*
net start spooler
```

## Mở nhanh công cụ (Win+R) {#cong-cu}

| Gõ | Mở |
|---|---|
| `ncpa.cpl` | Card mạng |
| `services.msc` | Dịch vụ |
| `eventvwr.msc` | Nhật ký sự kiện |
| `compmgmt.msc` | Ổ đĩa, user, thư mục chia sẻ |
| `devmgmt.msc` | Thiết bị, driver |
| `dsa.msc` | AD Users and Computers |
| `gpmc.msc` | Group Policy |
| `dnsmgmt.msc` · `dhcpmgmt.msc` | DNS server · DHCP server |
| `fsmgmt.msc` | Phiên đang mở file trên file server |

:::note
Lệnh trên trang này chưa chạy thử được trên máy lab (lab là Linux). Nguồn là tài liệu chính thức của Microsoft bên dưới.
:::

## Nguồn {#nguon}

- Microsoft Learn — [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands) · [robocopy](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy) · [netsh](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netsh) · [klist](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/klist)
- Microsoft Learn — [Test-ComputerSecureChannel](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/test-computersecurechannel?view=powershell-5.1) · [ActiveDirectory module](https://learn.microsoft.com/en-us/powershell/module/activedirectory/) · [Get-SmbOpenFile](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbopenfile) · [Get-DhcpServerv4ScopeStatistics](https://learn.microsoft.com/en-us/powershell/module/dhcpserver/get-dhcpserverv4scopestatistics) · [Event 4740](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4740)
