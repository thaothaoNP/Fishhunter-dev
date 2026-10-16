# Khám phá module: Cửa hàng / Nạp (`SHOP`) và Kho đồ (`INV`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

---

## `SHOP` — Cửa hàng / Nạp

| Mục | Giá trị |
|---|---|
| Tên trên UI | SHOP |
| Prefix | `SHOP` |
| Đường vào | 3 cửa: thanh dưới **SHOP** (`onClickShop`) · nút `+` cạnh số dư (`onClickAddGold`) · nút nổi **Promotions** — đều mở `Canvas/Popups/PopupShop` |
| Loại màn hình | Popup 3 tab |
| Status flow | Gói: có thể mua → đang thanh toán → đã cộng vàng (chưa quan sát) |
| Ước độ lớn | 30–40 REQ |
| Risk | 🔴 Cao — tiền thật (`Ks`), đổi Data nhà mạng |
| Evidence | [shop_overview_fullpage.png](../evidence/shop_overview_fullpage.png) |

### Thành phần quan sát được

| Tab | Thành phần |
|---|---|
| `Packages` (mặc định) | 12 gói, mỗi gói có nút giá `btnPurchase` và mô tả tiếng Miến Điện "mua N vàng": 99 Ks → 30.000 · 199 → 60.000 · 399 → 120.000 (+25%) · 599 → 180.000 (+20%) · 999 → 300.000 · 1999 → 600.000 (+18%) · 2999 → 900.000 · 3999 → 1.200.000 (+17%) · 5999 → 1.800.000 (+15%) · 9999 → 3.000.000 · 19999 → 6.000.000 (tỷ lệ cơ sở ~300 vàng/Ks; nhãn bonus % chỉ có ở một số gói) |
| `Exchange DATA` | Đổi vàng lấy Data — chưa mở nội dung |
| `Gun` | Shop súng — chưa mở nội dung |

### Network

`getMyPackageInfo` · `getFirstCashInPromotion` · `getExchangeShopItems` · `shopMyItem`.

### Vùng chưa xác minh

- Luồng thanh toán khi bấm `btnPurchase` (không bấm) — cổng nạp nhà mạng nằm ngoài phạm vi UI.
- Bonus % có cộng thật không, khuyến mãi nạp lần đầu (`1st Top-up` đang ẩn).
- Nội dung tab Exchange DATA và Gun.

---

## `INV` — Kho đồ

| Mục | Giá trị |
|---|---|
| Tên trên UI | INVENTORY |
| Bí danh | Kho đồ (`btnKhoDo`, `PopupKhoDo`) |
| Prefix | `INV` |
| Đường vào | Thanh dưới → **Inventory** (`onClickKhoDo`) |
| Loại màn hình | Popup: nhóm vật phẩm × tab phòng × danh sách + chi tiết |
| Status flow | Súng: sở hữu → đang trang bị |
| Ước độ lớn | 12–18 REQ |
| Risk | 🟡 Trung bình |
| Evidence | [inv_overview_fullpage.png](../evidence/inv_overview_fullpage.png) |

### Thành phần quan sát được

Nhóm `Gun` (`SungSan`) · tab phòng `Fishermen` / `Landlord` / `Rich man` · danh sách `List` · chi tiết súng đang chọn `Gun1`: `Gun effect` — `Speed: 1.00` · `Damage: 1.00` · `Time: Unlimited` · nút `Equip`.

### Network

`getInventory` · `shopMyItem`.

### Vùng chưa xác minh

- Súng có thời hạn (Time khác `Unlimited`), trang bị theo từng phòng, hiệu lực trong `FISH`.
