# Khám phá module: Poker (`POKER`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Poker (Texas Hold'em) |
| Prefix | `POKER` |
| Đường vào | Sảnh → **Poker** (`onClickPoker`) → `Canvas/Games/Poker`. Account `chicken` được **xếp thẳng vào bàn** 6874 (blind 50K/100K, chip 500.000) — AMB-FISH-03 |
| Loại màn hình | Màn chọn phòng (`Room`) + bàn nhiều người |
| Status flow | Ngoài phòng → ngồi bàn (buy-in) → chờ đủ người (`Please wait! We need at least 1 more player`) → ván → rời bàn (sau khi hết ván; giữa ván báo `Playing cannot quit`) |
| Số phòng | 4 mức (`Amateur` · `Pro` · `VIP` · `Legendary`): Blind 500/1.000 (buy-in 5.000–20.000) · 5.000/10.000 (50.000–200.000) · 10.000/20.000 (100.000–1.000.000) · 50.000/100.000 (1.000.000–100.000.000) |
| Ước độ lớn | 30–45 REQ |
| Risk | 🔴 Cao — buy-in lớn, ván tự chạy, rời bàn có điều kiện |
| Evidence | [poker_overview_fullpage.png](../evidence/poker_overview_fullpage.png) (màn chọn phòng) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Bàn | Jackpot · `Table:` 6874 · `Blind:` 50,000/100,000 · ghế: nickname, chip (`lblGold`), tên bộ bài (`TWO PAIR`), tiền thắng (`+195,000`) · `POT` · `btnInvite` |
| Hand rank | `btnViewCardTypes` → 9 hạng từ `STRAIGHT FLUSH` tới `HIGH CARD` (nhãn có lỗi chữ: `FOUR OF KIND`, `THREE OF AKIND`) |
| Điều khiển | `btn_buy_in` · emoji · chat nhanh · `btnMenu` → `btn_back` (`onClickBack`) · `btn_changeTable` · ping |
| Màn chọn phòng | 4 thẻ `Play` · `btn_help` · `btn_close` (về sảnh) · `btnSetting` · toast `Playing cannot quit` / `Canceled from leaving the table` |

## Network

`LobbyQuickPlay` · `LobbyGetRoomState` (lặp) · `LobbyDoGameAction` · `LobbyLeaveRoom` (code 200) · `LobbyRegInvite` · GameAnalytics `Poker:Click:Room_Legendary`.

## Vùng chưa xác minh

- Buy-in 500.000 so với khoảng 1.000.000–100.000.000 của phòng (AMB-FISH-03).
- Hành động tự động khi tới lượt (`LobbyDoGameAction` không do người dùng bấm).
- Fold/Call/Raise/All-in, chia pot, mời bạn, đổi bàn.
