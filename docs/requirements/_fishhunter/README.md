# Danh mục Requirements — Fish Hunter (cổng game, môi trường TEST)

> **Điểm vào của hệ thống Fish Hunter.** Mọi workflow đụng tới `docs/**/_fishhunter/` đọc file này **trước tiên**: module nào đã có tài liệu · **prefix nào đã bị chiếm** · mã REQ kế tiếp · ambiguity 🔴 còn treo.
>
> Bản đồ hệ thống chi tiết: [`_discovery/system_map.md`](_discovery/system_map.md)

> ⚠️ **Đây là hệ thống RIÊNG** trong namespace `_fishhunter/`. **Không dùng chung** dải prefix, mã REQ hay TC ID — mã hệ thống `FISH` đứng trước bảo đảm không đụng nhau khi grep.

| Mục | Giá trị |
|---|---|
| Hệ thống | Fish Hunter — cổng game HTML5 (bắn cá + slot + game bài/bàn + mini game), thị trường Myanmar (đơn vị nạp `Ks`, nội dung tiếng Anh/Miến Điện) |
| Mã hệ thống | `FISH` |
| Loại | **Game canvas** — Cocos Creator 2.4.3 (WebGL), giao tiếp server qua **WebSocket** `wss://<host>:2083` (khung tin nhị phân MessagePack, mỗi tin có `route`). **Không có DOM nghiệp vụ** — xem RISK-FISH-01 |
| Tiền tố REQ | `REQ-FISH-<MODULE>-<nn>` |
| Tiền tố TC ID | `FISH_<MODULE>_TC_<3 số>` — *đề xuất của agent, user không phản đối tại checkpoint 2026-10-16* |
| Môi trường dùng chung | **KHÔNG** — user chốt 2026-10-16: được thao tác thật (cược, nhận thưởng) bằng account test. ⚠️ Trong phòng chơi vẫn thấy người chơi khác (`trannguyen1949`, `huongnhim11`…) — chưa rõ là bot hay người thật (AMB-FISH-10) |
| URL · tài khoản | `.env` (`BASE_URL`, `TEST_ACCOUNTS` — 10 account) — **KHÔNG** ghi credentials vào `docs/` |
| **Vai trò hệ thống** | **1 vai trò: Người chơi.** Đã đăng nhập 2 account (`chicken`, `girlcute`) 2026-10-16 — cùng bộ chức năng. Khác biệt nằm ở **trạng thái account**, không phải vai trò: số dư, VIP (Lucky Wheel ghi "Exclusive for VIP Players"), đủ điều kiện `1st Top-up` / `Tournament` (2 nút đang ẩn) — AMB-FISH-07 |
| **Năng lực kiểm thử của QA** | Chốt 2026-10-16 — dùng cho nhánh **Vòng 3** của **mọi** bộ TC:<br>• Gọi API / socket: ✅ **user xác nhận có** (chưa đo — chưa có tài liệu route/payload ngoài những gì quan sát thụ động ở `system_map.md` mục 4)<br>• Truy vấn CSDL: ❌ không có — **đội Dev** xác minh<br>• Kiểm tầng tích hợp (cổng nạp `Ks`, cộng Data nhà mạng): ❌ không có — **đội Dev** xác minh<br>• Xem nhật ký hoạt động / trang quản trị: ❌ không có — chưa được cấp trang admin/CMS; lịch sử chỉ xem được qua tab `Record` (Hồ sơ) và nút History trong từng game<br>• DevTools trình duyệt: ✅ **đã đo 2026-10-16** — đọc được console (bản test bật `debug=true&log=true`, log ra tên route gửi/nhận `route<<<<<` / `route>>>>>`), khung WebSocket, và cây node Cocos qua `cc.director.getScene()` |
| Khởi tạo | 2026-10-16 bởi `/discover-system` (Mode UI) |

---

## 1. Bảng danh mục module (26 module)

| Module | Prefix | Trạng thái recon | Mức phủ tài liệu | Tài liệu | REQ đã dùng | Mã kế tiếp | AMB treo | Story | Cập nhật |
|---|---|---|---|---|---|---|---|---|---|
| Đăng nhập · Đăng ký · Đăng xuất | `AUTH` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-AUTH-01` | AMB-FISH-01, 05 | — | 2026-10-16 |
| Sảnh & Header | `LOBBY` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-LOBBY-01` | AMB-FISH-04, 06 | — | 2026-10-16 |
| Sự kiện Slot Legends | `SLEG` | ✅ Đã có tài liệu | 🟨 Một phần | [sleg/requirements_sleg.md](sleg/requirements_sleg.md) · nguồn: [`_discovery/sources/Slot_Legends_Event.md`](_discovery/sources/Slot_Legends_Event.md) | `REQ-FISH-SLEG-01` → `REQ-FISH-SLEG-75` (75) | `REQ-FISH-SLEG-76` | **9 🔴** (AMB-01, 02, 03, 04, 06, 09, 10, 12, 14) · 3 🟡 · 2 🟢 | 10 | 2026-10-16 |
| Sự kiện (khung) + Quà online | `EVENT` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-EVENT-01` | — | — | 2026-10-16 |
| Slot Treasure Chest | `SLTC` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-SLTC-01` | AMB-FISH-04 | — | 2026-10-16 |
| Slot Avengers | `SLAV` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-SLAV-01` | — | — | 2026-10-16 |
| Alien Blast | `ALIEN` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-ALIEN-01` | — | — | 2026-10-16 |
| Bắn cá Fish Hunter | `FISH` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-FISH-01` | AMB-FISH-08 | — | 2026-10-16 |
| Cửa hàng / Nạp | `SHOP` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-SHOP-01` | AMB-FISH-07 | — | 2026-10-16 |
| Kho đồ | `INV` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-INV-01` | — | — | 2026-10-16 |
| Giftcode | `GIFT` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-GIFT-01` | — | — | 2026-10-16 |
| Hồ sơ cá nhân | `PERS` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-PERS-01` | — | — | 2026-10-16 |
| My Game (quảng bá chéo) | `MORE` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-MORE-01` | — | — | 2026-10-16 |
| Nhiệm vụ hằng ngày | `MISS` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-MISS-01` | AMB-FISH-04 | — | 2026-10-16 |
| Điểm danh hằng ngày | `DAILY` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-DAILY-01` | AMB-FISH-06 | — | 2026-10-16 |
| Hộp thư | `MAIL` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-MAIL-01` | AMB-FISH-04 | — | 2026-10-16 |
| Vòng quay may mắn | `WHEEL` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-WHEEL-01` | AMB-FISH-07 | — | 2026-10-16 |
| Bảng xếp hạng | `RANK` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-RANK-01` | — | — | 2026-10-16 |
| Shan KoeMee | `SHAN` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-SHAN-01` | AMB-FISH-02 | — | 2026-10-16 |
| Baca Ocean (Baccarat) | `BACA` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-BACA-01` | — | — | 2026-10-16 |
| Poker | `POKER` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-POKER-01` | AMB-FISH-03 | — | 2026-10-16 |
| Fish Mascot (bàn) | `MASC` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-MASC-01` | — | — | 2026-10-16 |
| Plinko | `PLINKO` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-PLINKO-01` | — | — | 2026-10-16 |
| Fish Mascot Mini | `MASCM` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-MASCM-01` | AMB-FISH-11 | — | 2026-10-16 |
| Fish Submarine (Over/Under mini) | `SUBM` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-SUBM-01` | — | — | 2026-10-16 |
| Mini Poker | `MPK` | ⬜ Chưa khảo sát | ⬜ Trắng | — | — | `REQ-FISH-MPK-01` | — | — | 2026-10-16 |

Thứ tự dòng = **thứ tự khảo sát đã chốt** (mục 5).

**Bảng mã trạng thái recon:** ⬜ Chưa khảo sát · 🟨 Đang khảo sát · ✅ Đã có tài liệu · ⏸️ Hoãn · ⚪ Chưa implement
**Bảng mã mức phủ tài liệu:** 🟩 Đầy đủ · 🟨 Một phần · ⬜ Trắng · ⚠️ Nghi lỗi thời

### Prefix đã chiếm trong hệ thống `FISH` (module mới PHẢI chọn prefix ngoài danh sách này)

```
AUTH · LOBBY · SLEG · EVENT · SLTC · SLAV · ALIEN · FISH · SHOP · INV · GIFT · PERS · MORE
MISS · DAILY · MAIL · WHEEL · RANK · SHAN · BACA · POKER · MASC · PLINKO · MASCM · SUBM · MPK
```

### Vùng chưa cấp prefix

| Vùng | Lý do | Muốn đưa vào thì làm gì |
|---|---|---|
| `1st Top-up` (nút `btnNapLanDau`) | Node có trong Header nhưng **ẩn** với cả 2 account đã thử — chưa mở được | Xin account đủ điều kiện nạp lần đầu → `/discover-system` **Mode ADD** |
| `Tournament` (nút `btnTopGowin`) | Node có trong Header nhưng **ẩn** với cả 2 account | Hỏi PO điều kiện hiển thị / thời gian giải → **Mode ADD** |
| Popup quảng bá tự bật sau đăng nhập (`PopupEventPoker` "Join Now") | Popup điều hướng, không có entity riêng → **gộp vào `LOBBY`** | — |
| Cổng nạp tiền thật (thanh toán `Ks` qua nhà mạng) | Ngoài phạm vi UI game; không bấm `btnPurchase` | Chốt với PO có test thanh toán thật hay mock |

---

## 2. Trạng thái REQ toàn hệ thống

Đã lập bản đồ **26/26 module**, đã recon **1/26** (`SLEG`).

| Trạng thái | Số lượng | Chi tiết |
|---|---|---|
| 🟢 Active | 66 | `SLEG` 66 |
| 🟡 Changed | 0 | — |
| 🔴 Deprecated | 0 | — |
| ⚪ Chưa implement | 9 | `SLEG` 9 — banner Home, giới hạn 1 lần/ngày, icon trong game, điểm hiển thị trong phiên, thể lệ giải cuối, popup mời sub, đăng ký sub từ popup, reset kỳ, thông báo lỗi nhận thưởng |
| **Tổng** | **75** | |

Ước lượng khi recon xong toàn hệ thống: **~520–750 REQ** (chi tiết theo module: `system_map.md` mục 3).

---

## 3. Ambiguity 🔴 High còn treo

### 3.1. Ambiguity cấp hệ thống (phát hiện ở tầng khám phá)

| Mã | Mức | Module | Câu hỏi | Chặn cái gì |
|---|---|---|---|---|
| [AMB-FISH-01](_discovery/system_map.md#7-vùng-chưa-xác-minh--nghi-vấn-cấp-hệ-thống) | 🔴 | `AUTH` · toàn hệ thống | Response route `login` trả về **cả trường `password`**, và client log nguyên văn tài khoản + mật khẩu ra console (`login<<<<<` / `login>>>>>`). Bản production có tắt `debug`/`log` không? Server có cố ý trả mật khẩu? | TC bảo mật của `AUTH`; quyết định có mở bug bảo mật ngay hay không |
| [AMB-FISH-02](_discovery/system_map.md#7-vùng-chưa-xác-minh--nghi-vấn-cấp-hệ-thống) | 🔴 | `SHAN` | Mở game là **tự vào bàn** và client **tự gửi `skmBet`** — số dư `chicken` bị trừ 50.000 ngay, người chơi chưa bấm gì. Thiết kế (ante tự động) hay lỗi? | Toàn bộ luồng vào bàn của `SHAN` |
| [AMB-FISH-03](_discovery/system_map.md#7-vùng-chưa-xác-minh--nghi-vấn-cấp-hệ-thống) | 🔴 | `POKER` | Mở game là **tự vào bàn** blind 50K/100K với chip **500.000**, trong khi màn chọn phòng ghi buy-in mức đó là **1.000.000–100.000.000**; ván tự chạy (`LobbyDoGameAction`) khi chưa thao tác; bấm rời bàn báo `Playing cannot quit` | Buy-in, rời bàn, tự động hành động của `POKER` |

### 3.1b. Ambiguity 🔴 theo module

| Mã | Module | Câu hỏi | Chặn cái gì |
|---|---|---|---|
| [AMB-01](sleg/requirements_sleg.md#ambiguities) | `SLEG` | `Slot_Legends_Event.md` có phải bản cuối dev dùng để code? | Cách hiểu **mọi** chỗ lệch: bug hay tài liệu lỗi thời |
| [AMB-02](sleg/requirements_sleg.md#ambiguities) | `SLEG` | Kỳ 30 ngày (tài liệu) hay 57 ngày (bản TEST)? | REQ-08, mốc tham chiếu §7 |
| [AMB-03](sleg/requirements_sleg.md#ambiguities) | `SLEG` | Múi giờ: reset nhiệm vụ và hết kỳ đang chạy theo 00:00 **UTC+7**, tài liệu ghi UTC+6:30 | REQ-09, 35 — người chơi Myanmar mất thưởng chưa nhận sớm 30 phút |
| [AMB-04](sleg/requirements_sleg.md#ambiguities) | `SLEG` | Banner Home và icon trong game chưa có | REQ-03 → 05 |
| [AMB-06](sleg/requirements_sleg.md#ambiguities) | `SLEG` | Phần dư < 50.000 vàng giữ trong phiên (tài liệu) hay cộng dồn cả kỳ (thực tế)? | Công thức điểm BXH → giải cuối |
| [AMB-09](sleg/requirements_sleg.md#ambiguities) | `SLEG` | "Phiên hợp lệ" — 9 phiên đo, chỉ 4 được tính cho D1 | Nhiệm vụ D1 |
| [AMB-10](sleg/requirements_sleg.md#ambiguities) | `SLEG` | Chưa sub bấm Go / Claim **không** hiện popup mời sub (nghi bug) | Luồng chuyển đổi sub — mục tiêu chính của sự kiện |
| [AMB-12](sleg/requirements_sleg.md#ambiguities) | `SLEG` | Star chỉ cộng khi nhận → người chưa sub không bao giờ tích Star, trái §4 | Mốc Star với người chưa sub |
| [AMB-14](sleg/requirements_sleg.md#ambiguities) | `SLEG` | Không có account đã sub (9/9 `is_sub: false`); `Giangtran` đăng nhập sai | Toàn bộ nhánh "đã sub" — STORY-06 → 08 |

### 3.2. Ambiguity 🟡/🟢 cấp hệ thống

| Mã | Mức | Module | Câu hỏi |
|---|---|---|---|
| AMB-FISH-04 | 🟡 | `MISS` · `MAIL` · `LOBBY` · `SLTC` · `AUTH` | Chuỗi chưa dịch / lẫn ngôn ngữ: Missions `Ban ha ca fishname_4 16 lan` · Mail `header_gift_event` · marquee `null`, `event-onload` · Treasure Chest `Apuesta total` (tiếng Tây Ban Nha) · thông báo login `Username or password is incorect!` (sai chính tả). Có bảng chuỗi chuẩn để làm căn cứ không? |
| AMB-FISH-05 | 🟡 | `AUTH` | Đăng xuất thành công nhưng vẫn bật `PopupAlert` "Please try again." |
| AMB-FISH-06 | 🟡 | `LOBBY` · `DAILY` | Nút nhãn **Guide** gắn handler `onClickDiemDanhHangNgay` (nút ở trạng thái `interactable=false`), lần click đầu sau đăng nhập mở **Daily Attendance**, các lần sau mở **Guide**. Hành vi đúng là gì? |
| AMB-FISH-07 | 🟡 | `SHOP` · `WHEEL` · `LOBBY` | Điều kiện account để hiện `1st Top-up`, `Tournament`, và thế nào là "VIP" (Lucky Wheel). Xin account ở từng trạng thái |
| AMB-FISH-08 | 🟡 | `FISH` | Bấm Fish Hunter ở sảnh (`onClickFishHunter(true)`): account ~19 triệu vàng **vào thẳng phòng chơi** (quick play, mức cược 50.000), account 8 vàng dừng ở màn chọn 3 phòng. Luật chọn phòng tự động theo số dư là gì? |
| AMB-FISH-09 | 🟢 | `SLEG` | Tài liệu ghi "dự kiến 30 ngày, chưa xác định mốc"; bản TEST đang chạy, còn `15d` ngày 2026-10-16. Mốc thật của đợt là gì? |
| AMB-FISH-10 | 🟢 | Game nhiều người | Người chơi khác trong phòng/bàn là bot của môi trường test hay người thật? Ảnh hưởng thiết kế TC cho Shan/Poker/Baccarat |
| AMB-FISH-11 | 🟢 | `MASCM` · `MASC` | Nút "Fish Mascot" trong panel MINI GAME (`onClickBauCua`) mở bản bàn hay bản mini? |

### 3.3. Vấn đề cấp hệ thống đang treo

| Vấn đề | Ảnh hưởng | Cần ai giải quyết |
|---|---|---|
| Game vẽ trên canvas, không có DOM / accessibility tree | Không dùng được locator chuẩn (`getByRole`, `data-testid`). Recon và automation phải đi qua cây node Cocos (`cc.director`) — xem RISK-FISH-01 | Dev cung cấp test hook / quy ước tên node ổn định |
| Số dư account test bị tiêu khi recon (auto-bet ở Shan/Poker) | Account sẽ cạn vàng; không có trang admin để cộng | PO/Dev cấp cơ chế nạp vàng cho account test |

---

## 4. Cấu trúc thư mục chuẩn

```
docs/requirements/_fishhunter/
├── README.md                              ← file này — DANH MỤC
├── _discovery/                            ← TẦNG KHÁM PHÁ (không có mã REQ)
│   ├── system_map.md                      ← INDEX — TÊN FILE BẤT BIẾN
│   ├── modules/module_NN_<slug>.md        ← 18 file khám phá (26 module)
│   ├── sources/Slot_Legends_Event.md      ← tài liệu gốc QA cung cấp (đề xuất sự kiện Slot Legends)
│   └── evidence/<prefix>_overview_fullpage.png   ← 1 ảnh/module (canvas = viewport 1920×1080)
└── <module>/                              ← TẦNG MODULE (sinh dần khi recon)
    ├── requirements_<module>.md           ← INDEX — TÊN FILE BẤT BIẾN
    └── evidence/*.png
```

---

## 5. Quy trình sử dụng

| Tình huống | Workflow | Ghi vào đâu |
|---|---|---|
| Khảo sát chi tiết một module | `/generate-requirements-from-website <module>` (chỉ rõ namespace `_fishhunter`) | `docs/requirements/_fishhunter/<module>/requirements_<module>.md` + cập nhật dòng ở bảng mục 1 |
| Module `SLEG` (có tài liệu bán phần) | `/generate-requirements-from-website SLEG` ở chế độ **Hybrid** với `_discovery/sources/Slot_Legends_Event.md` | Như trên + Bản đồ phủ tài liệu |
| Phát hiện module bị sót (1st Top-up, Tournament…) | `/discover-system` (Mode ADD) | `_discovery/` + thêm dòng ở mục 1 |
| Hệ thống deploy tính năng mới | `/discover-system` (Mode DELTA) | Nhật ký khám phá ở `system_map.md` |

**Thứ tự recon đã chốt (user 2026-10-16 — "Ưu tiên Slot Legends"):**
`AUTH → LOBBY → SLEG → EVENT → SLTC → SLAV → ALIEN → FISH → SHOP → INV → GIFT → PERS → MORE → MISS → DAILY → MAIL → WHEEL → RANK → SHAN → BACA → POKER → MASC → PLINKO → MASCM → SUBM → MPK`

---

## 6. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 2026-10-16 | Xoá danh mục Perfex CRM cũ `docs/requirements/README.md` (các module của nó đã không còn trong repo) theo yêu cầu user; gỡ link tới nó ở đầu file này |
| 2026-10-16 | Recon `SLEG` bằng `/generate-requirements-from-website` (Hybrid, tài liệu bán phần) — **75 REQ** (66 🟢 · 9 ⚪), 10 Story, 14 AMB (9 🔴), 6 RISK, 11 ảnh evidence; 1 file có mục lục (40–80 REQ). Đã quay 300 lượt thật ở mức thấp nhất để kiểm luật điểm (account `chicken` −35.400 vàng). Phát hiện `Giangtran` không đăng nhập được với thông tin trong `.env`. Đối chiếu danh mục: `_fishhunter/*/requirements_*.md` chỉ có `sleg` — khớp |
| 2026-10-16 | Chuyển tài liệu đề xuất sự kiện từ `docs/Slot_Legends_Event.md` vào [`_discovery/sources/Slot_Legends_Event.md`](_discovery/sources/Slot_Legends_Event.md) theo quy ước lưu bản gốc tài liệu. Nội dung giữ nguyên, đã cập nhật link ở `README.md`, `system_map.md`, `module_02` |
| 2026-10-16 | Khởi tạo danh mục từ `/discover-system` **Mode UI** — hệ thống thứ hai của repo (sau Perfex CRM), đặt trong namespace `_fishhunter/`. **26 module, 26 prefix**, bản đồ tách 18 file khám phá. User chốt: giữ 26 module · ưu tiên Slot Legends · môi trường **không** dùng chung · QA có quyền gọi API/socket + DevTools. Tiền tố TC ID `FISH_` và việc dùng `docs/Slot_Legends_Event.md` làm nguồn cho `SLEG` là **mặc định của agent** (user chưa trả lời riêng — sửa tại đây nếu cần). Đối chiếu danh mục: namespace mới, chưa có thư mục module nào → khớp |
