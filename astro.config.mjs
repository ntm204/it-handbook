// Sổ tay IT — cấu hình trang (Astro + Starlight)
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";
import customHeadingId from "remark-custom-heading-id";

const REPO = "https://github.com/ntm204/it-handbook";
const BASE = "/it-handbook";

export default defineConfig({
  site: "https://ntm204.github.io",
  base: BASE,
  trailingSlash: "always",
  markdown: { remarkPlugins: [customHeadingId] },      // tiêu đề có id cố định: ## Tiêu đề {#id}
  integrations: [
    mermaid({                                         // sơ đồ ```mermaid, tự đổi sáng/tối
      theme: "default",
      autoTheme: true,
      mermaidConfig: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',  // font có sẵn: đo chữ chính xác
        themeVariables: { fontSize: "15px" },
        flowchart: { useMaxWidth: true, nodeSpacing: 32, rankSpacing: 40, padding: 12 },
        sequence: { useMaxWidth: true, mirrorActors: false, width: 120, actorMargin: 30, actorFontSize: 14, messageFontSize: 14, noteFontSize: 14 },
      },
    }),
    starlight({
      title: "Sổ tay IT",
      description: "Sổ tay IT thực chiến bằng tiếng Việt: hệ thống, server, mạng. Mã nguồn mở, ai cũng có thể đóng góp.",
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
          borderColor: "var(--hb-border)",
          codeFontFamily: "var(--sl-font-mono)",
          codeFontSize: "0.82rem",
          codeLineHeight: "1.7",
          frames: { shadowColor: "transparent", frameBoxShadowCssValue: "none" },
        },
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
      head: [{ tag: "script", attrs: { src: `${BASE}/handbook.js`, defer: true } }],
      sidebar: [
        { label: "Lộ trình nghề", link: "/nghe-nghiep/" },
        { label: "Mạng", link: "/mang/" },
        { label: "Linux server", link: "/linux/" },
        { label: "Windows & AD", link: "/windows/" },
        { label: "Switch & Firewall", link: "/thiet-bi-mang/" },
        { label: "Xử lý sự cố", link: "/xu-ly-su-co/" },
        {
          label: "Lab thực hành",
          items: [
            { label: "Tổng quan", link: "/lab/" },
            { label: "Hai mạng và một router", link: "/lab/01-mang-hai-may/" },
            { label: "Quan sát DNS và TCP", link: "/lab/02-quan-sat-goi-tin/" },
            { label: "Server đầy ổ", link: "/lab/03-day-o/" },
            { label: "Tự viết dịch vụ", link: "/lab/04-dich-vu-systemd/" },
            { label: "Chặn và mở cổng", link: "/lab/05-firewall/" },
            { label: "VLAN trên Cisco", link: "/lab/06-vlan-cisco/" },
          ],
        },
        { label: "Thuật ngữ", link: "/thuat-ngu/" },
        { label: "Đóng góp", link: `${REPO}/blob/main/CONTRIBUTING.md`, attrs: { target: "_blank" } },
      ],
    }),
  ],
});
