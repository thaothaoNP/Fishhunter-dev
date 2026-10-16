# Bản đồ hệ thống — Fish Hunter (môi trường TEST)

> **Tầng khám phá — KHÔNG chứa mã `REQ-XXX-NN`.** Ở đây chỉ cấp **prefix** cho từng module. Mã REQ (`REQ-FISH-<MODULE>-NN`) được cấp ở tầng module khi chạy `/generate-requirements-from-website`.
>
> Danh mục toàn hệ thống: [../README.md](../README.md)

---

## 1. Bối cảnh khảo sát

| Mục | Giá trị |
|---|---|
| Ngày khảo sát | 2026-10-16 |
| Mode | **UI** — hệ thống mới trong repo (namespace `_fishhunter/`), chỉ có URL + account. [`sources/Slot_Legends_Event.md`](sources/Slot_Legends_Event.md) là bản đề xuất sự kiện, chỉ phủ module `SLEG` → xử lý Hybrid **ở cấp module** khi recon `SLEG` |
| Hệ thống | Cổng game Fish Hunter, client Cocos Creator **2.4.3** (canvas WebGL), tham số khởi chạy bản test: `cp=myid` · `lang=en` · `wss=true` · `debug=true` · `log=true` |
| Server | 1 kết nối WebSocket `wss://<host>:2083` duy nhất cho mọi chức năng (tin nhị phân MessagePack, định tuyến bằng trường `route`). HTTP chỉ dùng tải tài nguyên + gửi sự kiện tới GameAnalytics |
| Thị trường | Myanmar — gói nạp tính bằng `Ks`, mô tả gói bằng tiếng Miến Điện, phần thưởng có cả **Data di động** (50 MB → GB) |
| Tiền tố TC ID | `FISH_` → `FISH_<MODULE>_TC_<3 số>` |
| URL · tài khoản | `.env` — **KHÔNG** ghi vào `docs/` |
| Account đã dùng | `chicken` (hiển thị `chicky`) và `girlcute` (hiển thị `girlgirl`) — cùng bộ chức năng, 1 vai trò Người chơi |
| Môi trường dùng chung | **KHÔNG** (user chốt sau checkpoint). Trong lúc khảo sát vẫn giữ nguyên tắc chỉ quan sát: không mua gói, không quay, không nhận thưởng — ngoại lệ ngoài ý muốn ghi ở mục 7.3 |
| Trình duyệt khảo sát | Chromium headless **1920×1080**, `--disable-gpu` (WebGL qua SwiftShader). Playwright MCP bị phiên khác giữ profile → agent tự khởi chạy Chromium qua thư viện Playwright, cùng tham số Headless mặc định |
| Kỹ thuật crawl | Canvas không có DOM nghiệp vụ → đọc **cây node Cocos** bằng `cc.director.getScene()` (tên node, `cc.Label`, `cc.Button` + `clickEvents`, `cc.Toggle`, `cc.EditBox`); thao tác bằng click chuột vào toạ độ tâm node, hoặc phát `clickEvents` của chính nút khi click chuột không được nhận (RISK-FISH-02); tầng network đọc **thụ động** từ console (`route<<<<<` gửi / `route>>>>>` nhận) và khung WebSocket |
| Phạm vi crawl | Toàn bộ nút Header · thanh dưới · danh sách 11 game ở sảnh · 2 nút kéo · panel MINI GAME (3 game) · menu Settings · form Login/Register · mở **vào** từng game và thoát ra |
| Số module phát hiện | **26 module**, ghi trong **18 file** khám phá |
| Ước tổng REQ | ~520–750 REQ |

---

## 2. Sơ đồ điều hướng (nguyên trạng — tên node trong ngoặc)

```
[Chưa đăng nhập] PopupLogin ── Username · Password · LOGIN · REGISTER ─▶ PopupRegister (Username · Password · Re-password · REGISTER)
        │ login OK
        ▼
[Sảnh — scene ShootFish]
├─ Popup tự bật sau đăng nhập: PopupEventPoker ("Join Now") → PopupDiemDanhHangNgay (Daily Attendance)
├─ Header
│   ├─ Avatar (avatar) ......................... → Personal [PERS]  (tab Record · Prize · Giftcode · Overview)
│   ├─ Số dư + nút (+) (btnAddCoin) ............ → Shop [SHOP]
│   ├─ My Game (btnMoreGame) ................... → PopupMoreGame [MORE]
│   ├─ Mail box (btnMail) ...................... → PopupMailBox [MAIL]
│   ├─ Giftcode (btnGiftcode) .................. → Personal, tab Giftcode [GIFT]
│   ├─ 1st Top-up (btnNapLanDau) ............... ẨN với 2 account đã thử
│   ├─ Tournament (btnTopGowin) ................ ẨN với 2 account đã thử
│   ├─ Marquee thông báo (notity_marquee)
│   └─ Settings ▾ (btnSetting/panelSetting) .... Music · Sound · T&C (PopupTermsConditions) · Logout (PopupConfirm)
├─ Banner sự kiện (EventPageView, 6 trang)
├─ Danh sách game (cuộn ngang)
│   ├─ Fish Hunter (btnFish) ................... → scene FishHunter [FISH]
│   ├─ Treasure Chest (btnSlotThuyCung) ........ → Games/SlotThuyCung [SLTC]   (hiển thị 3 mức jackpot ngay ở sảnh)
│   ├─ Avengers (btnAvenger) ................... → Games/SlotAvengers [SLAV]   (3 mức jackpot ở sảnh)
│   ├─ Alien Blast (btnReactoonz) .............. → scene Reactoonz [ALIEN]
│   ├─ Shan KoeMee (btnShanKoeMee) ............. → Games/ShanKoeMee [SHAN]
│   ├─ Baca Ocean (btnBaccarat) ................ → Games/Baccarat [BACA]
│   ├─ Poker (btnPoker) ........................ → Games/Poker [POKER]
│   ├─ Fish mascot (btnBauCua) ................. → Games/BauCua [MASC]
│   ├─ Plinko (btnPlinko) ...................... → scene Plinko [PLINKO]
│   ├─ Fish mascot Mini (btnBauCuaMini) ........ → overlay App/Minigames/BauCuaMini [MASCM]
│   └─ Fish Submarine (btnTX) .................. → overlay App/Minigames/TX [SUBM]
├─ Thanh dưới
│   ├─ Guide (btnGuide) ........................ → PopupGameGuide [LOBBY]  (⚠️ AMB-FISH-06)
│   ├─ Inventory (btnKhoDo) .................... → PopupKhoDo [INV]
│   ├─ Events (btnEvent) ....................... → App/Minigames/PopupEvents [EVENT] (tab Online Gifts) · [SLEG] (tab Slot Legends)
│   ├─ SHOP (btnShop) .......................... → PopupShop [SHOP]
│   ├─ Missions (btnNhiemVu) ................... → PopupNhiemVuHangNgay [MISS]
│   ├─ Leaderboards (btnLeaderBoard) ........... → PopupLeaderboard [RANK]
│   └─ Activities (btnLuckyWheel) .............. → menu trung gian (nút `Lucky Wheel`) → PopupLuckyWheel [WHEEL]
└─ Nút kéo thả (App/DragButtons) — tồn tại xuyên mọi scene
    ├─ Promotions (btnPromotions) .............. → PopupShop [SHOP]
    └─ MINI GAME (btnMiniGame, có badge đếm) ... → MiniGamePanel: Fish Mascot · Fish Submarine [SUBM] · Mini Poker [MPK]
```

Các overlay trong `App/Minigames` và nút kéo thả **sống xuyên scene** — mở được cả khi đang trong một game khác (đã quan sát Fish Submarine bật đè lên Plinko).

---

## 3. Bảng module tổng (26 module)

| # | Module | Prefix | Loại màn hình | Entity / vòng đời | Risk | Ước REQ | File khám phá |
|---|---|---|---|---|---|---|---|
| 1 | Đăng nhập · Đăng ký · Đăng xuất | `AUTH` | Form popup | Phiên đăng nhập, tài khoản | 🔴 | 25–35 | [module_01](modules/module_01_dang_nhap_sanh.md) |
| 2 | Sảnh & Header | `LOBBY` | Màn hình chính + menu | — (điều hướng, cấu hình âm thanh) | 🟡 | 30–45 | [module_01](modules/module_01_dang_nhap_sanh.md) |
| 3 | Sự kiện Slot Legends | `SLEG` | Tab trong popup | Kỳ sự kiện, điểm BXH, nhiệm vụ ngày, mốc Star | 🔴 | 30–45 | [module_02](modules/module_02_su_kien_slot_legends.md) |
| 4 | Sự kiện (khung) + Quà online | `EVENT` | Popup nhiều tab | Mốc quà online theo thời gian | 🟡 | 12–18 | [module_02](modules/module_02_su_kien_slot_legends.md) |
| 5 | Slot Treasure Chest | `SLTC` | Game slot | Lượt quay, jackpot, free spin | 🔴 | 25–35 | [module_03](modules/module_03_slot_treasure_chest.md) |
| 6 | Slot Avengers | `SLAV` | Game slot | Lượt quay, jackpot, free spin | 🔴 | 25–35 | [module_04](modules/module_04_slot_avengers.md) |
| 7 | Alien Blast | `ALIEN` | Game slot (scene riêng) | Lượt quay, mức cược | 🔴 | 20–30 | [module_05](modules/module_05_alien_blast.md) |
| 8 | Bắn cá Fish Hunter | `FISH` | Game thời gian thực | Phòng, phát bắn, kỹ năng, jackpot | 🔴 | 50–80 | [module_06](modules/module_06_ban_ca_fish_hunter.md) |
| 9 | Cửa hàng / Nạp | `SHOP` | Popup 3 tab | Gói nạp, đổi Data, súng | 🔴 | 30–40 | [module_07](modules/module_07_cua_hang_kho_do.md) |
| 10 | Kho đồ | `INV` | Popup | Súng sở hữu / đang trang bị | 🟡 | 12–18 | [module_07](modules/module_07_cua_hang_kho_do.md) |
| 11 | Giftcode | `GIFT` | Tab form | Mã quà (dùng / hết hạn) | 🔴 | 10–15 | [module_08](modules/module_08_giftcode_ho_so_mygame.md) |
| 12 | Hồ sơ cá nhân | `PERS` | Popup 4 tab | Thống kê người chơi, lịch sử | 🟡 | 15–20 | [module_08](modules/module_08_giftcode_ho_so_mygame.md) |
| 13 | My Game | `MORE` | Popup | — (liên kết app khác) | 🟢 | 5–8 | [module_08](modules/module_08_giftcode_ho_so_mygame.md) |
| 14 | Nhiệm vụ hằng ngày | `MISS` | Popup danh sách | Nhiệm vụ ngày, tiến độ | 🟡 | 12–18 | [module_09](modules/module_09_nhiem_vu_diem_danh_hop_thu.md) |
| 15 | Điểm danh hằng ngày | `DAILY` | Popup lưới 7 ngày | Chuỗi điểm danh | 🟡 | 10–14 | [module_09](modules/module_09_nhiem_vu_diem_danh_hop_thu.md) |
| 16 | Hộp thư | `MAIL` | Popup danh sách + chi tiết | Thư (chưa đọc / đã nhận quà) | 🟡 | 10–15 | [module_09](modules/module_09_nhiem_vu_diem_danh_hop_thu.md) |
| 17 | Vòng quay may mắn | `WHEEL` | Popup | Lượt quay, giải thưởng | 🔴 | 15–20 | [module_10](modules/module_10_vong_quay_bang_xep_hang.md) |
| 18 | Bảng xếp hạng | `RANK` | Popup 3 × 2 tab | Kỳ xếp hạng tuần/tháng | 🟡 | 15–20 | [module_10](modules/module_10_vong_quay_bang_xep_hang.md) |
| 19 | Shan KoeMee | `SHAN` | Game bài nhiều người | Phòng, bàn, ván | 🔴 | 30–40 | [module_11](modules/module_11_shan_koemee.md) |
| 20 | Baca Ocean | `BACA` | Game bàn | Phiên cược | 🔴 | 25–35 | [module_12](modules/module_12_baca_ocean.md) |
| 21 | Poker | `POKER` | Game bài nhiều người | Phòng, bàn, ván, buy-in | 🔴 | 30–45 | [module_13](modules/module_13_poker.md) |
| 22 | Fish Mascot (bàn) | `MASC` | Game bàn | Phiên cược 6 cửa | 🔴 | 20–30 | [module_14](modules/module_14_fish_mascot.md) |
| 23 | Plinko | `PLINKO` | Game (scene riêng) | Lượt thả bóng | 🔴 | 18–25 | [module_15](modules/module_15_plinko.md) |
| 24 | Fish Mascot Mini | `MASCM` | Overlay mini | Phiên cược | 🔴 | 15–20 | [module_16](modules/module_16_fish_mascot_mini.md) |
| 25 | Fish Submarine | `SUBM` | Overlay mini + chat | Phiên Over/Under | 🔴 | 20–25 | [module_17](modules/module_17_fish_submarine.md) |
| 26 | Mini Poker | `MPK` | Overlay mini slot | Lượt quay, jackpot | 🔴 | 15–20 | [module_18](modules/module_18_mini_poker.md) |
| | | | | | | **~520–750** | |

**Căn cứ Risk:** mọi game và chức năng tiêu/nhận vàng là 🔴 vì vàng mua được bằng tiền thật (`Ks`) và phần thưởng có cả Data nhà mạng; toàn hệ thống **không có tài liệu** (trừ `SLEG`). Chức năng chỉ hiển thị / nhận thưởng nhỏ cố định là 🟡; liên kết tĩnh là 🟢.

## Bản đồ tài liệu

| File | Module bao phủ | Prefix | Trạng thái recon |
|---|---|---|---|
| [modules/module_01_dang_nhap_sanh.md](modules/module_01_dang_nhap_sanh.md) | Đăng nhập · Sảnh & Header | `AUTH` · `LOBBY` | ⬜ ⬜ |
| [modules/module_02_su_kien_slot_legends.md](modules/module_02_su_kien_slot_legends.md) | Slot Legends · Sự kiện + Quà online | `SLEG` · `EVENT` | ⬜ ⬜ |
| [modules/module_03_slot_treasure_chest.md](modules/module_03_slot_treasure_chest.md) | Slot Treasure Chest | `SLTC` | ⬜ |
| [modules/module_04_slot_avengers.md](modules/module_04_slot_avengers.md) | Slot Avengers | `SLAV` | ⬜ |
| [modules/module_05_alien_blast.md](modules/module_05_alien_blast.md) | Alien Blast | `ALIEN` | ⬜ |
| [modules/module_06_ban_ca_fish_hunter.md](modules/module_06_ban_ca_fish_hunter.md) | Bắn cá Fish Hunter | `FISH` | ⬜ |
| [modules/module_07_cua_hang_kho_do.md](modules/module_07_cua_hang_kho_do.md) | Cửa hàng · Kho đồ | `SHOP` · `INV` | ⬜ ⬜ |
| [modules/module_08_giftcode_ho_so_mygame.md](modules/module_08_giftcode_ho_so_mygame.md) | Giftcode · Hồ sơ · My Game | `GIFT` · `PERS` · `MORE` | ⬜ ⬜ ⬜ |
| [modules/module_09_nhiem_vu_diem_danh_hop_thu.md](modules/module_09_nhiem_vu_diem_danh_hop_thu.md) | Nhiệm vụ · Điểm danh · Hộp thư | `MISS` · `DAILY` · `MAIL` | ⬜ ⬜ ⬜ |
| [modules/module_10_vong_quay_bang_xep_hang.md](modules/module_10_vong_quay_bang_xep_hang.md) | Vòng quay · Bảng xếp hạng | `WHEEL` · `RANK` | ⬜ ⬜ |
| [modules/module_11_shan_koemee.md](modules/module_11_shan_koemee.md) | Shan KoeMee | `SHAN` | ⬜ |
| [modules/module_12_baca_ocean.md](modules/module_12_baca_ocean.md) | Baca Ocean | `BACA` | ⬜ |
| [modules/module_13_poker.md](modules/module_13_poker.md) | Poker | `POKER` | ⬜ |
| [modules/module_14_fish_mascot.md](modules/module_14_fish_mascot.md) | Fish Mascot (bàn) | `MASC` | ⬜ |
| [modules/module_15_plinko.md](modules/module_15_plinko.md) | Plinko | `PLINKO` | ⬜ |
| [modules/module_16_fish_mascot_mini.md](modules/module_16_fish_mascot_mini.md) | Fish Mascot Mini | `MASCM` | ⬜ |
| [modules/module_17_fish_submarine.md](modules/module_17_fish_submarine.md) | Fish Submarine | `SUBM` | ⬜ |
| [modules/module_18_mini_poker.md](modules/module_18_mini_poker.md) | Mini Poker | `MPK` | ⬜ |

Tổng: **18 file · 26 module** (2+2+1+1+1+1+2+3+3+2+8 = 26 = số dòng mục 3). Không gộp 2 module 🔴 vào cùng một file. Cột trạng thái chỉ tham chiếu — nguồn sự thật là [`../README.md`](../README.md).

---

## 4. Bản đồ entity, phụ thuộc & network cấp hệ thống

### 4.1. Phụ thuộc giữa module

```
AUTH ──▶ mọi module (mọi route đều đi trên cùng phiên socket sau login)
Số dư vàng (Header) ◀── đọc/ghi ── SHOP · GIFT · MAIL · DAILY · MISS · EVENT · SLEG · WHEEL · mọi game
SLEG ◀── điểm & nhiệm vụ cộng từ ── SLTC · SLAV · ALIEN   (theo tài liệu: chỉ 3 game Slot)
MISS ◀── tiến độ từ ── FISH ("bắn hạ cá X n lần") · WHEEL ("quay vòng quay 1 lần") · thắng ván
RANK ◀── điểm Cashgain/Kill/Damage từ ── FISH (Kill/Damage) · các game (Cashgain)
PERS (Record/Overview) ◀── thống kê từ ── FISH (số cá bắn, damage, thứ hạng Top)
INV ◀── súng mua từ ── SHOP (tab Gun) · trang bị dùng trong ── FISH
SHOP (Exchange DATA) · FISH (cá đặc biệt "Lucky Crocodile") ──▶ phần thưởng Data nhà mạng (tích hợp ngoài)
MAIL ◀── thư thưởng xếp hạng sự kiện ("Fish Event Ranking Rewards", "Fish Mascot Event Ranking Rewards")
```

### 4.2. Route socket quan sát được (thụ động, qua console bản `debug=true`)

| Nhóm | Route | Module |
|---|---|---|
| Phiên | `login` · `ping` (~3 s/lần) · `state` | `AUTH` |
| Sảnh | `getListPopups` · `getRollingTexts` (marquee) · `getText` · `activityWithBanner` · `checkEventOn` · `infoEventAnnualOn` · `crossServices` · `logGameOpen` · `getJackpot` · `SL1`/`SL4` (jackpot slot đẩy định kỳ) · `OnUpdateJackpot` · `onBcJackpot` (thông báo nổ hũ toàn server) | `LOBBY` |
| Sự kiện | `getEventPromotion` · `getListPromotionByEvent` · `listItemOnline` · `canGetBonus` · `goldRewardEvent` · `SlotLegendsDayMission` · `leaderboardWinnerSlotLegends` | `EVENT` · `SLEG` |
| Cửa hàng / Kho | `getMyPackageInfo` · `getFirstCashInPromotion` · `getExchangeShopItems` · `shopMyItem` · `getInventory` | `SHOP` · `INV` |
| Nhiệm vụ / Điểm danh / Thư | `getMyMissions` · `openMissionUI` · `getCheckInData` · `getListMailBox` | `MISS` · `DAILY` · `MAIL` |
| Xếp hạng / Vòng quay | `topCashGainWeek` · `leaderboardWinnerFish/Poker/Plinko/BauCua` · `getLuckySpin` | `RANK` · `WHEEL` |
| Thống kê | `getStatistic` | `PERS` |
| Bắn cá | `play` · `playDropCoins` · `quit` | `FISH` |
| Game bài/bàn | `skmGetRooms` · `skmJoin` · `skmBet` · `skmLeave` · `skmGetChatHistory` · `LobbyQuickPlay` · `LobbyGetRoomState` · `LobbyDoGameAction` · `LobbyLeaveRoom` · `LobbyRegInvite` · `baccaratJoin/GetState/Leave` · `bauCuaJoin/GetState/Leave` | `SHAN` · `POKER` · `BACA` · `MASC` |
| Slot / mini | `reactoonzInit/Leave` · `miniBauCuaJoin/GetState/Leave` · `tx1` (trạng thái phiên Over/Under, đẩy ~1 s/lần) · `chatTxHistory` · `mpkJp` | `ALIEN` · `MASCM` · `SUBM` · `MPK` |

HTTP ngoài socket: tải `cocos.zip` + tài nguyên tĩnh; `POST api.gameanalytics.com` (sự kiện phân tích, ví dụ `Poker:Click:Room_Legendary`).

> Danh sách trên chỉ gồm route **client tự phát sinh** khi khảo sát. Agent không gọi thử route nào. Route của thao tác chưa làm (quay slot, mua gói, nhận thưởng, nhập giftcode) chưa xuất hiện.

---

## 5. Ma trận phân quyền sơ bộ (cấp module)

Hệ thống có **1 vai trò** (Người chơi) → không có ma trận vai trò. Thay vào đó là ma trận theo **trạng thái account**:

| Chức năng | Account thường (`chicken`, `girlcute`) | Account VIP | Account đủ điều kiện nạp lần đầu | Chưa đăng nhập |
|---|---|---|---|---|
| Sảnh, 11 game, mini game | ✅ | ❔ | ❔ | ❌ — chỉ thấy PopupLogin |
| Lucky Wheel — quay | ❔ (popup mở được, chưa quay; luật ghi "Exclusive for VIP Players") | ❔ | — | ❌ |
| Nút `1st Top-up` | ❌ ẩn (đã kiểm chứng trên cây node: `active=false`) | ❔ | ❔ | ❌ |
| Nút `Tournament` | ❌ ẩn (đã kiểm chứng: `active=false`) | ❔ | ❔ | ❌ |
| Nhận thưởng Slot Legends | ❔ — tài liệu ghi "chỉ người dùng đang sub" | ❔ | — | ❌ |

`Tổng 20 ô = Đã kiểm chứng 6 · Suy diễn 0 · Chưa rõ 11 · Không áp dụng 3`. Mỗi trạng thái account chưa có = 1 câu hỏi trong AMB-FISH-07.

---

## 6. Thứ tự khảo sát đã chốt

User chốt 2026-10-16 (phương án "Ưu tiên Slot Legends"):

| Bước | Module | Lý do |
|---|---|---|
| 1 | `AUTH` | Cổng vào mọi module |
| 2 | `LOBBY` | Khung điều hướng, số dư, popup tự bật — mọi TC khác bắt đầu từ đây |
| 3 | `SLEG` | Ưu tiên của user; có tài liệu đề xuất → Hybrid |
| 4 | `EVENT` | Cùng popup với `SLEG` |
| 5–7 | `SLTC` → `SLAV` → `ALIEN` | 3 game Slot cấp điểm/nhiệm vụ cho `SLEG` |
| 8 | `FISH` | Game lõi, nhiều phụ thuộc nhất (`MISS`, `RANK`, `PERS`, `INV`) |
| 9–13 | `SHOP` → `INV` → `GIFT` → `PERS` → `MORE` | Ví/vật phẩm |
| 14–18 | `MISS` → `DAILY` → `MAIL` → `WHEEL` → `RANK` | Cơ chế giữ chân |
| 19–23 | `SHAN` → `BACA` → `POKER` → `MASC` → `PLINKO` | Game bài/bàn |
| 24–26 | `MASCM` → `SUBM` → `MPK` | Mini game |

**Module BLOCKED:** không có. Vùng **chưa cấp prefix** (`1st Top-up`, `Tournament`) xem [`../README.md`](../README.md) mục 1.

---

## 7. Vùng chưa xác minh & nghi vấn cấp hệ thống

### 7.1. Nghi vấn (đã ghi mã ở `../README.md` mục 3)

| Mã | Mức | Tóm tắt | Bằng chứng |
|---|---|---|---|
| AMB-FISH-01 | 🔴 | `login>>>>>` trả kèm trường `password`; client log nguyên văn tài khoản + mật khẩu ra console | Console bản test `debug=true` — **không chép giá trị** |
| AMB-FISH-02 | 🔴 | Shan tự vào bàn + tự gửi `skmBet`, trừ 50.000 vàng | `skmJoin` → `skmBet` liên tiếp; số dư 19.313.368 → 19.263.368 |
| AMB-FISH-03 | 🔴 | Poker tự vào bàn với 500.000 chip, mâu thuẫn buy-in 1.000.000–100.000.000; ván tự chạy | `LobbyQuickPlay` → `LobbyDoGameAction`; toast `Playing cannot quit` · `Canceled from leaving the table` |
| AMB-FISH-04 | 🟡 | Chuỗi chưa dịch / lẫn ngôn ngữ / sai chính tả | Nhãn đọc từ `cc.Label` |
| AMB-FISH-05 | 🟡 | Logout thành công vẫn hiện "Please try again." | `PopupAlert` bật cùng `PopupLogin` sau `onConfirm` |
| AMB-FISH-06 | 🟡 | Nút Guide gắn handler điểm danh, hành vi lần đầu khác lần sau | `btnGuide.clickEvents = onClickDiemDanhHangNgay`, `interactable=false` |
| AMB-FISH-07 | 🟡 | Điều kiện VIP / 1st Top-up / Tournament | Node ẩn |
| AMB-FISH-08 | 🟡 | Fish Hunter vào thẳng phòng (quick play) khi nhiều vàng, dừng ở chọn phòng khi ít vàng | `onClickFishHunter(true)`; so sánh `chicken` vs `girlcute` |
| AMB-FISH-09 | 🟢 | Mốc thời gian thật của Slot Legends | `Refresh in: 15d:…` |
| AMB-FISH-10 | 🟢 | Người chơi khác là bot hay người thật | Nickname dạng `user_861612`, `djickennc87` |
| AMB-FISH-11 | 🟢 | "Fish Mascot" trong panel MINI GAME mở bản nào | `MiniGamePanel/btnBauCua.onClickBauCua` |

### 7.2. Rủi ro kiểm thử cấp hệ thống

| Mã | Rủi ro | Giảm thiểu |
|---|---|---|
| RISK-FISH-01 | **Không có DOM / accessibility tree** — locator chuẩn (`getByRole`, `data-testid`) vô dụng; tên node do dev đặt tuỳ ý (`New Label`, `btnAdd` cho nút Home của Plinko, `page_2 copy`) | Thống nhất với dev: test hook / tên node ổn định cho các nút chính; ghi đường dẫn node đầy đủ trong tài liệu module |
| RISK-FISH-02 | Ở headless 1920×1080, click chuột vào **đúng tâm** các nút Events · SHOP · Missions · Activities **không được nhận**, trong khi Guide · Inventory · Leaderboards thì được. Phải phát `clickEvents` trực tiếp mới mở được | Điều tra ở bước recon `LOBBY` (lớp phủ trong suốt? vùng chạm khác hình vẽ?); nếu tái hiện trên trình duyệt thật → bug |
| RISK-FISH-03 | Mỗi game load **60–70 s** ở headless (WebGL phần mềm); popup lần đầu mở chậm > 10 s | Chờ theo điều kiện (scene/node xuất hiện), không chờ cố định; cân nhắc chạy headed có GPU cho đợt dài |
| RISK-FISH-04 | Kết quả ngẫu nhiên (RNG) + nhiều người chơi thời gian thực → kết quả không tái lập | Kiểm hành vi theo luật (trả thưởng đúng hệ số, cập nhật số dư khớp) thay vì kết quả cụ thể; xin chế độ seed/kịch bản từ dev nếu có |
| RISK-FISH-05 | Account test tiêu vàng (tự cược ở Shan/Poker) và **không có trang admin** để cộng lại | Xin cơ chế cấp vàng; theo dõi số dư đầu/cuối mỗi phiên test |
| RISK-FISH-06 | Bản test bật `debug=true&log=true` và gửi sự kiện thật tới GameAnalytics | Xác nhận bản production tắt log; lọc sự kiện test khỏi số liệu phân tích |

### 7.3. Tác động ngoài ý muốn trong lúc khảo sát (minh bạch)

| Thời điểm | Tác động | Nguyên nhân |
|---|---|---|
| 2026-10-16 | Số dư `chicken` đổi **19.313.368 → 19.459.690** (+146.322) | Shan tự cược 50.000 khi mở game (AMB-FISH-02); Poker tự vào bàn và một ván tự chạy, account thắng +195.000 (AMB-FISH-03); các thay đổi nhỏ còn lại không truy vết được |
| 2026-10-16 | Account `chicken` đã ngồi vào bàn Poker 6874, đã rời (`LobbyLeaveRoom` code 200) | Như trên |
| 2026-10-16 | Bật/tắt nhạc trong Settings một lần, đã trả về trạng thái ban đầu | Click helper bấm trúng nút con trong panel Settings |
| 2026-10-16 | Chuyển mức cược trong phòng bắn cá 50.000 → 25.000 (chỉ là cài đặt, không bắn) | Thao tác đóng panel MINI GAME bấm trúng nút giảm cược |

### 7.4. Chưa xác minh

| Vùng | Lý do |
|---|---|
| Route và phản hồi của mọi thao tác **tiêu/nhận** vàng (quay, cược, mua, nhận thưởng, nhập giftcode) | Khảo sát cấp hệ thống chỉ quan sát, không thực hiện |
| Validation của form Register | Không submit (tránh tạo account rác) |
| Nội dung T&C đầy đủ, các tab ẩn của Guide | Chỉ mở, chưa đọc hết |
| Luồng thanh toán `Ks` thật | Ngoài phạm vi UI |

---

## 8. Ghi chú kỹ thuật cho bước recon module

- Lấy cây node: `cc.director.getScene()`; popup nằm ở `Canvas/Popups/<PopupXxx>`, game dạng popup ở `Canvas/Games/<Game>`, overlay mini ở `App/Minigames/<Game>`; game scene riêng: `FishHunter`, `Reactoonz`, `Plinko`.
- Toạ độ click = tâm **chính node** (`convertToWorldSpaceAR` theo anchor) — **không** dùng `getBoundingBoxToWorld()` vì nó gộp node con (đã bấm nhầm vào panel Settings vì lỗi này).
- Ô nhập là textarea DOM ẩn (`cocosEditBox`) hiện ra khi node edit được focus → điền bằng `textarea:visible`.
- Chọn tab (`cc.Toggle`) bằng click chuột thật; gọi `toggle.check()` không kích hoạt nội dung tab.
- Đóng popup: nút `BtnClose`/`btnClose`/`btn_close`; **cẩn thận** `panelSetting/btnBack` là **Logout**, không phải nút quay lại.

---

## 9. Nhật ký khám phá

| Ngày | Mode | Thay đổi |
|---|---|---|
| 2026-10-16 | Recon `SLEG` | Bổ sung cho bản đồ: (1) phát hiện thêm route `SL2` (quay Treasure Chest/Avenger), `reactoonzSpin`, `ClaimTaskRewardSlotLegends`, `ClaimStreakRewardSlotLegends`, push `NoticeOfMission`; response không mang `route`, ghép theo `msgId`; (2) tab Slot Legends phải bấm bằng click chuột thật (`toggle.check()` không đổi nội dung) |
| 2026-10-16 | UI | Khảo sát lần đầu: 26 module, 26 prefix, 18 file khám phá, 26 ảnh evidence. Checkpoint: user xác nhận danh sách đủ, giữ ranh giới 26 module, thứ tự ưu tiên Slot Legends, môi trường không dùng chung, QA có API/socket + DevTools |
