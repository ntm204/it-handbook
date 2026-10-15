// Nội dung: mỗi trang là một file Markdown trong src/content/docs (file bắt đầu bằng _ là mẫu, không xuất bản)
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: ["*.md", "!_*.md"], base: "./src/content/docs" }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      man: z.string().regex(/^[a-z-]+\(\d\)$/),   // tên kiểu trang man, ví dụ "linux(8)"
      order: z.number(),                          // thứ tự trên trang chủ
      summary: z.string(),                        // một dòng ngắn: trang có gì (hiện ở trang chủ và dòng TÊN)
    }),
  }),
};
