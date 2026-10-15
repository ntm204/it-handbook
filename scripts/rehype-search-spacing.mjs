// Khoảng trắng giữa các khối cho đoạn trích tìm kiếm.
// Pagefind ghép chữ của các khối liền nhau không có dấu cách ("Việc" + "Lệnh" → "ViệcLệnh", "server." + "Hiểu" → "server.Hiểu").
// Plugin này thêm một dấu cách vào cuối mỗi đoạn văn, mục danh sách và ô bảng. Trình duyệt bỏ qua dấu cách cuối khối nên giao diện không đổi.
// Không thêm vào tiêu đề: ở đó dấu cách sẽ đẩy lệch icon liên kết bên cạnh.
const BLOCKS = new Set(["p", "li", "td", "th", "dd", "dt", "summary"]);

export default function rehypeSearchSpacing() {
  return (tree) => {
    const walk = (node) => {
      (node.children || []).forEach(walk);
      if (node.type !== "element") return;
      if (BLOCKS.has(node.tagName)) node.children.push({ type: "text", value: " " });
    };
    walk(tree);
  };
}
