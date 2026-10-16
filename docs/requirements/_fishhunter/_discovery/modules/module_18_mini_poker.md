# Khám phá module: Mini Poker (`MPK`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Mini Poker |
| Prefix | `MPK` |
| Đường vào | Nút nổi **MINI GAME** → panel → **Mini Poker** (`onClickMiniPoker`) → overlay `App/Minigames/MiniPoker` |
| Loại màn hình | Overlay mini slot 5 lá bài |
| Status flow | Lượt quay: chờ → quay → trả thưởng theo bộ bài; Auto Spin; Fast Mode |
| Ước độ lớn | 15–20 REQ |
| Risk | 🔴 Cao — tiêu vàng, jackpot ~500 triệu |
| Evidence | [mpk_overview_fullpage.png](../evidence/mpk_overview_fullpage.png) |

## Thành phần quan sát được

`Spin` · mức cược `1K` · `10K` · `100K` (mặc định 100K) · jackpot `500,042,000` · `Auto Spin` (`btnQuayTuDong`) · `Fast Mode` (`btnSieuToc`) · `btnHistory` · `btnJP` · `btnTop` · `btnRule` · `btnClose`.

## Network

`mpkJp` (jackpot, đẩy định kỳ).

## Vùng chưa xác minh

- Bảng trả thưởng theo bộ bài, điều kiện nổ jackpot theo mức cược, Auto Spin dừng khi nào.
