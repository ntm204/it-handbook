/* Sổ tay IT — tính năng riêng chạy trên mỗi trang (Starlight).
   Thời gian đọc, nút in, phần Hiểu·Làm·Tra, bấm lệnh để copy, thuật ngữ, tiến độ học.
   Tiến độ lưu trong localStorage của trình duyệt, không gửi đi đâu. */
(function () {
  "use strict";

  var BASE = new URL(".", document.currentScript.src).pathname;          // /it-handbook/
  var PAGE = location.pathname.slice(BASE.length);                         // "mang/", "lab/01-…/", ""
  var LEARN_PAGES = {
    "nghe-nghiep/": "01 · Lộ trình nghề",
    "mang/": "02 · Mạng",
    "linux/": "03 · Linux server",
    "windows/": "04 · Windows & AD",
    "thiet-bi-mang/": "05 · Switch & Firewall",
    "xu-ly-su-co/": "06 · Xử lý sự cố",
    "lab/01-mang-hai-may/": "Lab 1 · Hai mạng và một router",
    "lab/02-quan-sat-goi-tin/": "Lab 2 · Quan sát DNS và TCP",
    "lab/03-day-o/": "Lab 3 · Server đầy ổ",
    "lab/04-dich-vu-systemd/": "Lab 4 · Tự viết dịch vụ",
    "lab/05-firewall/": "Lab 5 · Chặn và mở cổng",
    "lab/06-vlan-cisco/": "Lab 6 · VLAN trên Cisco",
  };
  var REVIEW_DAYS = [1, 7, 30];
  var content = document.querySelector(".sl-markdown-content");

  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fmt(d) { d = new Date(d); return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function load(k, f) { try { return JSON.parse(localStorage.getItem(k)) || f; } catch (e) { return f; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function el(id) { var e = document.getElementById(id); if (!e) { e = document.createElement("div"); e.id = id; document.body.appendChild(e); } return e; }
  function toast(text) { var t = el("toast"); t.textContent = text; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 1600); }

  // ── Phần Hiểu · Làm · Tra ──
  var PARTS = { hieu: 1, lam: 1, tra: 1 };
  function tagParts() {
    if (!content) return;
    var current = null;
    Array.prototype.forEach.call(content.children, function (node) {
      var h2 = node.matches(".sl-heading-wrapper.level-h2") ? node.querySelector("h2") : null;
      if (h2) {
        current = PARTS[h2.id] ? h2.id : null;
        if (current) { node.classList.add("part", "part-" + current); h2.classList.add("part"); }
      }
      if (current) node.setAttribute("data-part", current);
    });
  }

  // ── Dòng thông tin dưới tiêu đề: thời gian đọc + nút in ──
  function pageMeta() {
    var h1 = document.getElementById("_top");
    if (!h1 || !content || PAGE === "") return;
    var words = content.innerText.split(/\s+/).filter(Boolean).length;
    var hasTra = !!document.getElementById("tra");
    var meta = document.createElement("div");
    meta.className = "page-meta";
    meta.innerHTML = "<span>" + Math.max(1, Math.round(words / 200)) + " phút đọc</span>" +
      '<span class="page-tools"><button type="button" data-print="all">In trang</button>' +
      (hasTra ? '<button type="button" data-print="tra">In bảng tra</button>' : "") + "</span>";
    h1.insertAdjacentElement("afterend", meta);
    $$("[data-print]", meta).forEach(function (b) {
      b.onclick = function () {
        if (b.getAttribute("data-print") === "tra") document.body.classList.add("print-tra");
        window.print();
        setTimeout(function () { document.body.classList.remove("print-tra"); }, 500);
      };
    });
  }

  // ── Bấm vào lệnh trong bảng để copy ──
  function bindCopy() {
    $$(".sl-markdown-content td code").forEach(function (c) {
      c.title = "Bấm để copy";
      c.onclick = function () { navigator.clipboard.writeText(c.innerText).then(function () { toast("Đã copy: " + c.innerText); }); };
    });
  }

  // ── Thuật ngữ: giải thích khi rê chuột / chạm, chỉ lần xuất hiện đầu ──
  function applyGlossary(glossary) {
    if (!content || PAGE === "thuat-ngu/") return;
    var seen = {}, nodes = [];
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentElement;
        if (!p || p.closest("code, pre, a, h1, h2, h3, abbr, .mermaid, summary, .progress-bar, .page-meta")) return NodeFilter.FILTER_REJECT;
        return /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      glossary.forEach(function (g) {
        if (seen[g.term] || !node.parentNode) return;
        var flags = /[a-z]/.test(g.term) ? "i" : "";   // viết tắt khớp đúng chữ hoa
        var re = new RegExp("(^|[^\\wÀ-ỹ])(" + g.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![\\wÀ-ỹ])", flags);
        var m = node.nodeValue.match(re);
        if (!m) return;
        seen[g.term] = true;
        var after = node.splitText(m.index + m[1].length);
        after.nodeValue = after.nodeValue.slice(m[2].length);
        var abbr = document.createElement("abbr");
        abbr.className = "term"; abbr.tabIndex = 0; abbr.textContent = m[2];
        abbr.setAttribute("data-tip", g.vi + " — " + g.def);
        after.parentNode.insertBefore(abbr, after);
      });
    });
  }
  function showTip(a) {
    var tip = el("tip"); tip.textContent = a.getAttribute("data-tip");
    var r = a.getBoundingClientRect();
    tip.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 330)) + "px";
    tip.style.top = (r.bottom + 8) + "px";
    tip.classList.add("show");
  }
  function hideTip() { var t = document.getElementById("tip"); if (t) t.classList.remove("show"); }
  document.addEventListener("mouseover", function (e) { var t = e.target.closest && e.target.closest("abbr.term"); t ? showTip(t) : hideTip(); });
  document.addEventListener("focusin", function (e) { if (e.target.matches && e.target.matches("abbr.term")) showTip(e.target); });
  document.addEventListener("focusout", hideTip);
  document.addEventListener("scroll", hideTip, true);

  // ── Tiến độ học: ôn cách quãng 1, 7, 30 ngày ──
  function progress() { return load("progress-v2", {}); }
  function nextReview(p) { return p && p.step < REVIEW_DAYS.length ? addDays(p.last, REVIEW_DAYS[p.step]) : null; }
  function isDue(p) { var n = nextReview(p); return !!(n && n <= new Date()); }

  function markSidebar() {
    var prog = progress();
    $$(".sidebar-content a[href]").forEach(function (a) {
      var key = new URL(a.href, location.href).pathname.slice(BASE.length);
      var p = prog[key];
      a.classList.toggle("learned", !!p && !isDue(p));
      a.classList.toggle("due", !!p && isDue(p));
    });
  }
  function progressBar() {
    if (!content || !LEARN_PAGES[PAGE]) return;
    var bar = document.querySelector(".progress-bar") || content.appendChild(document.createElement("div"));
    bar.className = "progress-bar";
    var p = progress()[PAGE], text, btn;
    if (!p) { text = "Học xong trang này?"; btn = "Đánh dấu đã học"; }
    else if (isDue(p)) { text = "Đến hạn ôn lần " + (p.step + 1) + ": đọc lại Cần nhớ và Tự kiểm tra."; btn = "Đã ôn xong"; }
    else { var n = nextReview(p); text = "Đã học " + fmt(p.learned) + (n ? " · ôn lại ngày " + fmt(n) : " · đã ôn đủ 3 lần"); btn = "Bỏ đánh dấu"; }
    bar.innerHTML = "<span>" + text + '</span><button type="button">' + btn + "</button>";
    bar.querySelector("button").onclick = function () {
      var prog = progress(), cur = prog[PAGE], now = new Date().toISOString();
      if (!cur) { prog[PAGE] = { learned: now, last: now, step: 0 }; toast("Đã đánh dấu. Ôn lại sau 1 ngày."); }
      else if (isDue(cur)) { cur.step += 1; cur.last = now; toast(cur.step >= REVIEW_DAYS.length ? "Đã ôn đủ 3 lần." : "Lần ôn tiếp theo sau " + REVIEW_DAYS[cur.step] + " ngày."); }
      else { delete prog[PAGE]; toast("Đã bỏ đánh dấu."); }
      save("progress-v2", prog); progressBar(); markSidebar();
    };
  }
  function reviewList() {
    var box = document.getElementById("review-due");
    if (!box) return;
    var prog = progress(), keys = Object.keys(LEARN_PAGES), learned = keys.filter(function (k) { return prog[k]; });
    var due = learned.filter(function (k) { return isDue(prog[k]); });
    var html = "<p>Đã học <b>" + learned.length + "/" + keys.length + "</b> bài.";
    if (due.length) html += " Đến hạn ôn:</p><ul>" + due.map(function (k) { return '<li><a href="' + BASE + k + '">' + LEARN_PAGES[k] + "</a></li>"; }).join("") + "</ul>";
    else html += learned.length ? " Chưa có bài nào đến hạn ôn.</p>" : " Đọc xong một trang thì bấm <b>Đánh dấu đã học</b> ở cuối trang.</p>";
    box.innerHTML = html;
  }

  // ── Gõ "/" để mở ô tìm kiếm ──
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && tag !== "input" && tag !== "textarea" && !e.target.isContentEditable) {
      var btn = document.querySelector("site-search button[data-open-modal]");
      if (btn) { e.preventDefault(); btn.click(); }
    }
  });

  tagParts();
  pageMeta();
  bindCopy();
  progressBar();
  markSidebar();
  reviewList();
  fetch(BASE + "glossary.json").then(function (r) { return r.json(); }).then(applyGlossary).catch(function () {});
})();
