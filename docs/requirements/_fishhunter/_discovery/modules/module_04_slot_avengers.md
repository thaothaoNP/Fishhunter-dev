# Khám phá module: Slot Avengers (`SLAV`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Avengers (nhãn `NEW`) |
| Prefix | `SLAV` |
| Đường vào | Sảnh → thẻ **Avengers** (`onClickSlotAvengers`) → `Canvas/Games/SlotAvengers` |
| Loại màn hình | Game slot, 20 dòng |
| Status flow | Lượt quay: chờ → quay → trả thưởng; Auto; Boost; Free spin |
| Ước độ lớn | 25–35 REQ |
| Risk | 🔴 Cao — tiêu vàng, jackpot 3 mức, cấp điểm cho `SLEG` |
| Evidence | [slav_overview_fullpage.png](../evidence/slav_overview_fullpage.png) |

## Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Topbar | Số dư · `btnhuongdan` (hướng dẫn) · `btnBack` · `btnRank` · `btnlichsu` (lịch sử) · `btnMenu` · jackpot `20,034,260` · Free spin · nickname |
| Footer | `btnSpin` · `btnAuto` · `btnBet` (`VALUE` 10,000) · `btnLine` (`LINES` 20) · `btnBoost` · tổng `200,000` · `WIN NOW` |
| Chuỗi | Nhãn `lblWinNow` hiển thị `Total Value`, nhãn `lblTotalBet` hiển thị `WIN NOW` — tên node và chữ hiển thị **đảo nhau**, cần kiểm vị trí trên ảnh khi recon |

## Network

`SL1` (jackpot, có thêm `name: fishAvenger`) · `logGameOpen`.

## Vùng chưa xác minh

- Bảng trả thưởng, Free spin, jackpot; nội dung hướng dẫn và lịch sử.
- Khác biệt luật giữa Avengers và Treasure Chest (cùng bố cục 20 dòng).
