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
