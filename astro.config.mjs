// Sổ tay IT — cấu hình trang (Astro + Starlight)
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import customHeadingId from "remark-custom-heading-id";
import remarkViSearch from "./scripts/remark-vi-search.mjs";
import rehypeSearchSpacing from "./scripts/rehype-search-spacing.mjs";
import rehypeStackTables from "./scripts/rehype-stack-tables.mjs";

const REPO = "https://github.com/ntm204/it-handbook";
const BASE = "/it-handbook";

export default defineConfig({
  site: "https://ntm204.github.io",
  base: BASE,
  trailingSlash: "always",
  // id tiêu đề cố định; tìm "dang nhap" ra "đăng nhập"; đoạn trích tìm kiếm không dính chữ; bảng nhiều cột thành thẻ trên điện thoại
  markdown: { remarkPlugins: [customHeadingId, remarkViSearch], rehypePlugins: [rehypeSearchSpacing, rehypeStackTables] },
  integrations: [
    starlight({
      title: "Sổ tay IT",
      description: "Bảng tra lệnh tiếng Việt: Linux, mạng, Windows, switch, Git, Docker, terminal. Ngắn, đúng, bấm là copy. Mã nguồn mở.",
      defaultLocale: "root",
      locales: { root: { label: "Tiếng Việt", lang: "vi" } },
      components: {
        SiteTitle: "./src/components/SiteTitle.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",   // nút 3 biểu tượng thay ô chọn mặc định
        Head: "./src/components/Head.astro",                 // thêm cuộn mượt (Lenis)
      },
      social: [{ icon: "github", label: "GitHub", href: REPO }],
      editLink: { baseUrl: `${REPO}/edit/main/` },
      lastUpdated: true,
      expressiveCode: {
        themes: ["github-dark-default", "github-light-default"],
        styleOverrides: {
          borderRadius: "0.85rem",
          borderColor: "transparent",   // khung code không viền, chỉ nền
          codeFontFamily: "var(--sl-font-mono)",
          codeFontSize: "0.82rem",
          codeLineHeight: "1.7",
          frames: { shadowColor: "transparent", frameBoxShadowCssValue: "none" },
        },
        // Lệnh dài tự xuống dòng thay vì bị che (phải vuốt ngang); dòng nối thụt vào 4 ký tự để phân biệt với dòng lệnh mới
        defaultProps: { wrap: true, hangingIndent: 4 },
      },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      customCss: [
        "@fontsource/be-vietnam-pro/400.css",
        "@fontsource/be-vietnam-pro/500.css",
        "@fontsource/be-vietnam-pro/600.css",
        "@fontsource/be-vietnam-pro/700.css",
        "@fontsource/jetbrains-mono/400.css",
        "@fontsource/jetbrains-mono/500.css",
        "./src/styles/custom.css",
      ],
      head: [
        { tag: "script", attrs: { src: `${BASE}/handbook.js`, defer: true } },
        // Ảnh xem trước khi chia sẻ link (Facebook, Zalo, LinkedIn). Nguồn thiết kế: scripts/og/og.html
        { tag: "meta", attrs: { property: "og:image", content: `https://ntm204.github.io${BASE}/og.png` } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "Sổ tay IT — bảng tra lệnh cho người làm IT" } },
        { tag: "meta", attrs: { name: "twitter:image", content: `https://ntm204.github.io${BASE}/og.png` } },
      ],
      sidebar: [
        { label: "Linux", link: "/linux/" },
        { label: "Mạng", link: "/mang/" },
        { label: "Windows & AD", link: "/windows/" },
        { label: "Switch & Firewall", link: "/thiet-bi-mang/" },
        { label: "Git", link: "/git/" },
        { label: "Docker", link: "/docker/" },
        { label: "Terminal & Neovim", link: "/terminal/" },
        { label: "Đóng góp", link: `${REPO}/blob/main/CONTRIBUTING.md`, attrs: { target: "_blank" } },
      ],
    }),
  ],
});
