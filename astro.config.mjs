// Sổ tay IT — cấu hình trang (Astro thuần, giao diện kiểu trang man)
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import customHeadingId from "remark-custom-heading-id";
import remarkViSearch from "./scripts/remark-vi-search.mjs";
import rehypeSearchSpacing from "./scripts/rehype-search-spacing.mjs";
import rehypeManTables from "./scripts/rehype-man-tables.mjs";

export default defineConfig({
  site: "https://ntm204.github.io",
  base: "/it-handbook",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    // id tiêu đề cố định · tìm "dang nhap" ra "đăng nhập" · đoạn trích tìm kiếm không dính chữ · bảng thành danh sách kiểu man
    remarkPlugins: [customHeadingId, remarkViSearch],
    rehypePlugins: [rehypeSearchSpacing, rehypeManTables],
    syntaxHighlight: false,   // khối lệnh hiện chữ thường như trang man, không tô màu
  },
});
