// Tìm kiếm không dấu cho chữ "đ".
// Công cụ tìm kiếm (Pagefind) bỏ được dấu thanh ("cong" tìm ra "cổng") nhưng "đ" là ký tự riêng, không phải "d" có dấu,
// nên "dang nhap" không tìm ra "đăng nhập". Plugin này thêm vào mỗi đoạn văn / ô bảng có chữ "đ" các từ đó viết không dấu,
// ẩn với mắt và trình đọc màn hình, chỉ để công cụ tìm kiếm đọc.
const HAS_D = /[đĐ]/;
const toText = (node) =>
  node.type === "text" || node.type === "inlineCode" ? node.value : (node.children || []).map(toText).join("");
const plain = (w) => w.replace(/đ/g, "d").replace(/Đ/g, "D").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}-]/gu, "");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function remarkViSearch() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === "paragraph" || node.type === "tableCell") {
        const text = toText(node);
        if (HAS_D.test(text)) {
          // Chỉ các từ có "đ", bỏ hết dấu ("đăng" → "dang"); bọc trong ⟦ ⟧ để handbook.js lọc khỏi đoạn trích kết quả tìm kiếm
          const words = [...new Set(text.split(/\s+/).filter((w) => HAS_D.test(w)).map(plain))].filter(Boolean);
          node.children.push({ type: "html", value: `<span class="hb-search-alias" aria-hidden="true">⟦ ${esc(words.join(" "))} ⟧</span>` });
        }
        return;
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
  };
}
