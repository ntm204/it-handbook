/* Sổ tay IT — tính năng riêng chạy trên mỗi trang (Starlight).
   Nút in, bấm lệnh trong bảng để copy, chú thích khi rê chuột, phím "/" mở tìm kiếm, nút lên đầu trang. */
(function () {
  "use strict";

  var BASE = new URL(".", document.currentScript.src).pathname;          // /it-handbook/
  var PAGE = location.pathname.slice(BASE.length);                         // "mang/", "" (trang chủ)
  var content = document.querySelector(".sl-markdown-content");

  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(id) { var e = document.getElementById(id); if (!e) { e = document.createElement("div"); e.id = id; document.body.appendChild(e); } return e; }
  function toast(text) { var t = el("toast"); t.textContent = text; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 1600); }

  // ── Nút in dưới tiêu đề (in bảng tra ra A4) ──
  function pageMeta() {
    var h1 = document.getElementById("_top");
    if (!h1 || !content || PAGE === "") return;
    var meta = document.createElement("div");
    meta.className = "page-meta";
    meta.innerHTML = '<span class="page-tools"><button type="button">In trang</button></span>';
    h1.insertAdjacentElement("afterend", meta);
    meta.querySelector("button").onclick = function () { window.print(); };
  }

  // ── Bấm vào lệnh trong bảng để copy ──
  function bindCopy() {
    $$(".sl-markdown-content td code").forEach(function (c) {
      c.setAttribute("data-tip", "Bấm để copy");
      c.onclick = function () { navigator.clipboard.writeText(c.innerText).then(function () { toast("Đã copy: " + c.innerText); }); };
    });
  }

  function showTip(a) {
    var tip = el("tip"); tip.textContent = a.getAttribute("data-tip");
    var r = a.getBoundingClientRect();
    tip.style.left = Math.max(8, Math.min(r.left, window.innerWidth - tip.offsetWidth - 8)) + "px";
    var below = r.bottom + 8, above = r.top - tip.offsetHeight - 8;          // gần đáy màn hình thì hiện phía trên
    tip.style.top = (below + tip.offsetHeight > window.innerHeight - 8 && above > 8 ? above : below) + "px";
    tip.classList.add("show");
  }
  function hideTip() { var t = document.getElementById("tip"); if (t) t.classList.remove("show"); }
  // Chú thích riêng cho mọi phần tử có data-tip — thay hộp "title" mặc định của trình duyệt
  document.addEventListener("mouseover", function (e) { var t = e.target.closest && e.target.closest("[data-tip]"); t ? showTip(t) : hideTip(); });
  document.addEventListener("focusin", function (e) { var t = e.target.closest && e.target.closest("[data-tip]"); t ? showTip(t) : hideTip(); });
  document.addEventListener("focusout", hideTip);
  document.addEventListener("scroll", hideTip, true);

  // ── Gõ "/" để mở ô tìm kiếm ──
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && tag !== "input" && tag !== "textarea" && !e.target.isContentEditable) {
      var btn = document.querySelector("site-search button[data-open-modal]");
      if (btn) { e.preventDefault(); btn.click(); }
    }
  });

  // ── Đoạn trích kết quả tìm kiếm: bỏ phần chữ không dấu ⟦ … ⟧ (chỉ để tìm "dang nhap" ra "đăng nhập", không để đọc) ──
  function cleanExcerpts() {
    var root = document.getElementById("starlight__search");
    if (!root) return;
    function clean() {
      $$(".pagefind-ui__result-excerpt", root).forEach(function (el) {
        var h = el.innerHTML;
        if (h.indexOf("⟦") < 0 && h.indexOf("⟧") < 0) return;
        h = h.replace(/⟦[\s\S]*?⟧/g, " ").replace(/^[^⟦]*?⟧/, " ").replace(/⟦[\s\S]*$/, " ").replace(/\s{2,}/g, " ").trim();
        el.innerHTML = h;
      });
    }
    new MutationObserver(clean).observe(root, { childList: true, subtree: true });
  }

  // ── Nút lên đầu trang (chỉ hiện khi đã cuộn xuống) ──
  function scrollUi() {
    if (!content || PAGE === "") return;
    var top = document.createElement("button");
    top.type = "button"; top.id = "to-top"; top.setAttribute("aria-label", "Lên đầu trang"); top.setAttribute("data-tip", "Lên đầu trang");
    top.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    top.onclick = function () { window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0 }); };
    document.body.appendChild(top);
    var ticking = false;
    function update() {
      var y = window.scrollY;
      top.classList.toggle("show", y > window.innerHeight * 1.2);
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  scrollUi();
  pageMeta();
  bindCopy();
  cleanExcerpts();
})();
