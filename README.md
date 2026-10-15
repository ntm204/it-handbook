# Sổ tay IT

**Bảng tra lệnh bằng tiếng Việt cho người làm IT**: Linux, mạng, Windows & AD, switch & firewall, Git, Docker, terminal.

📖 Đọc tại **https://ntm204.github.io/it-handbook/**

Ngắn, đúng, dùng được ngay: mỗi trang mở đầu bằng bảng "gặp vấn đề → chạy lệnh gì trước", sau đó là các bảng lệnh theo việc. Lệnh đã chạy thử hoặc có nguồn chính thống. Bấm vào lệnh là copy.

## Có gì bên trong

| Trang | Có gì |
|---|---|
| **Linux** | Tình trạng server trong 60 giây, dịch vụ, log, ổ đĩa, SSH, firewall, cron |
| **Mạng** | Lệnh tương đương Linux / Windows / macOS / Cisco, DNS, bắt gói tin, subnet, cổng hay gặp |
| **Windows & AD** | Mạng, tài khoản domain bị khoá, file server, robocopy, máy in |
| **Switch & Firewall** | Cisco IOS, HPE/Aruba, FortiGate: cổng, VLAN, tìm MAC, lỗi cổng, debug |
| **Git** | Hằng ngày, nhánh, lịch sử, cứu khi lỡ tay |
| **Docker** | Container, image, Compose, dọn dung lượng |
| **Terminal & Neovim** | Phím tắt dòng lệnh, tìm và lọc, tmux, vim, LazyVim |

## Đóng góp

Lệnh hay nhất là lệnh người làm nghề dùng thật hằng ngày. Bạn có lệnh nào hay, gửi lên để mọi người cùng dùng.

| Bạn muốn | Cách làm | Cần biết git? |
|---|---|---|
| **Chia sẻ một sự cố đã gặp** | [Điền mẫu chia sẻ sự cố](../../issues/new?template=chia-se-su-co.yml) | Không |
| Báo lỗi sai, lệnh sai | [Báo lỗi nội dung](../../issues/new?template=bao-loi.yml) | Không |
| Sửa một chỗ nhỏ | Bấm **Sửa trang này** ở cuối mỗi trang trên web | Không, sửa ngay trên GitHub |
| Đề xuất lệnh hay, chủ đề mới | [Gửi đề xuất](../../issues/new?template=de-xuat.md) | Không |
| Thêm trang, bổ sung lệnh | Đọc [CONTRIBUTING.md](CONTRIBUTING.md) | Có |

Mọi người đóng góp đều được ghi tên trong [CONTRIBUTORS.md](CONTRIBUTORS.md). Hãy đọc [Quy tắc ứng xử](CODE_OF_CONDUCT.md) trước khi tham gia.

## Chạy trên máy

```sh
git clone https://github.com/ntm204/it-handbook
cd it-handbook
npm install
npm run dev          # http://localhost:4321/it-handbook/ — sửa file là trang tự cập nhật
```

Nội dung nằm trong `src/content/docs/`, mỗi trang là một file Markdown. Trang web dựng bằng [Starlight](https://starlight.astro.build).

## Giấy phép

- **Nội dung** (các trang tài liệu): [CC BY-SA 4.0](LICENSE). Được dùng lại, chỉnh sửa, kể cả cho mục đích thương mại, miễn là **ghi nguồn** và chia sẻ lại với cùng giấy phép.
- **Mã nguồn** (cấu hình, script, giao diện): [MIT](LICENSE-CODE).

---

**English:** Vietnamese-language command cheat sheets for IT work: Linux, networking, Windows & AD, switches & firewalls, Git, Docker and the terminal. Content is licensed CC BY-SA 4.0, code MIT. Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
