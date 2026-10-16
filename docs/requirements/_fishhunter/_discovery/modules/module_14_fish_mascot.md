# Khám phá module: Fish Mascot — bản bàn (`MASC`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Fish mascot |
| Bí danh | Bầu cua (`btnBauCua`, `Games/BauCua`) |
| Prefix | `MASC` |
| Đường vào | Sảnh → **Fish mascot** (`onClickBauCua`) → `Canvas/Games/BauCua`. Account không đủ vàng (`girlcute`, 8) nhận `PopupConfirm`: `Not enough cash to join Bau Cua` · `Cancel` · `Get More Gold` |
| Loại màn hình | Bàn cược 6 cửa, nhiều người |
| Status flow | Phiên: `playing` / đếm ngược → mở kết quả → trả thưởng |
| Ước độ lớn | 20–30 REQ |
| Risk | 🔴 Cao — cược vàng, kiểm tra số dư tối thiểu khi vào |
| Evidence | [masc_overview_fullpage.png](../evidence/masc_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Bàn | 6 cửa `huou` · `bau` · `ga` · `ca` · `cua` · `tom` (hình con vật biển) · luật trả `Single-1:1` · `Double-1:2` · `Triple-1:3` · trạng thái `playing` · số người `5 playing` |
| Lịch sử | `RECENT` (cuộn) · `btnSessionHistory` |
| Chip | `1000` · `5000` · `50000` · `100000` · `500000` · `btnPrev` · nhãn `GOLD` |
| Khác | Toast `<nickname> joined` · `btnBack` (`onClickBack`, về sảnh) · `btnSetting` · `DragButton` |

## Network

`bauCuaJoin` · `bauCuaGetState` · `bauCuaLeave`.

## Vùng chưa xác minh

- Số dư tối thiểu để vào (ngưỡng thật), luật trả thưởng, giới hạn cược, huỷ cược.
