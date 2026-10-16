# Khám phá module: Fish Mascot Mini (`MASCM`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Fish mascot Mini (sảnh) · popup tiêu đề `Fish Mascot` |
| Bí danh | Bầu cua mini (`btnBauCuaMini`, `App/Minigames/BauCuaMini`) |
| Prefix | `MASCM` |
| Đường vào | Sảnh → **Fish mascot Mini** (`onClickBauCuaMini`) → overlay trong `App/Minigames` (sống xuyên scene); panel MINI GAME có nút "Fish Mascot" — chưa rõ mở bản nào (AMB-FISH-11) |
| Loại màn hình | Overlay mini đè lên màn hình hiện tại |
| Status flow | Phiên `#501056`: đếm ngược `lbClock` → kết quả → phiên mới |
| Ước độ lớn | 15–20 REQ |
| Risk | 🔴 Cao — cược vàng, chạy song song khi đang chơi game khác |
| Evidence | [mascm_overview_fullpage.png](../evidence/mascm_overview_fullpage.png) |

## Thành phần quan sát được

6 cửa (`0`–`5`) mỗi cửa hiện tổng cược toàn server (`168,842,000`…) · 2 nút chọn chip (toggle) · `Bet x2` (disabled) · `Bet Again` (disabled) · `btnHistory` · `btnHelp` · `btnRank` · `btnSessionHistory` · `btnClose` (`onClickClose`) · nền mờ `blur`.

## Network

`miniBauCuaJoin` · `miniBauCuaGetState` · `miniBauCuaLeave` · `OnMiniBauCuaLeave` (đẩy khi người khác rời, kèm `numberOfPlayer`).

## Vùng chưa xác minh

- Luật trả thưởng (có giống `MASC`?), x2 / cược lại, rời overlay khi đã cược.
