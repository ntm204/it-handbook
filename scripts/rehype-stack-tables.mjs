// Bảng nhiều cột trên điện thoại: mỗi hàng thành một thẻ dọc thay vì bị ép thành cột hẹp, mỗi dòng còn một hai từ.
// Chỉ áp cho bảng từ 3 cột có ô dài (bảng ngắn như "cổng / giao thức / dịch vụ" vẫn đọc tốt dạng bảng).
// Plugin thêm class "hb-stack" và data-label (tên cột) cho từng ô; giao diện dạng thẻ nằm trong custom.css.
const text = (n) => (n.type === "text" ? n.value : (n.children || []).map(text).join(""));
const kids = (n, tag) => (n.children || []).filter((c) => c.type === "element" && c.tagName === tag);

export default function rehypeStackTables() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === "element" && node.tagName === "table") {
        const head = kids(node, "thead")[0], body = kids(node, "tbody")[0];
        const labels = head ? kids(kids(head, "tr")[0] || {}, "th").map((th) => text(th).trim()) : [];
        const cells = body ? kids(body, "tr").flatMap((tr) => kids(tr, "td")) : [];
        const avg = cells.reduce((s, td) => s + text(td).trim().length, 0) / (cells.length || 1);
        if (labels.length >= 3 && avg > 18) {
          node.properties.className = [...[].concat(node.properties.className || []), "hb-stack"];
          kids(body, "tr").forEach((tr) => kids(tr, "td").forEach((td, i) => { td.properties["data-label"] = labels[i] || ""; }));
        }
        return;
      }
      (node.children || []).forEach(walk);
    };
    walk(tree);
  };
}
