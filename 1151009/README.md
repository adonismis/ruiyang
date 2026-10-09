# 睿洋機電工程有限公司｜靜態網站

這是一般 HTML／CSS／JavaScript 網站。首頁為根目錄的 `index.html`，其他頁面也都在根目錄，以 `.html` 檔案互相連結。正式網站只需上傳根目錄的 HTML 檔與 `assets/`；不需安裝 Node.js，也不需執行 Next.js。

## 開啟與部署

- 直接開啟 `index.html`，即可瀏覽頁面與站內連結。
- 部署到一般靜態網站空間時，將所有 `.html` 檔及整個 `assets/` 資料夾放在同一層。伺服器的預設首頁設為 `index.html`，404 頁可設為 `404.html`。
- 本站沒有 API 或伺服器程式。`assets/js/site.js` 負責行動版選單、首頁新聞頁籤和捲動顯示效果。

## 檔案位置

| 類型 | 位置 |
| --- | --- |
| 首頁 | `index.html` |
| 公司、服務、實績、永續、新聞、徵才、聯絡等內頁 | 根目錄各 `.html` 檔 |
| 網站樣式 | `assets/css/site.css` |
| 字型宣告與字型檔 | `assets/css/fonts.css`、`assets/fonts/` |
| 原生 JavaScript | `assets/js/site.js` |
| 照片、LOGO、網站圖示 | `assets/images/`、`assets/brand/`、`assets/icon.png` |
| 舊版 Next.js 原始碼與建置檔 | `old/` |

內容修改請直接編輯對應 HTML。若新增頁面，請以 `.html` 連結新檔，並確認圖片及樣式的相對路徑可用。`old/` 僅保留舊版資料，不需一起部署。

目前營業項目仍有待確認版位，工程、新聞、證件與職缺尚無已公開資料。聯絡表單呈現原有的「尚未開放」狀態，送出按鈕停用；靜態網站不會寄信或儲存填寫內容。正式聯絡方式和內容取得後，需更新相關 HTML，若要啟用表單則須另接收件服務。

照片來源及使用說明見 [ASSETS.md](ASSETS.md)。
