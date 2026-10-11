/* Sổ tay IT — cấu hình docsify và các tính năng riêng.
   Toàn bộ chạy trên máy, không cần Internet. Tiến độ học lưu trong localStorage của trình duyệt. */

(function () {
  "use strict";

  // Các trang thuộc lộ trình học (được đánh dấu đã học / ôn tập)
  var LEARN_PAGES = {
    "nghe-nghiep.md": "01 · Lộ trình nghề",
    "mang.md": "02 · Mạng",
    "linux.md": "03 · Linux server",
    "windows.md": "04 · Windows & AD",
    "thiet-bi-mang.md": "05 · Switch & Firewall",
    "xu-ly-su-co.md": "06 · Xử lý sự cố",
    "lab/01-mang-hai-may.md": "Lab 1 · Hai mạng và một router",
    "lab/02-quan-sat-goi-tin.md": "Lab 2 · Quan sát DNS và TCP",
    "lab/03-day-o.md": "Lab 3 · Server đầy ổ",
    "lab/04-dich-vu-systemd.md": "Lab 4 · Tự viết dịch vụ",
    "lab/05-firewall.md": "Lab 5 · Chặn và mở cổng",
    "lab/06-vlan-cisco.md": "Lab 6 · VLAN trên switch Cisco",
  };
  var REVIEW_DAYS = [1, 7, 30];          // ôn cách quãng: sau 1, 7, 30 ngày
  var WORDS_PER_MIN = 200;

  // ── Tiện ích ──
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fmt(d) { d = new Date(d); return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; } }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  function toast(text) {
    var t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove("show"); }, 1600);
  }

  // ── Dữ liệu tải một lần ──
  var meta = {};          // ngày cập nhật từng trang (assets/meta.json, sinh khi commit)
  var glossary = [];      // thuật ngữ, đọc từ thuat-ngu.md
  var metaReady = fetch("assets/meta.json").then(function (r) { return r.json(); }).then(function (j) { meta = j; }).catch(function () {});
  var glossaryReady = fetch("thuat-ngu.md").then(function (r) { return r.text(); }).then(function (md) {
    md.split("\n").forEach(function (line) {
      var m = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/);
      if (m) glossary.push({ term: m[1], vi: m[2], def: m[3].replace(/\[(.+?)\]\(.+?\)/g, "$1").replace(/`/g, "") });
    });
    glossary.sort(function (a, b) { return b.term.length - a.term.length; });
  }).catch(function () {});

  // ── Tiến độ học ──
  function progress() { return load("progress", {}); }  // { "mang.md": { learned: iso, step: 0 } }
  function nextReview(p) {
    if (!p) return null;
    if (p.step >= REVIEW_DAYS.length) return null;       // đã ôn đủ
    return addDays(p.last || p.learned, REVIEW_DAYS[p.step]);
  }
  function isDue(p) { var n = nextReview(p); return n && n <= new Date(); }

  function markSidebar() {
    var prog = progress();
    $$(".sidebar-nav a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(/^#\//, "").split("?")[0];
      var file = href ? href.replace(/\/$/, "") + ".md" : "";
      var p = prog[file];
      a.classList.toggle("learned", !!p);
      a.classList.toggle("due", !!(p && isDue(p)));
      a.title = p ? (isDue(p) ? "Đến hạn ôn" : "Đã học " + fmt(p.learned)) : "";
    });
  }

  function progressBar(file) {
    if (!LEARN_PAGES[file]) return "";
    var p = progress()[file];
    var text, btn;
    if (!p) { text = "Học xong trang này?"; btn = "Đánh dấu đã học"; }
    else if (isDue(p)) { text = "Đến hạn ôn lần " + (p.step + 1) + ". Đọc lại phần Cần nhớ và Tự kiểm tra."; btn = "Đã ôn xong"; }
    else {
      var n = nextReview(p);
      text = "Đã học " + fmt(p.learned) + (n ? " · ôn lại ngày " + fmt(n) : " · đã ôn đủ 3 lần");
      btn = "Bỏ đánh dấu";
    }
    return '<div class="progress-bar" data-file="' + file + '"><span>' + text + '</span><button type="button">' + btn + "</button></div>";
  }

  function bindProgress() {
    var bar = $(".progress-bar");
    if (!bar) return;
    $("button", bar).onclick = function () {
      var file = bar.getAttribute("data-file"), prog = progress(), p = prog[file], now = new Date().toISOString();
      if (!p) { prog[file] = { learned: now, last: now, step: 0 }; toast("Đã đánh dấu. Ôn lại sau 1 ngày."); }
      else if (isDue(p)) { p.step += 1; p.last = now; toast(p.step >= REVIEW_DAYS.length ? "Đã ôn đủ 3 lần." : "Lần ôn tiếp theo sau " + REVIEW_DAYS[p.step] + " ngày."); }
      else { delete prog[file]; toast("Đã bỏ đánh dấu."); }
      save("progress", prog);
      bar.outerHTML = progressBar(file);
      bindProgress();
      markSidebar();
    };
  }

  function renderReviewList() {
    var box = $("#review-due");
    if (!box) return;
    var prog = progress(), due = [], learned = 0;
    Object.keys(LEARN_PAGES).forEach(function (f) {
      if (prog[f]) learned++;
      if (prog[f] && isDue(prog[f])) due.push(f);
    });
    var total = Object.keys(LEARN_PAGES).length;
    var html = '<p class="review-summary">Đã học <b>' + learned + "/" + total + "</b> bài.";
    if (due.length) {
      html += " Đến hạn ôn:</p><ul>" + due.map(function (f) {
        return '<li><a href="#/' + f.replace(/\.md$/, "") + '">' + LEARN_PAGES[f] + "</a></li>";
      }).join("") + "</ul>";
    } else html += learned ? " Chưa có bài nào đến hạn ôn.</p>" : " Đọc xong một trang thì bấm <b>Đánh dấu đã học</b> ở cuối trang.</p>";
    box.innerHTML = html;
  }

  // ── Mục lục bên phải, đánh dấu mục đang đọc ──
  var tocObserver;
  function buildToc() {
    var old = $("#toc");
    if (old) old.remove();
    if (tocObserver) tocObserver.disconnect();
    var heads = $$(".markdown-section h2, .markdown-section h3").filter(function (h) { return h.id; });
    if (heads.length < 3) return;
    var nav = document.createElement("nav");
    nav.id = "toc";
    nav.innerHTML = '<p class="toc-title">Trong trang này</p>' + heads.map(function (h) {
      var text = h.textContent.trim();
      var route = location.hash.split("?")[0];
      return '<a class="toc-' + h.tagName.toLowerCase() + (h.classList.contains("part") ? " toc-part" : "") +
        '" data-id="' + h.id + '" href="' + route + "?id=" + encodeURIComponent(h.id) + '">' + text + "</a>";
    }).join("");
    $(".content").appendChild(nav);
    var links = {};
    $$("a", nav).forEach(function (a) { links[a.getAttribute("data-id")] = a; });
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          $$("a.active", nav).forEach(function (a) { a.classList.remove("active"); });
          var a = links[e.target.id];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "0px 0px -75% 0px" });
    heads.forEach(function (h) { tocObserver.observe(h); });
  }

  // ── Phần Hiểu · Làm · Tra: gắn nhãn để định dạng và để in riêng phần Tra ──
  var PARTS = { hieu: "Hiểu", lam: "Làm", tra: "Tra" };
  function tagParts() {
    var current = null;
    $$(".markdown-section > *").forEach(function (el) {
      if (el.tagName === "H2") current = PARTS[el.id] ? el.id : null;
      if (el.tagName === "H2" && PARTS[el.id]) el.classList.add("part", "part-" + el.id);
      if (current) el.setAttribute("data-part", current);
    });
  }

  // ── Thuật ngữ: rê chuột (hoặc chạm) để xem giải thích, chỉ lần xuất hiện đầu tiên ──
  function applyGlossary(file) {
    if (!glossary.length || file === "thuat-ngu.md") return;
    var seen = {};
    var walker = document.createTreeWalker($(".markdown-section"), NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentElement;
        if (!p || p.closest("code, pre, a, h1, h2, h3, abbr, .mermaid, #toc, .progress-bar, summary")) return NodeFilter.FILTER_REJECT;
        return /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      glossary.forEach(function (g) {
        if (seen[g.term] || !node.parentNode) return;
        // Viết tắt (DNS, VLAN) khớp đúng chữ hoa; thuật ngữ thường (gateway) không phân biệt hoa thường
        var flags = /[a-z]/.test(g.term) ? "i" : "";
        var re = new RegExp("(^|[^\\wÀ-ỹ])(" + g.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![\\wÀ-ỹ])", flags);
        var m = node.nodeValue.match(re);
        if (!m) return;
        seen[g.term] = true;
        var start = m.index + m[1].length;
        var after = node.splitText(start);
        after.nodeValue = after.nodeValue.slice(m[2].length);
        var abbr = document.createElement("abbr");
        abbr.className = "term";
        abbr.tabIndex = 0;
        abbr.textContent = m[2];
        abbr.setAttribute("data-tip", g.vi + " — " + g.def);
        after.parentNode.insertBefore(abbr, after);
      });
    });
  }

  // Hộp giải thích nổi: không bị khung bảng cắt mất
  function showTip(el) {
    var tip = $("#tip");
    if (!tip) { tip = document.createElement("div"); tip.id = "tip"; document.body.appendChild(tip); }
    tip.textContent = el.getAttribute("data-tip");
    var r = el.getBoundingClientRect();
    tip.style.left = Math.min(r.left, window.innerWidth - 340) + "px";
    tip.style.top = (r.bottom + 8) + "px";
    tip.classList.add("show");
  }
  function hideTip() { var tip = $("#tip"); if (tip) tip.classList.remove("show"); }
  document.addEventListener("mouseover", function (e) { var t = e.target.closest && e.target.closest("abbr.term"); t ? showTip(t) : hideTip(); });
  document.addEventListener("focusin", function (e) { if (e.target.matches && e.target.matches("abbr.term")) showTip(e.target); });
  document.addEventListener("focusout", hideTip);
  document.addEventListener("scroll", hideTip, true);

  // ── Bấm vào lệnh trong bảng để copy ──
  function bindCopy() {
    $$(".markdown-section td code").forEach(function (el) {
      el.title = "Bấm để copy";
      el.onclick = function () {
        navigator.clipboard.writeText(el.innerText).then(function () { toast("Đã copy: " + el.innerText); });
      };
    });
  }

  // ── In: cả trang hoặc chỉ phần Tra ──
  function bindPrint() {
    $$("[data-print]").forEach(function (b) {
      b.onclick = function () {
        if (b.getAttribute("data-print") === "tra") document.body.classList.add("print-tra");
        window.print();
        setTimeout(function () { document.body.classList.remove("print-tra"); }, 500);
      };
    });
  }

  // ── Plugin docsify ──
  function handbookPlugin(hook, vm) {
    var words = 0;
    // Đợi dữ liệu ngày cập nhật trước khi dựng trang
    hook.beforeEach(function (md, next) {
      words = md.replace(/```[\s\S]*?```/g, " ").replace(/[|#>*`\-]/g, " ").split(/\s+/).filter(Boolean).length;
      metaReady.then(function () { next(md); });
    });
    hook.afterEach(function (html, next) {
      var file = vm.route.file;
      var mins = Math.max(1, Math.round(words / WORDS_PER_MIN));
      var updated = meta[file] ? " · cập nhật " + fmt(meta[file]) : "";
      var hasTra = html.indexOf('id="tra"') !== -1;
      var tools = file === "README.md" ? "" :
        '<span class="page-tools"><button type="button" data-print="all">In trang</button>' +
        (hasTra ? '<button type="button" data-print="tra">In bảng tra</button>' : "") + "</span>";
      var line = '<div class="page-meta"><span>' + mins + " phút đọc" + updated + "</span>" + tools + "</div>";
      html = html.replace(/(<\/h1>)/, "$1" + line);
      next(html + progressBar(file));
    });
    hook.doneEach(function () {
      var file = vm.route.file;
      tagParts();
      buildToc();
      bindCopy();
      bindPrint();
      bindProgress();
      markSidebar();
      renderReviewList();
      glossaryReady.then(function () { applyGlossary(file); });
    });
  }

  // ── Gõ "/" để tìm ──
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && tag !== "input" && tag !== "textarea") {
      var input = $(".search input");
      if (input) { e.preventDefault(); input.focus(); input.select(); }
    }
  });

  // ── Sơ đồ: cùng bảng màu với trang ──
  var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  window.mermaid && mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', // font có sẵn: đo chữ chính xác
    flowchart: { useMaxWidth: true, nodeSpacing: 30, rankSpacing: 36 },
    sequence: { useMaxWidth: true, mirrorActors: false, width: 118, actorMargin: 28, actorFontSize: 14, messageFontSize: 13, noteFontSize: 13 },
    themeVariables: Object.assign({ fontSize: "14px" }, dark ? {
      background: "#11161d", primaryColor: "#171d26", primaryBorderColor: "#3b4656",
      primaryTextColor: "#e6edf3", lineColor: "#6b7685", secondaryColor: "#1b2230",
      tertiaryColor: "#11161d", noteBkgColor: "#1b2230", noteTextColor: "#e6edf3",
      actorBkg: "#171d26", actorBorder: "#3b4656", actorTextColor: "#e6edf3", signalColor: "#949ca6", signalTextColor: "#e6edf3",
    } : {
      background: "#f7f8fa", primaryColor: "#ffffff", primaryBorderColor: "#c9ced6",
      primaryTextColor: "#1f2328", lineColor: "#8a939e", secondaryColor: "#eef3ff",
      tertiaryColor: "#f7f8fa", noteBkgColor: "#eef3ff", noteTextColor: "#1f2328",
      actorBkg: "#ffffff", actorBorder: "#c9ced6", actorTextColor: "#1f2328", signalColor: "#5d6670", signalTextColor: "#1f2328",
    }),
  });

  // ── Cấu hình docsify ──
  window.$docsify = {
    name: '<span class="logo-prompt">~$</span>sổ tay <b>IT</b>',
    nameLink: "#/",
    homepage: "README.md",
    loadSidebar: "_sidebar.md",
    alias: { "/.*/_sidebar.md": "/_sidebar.md" },   // trang trong lab/ dùng chung thanh bên
    subMaxLevel: 0,                                   // mục lục trang nằm bên phải, không chen vào thanh bên
    auto2top: true,
    search: { placeholder: "Tìm lệnh, sự cố…", noData: "Không tìm thấy", depth: 3, paths: "auto" },
    copyCode: { buttonText: "Copy", successText: "Đã copy", errorText: "Lỗi" },
    pagination: { previousText: "Trước", nextText: "Tiếp", crossChapter: true, crossChapterText: false },
    plugins: [handbookPlugin],
  };
})();
