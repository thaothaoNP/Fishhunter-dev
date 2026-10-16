# Khám phá module: Fish Submarine (`SUBM`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Fish Submarine |
| Bí danh | Tài xỉu (`btnTX`, `App/Minigames/TX`) |
| Prefix | `SUBM` |
| Đường vào | Sảnh → **Fish Submarine** (`onClickTX`) hoặc panel MINI GAME → overlay trong `App/Minigames` (đã quan sát bật đè lên scene Plinko) |
| Loại màn hình | Overlay mini + khung chat |
| Status flow | Phiên `#2055765`: nhận cược (đếm ngược) → lắc → kết quả (điểm) → phiên mới; trạng thái đẩy mỗi ~1 s (`tx1`, `GameState` 0/1/2) |
| Ước độ lớn | 20–25 REQ |
| Risk | 🔴 Cao — cược vàng, chat công khai |
| Evidence | [subm_overview_fullpage.png](../evidence/subm_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Cửa | `Over` (tổng `26,182,300`, của mình `0`, số người) · `Under` (`29,185,600`) · `btnBetTai` / `btnBetXiu` (`CHOOSE`) |
| Thông tin | `lbSession` · kết quả `lbScore` · đồng hồ · lịch sử 15 chấm |
| Nút | `btnHistory` · `btnStatistic` · `btnHelp` · `btnRank` · `btnChat` · `btnClose` |
| Chat | Danh sách tin · ô `Enter text here...` (editbox Unicode tiếng Việt `VietUni.CVietEditbox`) · `btnSend` |
| PopupHelp | `How to play:` dự đoán OVER/UNDER, nhập số vàng, Confirm/Cancel, "A successful placing of coins cannot be canceled"; `Scoring Method` 1–5 điểm; ô `Don't show again` |

## Network

`tx1` (trạng thái phiên: `BigCount`, `BigMoney`, `Dices`, `GameState`, `Histories`, `RemainTime`) · `chatTxHistory`.

## Vùng chưa xác minh

- Luật Over/Under theo tổng xúc xắc, hoa hồng, giới hạn cược, chat (lọc từ, độ dài).
