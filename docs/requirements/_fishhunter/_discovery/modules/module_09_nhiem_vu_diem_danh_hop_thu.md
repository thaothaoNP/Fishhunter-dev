# Khám phá module: Nhiệm vụ (`MISS`) · Điểm danh (`DAILY`) · Hộp thư (`MAIL`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

---

## `MISS` — Nhiệm vụ hằng ngày

| Mục | Giá trị |
|---|---|
| Tên trên UI | MISSIONS |
| Bí danh | Nhiệm vụ hằng ngày (`btnNhiemVu`, `PopupNhiemVuHangNgay`) |
| Prefix | `MISS` |
| Đường vào | Thanh dưới → **Missions** (`onClickNhiemVuHangNgay`); popup mở chậm (> 10 s lần đầu). Click chuột không mở được ở headless — RISK-FISH-02 |
| Loại màn hình | Popup danh sách cuộn |
| Status flow | Nhiệm vụ: chưa xong (`Go`) → xong → đã nhận thưởng |
| Ước độ lớn | 12–18 REQ |
| Risk | 🟡 Trung bình |
| Evidence | [miss_overview_fullpage.png](../evidence/miss_overview_fullpage.png) |

### Thành phần quan sát được (10 nhiệm vụ, account `chicken`)

Mỗi dòng: tên · tiến độ · thưởng vàng · nút `Go`. Ví dụ nguyên văn: `Ban ha ca fishname_4 16 lan` (4.000) · `Ban ha ca fishname_20 8 lan` (4.000) · `Ban ha ca fishname_26 19 lan` (9.500) · `Ban ha ca fishname_22 7 lan` (10.500) · `Ban ha ca fishname_12 1 lan` (15.000) · `Thang 4 lan` (2.000) · `Quay vong quay 1 lan` (5.000) · … — **tên nhiệm vụ là tiếng Việt không dấu kèm key `fishname_N` chưa thay** (AMB-FISH-04). Phần thưởng mốc tổng (`MissionNoti`) có trong mọi scene.

### Network

`getMyMissions` · `openMissionUI`.

### Vùng chưa xác minh

- Đích của nút `Go`; tiến độ cập nhật khi chơi; reset theo ngày; nhận thưởng.

---

## `DAILY` — Điểm danh hằng ngày

| Mục | Giá trị |
|---|---|
| Tên trên UI | DAILY ATTENDANCE |
| Bí danh | Điểm danh (`PopupDiemDanhHangNgay`) |
| Prefix | `DAILY` |
| Đường vào | **Tự bật** sau đăng nhập (sau popup quảng bá) · handler `onClickDiemDanhHangNgay` gắn ở nút Guide (AMB-FISH-06) |
| Loại màn hình | Popup lưới 7 ngày |
| Status flow | Ngày: đã nhận → hôm nay nhận được → chưa tới |
| Ước độ lớn | 10–14 REQ |
| Risk | 🟡 Trung bình |
| Evidence | [daily_overview_fullpage.png](../evidence/daily_overview_fullpage.png) |

### Thành phần quan sát được

`Day 1` 5.000 · `Day 2` 10.000 (+ vật phẩm x2) · `Day 3` 20.000 (x2) · `Day 4` 30.000 (x2) · `Day 5` 40.000 (x2, x4) · `Day 6` 50.000 (x2, x2) · `Day 7` 100.000 (x2, x2). Mỗi ô là một nút.

### Network

`getCheckInData`.

### Vùng chưa xác minh

- Ngày hiện tại của account, nhận thưởng, đứt chuỗi khi bỏ một ngày, vật phẩm x2/x4 là gì.

---

## `MAIL` — Hộp thư

| Mục | Giá trị |
|---|---|
| Tên trên UI | MAIL BOX |
| Prefix | `MAIL` |
| Đường vào | Header → **Mail box** (`onClickMail`) → `PopupMailBox` |
| Loại màn hình | Popup danh sách (trái) + chi tiết (phải) |
| Status flow | Thư: chưa đọc → đã đọc → đã nhận quà (chưa quan sát) |
| Ước độ lớn | 10–15 REQ |
| Risk | 🟡 Trung bình — thư thưởng xếp hạng có thể kèm vàng |
| Evidence | [mail_overview_fullpage.png](../evidence/mail_overview_fullpage.png) |

### Thành phần quan sát được

Tiêu đề thư: `header_gift_event` (key chưa dịch — AMB-FISH-04) · `Fish Event Ranking Rewards` · `Fish Mascot Event Ranking Rewards`. Có **2 nút đóng** (`BtnClose` và `btn_close`).

### Network

`getListMailBox` (gọi lại nhiều lần trong phiên — 16 lần).

### Vùng chưa xác minh

- Nội dung chi tiết thư, nhận quà đính kèm, xoá thư, thời hạn thư.
