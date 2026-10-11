# Lab 5 · Chặn và mở cổng

Dựng một client và một server, rồi dùng **nftables** để chặn, từ chối và chỉ cho phép một máy truy cập cổng 8080.

> Thấy tận mắt vì sao có lúc báo `timed out`, có lúc báo `refused`; viết luật firewall chỉ cho phép đúng nguồn cần thiết.

<p class="related">Kiến thức: <a href="#/mang?id=luong-ket-noi">Triệu chứng ở bước TCP</a> · <a href="#/linux?id=firewall">Firewall ufw</a></p>

## Chuẩn bị :id=chuan-bi

```bash
sudo ip netns add client
sudo ip netns add server
sudo ip link add veth-c type veth peer name veth-s
sudo ip link set veth-c netns client
sudo ip link set veth-s netns server
sudo ip -n client addr add 10.0.0.1/24 dev veth-c
sudo ip -n server addr add 10.0.0.2/24 dev veth-s
sudo ip -n client link set veth-c up
sudo ip -n server link set veth-s up
```

Mở `tmux`, chia đôi. Cửa sổ trái chạy "dịch vụ" trên server (dừng bằng <kbd>Ctrl</kbd>+<kbd>C</kbd>):

```bash
sudo ip netns exec server nc -lk 8080
```

Cửa sổ phải dùng để thử kết nối từ client. Lệnh thử dùng lại nhiều lần:

```bash
sudo ip netns exec client nc -zv -w 2 10.0.0.2 8080
```

## Làm mẫu :id=lam-mau

### 1 · Chưa có luật :id=chua-co-luat

```
Connection to 10.0.0.2 8080 port [tcp/http-alt] succeeded!
```

### 2 · Chặn im lặng (drop) :id=drop

```bash
sudo ip netns exec server nft add table inet lab
sudo ip netns exec server nft add chain inet lab input '{ type filter hook input priority 0; policy accept; }'
sudo ip netns exec server nft add rule inet lab input tcp dport 8080 drop
```

```
nc: connect to 10.0.0.2 port 8080 (tcp) timed out: Operation now in progress
```

Lệnh thử **chờ hết 2 giây** rồi mới báo lỗi: gói bị bỏ, không có trả lời nào.

### 3 · Từ chối (reject) :id=reject

```bash
sudo ip netns exec server nft flush chain inet lab input
sudo ip netns exec server nft add rule inet lab input tcp dport 8080 reject with tcp reset
```

```
nc: connect to 10.0.0.2 port 8080 (tcp) failed: Connection refused
```

Báo lỗi **ngay lập tức**: server trả về gói RST.

| Triệu chứng | Ý nghĩa thực tế |
|---|---|
| `timed out` | Có firewall **drop** ở đâu đó trên đường đi, hoặc máy đích không tồn tại |
| `refused` | Máy đích còn sống; cổng đóng hoặc bị **reject** |

### 4 · Chỉ cho phép một máy :id=cho-phep

```bash
sudo ip netns exec server nft flush chain inet lab input
sudo ip netns exec server nft add rule inet lab input ip saddr 10.0.0.1 tcp dport 8080 accept
sudo ip netns exec server nft add rule inet lab input tcp dport 8080 drop
sudo ip netns exec server nft list ruleset
```

Luật được xét **từ trên xuống**, gặp luật khớp đầu tiên thì dừng. Thử lại: client `10.0.0.1` kết nối được, mọi IP khác bị chặn.

## Tự làm :id=tu-lam

Đổi IP client thành `10.0.0.5/24` (gỡ IP cũ, thêm IP mới) và kiểm tra: kết nối lúc này **timed out** hay **refused**? Vì sao?

<details>
<summary>Đáp án</summary>

```bash
sudo ip -n client addr del 10.0.0.1/24 dev veth-c
sudo ip -n client addr add 10.0.0.5/24 dev veth-c
sudo ip netns exec client nc -zv -w 2 10.0.0.2 8080
```

**timed out**: nguồn `10.0.0.5` không khớp luật accept nên rơi xuống luật **drop**, gói bị bỏ im lặng.

</details>

## Dọn dẹp :id=don-dep

Dừng `nc` ở cửa sổ trái bằng <kbd>Ctrl</kbd>+<kbd>C</kbd>, rồi:

```bash
sudo ip netns del client; sudo ip netns del server
```

Luật nftables nằm trong namespace `server` nên mất theo khi xoá namespace.

## Cần nhớ :id=can-nho

1. `timed out` = bị drop hoặc máy đích không tồn tại · `refused` = máy còn sống, cổng đóng hoặc bị reject.
2. Luật firewall xét từ trên xuống, luật khớp đầu tiên thắng: luật cho phép phải đặt **trước** luật chặn.
3. Chỉ mở đúng nguồn cần thiết (`ip saddr …`), không mở cho tất cả.

## Nguồn tham khảo :id=nguon

- [nft(8)](https://manpages.ubuntu.com/manpages/noble/en/man8/nft.8.html) · [nc(1)](https://manpages.ubuntu.com/manpages/noble/en/man1/nc_openbsd.1.html)
