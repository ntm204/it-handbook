# Ảnh chia sẻ (og.png)

Nguồn thiết kế của `public/og.png` (1200×630). Sửa `og.html`, rồi dựng lại ảnh:

```sh
cp node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-{vietnamese,latin}-{400,700}-normal.woff2 \
   node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2 scripts/og/
cd scripts/og && python3 -m http.server 8765     # mở http://localhost:8765, chụp màn hình 1200×630
```

Bất kỳ trình duyệt Chromium nào cũng chụp được bằng: `--headless=new --window-size=1200,630 --screenshot=og.png http://localhost:8765/`
