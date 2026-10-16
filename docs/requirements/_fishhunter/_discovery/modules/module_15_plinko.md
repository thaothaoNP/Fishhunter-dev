# Khám phá module: Plinko (`PLINKO`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Plinko |
| Prefix | `PLINKO` |
| Đường vào | Sảnh → **Plinko** (`onClickPlinko`) → **đổi scene** `Plinko` |
| Loại màn hình | Game thả bóng, 1 người |
| Status flow | Chờ → thả bóng → bóng rơi vào ô hệ số → trả thưởng |
| Ước độ lớn | 18–25 REQ |
| Risk | 🔴 Cao — giá bóng ~1,29 triệu vàng mặc định |
| Evidence | [plinko_overview_fullpage.png](../evidence/plinko_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Cấu hình | `Row` 8 (mặc định) · 12 · 14 · `Risk` `Low` (mặc định) · `Mid` · `High` |
| Ô hệ số (Row 8, Low) | ví dụ `2.1` · `3.6` · `0.9` · `1.1` · `0.5` … |
| Thả bóng | `Ball Price` `1291000` / `1297000` (giá đổi giữa hai lần vào) · `btnBetMinus` (½) · `btnBetPlus` (2×) · `Send Ball` |
| Khác | Số dư + `btnAdd` (`onClickAddCoin`) · nút Home — tên node **`btnAdd`** nhưng handler `onClickHome` (RISK-FISH-01) |

## Network

Chưa quan sát route riêng (chưa thả bóng).

## Vùng chưa xác minh

- Giá bóng mặc định tính theo gì (số dư?); bảng hệ số đầy đủ theo Row × Risk; thả nhiều bóng liên tiếp.
