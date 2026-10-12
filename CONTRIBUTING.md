# Đóng góp cho Sổ tay IT

Cảm ơn bạn đã muốn đóng góp. Sổ tay này có giá trị nhờ **kinh nghiệm thật** của người làm nghề, nên đóng góp nhỏ cũng đáng quý: một lệnh đúng hơn, một lỗi chính tả, một sự cố bạn từng xử lý.

## Cách nhanh nhất (không cần git)

| Việc | Cách làm |
|---|---|
| Chia sẻ một sự cố đã gặp | [Điền mẫu chia sẻ sự cố](../../issues/new?template=chia-se-su-co.yml). Người duy trì sẽ biên tập và đưa vào sổ tay, ghi tên bạn |
| Báo nội dung sai | [Điền mẫu báo lỗi](../../issues/new?template=bao-loi.yml) |
| Sửa trực tiếp một chỗ nhỏ | Trên trang web, bấm **Sửa trang này** ở cuối trang → GitHub mở trình sửa → **Propose changes** |

## Viết trang mới hoặc bài lab

1. Fork repo, tạo nhánh mới.
2. Cần Node 22.12 trở lên (xem `.nvmrc`). Chạy trên máy: `npm install` rồi `npm run dev`, mở `http://localhost:4321/it-handbook/`.
3. Chép [trang mẫu](src/content/docs/_mau-trang.md) sang tên mới trong `src/content/docs/` (bài lab đặt ở `src/content/docs/lab/`).
4. Thêm trang vào thanh bên trong `astro.config.mjs`.
5. Kiểm tra `npm run build && npm run check` (build và kiểm liên kết) không lỗi, rồi mở Pull Request. GitHub sẽ tự chạy lại bước này cho mọi Pull Request.

## Tiêu chuẩn nội dung

Sổ tay giữ uy tín nhờ mấy nguyên tắc sau. Pull Request không đạt sẽ được góp ý để sửa, không bị từ chối thẳng.

| Nguyên tắc | Cụ thể |
|---|---|
| **Đúng và kiểm chứng được** | Lệnh phải chạy thật. Mẹo ít người biết phải có nguồn chính thống (RFC, Microsoft Learn, man page, tài liệu hãng) hoặc ghi rõ đã thử trên môi trường nào |
| **Dùng được ngay** | Viết thứ người đọc làm theo được. Không chép lý thuyết dài từ sách |
| **Ghi rõ nếu chưa thử** | Ví dụ: "lệnh theo tài liệu Cisco, chưa chạy trên thiết bị thật" |
| **Tiếng Việt rõ ràng** | Câu ngắn. Thuật ngữ giữ tiếng Anh kèm giải thích; thuật ngữ mới thêm vào `thuat-ngu.md` |
| **Không thông tin nhạy cảm** | Không IP thật, tên công ty, mật khẩu, cấu hình thật của nơi bạn làm. Thay bằng ví dụ `192.168.10.x`, `<tên-server>` |
| **Tôn trọng bản quyền** | Không chép nguyên văn sách hay khoá học. Viết lại bằng lời của bạn và dẫn nguồn |

## Cấu trúc một trang

Mỗi trang chủ đề gồm (xem [trang mẫu](src/content/docs/_mau-trang.md)):

1. **Mở đầu:** một câu giới thiệu → mục tiêu học → dòng "Liên quan".
2. **Hiểu:** khái niệm, cơ chế, sơ đồ.
3. **Làm:** quy trình từng bước.
4. **Tra:** bảng lệnh. Cột trái là việc cần làm, cột phải là lệnh.
5. **Tự kiểm tra:** câu hỏi tình huống, đáp án ẩn trong `<details>`.
6. **Cần nhớ:** đúng 3 ý.
7. **Nguồn tham khảo.**

| Cú pháp | Dùng cho |
|---|---|
| `## Tiêu đề {#id-khong-dau}` | Mục cần liên kết tới. Id không dấu, không bắt đầu bằng số |
| `:::note` … `:::` | Ghi chú nên biết |
| `:::caution` … `:::` | Cảnh báo: làm sai có thể mất dữ liệu hoặc mất kết nối |
| ` ```mermaid ` | Sơ đồ. Nên vẽ theo chiều dọc, chữ ngắn |

## Commit

Viết commit message bằng tiếng Việt, ngắn, nói rõ đã làm gì. Ví dụ: `Xử lý sự cố: thêm trường hợp máy in mạng đổi IP`.

## Ghi công

Mọi người có đóng góp được ghi tên trong [CONTRIBUTORS.md](CONTRIBUTORS.md). Nếu bạn chia sẻ sự cố qua mẫu, hãy ghi tên hiển thị mong muốn trong mẫu.
