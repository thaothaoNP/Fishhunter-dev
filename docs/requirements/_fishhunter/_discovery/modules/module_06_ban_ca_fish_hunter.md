# Khám phá module: Bắn cá Fish Hunter (`FISH`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Fish Hunter (nhãn `HOT`) |
| Prefix | `FISH` |
| Đường vào | Sảnh → thẻ **Fish Hunter** (`onClickFishHunter(true)`) → **đổi scene** `FishHunter`; account nhiều vàng (`chicken`, ~19 triệu) vào **thẳng phòng chơi** (quick play); account ít vàng (`girlcute`, 8 vàng) dừng ở **màn chọn phòng** `FishRooms` — AMB-FISH-08 |
| Loại màn hình | Game thời gian thực nhiều người (4 vị trí súng), màn chọn phòng |
| Status flow | Ngoài phòng → trong phòng (chọn phòng / quick play) → thoát. Kỹ năng: có lượt → đang dùng → hết |
| Số phòng | 3: `Fishermen` (tối thiểu 10 gold) · `Landlord` (100) · `Rich man` (1.000) — theo Guide |
| Ước độ lớn | 50–80 REQ |
| Risk | 🔴 Cao — mỗi phát bắn tiêu vàng, Auto bắn, jackpot, thưởng Data nhà mạng; nguồn dữ liệu cho `MISS`, `RANK`, `PERS`, `INV` |
| Evidence | [fish_overview_fullpage.png](../evidence/fish_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| FishRooms | `Room1 Fishermen` · `Room2 Landlord` · `Room3 Rich man` · `btnBack` (`onClickBack`, về sảnh) |
| Phòng chơi — súng của mình | `btnMinus` / `btnAdd` (mức cược, quan sát 25.000 / 50.000) · nickname · số dư · `btnChangeGun` |
| Phòng chơi — người khác | Nickname, số dư, mức cược của tối đa 3 người khác (số dư của họ thay đổi trực tiếp) |
| Thanh trái | `toggleAuto` (AUTO ON/OFF) · `fireX2` (còn 4 lượt) · `fireX4` (0) · `snipe` (0) · `freeze` (0) |
| Menu | `btnMenu` (`toggleShow`) → `btnBack` · `btnHelp` · `toggleSound` · `toggleMusic` |
| Khác | Jackpot phòng (`182,621,026` / `365,034,144` — khác nhau giữa các lần vào) · độ trễ `lblPing` (400–800 ms) · `touchPad` (vùng chạm để bắn) · cá là node có `cc.Button` |
| PopupGuideSpecialFish | Tiêu đề `FISH HUNTER` · `Lucky Crocodile` — "Catching crocodiles while hunting will receive Data rewards: 50 MB, 100 MB, 500MB … GB. Limited quantity" · nút `Continue`; tự bật khi vào phòng, mở lại qua `btnHelp` |

## Network

`play` (vào phòng) · `playDropCoins` · `quit` (thoát) · `getJackpot`. Route bắn/trúng cá chưa quan sát (không bắn).

## Vùng chưa xác minh

- Bắn, trúng cá, hệ số thưởng từng loại cá, rơi vàng.
- Kỹ năng x2/x4/Snipe/Freeze: cách có lượt, hiệu lực.
- Auto bắn (tiêu vàng liên tục) — chỉ thử trên account có vàng.
- Đổi súng ↔ súng trang bị ở `INV`; điều kiện vào từng phòng khi không đủ vàng.
- Phần thưởng Data khi bắt cá sấu (tích hợp nhà mạng — QA không kiểm được tầng này).
