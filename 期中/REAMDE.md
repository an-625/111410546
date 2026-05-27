# 🐍 貪食蛇排行榜遊戲 (Snake Game with Leaderboard)

> 💡 **專案開發聲明**：本專案之全端架構、核心邏輯、Bug 深度除錯（包含本機連接埠衝突與跨環境 shell 轉譯問題）以及本文件報告，全程皆使用 **AI 數據模型（Gemini）** 進行深度協作、共同導引開發與完成。

![JavaScript](https://img.shields.io/badge/Frontend-JavaScript-yellow)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-lightgrey)
![License](https://img.shields.io/badge/License-MIT-blue)

一個結合經典網頁 Canvas 貪食蛇遊戲與後端 RESTful 排行榜系統的全端（Full-Stack）網頁應用程式。玩家可以在前端進行流暢的遊戲體驗，並在結束後將分數即時同步至 Node.js 後端伺服器，與全網玩家進行即時排名。

---

## 🚀 專案特點 & 功能介紹

### 🎮 前端遊戲核心邏輯
- **經典操控與精準響應**：使用鍵盤方向鍵（Up, Down, Left, Right）流暢控制蛇身，內建防連續按鍵導致自殺的轉向鎖定機制。
- **動態成長機制**：食物隨機生成於畫布內（不與蛇身重疊），每吃掉一個食物，蛇身即時增長，分數隨之累加。
- **雙重死亡碰撞判定**：包含「撞擊四面牆壁邊界」與「蛇頭撞擊自身陣列（咬到自己）」的嚴格死亡結算。
- **非同步排行榜刷新**：遊戲結束後無須重新整理網頁，自動透過 Fetch API (Async/Await) 從後端拉取最新數據並動態渲染 UI。

### 🖥️ 後端伺服器 (Server)
- **輕量化資料管理**：接收並在記憶體內（In-Memory）即時維護玩家的分數紀錄，待命時硬體資源消耗極低（CPU ~0%, RAM < 50MB）。
- **排行演算法優化**：自動對傳入的分數進行動態降冪排序，並利用資料截斷技術防範冗餘數據，永遠只保留前 10 名的頂尖數據。
- **開發者友善架構**：內建 CORS 跨來源資源共用設定與 `express.json()` 中介軟體，確保前後端通訊完全解耦、不卡關。

---

## 📂 專案目錄結構

```text
snake-game/
├── client/                  # 前端網頁應用程式 (靜態資源)
│   ├── index.html           # 遊戲 Canvas 畫布與排行榜顯示面板 UI
│   ├── style.css            # 遊戲畫面、按鈕與排版樣式客製化
│   └── game.js              # 貪食蛇遊戲迴圈、碰撞邏輯與 Fetch 網路請求
└── server/                  # 後端 Node.js 服務環境
    ├── node_modules/        # npm 套件依賴軟體庫 (Express 等)
    ├── server.js            # 後端主應用程式 (API 路由、CORS、數據排序邏輯)
    ├── package.json         # 專案相依性管理與啟動腳本設定 (npm start)
    └── package-lock.json    # 鎖定套件版本樹
```
##💡 技術挑戰與解決方案 (遇到的問題深度剖析)
在 AI 的循序漸進引導與共同 Debug 過程中，本專案成功克服了從「底層通訊協定」到「作業系統環境相容性」的三大技術挑戰：

1. Fetch 傳送 JSON 資料失敗（HTTP 400 / 500 錯誤與 Body 遺失）
發生原因：一開始在前端直接將 JavaScript 原生物件作為 body 傳送，且未聲明資料格式。這導致網路傳輸封包無法被解讀，且 Express 後端因未配置適當的解析器，讀取出來的 req.body 恆為 undefined。

解決方案：

後端端點：在 server.js 路由前置引入 app.use(express.json())，賦予 Express 解析 JSON 封包的中介能力。

前端端點：在 Fetch 的 options 中明確補上 'Content-Type': 'application/json' 標頭，並強行使用 JSON.stringify(data) 將物件字串化後送出，成功達成前後端資料格式對齊。
2. 排行榜數據亂序、硬體資源浪費與「鬼打牆」卡死問題
發生原因：

由於新分數是盲目地利用 push() 推入陣列，沒有經過排序，導致低分排在前面。

當伺服器重複重啟時，常噴出 EADDRINUSE: address already in use :::3000 錯誤，這是因為舊的 Node.js 程序未正常釋放連接埠（Port），多個程序爭奪同一診間，導致新程式崩潰並產生殭屍程序，甚至引發網頁重新整理卻「讀到舊暫存」的鬼打牆現象。

解決方案：

算法層面：在 API 回傳前，利用高階陣列方法 sort((a, b) => b.score - a.score) 進行高效率的即時降冪排序，並搭配 slice(0, 10) 永遠只裁剪並保留最高前 10 名。這不僅最佳化了顯示效果，更將記憶體空間限制在常數階度，防止資料暴增拖慢效能（當前狀態記憶體僅佔用 30~50MB，CPU 趨近於 0%）。

程序層面：學會了在開發階段不直接打叉關閉終端機，而是透過 Ctrl + C 讓 Node.js 發送優雅關閉（Graceful Shutdown）訊號以釋放 Port 3000。

3. Git Bash（MINGW64）環境下的 Windows 指令路徑轉譯災情
發生原因：當遭遇 Port 3000 卡死、需要強行終止進程時，在 Git Bash 中執行 Windows 原生指令 taskkill /PID <PID> /F 會瘋狂報錯：錯誤: 錯誤的引數/選項 - 'D:/Git/PID'。這是因為 Git Bash 內建的 Linux 模擬器會自作聰明地將單斜線 / 開頭的參數，全部誤判為 Windows 的絕對檔案路徑。

解決方案：在 AI 的深度提示與環境相容性調整下，學會了兩種黃金解決路徑：

跳脫路徑法：在 Git Bash 中改用雙斜線 //PID 與 //F 進行跳脫（taskkill //PID <PID> //F），強行阻止終端機進行路徑轉譯。

原生核心法：直接使用 Linux 核心內建的 kill -9 <PID> 指令強行中斷，或切換至原生 Windows CMD 完成程序擊殺，徹底搞懂跨平台終端機的核心差異。

🛠️ 未來擴充功能 (Todo List)
本專案目前的軟體架構具備極佳的模組化與擴充性，未來預計朝向以下三個核心維度進行演進與優化：

[ ] 1. 永久化資料庫串接 (Data Persistence)

現狀分析：目前排行榜儲存在記憶體（RAM）中，伺服器一旦重啟或發生未捕獲的例外，數據將全部灰飛煙滅。

改進計畫：預計引入輕量級 NoSQL 資料庫 MongoDB 或內嵌式 SQLite，將 /score 與 /leaderboard 改寫為資料庫查詢語句，讓排行榜具備斷電不遺失的永久保存特性。

[ ] 2. 後端防作弊與安全驗證機制 (Anti-Cheat & Security)

現狀分析：由於目前前端與後端高度解耦，任何人都可以輕易打開 Postman 或瀏覽器開發者工具，直接向 /score 發送偽造的超高分數（例如 {"name": "Hacker", "score": 999999}）。

改進計畫：

邏輯檢驗：在後端加入步長與時間驗證（例如：一秒內不可能增加超過 10 分）。

加密權杖：前端遊戲進行時，由後端動態簽發帶有時間戳的加密 Token，結算時需附帶 Token 進行校驗，防範惡意偽造封包。

[ ] 3. 遊戲難度漸進系統 (Dynamic Difficulty / Progressive FPS)

現狀分析：目前蛇的移動速度是恆定的，長時間遊玩容易讓玩家產生視覺疲勞，缺乏挑戰性。

改進計畫：設計一個動態調節器，隨著蛇身陣列長度增加（例如每吃 5 個食物），遊戲的主迴圈重新繪製頻率（FPS/Interval）就會按比例縮短，讓速度越來越快，大幅拉高遊戲的刺激度與可玩性。

📝 全端開發心得
這是我第一次真正涉足全端網頁（Full-Stack）的領域。從一開始單純在網頁前端 Canvas 畫布上計算方格坐標、監聽鍵盤事件，到後來自己動手用 Node.js 和 Express 搭建起一整套可以互相對話的後端服務，這之間的成就感是無法言喻的。

在與 AI 緊密協作的開發過程中，我獲得了許多超越教科書的寶貴實戰經驗。我深刻體會到，在全端開發中，「資料的流動與協議（API Specification）」就是整個應用程式的靈魂。從最初連 JSON 都傳不過去、遭遇 TCP 通訊埠被佔用導致系統崩潰的挫折，到後來能夠沉著地用 netstat 與 taskkill 去排查作業系統底層的進程衝突，並寫出兼顧效能與記憶體管理（sort + slice）的自動排序前 10 名排行榜，這些 Debug 的過程才是含金量最高的實戰養分。

這次的作業不僅僅是做出一款貪食蛇遊戲，更幫我徹底打通了前後端串接的任督二脈。它讓我對網路通訊協定、JSON 資料封裝、以及跨作業系統環境的相容性有了更紮實的微觀認知，也讓我對未來獨立開發更大型、更具規模的全端 Web 應用程式充滿了期待與信心！
