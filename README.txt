GO HEALTH 活動網站第一版檔案

建議上傳到 S3 的資料夾結構：

go-health-site/
├── index.html
├── content.json
├── assets/
│   ├── css/style.css
│   ├── js/app.js
│   └── images/
│       ├── hero-desktop.webp
│       ├── hero-mobile.webp
│       ├── logo-happygo.png
│       ├── logo-femh.png
│       └── happy-go-go-health-qrcode.png

更新方式：
1. 文案、活動、CTA、注意事項：替換根目錄 content.json。
2. 圖片：替換 assets/images/ 中同名檔案。
3. 版型、排版、互動：修改 index.html、assets/css/style.css、assets/js/app.js。

本機預覽：
請不要直接雙擊 index.html，因為瀏覽器可能會擋 fetch content.json。
可在資料夾內執行：
python -m http.server 8000
再打開 http://localhost:8000
