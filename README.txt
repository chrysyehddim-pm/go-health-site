GO HEALTH 活動網站 v3

本版主要調整：
1. 桌機 QR Code 放大，手機版隱藏 QR Code、保留按鈕。
2.「GO HEALTH 是什麼」右側改為 CSS 服務互動示意卡，不需新增圖片。
3. 三大服務亮點改為三欄版，會自動排除 enabled=false 的健康小知識。
4. 世代記憶交換計畫增加獎項卡、截止日、KOL 名稱提示與按鈕間距。
5. 實體活動區只呈現 enabled=true 的 offline events。
6. Footer 上方合作 Logo 區移除「開啟 GO HEALTH」按鈕，避免和合作識別混淆。
7. 社群活動 CTA 若 Google Sheet 填 TBD，前端會自動呈現 disabled 狀態。

上傳方式：
請將 go-health-site 資料夾內的所有檔案上傳到 GitHub Pages 或 S3 根目錄。

本機預覽：
cd go-health-site
python -m http.server 8000
然後開啟 http://localhost:8000


[v5 更新]
- 整合世代記憶交換計畫主視覺：assets/images/campaign-kv-desktop.webp、campaign-kv-mobile.webp。
- 新增線上分享與現場記憶郵局兩張參與方式卡。
- 更新亞東醫院活動名稱為「腦健康分享講座 × 記憶郵局」。
- 更新 notices 順序與 n011 記憶郵局說明。
- CSS / JS / JSON 皆已加 v5 cache busting。


--- v6 更新重點 ---
- 重整世代記憶交換計畫為 Launch Campaign 母主軸。
- 桌機版 Hero 不再顯示立即體驗按鈕，改以 QR Code 為主；手機版保留開啟 GO HEALTH 按鈕。
- Campaign 區新增 Switch 2 / GO HEALTH 萬點誘因卡。
- 新增記憶交換三重奏：線上留言、記憶郵局、高齡博覽會。
- 活動場次資訊只保留實體活動，不再與社群活動拆裂。
