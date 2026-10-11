# Lab 2 · Quan sát DNS và TCP

Dùng `tcpdump` để **nhìn tận mắt** các bước 3 và 4 của luồng kết nối: hỏi DNS, bắt tay TCP, và một kết nối bị từ chối.

> Đọc được kết quả tcpdump: phân biệt truy vấn và trả lời DNS, nhận ra bắt tay 3 bước của TCP và gói bị từ chối (RST).

<p class="related">Kiến thức: <a href="#/mang?id=luong-ket-noi">Từ lúc cắm dây đến lúc mở được web</a> · <a href="#/mang?id=bat-goi-tin">Bắt gói tin</a></p>

## Chuẩn bị :id=chuan-bi

Cần 2 cửa sổ: một để bắt gói, một để chạy lệnh.

```bash
orb -m lab
tmux new -s lab          # rồi Ctrl+B |  để chia đôi; Ctrl+B ← → để chuyển ô
```

## Làm mẫu :id=lam-mau

### 1 · Một truy vấn DNS :id=dns

Cửa sổ trái:

```bash
sudo tcpdump -i any -nn port 53
```

Cửa sổ phải:

```bash
dig +short example.com
```

Cửa sổ trái hiện (rút gọn):

```
Out IP 192.168.139.160.60453 > 0.250.250.200.53: 20818+ A? example.com. (52)
In  IP 0.250.250.200.53 > 192.168.139.160.60453: 20818 2/0/1 A 104.20.23.154, A 172.66.147.243 (94)
```

| Phần | Nghĩa |
|---|---|
| `> <ip-dns>.53` | Gửi tới cổng 53 của DNS server |
| `20818+ A? example.com.` | Truy vấn số 20818: hỏi bản ghi **A** (IPv4) của example.com |
| `20818 2/0/1 A 104.20.23.154, …` | Trả lời cùng số 20818: có **2** câu trả lời, kèm IP |

Dừng tcpdump bằng <kbd>Ctrl</kbd>+<kbd>C</kbd>.

### 2 · Bắt tay TCP :id=bat-tay

Cửa sổ trái:

```bash
sudo tcpdump -i any -nn 'tcp port 80 and host example.com'
```

Cửa sổ phải:

```bash
curl -4 -s -o /dev/null -w "%{http_code}\n" http://example.com
```

```
Flags [S],  seq 4274952610                  ← máy mình: SYN, xin kết nối
Flags [S.], seq 54176101, ack 4274952611    ← server: SYN-ACK, đồng ý
Flags [.],  ack 1                           ← máy mình: ACK. Kết nối đã mở
Flags [P.], length 75: HTTP: GET / HTTP/1.1 ← gửi yêu cầu
Flags [P.], length 933: HTTP: HTTP/1.1 200 OK
```

| Cờ | Nghĩa |
|---|---|
| `[S]` | SYN: xin mở kết nối |
| `[S.]` | SYN + ACK: đồng ý |
| `[.]` | ACK: xác nhận |
| `[P.]` | Có dữ liệu |
| `[F.]` | Kết thúc kết nối |
| `[R.]` | Reset: **từ chối** hoặc cắt ngang |

### 3 · Kết nối bị từ chối :id=tu-choi

Cổng 9 không có chương trình nào nghe. Cửa sổ trái:

```bash
sudo tcpdump -i lo -nn 'tcp port 9'
```

Cửa sổ phải:

```bash
nc -zv 127.0.0.1 9
```

```
nc: connect to 127.0.0.1 port 9 (tcp) failed: Connection refused
IP 127.0.0.1.54982 > 127.0.0.1.9: Flags [S], …
IP 127.0.0.1.9 > 127.0.0.1.54982: Flags [R.], …
```

Gửi SYN, nhận ngay **RST**: máy đích còn sống nhưng cổng đóng. Đó chính là `Connection refused`.

## Tự làm :id=tu-lam

Bắt gói khi chạy `curl https://example.com` (cổng 443). Có thấy được nội dung `HTTP/1.1 200 OK` như ở bước 2 không? Vì sao?

<details>
<summary>Đáp án</summary>

Lệnh bắt gói: `sudo tcpdump -i any -nn 'tcp port 443 and host example.com'`. Vẫn thấy bắt tay `[S]`, `[S.]`, `[.]`, nhưng **không** đọc được nội dung HTTP: HTTPS mã hoá toàn bộ dữ liệu bằng TLS. tcpdump chỉ thấy được địa chỉ, cổng, cờ TCP và kích thước gói.

</details>

## Cần nhớ :id=can-nho

1. DNS: truy vấn và trả lời có **cùng một số**; `A?` là hỏi IPv4, `AAAA?` là hỏi IPv6.
2. TCP mở kết nối bằng `[S]` → `[S.]` → `[.]`. Không có `[S.]` trả về = gói bị chặn hoặc máy đích không tồn tại.
3. `[R.]` ngay sau `[S]` = cổng đóng (`Connection refused`).

## Nguồn tham khảo :id=nguon

- [tcpdump(1)](https://www.tcpdump.org/manpages/tcpdump.1.html) · IETF [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) (TCP) · [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034) (DNS)
