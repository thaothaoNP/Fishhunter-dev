# Khám phá module: Slot Treasure Chest (`SLTC`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Treasure Chest (nhãn `HOT`) |
| Bí danh | Slot Thủy Cung (tên node `btnSlotThuyCung`, `Games/SlotThuyCung`) |
| Prefix | `SLTC` |
| Đường vào | Sảnh → thẻ **Treasure Chest** (handler `onClickSlotThuyCung`) → mở dạng popup game trong `Canvas/Games` (không đổi scene) |
| Loại màn hình | Game slot 5 cuộn, 20 dòng |
| Status flow | Lượt quay: chờ → quay → trả thưởng; chế độ thường / Auto / Fast; Free spin |
| Ước độ lớn | 25–35 REQ |
| Risk | 🔴 Cao — tiêu vàng mỗi lượt, jackpot 3 mức, cấp điểm/nhiệm vụ cho `SLEG` |
| Evidence | [sltc_overview_fullpage.png](../evidence/sltc_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Header | Jackpot `20,023,403` · nickname · số dư · `btnBack` (`onClickBack`) · số Free spin `lblFreeSpin` · `btnRank` · `btnMenu` |
| Footer | `SPIN` · `AUTO` · Value `10,000` với `btnBetUp` / `btnBetDown` · `Lines` `20` (`btnLine`) · `FAST` (`btnBoost`) · tổng cược `200,000` (= 10.000 × 20 dòng) · `Win` |
| Ở sảnh | Thẻ game hiển thị 3 mức jackpot trực tiếp (~500K · ~3M · ~20M), cập nhật qua `SL1` |
| Chuỗi lỗi | Nhãn tổng cược hiển thị **`Apuesta total`** (tiếng Tây Ban Nha) — AMB-FISH-04 |

## Network

`SL1` (jackpot 3 mức `Jackpot100/1000/10000`, đẩy ~10 s) · `logGameOpen`. Route quay chưa quan sát (chưa quay).

## Vùng chưa xác minh

- Bảng trả thưởng, luật dòng, Free spin, điều kiện nổ jackpot (mức jackpot theo mức cược 100/1.000/10.000?).
- Nội dung `btnMenu` (hướng dẫn, lịch sử) và `btnRank`.
- Cộng điểm/nhiệm vụ `SLEG` sau mỗi lượt.
