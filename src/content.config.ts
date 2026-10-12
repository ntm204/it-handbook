import { defineCollection } from "astro:content";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Chữ giao diện tiếng Việt mà Starlight chưa dịch sẵn (hộp tìm kiếm, nút copy): src/content/i18n/vi.json
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
