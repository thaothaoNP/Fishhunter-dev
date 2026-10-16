# Khám phá module: Đăng nhập · Đăng ký · Đăng xuất (`AUTH`) và Sảnh & Header (`LOBBY`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

---

## `AUTH` — Đăng nhập · Đăng ký · Đăng xuất

| Mục | Giá trị |
|---|---|
| Tên trên UI | LOGIN · REGISTER · Logout |
| Prefix | `AUTH` |
| Đường vào | Mở URL khi chưa có phiên → `Canvas/Popups/PopupLogin` · nút REGISTER → `PopupRegister` · Settings ▾ → `panelSetting/btnBack` (handler `Logout`) → `PopupConfirm` |
| Loại màn hình | Form popup |
| Thao tác | Đăng nhập · đăng ký · đăng xuất (có xác nhận) |
| Status flow | Phiên: chưa đăng nhập → đã đăng nhập → đăng xuất |
| Số field | Login 2 (Username, Password) · Register 3 (Username, Password, Re-password) |
| Ước độ lớn | 25–35 REQ |
| Risk | 🔴 Cao — cổng vào mọi module; nghi vấn bảo mật AMB-FISH-01 |
| Evidence | [auth_overview_fullpage.png](../evidence/auth_overview_fullpage.png) |

### Thành phần quan sát được

| Màn hình | Thành phần |
|---|---|
| PopupLogin | Tiêu đề `LOGIN` · ô `Username` · ô `Password` (ô nhập DOM `maxlength=36`) · nút `LOGIN` · nút `REGISTER`. Sau khi đăng xuất, ô Username **giữ sẵn** tên đăng nhập trước đó |
| PopupRegister | Tiêu đề `REGISTER` · `Username` · `Password` · `Re-password...` · nút `REGISTER` · nút đóng |
| Đăng nhập sai | `PopupAlert` tiêu đề `FISH HUNTER`, nội dung nguyên văn `Username or password is incorect!` (server trả `err: 101`) |
| PopupConfirm (Logout) | `Do you want to sign out of your account?` · `Cancel` · `Logout` |
| Sau Logout | Quay về PopupLogin **kèm** `PopupAlert` "Please try again." (AMB-FISH-05) |

### Network

`login` (gửi: username, password, `deviceId` UUID, `platform: android`, `appId: ccshootfish`, `cp`, `language`) → nhận `{ok, username, password, userId, avatar}` hoặc `{ok:false, err:101, msg}`. `ping` định kỳ ~3 s.

### Vùng chưa xác minh

- Validation form Register (trùng tên, độ dài, mật khẩu không khớp) — chưa submit.
- Đăng nhập bằng `access_token` trên URL (tham số có trong URL, đang để trống).
- Đăng nhập cùng account ở 2 nơi; mất kết nối socket giữa chừng.

---

## `LOBBY` — Sảnh & Header

| Mục | Giá trị |
|---|---|
| Tên trên UI | (Sảnh chính, logo Fish Hunter) |
| Prefix | `LOBBY` |
| Đường vào | Sau đăng nhập — scene `ShootFish`, node `Canvas/Lobby` |
| Loại màn hình | Màn hình chính + menu thả + popup điều hướng |
| Thao tác | Điều hướng · bật/tắt Music, Sound · xem T&C · Guide · kéo thả nút nổi |
| Status flow | Không có |
| Ước độ lớn | 30–45 REQ |
| Risk | 🟡 Trung bình — không tiêu vàng trực tiếp nhưng là khung của mọi luồng; nhiều chuỗi lỗi hiển thị |
| Evidence | [lobby_overview_fullpage.png](../evidence/lobby_overview_fullpage.png) |

### Thành phần quan sát được

| Khu vực | Thành phần |
|---|---|
| Header | Avatar · nickname · số dư vàng · nút `+` · dòng marquee (đang hiển thị `null`, `event-onload` — AMB-FISH-04) · `My Game` · `Mail box` · `Giftcode` · 2 nút ẩn `1st Top-up`, `Tournament` · bánh răng Settings |
| Settings ▾ | `toggleMusic` · `toggleSound` · `btnT&C` → `TERMS AND CONDITIONS OF THE "FISH HUNTER" SERVICE` (có mục "Fair Play Rules") · `btnBack` = **Logout** |
| Banner | `EventPageView` 6 trang, tự chuyển |
| Danh sách game | 11 thẻ game cuộn ngang; nhãn `HOT` / `NEW`; Treasure Chest và Avengers hiển thị 3 mức jackpot cập nhật trực tiếp |
| Thanh dưới | Guide · Inventory · Events · SHOP · Missions · Leaderboards · Activities |
| Nút nổi | `Promotions` (mở Shop) · `MINI GAME` (badge đếm ngược, mở panel 3 mini game) — tồn tại ở mọi scene |
| Popup tự bật sau đăng nhập | `PopupEventPoker` (nút `Join Now`) → `PopupDiemDanhHangNgay` |
| Guide | `PopupGameGuide`, tab `How to play`: 3 phòng `Fishermen` (tối thiểu 10 gold) · `Landlord` (100) · `Rich man` (1.000) |

### Network

`getListPopups` · `getRollingTexts` · `getText` · `activityWithBanner` · `checkEventOn` · `infoEventAnnualOn` · `crossServices` · `getJackpot` · `SL1`/`SL4` · `OnUpdateJackpot` · `onBcJackpot` · `logGameOpen`.

### Vùng chưa xác minh

- RISK-FISH-02: click chuột không mở được Events/SHOP/Missions/Activities ở headless.
- AMB-FISH-06: nút Guide.
- Nội dung đủ 6 trang banner và đích điều hướng của từng trang.
