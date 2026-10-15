# Đóng góp cho Sổ tay IT

Cảm ơn bạn đã muốn đóng góp. Sổ tay là **bảng tra lệnh**: ngắn, đúng, dùng được ngay. Đóng góp nhỏ cũng đáng quý: một lệnh hay bạn dùng hằng ngày, một lệnh sai cần sửa, một triệu chứng bạn từng gặp.

## Cách nhanh nhất (không cần git)

| Việc | Cách làm |
|---|---|
| Đề xuất một lệnh hay | [Gửi đề xuất](../../issues/new?template=de-xuat.md) |
| Chia sẻ một sự cố đã gặp | [Điền mẫu chia sẻ sự cố](../../issues/new?template=chia-se-su-co.yml). Triệu chứng và lệnh xử lý sẽ vào bảng "Gặp vấn đề", ghi tên bạn |
| Báo nội dung sai | [Điền mẫu báo lỗi](../../issues/new?template=bao-loi.yml) |
| Sửa trực tiếp một chỗ nhỏ | Trên trang web, bấm **sửa trang này** ở cuối trang → GitHub mở trình sửa → **Propose changes** |

## Thêm trang hoặc bổ sung lệnh

1. Fork repo, tạo nhánh mới.
2. Cần Node 22.12 trở lên (xem `.nvmrc`). Chạy trên máy: `npm install` rồi `npm run dev`, mở `http://localhost:4321/it-handbook/`.
3. Bổ sung vào trang có sẵn, hoặc chép [trang mẫu](src/content/docs/_mau-trang.md) sang tên mới trong `src/content/docs/`.
4. Trang mới tự hiện trên trang chủ: chỉ cần điền `man`, `order`, `summary` ở đầu file như trang mẫu.
5. Kiểm tra `npm run build && npm run check` (build và kiểm liên kết) không lỗi, rồi mở Pull Request. GitHub sẽ tự chạy lại bước này cho mọi Pull Request.

## Tiêu chuẩn nội dung

Sổ tay giữ uy tín nhờ mấy nguyên tắc sau. Pull Request không đạt sẽ được góp ý để sửa, không bị từ chối thẳng.

| Nguyên tắc | Cụ thể |
|---|---|
| **Đúng và kiểm chứng được** | Lệnh phải chạy thật. Mẹo ít người biết phải có nguồn chính thống (RFC, Microsoft Learn, man page, tài liệu hãng) hoặc ghi rõ đã thử trên môi trường nào |
| **Ngắn** | Một dòng một việc. Không giải thích dài; cần lưu ý thì một câu dưới bảng, hoặc `> **Chú ý:**` nếu làm sai có thể mất dữ liệu |
| **Ghi rõ nếu chưa thử** | Ví dụ: "lệnh theo tài liệu Cisco, chưa chạy trên thiết bị thật" |
| **Tiếng Việt rõ ràng** | Cột "Việc" viết như người dùng hỏi: "Ai đang giữ cổng", "Ổ đầy". Thuật ngữ giữ tiếng Anh |
| **Không thông tin nhạy cảm** | Không IP thật, tên công ty, mật khẩu, cấu hình thật của nơi bạn làm. Thay bằng ví dụ `192.168.10.x`, `<tên-server>` |
| **Tôn trọng bản quyền** | Không chép nguyên văn sách hay khoá học. Viết lại bằng lời của bạn và dẫn nguồn |

## Cấu trúc một trang

Xem [trang mẫu](src/content/docs/_mau-trang.md):

1. **Một câu mở đầu:** trang gồm lệnh gì, đã thử trên đâu.
2. **Gặp vấn đề:** bảng `Triệu chứng | Chạy trước`.
3. **Các nhóm lệnh:** mỗi nhóm một bảng `Việc | Lệnh` (trên web hiện thành danh sách kiểu trang man). Lệnh nằm trong dấu \` để người đọc bấm là copy.
4. **Nguồn:** tài liệu chính thức.

| Cú pháp | Dùng cho |
|---|---|
| `## Tiêu đề {#id-khong-dau}` | Mỗi nhóm lệnh. Id không dấu, không bắt đầu bằng số |
| `<tên>`, `<ip>` | Chỗ người đọc tự điền |
| ` ``` ` | Cấu hình nhiều dòng (switch, cron, ssh config) |
| `> **Chú ý:** …` | Lệnh làm sai có thể mất dữ liệu hoặc mất kết nối |
| `man: linux(8)` · `order: 1` · `summary: "…"` | Đầu file: tên kiểu trang man, thứ tự trên trang chủ, một dòng tóm tắt |

## Commit

Viết commit message bằng tiếng Việt, ngắn, nói rõ đã làm gì. Ví dụ: `Linux: thêm lệnh xem dung lượng từng thư mục`.

## Ghi công

Mọi người có đóng góp được ghi tên trong [CONTRIBUTORS.md](CONTRIBUTORS.md). Nếu bạn chia sẻ sự cố qua mẫu, hãy ghi tên hiển thị mong muốn trong mẫu.
