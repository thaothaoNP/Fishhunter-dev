# Khám phá module: Baca Ocean (`BACA`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Baca Ocean |
| Bí danh | Baccarat (`btnBaccarat`, `Games/Baccarat`) |
| Prefix | `BACA` |
| Đường vào | Sảnh → **Baca Ocean** (`onClickBaccarat`). Account `girlcute` (8 vàng) thấy popup **Choose the playroom**; account `chicken` vào thẳng bàn |
| Loại màn hình | Chọn phòng + bàn cược 3 cửa |
| Status flow | Phiên: nhận cược → khoá → mở bài → trả thưởng |
| Số phòng | 4: `Crab` (2,000) · `Turtle` (10,000) · `Octopus` (10,000) · `Shark` (50,000) |
| Ước độ lớn | 25–35 REQ |
| Risk | 🔴 Cao — cược vàng |
| Evidence | [baca_overview_fullpage.png](../evidence/baca_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Bàn | 3 cửa `player` · `banker` · `tie` |
| Bottom | `Call` (`btnBet`) · `Get more` (disabled) · `Cancel call` (disabled) · 5 chip `50K` · `60K` · `70K` · `80K` · `100K` (mặc định 100K) · `btnPrevChip` · `btn_chat` · `btn_info` |
| Top | `btnBack` (`onClickBackToSelectRoom`) · `btn_menu` |

## Network

`baccaratJoin` · `baccaratGetState` · `baccaratLeave`.

## Vùng chưa xác minh

- Tỷ lệ trả 3 cửa, hoa hồng banker, giới hạn cược theo phòng.
- Chip trên bàn (50K–100K) so với mức phòng (2.000–50.000) — đơn vị có khớp không.
