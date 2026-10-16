# Khám phá module: Vòng quay may mắn (`WHEEL`) và Bảng xếp hạng (`RANK`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

---

## `WHEEL` — Vòng quay may mắn

| Mục | Giá trị |
|---|---|
| Tên trên UI | Activities → Lucky Wheel |
| Prefix | `WHEEL` |
| Đường vào | Thanh dưới → **Activities** (`btnLuckyWheel`, handler `setActive(true)`) → menu trung gian có nút **Lucky Wheel** → `PopupLuckyWheel` |
| Loại màn hình | Popup vòng quay + luật + xếp hạng |
| Status flow | Lượt quay: còn lượt (`lblCount`) → quay → nhận giải |
| Ước độ lớn | 15–20 REQ |
| Risk | 🔴 Cao — "Use Gold to spin", giải có vật phẩm giá trị (ảnh vòng quay có iPhone 16 Pro Max); chỉ cho VIP |
| Evidence | [wheel_overview_fullpage.png](../evidence/wheel_overview_fullpage.png) (menu trung gian Activities) |

### Thành phần quan sát được

Số dư + `btnAdd` · nickname · `btnSpin` (`SPIN`, số lượt `lblCount` = 0, giá `20000`) · khối `RULE`: "Lucky Wheel - Exclusive for VIP Players! Rules: - Use Gold to spin and receive v…" · `btnRank`.

### Network

`getLuckySpin`.

### Vùng chưa xác minh

- Điều kiện VIP (AMB-FISH-07); quay khi không phải VIP / hết lượt / không đủ vàng; danh sách giải và cách trao giải hiện vật.

---

## `RANK` — Bảng xếp hạng

| Mục | Giá trị |
|---|---|
| Tên trên UI | LEADERBOARDS |
| Prefix | `RANK` |
| Đường vào | Thanh dưới → **Leaderboards** (`onClickLeaderBoard`) |
| Loại màn hình | Popup: 3 tiêu chí × 2 kỳ |
| Status flow | Kỳ xếp hạng tuần/tháng: đang tính → chốt → trao thưởng (qua `MAIL`?) |
| Ước độ lớn | 15–20 REQ |
| Risk | 🟡 Trung bình |
| Evidence | [rank_overview_fullpage.png](../evidence/rank_overview_fullpage.png) |

### Thành phần quan sát được

Tiêu chí `Cashgain` (mặc định) · `Kill` · `Damage` · kỳ `Weekly` (mặc định) / `Monthly` · top 3 có huy hiệu + danh sách từ hạng 4 · dòng của mình ghim cuối (`99+`, `chicky`, `0`) · `btnRule` · `btnHistory`. Điểm rút gọn kiểu `4K`.

### Network

`topCashGainWeek` · `leaderboardWinnerFish/Poker/Plinko/BauCua`.

### Vùng chưa xác minh

- Nguồn điểm từng tiêu chí (chỉ bắn cá hay mọi game); giờ chốt kỳ; nội dung Rule/History; phần thưởng.
