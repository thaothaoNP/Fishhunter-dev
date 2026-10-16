# Khám phá module: Shan KoeMee (`SHAN`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Shan KoeMee (nhãn `NEW`) — game bài Myanmar |
| Prefix | `SHAN` |
| Đường vào | Sảnh → **Shan KoeMee** (`onClickShanKoeMee`) → `Canvas/Games/ShanKoeMee`. Khi mở, account `chicken` được **xếp thẳng vào bàn** (blind 50.000–5.000.000) — AMB-FISH-02 |
| Loại màn hình | Màn chọn phòng (`SelectRoom`) + bàn chơi nhiều người |
| Status flow | Ngoài phòng → trong bàn → ván: chờ (đồng hồ `lblClock`) → cược → chia bài → kết quả → rời bàn |
| Số phòng | 4: `Amateur` 1K~100K · `Pro` 50K~5M · `Vip` 2M~200M · `Legendary` 500M~50B |
| Ước độ lớn | 30–40 REQ |
| Risk | 🔴 Cao — tự cược khi vào bàn, tiền cược lớn, nhiều người chơi |
| Evidence | [shan_overview_fullpage.png](../evidence/shan_overview_fullpage.png) (màn chọn phòng, có panel MINI GAME đè giữa — không chụp lại để tránh tự cược thêm) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Bàn | Đồng hồ đếm · tối đa 4 người: nickname, số dư, mức cược (`50K`) · `blindTable` ` 50,000-5,000,000 ` · `chips` |
| Top | `btnBack` (`onClickBackToSelectRoom` — về màn chọn phòng, không về sảnh) · `btn_menu` · `btnJackpot` (jackpot `1,000,196,012`) · `btnGuild` |
| Bottom | `btn_chat` |
| SelectRoom | 4 nút phòng `Play` · `btnBack` (`onClickBack` — về sảnh) · `btnGuild` |

## Network

`skmGetRooms` · `skmJoin` → **`skmBet`** (tự gửi, không do người dùng bấm) · `skmGetChatHistory` · `skmLeave`.

## Vùng chưa xác minh

- Luật Shan KoeMee (điểm bài, nhà cái, ăn/thua), cược tay, chat, Guild, jackpot.
- Tự cược khi vào bàn là thiết kế hay lỗi (AMB-FISH-02).
