# Khám phá module: Sự kiện Slot Legends (`SLEG`) và Sự kiện + Quà online (`EVENT`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

Hai module nằm chung popup `App/Minigames/PopupEvents` (mở từ nút **Events** ở thanh dưới), mỗi tab là một module vì có vòng đời và luật thưởng riêng.

---

## `SLEG` — Sự kiện Slot Legends

| Mục | Giá trị |
|---|---|
| Tên trên UI | Slot Legends (tab `Event:Event Slot`) |
| Bí danh | Slot Legends Event — theo [`sources/Slot_Legends_Event.md`](../sources/Slot_Legends_Event.md) |
| Prefix | `SLEG` |
| Đường vào | Events → tab **Slot Legends** (phải click chuột thật vào tab; `toggle.check()` không đổi nội dung) |
| Loại màn hình | Tab gồm 3 khối: Bảng xếp hạng · Nhiệm vụ ngày · Thanh tiến trình Star |
| Status flow | Kỳ sự kiện: đang diễn ra → kết thúc (lưu điểm, xét thưởng, reset). Nhiệm vụ: chưa xong → xong → đã nhận. Mốc Star: khoá → mở → đã nhận |
| Ước độ lớn | 30–45 REQ |
| Mức phủ tài liệu | 🟨 Một phần — tài liệu là **bản đề xuất**: có luật điểm, cấu trúc 4 phần, điều kiện nhận thưởng (người dùng đang sub); thiếu mốc thời gian, chưa rõ đã chốt hay chưa |
| Risk | 🔴 Cao — trao thưởng (vàng, vật phẩm, giải cuối kỳ), phụ thuộc 3 game Slot, có điều kiện "đang sub" chưa kiểm chứng được |
| Evidence | [sleg_overview_fullpage.png](../evidence/sleg_overview_fullpage.png) |

### Thành phần quan sát được (2026-10-16, account `girlcute`)

| Khối | Thành phần |
|---|---|
| Đầu tab | `Refresh in: 15d:07:59:03` (đếm ngược hết kỳ) |
| Bảng xếp hạng | `My ranking : 0` · `My Score : 0` · `Refresh in: 00:52` (đếm ngược thứ hai — chưa rõ là gì) · nút `Rule` · top 3: `hungnv12` 7695 · `sung001` 833 · `Hung Nguyen` 498 |
| Nhiệm vụ ngày | 5 dòng: `Get 10 wins in 1 session` (0/1) · `Complete 5 Slot sessions` (0/5) · `Get 20 wins in 1 session` · `Spin 300 times in total` (0/300) · `Win a total of 20,000,000 gold` (0/20000000); mỗi dòng có phần thưởng (`x5000`, `x10`, `x2`, `x1`) và nút `Go` |
| Tiến trình Star | Số Star hiện có `0` · 5 mốc **50 · 150 · 350 · 700 · 1200** · nút quà |
| Gợi ý | `Try your luck` |

### Đối chiếu nhanh với tài liệu

| Nội dung tài liệu | Trên UI | Ghi chú |
|---|---|---|
| 4 phần: BXH · nhiệm vụ ngày · thưởng tiến trình Star · giải cuối kỳ | Thấy 3 phần; giải cuối kỳ chưa thấy trên tab | Kiểm ở nút `Rule` khi recon |
| Mỗi ngày 5 nhiệm vụ ngẫu nhiên từ kho | Có đúng 5 nhiệm vụ | Khớp |
| Áp dụng 3 game Slot (Treasure Chest, Avenger, Alien Blast) | Có 3 game ở sảnh | Chưa kiểm chứng việc cộng điểm |
| Thời gian dự kiến 30 ngày, chưa xác định mốc | Còn 15 ngày | AMB-FISH-09 |
| Nhận thưởng chỉ dành cho người dùng đang sub | Không thấy chỉ báo sub trên UI | Cần account đang sub (AMB-FISH-07) |

### Network

`SlotLegendsDayMission` · `leaderboardWinnerSlotLegends` · `checkEventOn` · `getEventPromotion`.

### Vùng chưa xác minh

- Nội dung popup `Rule`, cách tính điểm thật khi quay (+1 khi thắng, +1 mỗi 50.000 vàng thắng theo tài liệu).
- Ý nghĩa đếm ngược `00:52` so với `15d`.
- Nhận thưởng nhiệm vụ / mốc Star; điều kiện "đang sub".

---

## `EVENT` — Sự kiện (khung) + Quà online

| Mục | Giá trị |
|---|---|
| Tên trên UI | Events · tab `Online Gifts` |
| Prefix | `EVENT` |
| Đường vào | Thanh dưới → **Events** (click chuột không mở được ở headless — RISK-FISH-02) |
| Loại màn hình | Popup nhiều tab |
| Status flow | Mốc quà online: chưa tới giờ → nhận được (`canGet`) → đã nhận |
| Ước độ lớn | 12–18 REQ |
| Risk | 🟡 Trung bình — phần thưởng nhỏ cố định theo thời gian online |
| Evidence | [event_overview_fullpage.png](../evidence/event_overview_fullpage.png) |

### Thành phần quan sát được

| Khối | Thành phần |
|---|---|
| Danh sách tab | `Online Gifts` · `Slot Legends` (danh sách tab do server trả — có thể đổi theo sự kiện đang bật) |
| Online Gifts | `Next reward time: 08:29` · 6 mốc: 1 phút `x100` · 5 phút `x300` · 10 phút `x500` · 15 phút `x800` · 30 phút `x1000` · 60 phút `x1500` · nút nhận `canGet` |

### Network

`listItemOnline` · `canGetBonus` · `goldRewardEvent` · `getListPromotionByEvent` · `infoEventAnnualOn`.

### Vùng chưa xác minh

- Bộ đếm online có reset khi thoát game / đổi ngày không; mốc nào reset theo ngày.
- Các tab sự kiện khác khi server bật (King of Fishing đã nhắc trong tài liệu Slot Legends).
