GO HEALTH 活動網站 v7

本版主要調整：
1. 將「世代記憶交換計畫」改成更完整的對外活動敘事，移除內部專案語氣。
2. 新增 campaign_steps 資料結構，前端以「三種方式，交換快樂記憶」呈現參與方式。
3. 第一重改為「分享長輩的光芒記憶」，並保留「前往活動貼文」按鈕；若連結為 TBD，前端會顯示「活動貼文即將公開」。
4. 新增 kol_profiles 資料結構與「記憶分享引路人」區塊，日後可替換 KOL 貼文或粉絲團連結。
5. 將「加碼抽萬點」改為「GO HEALTH 會員限定禮」，降低促銷感。
6. 手機版新增漢堡選單與回到頂部浮動按鈕。
7. CSS / JS / JSON 皆已加 v7 cache busting。

上傳方式：
請將 go-health-site 資料夾內的所有檔案上傳到 GitHub Pages 或 S3 根目錄。

本機預覽：
cd go-health-site
python -m http.server 8000
然後開啟 http://localhost:8000


2026-06-10 v7.1：修正 mobile menu hidden 樣式，避免桌機/手機預設展開。
