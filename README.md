# Sổ tay IT

**Sổ tay thực chiến bằng tiếng Việt cho người làm hệ thống, server và mạng**, đặc biệt là IT ở nhà máy, khu công nghiệp.

📖 Đọc tại **https://ntm204.github.io/it-handbook/**

Không lý thuyết suông: mỗi lệnh đều đúng cú pháp, mỗi mẹo đều có nguồn chính thống hoặc đã chạy thử, mỗi bài lab có kết quả mẫu thật.

## Có gì bên trong

| Phần | Nội dung |
|---|---|
| **Xử lý sự cố** | Quy trình 7 bước chuẩn CompTIA và 10 sự cố hay gặp: mất mạng, tài khoản domain bị khoá, server đầy ổ, camera mất hình… |
| **Mạng** | Từ lúc cắm dây đến lúc mở được web, chia subnet, VLAN, NAT, lệnh tương đương Linux / Windows / macOS / Cisco |
| **Linux server** | Đọc tình trạng server trong 60 giây, systemd, log, ổ đĩa, SSH, firewall |
| **Windows & Active Directory** | Đăng nhập domain hoạt động thế nào, tìm máy gây khoá tài khoản, file server, robocopy |
| **Switch & Firewall** | Cisco IOS, HPE/Aruba, FortiGate: VLAN, lỗi cổng, vì sao gói tin bị chặn |
| **Lab thực hành** | 6 bài có làm mẫu và đáp án, chạy trên máy Linux ảo hoặc Cisco Packet Tracer |

## Đóng góp

Sổ tay mạnh nhất ở **kinh nghiệm thật**: những sự cố bạn đã gặp và xử lý. Thứ đó không sách nào hay AI nào viết thay được.

| Bạn muốn | Cách làm | Cần biết git? |
|---|---|---|
| **Chia sẻ một sự cố đã gặp** | [Điền mẫu chia sẻ sự cố](../../issues/new?template=chia-se-su-co.yml) | Không |
| Báo lỗi sai, lệnh sai | [Báo lỗi nội dung](../../issues/new?template=bao-loi.yml) | Không |
| Sửa một chỗ nhỏ | Bấm **Sửa trang này** ở cuối mỗi trang trên web | Không, sửa ngay trên GitHub |
| Viết trang mới, bài lab | Đọc [CONTRIBUTING.md](CONTRIBUTING.md) | Có |

Mọi người đóng góp đều được ghi tên. Hãy đọc [Quy tắc ứng xử](CODE_OF_CONDUCT.md) trước khi tham gia.

## Chạy trên máy

```sh
git clone https://github.com/ntm204/it-handbook
cd it-handbook
npm install
npm run dev          # http://localhost:4321/it-handbook/ — sửa file là trang tự cập nhật
```

Nội dung nằm trong `src/content/docs/`, mỗi trang là một file Markdown. Trang web dựng bằng [Starlight](https://starlight.astro.build).

## Giấy phép

- **Nội dung** (tài liệu, bài lab): [CC BY-SA 4.0](LICENSE). Được dùng lại, chỉnh sửa, kể cả cho mục đích thương mại, miễn là **ghi nguồn** và chia sẻ lại với cùng giấy phép.
- **Mã nguồn** (cấu hình, script, giao diện): [MIT](LICENSE-CODE).

---

**English:** A practical, Vietnamese-language handbook for systems, server and network administration, with a focus on IT in Vietnamese factories and industrial parks. Content is licensed CC BY-SA 4.0, code MIT. Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
