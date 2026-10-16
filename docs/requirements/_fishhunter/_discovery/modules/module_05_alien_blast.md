# Khám phá module: Alien Blast (`ALIEN`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Alien Blast (nhãn `NEW`; game mới tháng 9/2026 theo tài liệu Slot Legends) |
| Bí danh | Reactoonz (tên node `btnReactoonz`, scene `Reactoonz`) |
| Prefix | `ALIEN` |
| Đường vào | Sảnh → thẻ **Alien Blast** (`onClickReactoonz`) → **đổi scene** `Reactoonz` |
| Loại màn hình | Game slot dạng lưới (cluster) — `Board`, `double`, `HUD` |
| Status flow | `PRESS SPIN TO BEGIN` → quay → trả thưởng; Autoplay |
| Ước độ lớn | 20–30 REQ |
| Risk | 🔴 Cao — tiêu vàng, mức cược tối đa 500.000/lượt, cấp điểm cho `SLEG` |
| Evidence | [alien_overview_fullpage.png](../evidence/alien_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| HUD | `Balance:` + số dư · `Bet:` + mức hiện tại · `btn_plus` (đang **disabled** khi ở mức cao nhất) / `btn_minus` · danh sách 9 mức cược `1000 · 2000 · 5000 · 10000 · 20000 · 50000 · 100000 · 200000 · 500000` · `btn_info` · `btn_spin` · `btn_autoplay` · `btn_up`/`btn_down` |
| Khác | `btnBack` (`onClickBack`, về sảnh) · `FrameEffect` · `TextEffect` |
| Quan sát | Mức cược mặc định khi vào là **500000** (mức cao nhất) — cần xác nhận có phải nhớ mức lần trước hay mặc định tối đa |

## Network

`reactoonzInit` (khi vào) · `reactoonzLeave` (khi thoát).

## Vùng chưa xác minh

- Luật cụm, hệ số `double`, nội dung `btn_info`.
- Mức cược mặc định (AMB khi recon nếu mặc định là tối đa).
