// Bảng Markdown → danh sách kiểu trang man (<dl>): dòng trên là việc, dòng dưới thụt vào là lệnh.
// Bảng nhiều cột: mỗi cột sau cột đầu thành một dòng có nhãn (tên cột), ví dụ "Linux  ip -br a".
const el = (tagName, children = [], properties = {}) => ({ type: "element", tagName, properties, children });
const kids = (n, tag) => (n.children || []).filter((c) => c.type === "element" && c.tagName === tag);
const text = (n) => (n.type === "text" ? n.value : (n.children || []).map(text).join(""));

export default function rehypeManTables() {
  return (tree) => {
    const walk = (node) => {
      (node.children || []).forEach((child, i) => {
        if (child.type !== "element" || child.tagName !== "table") return walk(child);
        const head = kids(child, "thead")[0], body = kids(child, "tbody")[0];
        const labels = head ? kids(kids(head, "tr")[0] || {}, "th").map((th) => text(th).trim()) : [];
        const items = [];
        for (const tr of body ? kids(body, "tr") : []) {
          const [first, ...rest] = kids(tr, "td");
          items.push(el("dt", first ? first.children : []));
          if (rest.length === 1) items.push(el("dd", rest[0].children));
          else items.push(el("dd", rest.map((td, j) => el("div", [el("span", [{ type: "text", value: labels[j + 1] || "" }], { className: ["k"] }), { type: "text", value: " " }, ...td.children]))));
        }
        node.children[i] = el("dl", items);
      });
    };
    walk(tree);
  };
}
