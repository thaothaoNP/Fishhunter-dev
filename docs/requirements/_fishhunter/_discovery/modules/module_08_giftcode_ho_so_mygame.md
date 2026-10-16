# Khám phá module: Giftcode (`GIFT`) · Hồ sơ cá nhân (`PERS`) · My Game (`MORE`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

`GIFT` và `PERS` nằm chung popup `Canvas/Popups/PopupPersonal` (tab `Giftcode` là một tab của Personal) nhưng tách module vì Giftcode có entity riêng (mã quà dùng/hết hạn) và cộng vàng.

---

## `GIFT` — Giftcode

| Mục | Giá trị |
|---|---|
| Tên trên UI | Giftcode |
| Prefix | `GIFT` |
| Đường vào | Header → **Giftcode** (`onClickGiftcode`) → PopupPersonal, tab `Giftcode` được chọn sẵn · hoặc Avatar → tab Giftcode |
| Loại màn hình | Tab form 1 field |
| Status flow | Mã: hợp lệ → đã dùng / hết hạn / không tồn tại (chưa quan sát) |
| Số field | 1 — `edbCode` (`maxLength 36`), gợi ý `Enter the code you want to use.` · nút `Confirm` (node tên `btnExchangeData`) |
| Ước độ lớn | 10–15 REQ |
| Risk | 🔴 Cao — cộng vàng/vật phẩm; nguy cơ dùng lại mã |
| Evidence | [gift_overview_fullpage.png](../evidence/gift_overview_fullpage.png) |

### Vùng chưa xác minh

- Thông báo lỗi khi mã rỗng / sai / đã dùng / hết hạn; phần thưởng khi đúng. Cần PO cấp mã test.
- Mã hiển thị ở `MORE` (`Giftcode: ----------`) liên quan gì tới tab này.

---

## `PERS` — Hồ sơ cá nhân

| Mục | Giá trị |
|---|---|
| Tên trên UI | Personal |
| Prefix | `PERS` |
| Đường vào | Header → **Avatar** (`onClickPersonal`) |
| Loại màn hình | Popup 4 tab: `Record` (mặc định) · `Prize` · `Giftcode` (→ `GIFT`) · `Overview` |
| Ước độ lớn | 15–20 REQ |
| Risk | 🟡 Trung bình — chỉ hiển thị, nhưng số liệu phải khớp với `FISH`/`RANK` |
| Evidence | [pers_overview_fullpage.png](../evidence/pers_overview_fullpage.png) |

### Thành phần quan sát được (tab Record, account `chicken`)

`Amount of gold:` 19.313.368 · `Number of fish shot:` 4 (`Top23`) · `Damage:` 950.000 (`Top18`) · nút `Share` (biểu tượng Facebook) · số dư + nút `+` ở góc.

### Network

`getStatistic`.

### Vùng chưa xác minh

- Nội dung tab `Prize`, `Overview`; hành vi nút `Share` (mở Facebook?); đổi avatar/nickname có không.

---

## `MORE` — My Game

| Mục | Giá trị |
|---|---|
| Tên trên UI | My Game · popup tiêu đề `ENTERTAINMENT APPS` |
| Prefix | `MORE` |
| Đường vào | Header → **My Game** (`onClickMoreGame`) → `PopupMoreGame` |
| Loại màn hình | Popup lưới ứng dụng (4 thẻ, có nút `PLAY` / `GET NOW`) |
| Ước độ lớn | 5–8 REQ |
| Risk | 🟢 Thấp — liên kết ra ứng dụng khác |
| Evidence | [more_overview_fullpage.png](../evidence/more_overview_fullpage.png) |

### Thành phần quan sát được

Thẻ `Play` kèm `Giftcode: ----------` (mã chưa cấp) · thẻ `GetNow` "Free 5 Unlocks of Chapters" (ứng dụng truyện) · thẻ `myplay`, `MY LAND`.

### Vùng chưa xác minh

- Đích của từng nút (mở tab mới / app store / deep link); điều kiện để hiện Giftcode.
