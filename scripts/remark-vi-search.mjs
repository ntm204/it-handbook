// Tìm kiếm không dấu cho chữ "đ".
// Công cụ tìm kiếm (Pagefind) bỏ được dấu thanh ("cong" tìm ra "cổng") nhưng "đ" là ký tự riêng, không phải "d" có dấu,
// nên "dang nhap" không tìm ra "đăng nhập". Plugin này thêm vào mỗi đoạn văn / ô bảng có chữ "đ" một bản đã đổi đ → d,
// ẩn với mắt và trình đọc màn hình, chỉ để công cụ tìm kiếm đọc.
const HAS_D = /[đĐ]/;
const toText = (node) =>
  node.type === "text" || node.type === "inlineCode" ? node.value : (node.children || []).map(toText).join("");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function remarkViSearch() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === "paragraph" || node.type === "tableCell") {
        const text = toText(node);
        if (HAS_D.test(text)) {
          const alias = text.replace(/đ/g, "d").replace(/Đ/g, "D");
          node.children.push({ type: "html", value: `<span class="hb-search-alias" aria-hidden="true">${esc(alias)}</span>` });
        }
        return;
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
  };
}
