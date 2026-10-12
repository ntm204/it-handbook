// Cuộn mượt có quán tính cho chuột và trackpad (Lenis). Điện thoại giữ cuộn gốc của hệ điều hành.
// Tắt hoàn toàn khi người dùng bật "Giảm chuyển động" (Reduce motion).
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global { interface Window { __lenis?: Lenis } }

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.07,                 // độ "trôi": nhỏ hơn = trôi lâu, mượt hơn (0.1 là mặc định)
    wheelMultiplier: 0.9,       // mỗi nấc con lăn đi ngắn hơn một chút, cảm giác êm
    smoothWheel: true,
    syncTouch: false,           // cảm ứng: để hệ điều hành xử lý (tự nhiên nhất)
    allowNestedScroll: true,    // thanh bên, mục lục, khối code, bảng vẫn cuộn riêng
    autoToggle: true,           // hộp tìm kiếm khoá cuộn trang thì Lenis tự dừng
    anchors: true,              // bấm mục lục: cuộn mượt; khoảng chừa thanh đầu trang lấy từ CSS scroll-margin-top
    prevent: (node) => !!node.closest("dialog, .sidebar-pane, starlight-toc, .mobile-starlight-toc"),
  });
  window.__lenis = lenis;
}
