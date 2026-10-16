# Requirements — Sự kiện Slot Legends (`SLEG`)

> Hệ thống: Fish Hunter (namespace `_fishhunter`) · Danh mục: [../README.md](../README.md) · Khám phá: [../_discovery/modules/module_02_su_kien_slot_legends.md](../_discovery/modules/module_02_su_kien_slot_legends.md)

## Mục lục

- [6.1. Metadata & Tổng quan](#61-metadata--tổng-quan)
- [6.5.1. Bản đồ phủ tài liệu](#651-bản-đồ-phủ-tài-liệu)
- [6.2. Yêu cầu chức năng](#62-yêu-cầu-chức-năng) — STORY-SLEG-01 → 09
- [6.3. Đặc tả dữ liệu](#63-đặc-tả-dữ-liệu)
- [6.4. Business rules & thông báo](#64-business-rules--thông-báo)
- [6.5. Ma trận phân quyền](#65-ma-trận-phân-quyền-theo-trạng-thái-sub)
- [6.6. Ma trận trạng thái](#66-ma-trận-trạng-thái)
- [6.7. Ambiguities & Risks](#67-ambiguities--risks)
- [6.8. Phân rã Epic / Story](#68-phân-rã-epic--story)
- [Danh mục Evidence](#danh-mục-evidence)
- [6.9. Nhật ký thay đổi](#69-nhật-ký-thay-đổi)

---

## 6.1. Metadata & Tổng quan

| Thuộc tính | Giá trị |
|---|---|
| **Module / Prefix** | Sự kiện Slot Legends (`SLEG`) |
| **Mã REQ** | `REQ-FISH-SLEG-<NN>` (hệ thống thứ hai — có mã hệ thống `FISH`) |
| **Dải mã đã dùng** | `REQ-FISH-SLEG-01` → `REQ-FISH-SLEG-75` · `AMB-01` → `AMB-14` · `RISK-01` → `RISK-06` |
| **Mã kế tiếp** | `REQ-FISH-SLEG-76` · `AMB-15` · `RISK-07` — **KHÔNG đánh lại từ 01** |
| **Nhánh** | **Hybrid — tài liệu bán phần** ([`../_discovery/sources/Slot_Legends_Event.md`](../_discovery/sources/Slot_Legends_Event.md), bản "ĐỀ XUẤT SỰ KIỆN") + bản TEST đang chạy |
| **Chuẩn kỳ vọng** | **Tài liệu là chuẩn** (giả định của agent — user cho biết dev vừa code xong, chưa test; chưa xác nhận đây là bản cuối → `AMB-01`). REQ viết theo tài liệu; chỗ UI làm khác → `AMB` 🔴 + **nghi bug**, không viết REQ theo hành vi hiện tại |
| **Môi trường** | `https://fishhunter.ugame.vn/test/` (URL ở `.env`) — **không dùng chung**, được quay thật |
| **Account đã dùng** | `chicken` (khảo sát chính) · `camella2` (đối chiếu bộ nhiệm vụ) · cả 10 account trong `.env` (kiểm `is_sub`) — **không có account nào đã sub** (`AMB-14`) |
| **Trình duyệt khảo sát** | Chromium (Playwright 1.63) **Headless `1920×1080`**, `--disable-gpu` (WebGL SwiftShader). Game canvas Cocos 2.4.3 — không có DOM nghiệp vụ, đọc cây node `cc.director` + giải mã khung WebSocket thụ động (MessagePack) |
| **Ngày khảo sát** | 2026-10-16 (ngày nhiệm vụ server `day: 20261016`) |
| **Chi phí khảo sát** | Đã quay **300 lượt** ở mức cược thấp nhất (267 Alien Blast · 23 Treasure Chest · 10 Avenger); số dư `chicken` 19.459.690 → 19.424.290 (−35.400) |

### Tổng quan

Slot Legends là sự kiện tích điểm kéo người chơi vào 3 game Slot (**Treasure Chest · Avenger · Alien Blast**). Gồm 4 phần: **BXH điểm** · **5 nhiệm vụ ngày** · **thưởng theo tiến trình Star (5 mốc)** · **giải cuối sự kiện** (rút thăm 5 người trong top 50 đủ điều kiện). Mọi người đều được tính tiến trình; **chỉ người đang sub** nhận thưởng.

**Trong phạm vi:** tab Slot Legends trong popup Events, popup Rule, BXH đầy đủ, nhiệm vụ, mốc Star, điều kiện sub, cách tính điểm/tiến độ từ 3 game Slot, lối vào sự kiện.
**Ngoài phạm vi:** luật trả thưởng của từng game Slot (module `SLTC`/`SLAV`/`ALIEN`); CMS cấu hình kho nhiệm vụ và báo cáo (§10 — QA không có quyền CMS); chuyển 500.000 MMK thủ công (quy trình đối tác).

---

## 6.5.1. Bản đồ phủ tài liệu

| Vùng chức năng | Tài liệu phủ | Mức phủ | REQ liên quan |
|---|---|---|---|
| Lối vào (tab Event · banner Home · icon trong game) | §9, §10 "Giao diện", ảnh mockup King of Fishing | 🟨 Một phần | 01 → 06 |
| Thời gian & vòng đời kỳ | §1 "dự kiến 30 ngày, chưa xác định mốc", §3 | 🟨 Một phần | 07 → 10 |
| Tính điểm BXH | §3, §10 "Tính điểm" | 🟩 Đầy đủ | 11 → 20 |
| Hiển thị BXH & thể lệ | §3, §10 "BXH", "Giao diện" | 🟨 Một phần (không mô tả đồng hồ làm mới, người chưa có hạng) | 21 → 29, 74 |
| Nhiệm vụ hằng ngày | §5, §10 "Random nhiệm vụ", "Nhiệm vụ" | 🟩 Đầy đủ (có mâu thuẫn nội bộ ở T3, K2 → `AMB-08`) | 30 → 46, 72, 73 |
| Thưởng nhiệm vụ | §6, §4 | 🟩 Đầy đủ | 47 → 52, 71 |
| Mốc Star | §7, §4 | 🟩 Đầy đủ | 53 → 59 |
| Điều kiện sub & popup mời sub | §4, §10 "Trả thưởng" | 🟨 Một phần (nội dung popup chỉ mô tả chung) | 60 → 63 |
| Giải cuối sự kiện | §8, §10 "Chốt và rút thăm" | 🟩 Đầy đủ — **chỉ kiểm được sau khi kỳ kết thúc** | 64 → 69, 75 |
| Lỗi / edge case (mất mạng, phản hồi lỗi của server, giữa phiên) | — | ⬜ Trắng | 70 |
| CMS kho nhiệm vụ · Báo cáo · Chỉ số §11 | §10, §11 | 🟩 nhưng **ngoài phạm vi** (QA không có CMS) | — |

---

## 6.2. Yêu cầu chức năng

**Mã trạng thái:** 🟢 Active · 🟡 Changed · 🔴 Deprecated · ⚪ Chưa implement (tài liệu có, UI chưa có / chưa quan sát được — TC viết trước, đánh `skip`).
**Cột Nguồn:** `Tài liệu §x` (chưa kiểm chứng UI) · `Tài liệu §x + kiểm chứng thực tế` · `UI thực tế` / `Kiểm chứng thực tế` (ngoài tài liệu) · `API · <route>` (khung WebSocket quan sát thụ động).

### STORY-SLEG-01 — Lối vào & khung màn hình sự kiện

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-01 | Tab Slot Legends nằm trong popup Events | Khi sự kiện đang diễn ra, popup Events (nút **Events** ở thanh dưới sảnh) có tab `Slot Legends` | Sảnh → Events → danh sách tab **chứa** `Slot Legends`; bấm tab → khối nội dung sự kiện hiển thị. Ảnh `events_default_viewport.png`, `sleg_tab_default_viewport.png` | 🟢 | — | Tài liệu §9 + kiểm chứng thực tế |
| REQ-FISH-SLEG-02 | Nhãn tab hiển thị đếm ngược tới hết kỳ | Dưới tên tab là đồng hồ đếm ngược thời gian còn lại của kỳ | Nhãn **khớp mẫu** `Refresh in: <d>d:<hh>:<mm>:<ss>` và giảm theo thời gian thực; tổng thời gian còn lại khớp `end` của kỳ (sai số ≤ 1 phút) | 🟢 | — | Kiểm chứng thực tế — ngoài tài liệu |
| REQ-FISH-SLEG-03 | Banner giới thiệu sự kiện ở màn Home | Banner hiển thị ngay khi người dùng vào game, sau popup mời sub | Đăng nhập account **chưa đăng nhập trong ngày** → sau popup mời sub (nếu có) hiển thị banner Slot Legends | ⚪ | — | Tài liệu §9 — chưa quan sát được (`AMB-04`) |
| REQ-FISH-SLEG-04 | Banner Home giới hạn 1 lần/ngày | Banner chỉ tự hiện 1 lần mỗi ngày | Đăng nhập lần 2 trong cùng ngày → banner **không** tự hiện | ⚪ | — | Tài liệu §9 (`AMB-04`) |
| REQ-FISH-SLEG-05 | Icon sự kiện trong từng game Slot | Banner/icon sự kiện xuất hiện ở sảnh và trong từng game Slot | Vào Treasure Chest / Avenger / Alien Blast → có icon Slot Legends | ⚪ | — | Tài liệu §10 "Giao diện" — không tìm thấy node nào trong 3 game (`AMB-04`) |
| REQ-FISH-SLEG-06 | Màn sự kiện có đủ 3 khối BXH · Nhiệm vụ · Thưởng tiến trình | Màn hình sự kiện hiển thị BXH, danh sách nhiệm vụ và thanh tiến trình Star | Tab Slot Legends hiển thị đồng thời: khối BXH (top 3 + hạng của mình), khối 5 nhiệm vụ, thanh Star 5 mốc | 🟢 | — | Tài liệu §10 + kiểm chứng thực tế (bố cục 1 màn gộp, không phải 3 tab — `AMB-05`) |

### STORY-SLEG-02 — Thời gian & vòng đời kỳ

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-07 | Popup Rule hiển thị khoảng thời gian kỳ | Rule hiển thị `<start> --- <end>` | Bấm `Rule` → dòng thời gian **khớp mẫu** `YYYY-MM-DD HH:mm:ss --- YYYY-MM-DD HH:mm:ss` và bằng `start`/`end` server trả | 🟢 | — | Kiểm chứng thực tế · `API · leaderboardWinnerSlotLegends` |
| REQ-FISH-SLEG-08 | Thời lượng kỳ đúng như cấu hình đã chốt | Kỳ kéo dài theo mốc PO chốt | `end − start` = thời lượng PO chốt. Tài liệu: "dự kiến 30 ngày"; bản TEST: **57 ngày** (2026-09-05 07:28:00 → 2026-11-01 00:00:00) | 🟢 | — | Tài liệu §1 — **lệch UI** (`AMB-02` 🔴) |
| REQ-FISH-SLEG-09 | Đồng hồ hết kỳ chạy theo múi giờ đã chốt | Mốc `end` phải hiểu theo cùng múi giờ với các mốc khác của sự kiện (tài liệu dùng giờ Myanmar UTC+6:30) | Thời điểm đồng hồ về 0 = `end` theo **UTC+6:30**. Đo thực tế: về 0 lúc `2026-10-31T17:00Z` = 00:00 **UTC+7** | 🟢 | — | Tài liệu §10 (giờ Myanmar) — **lệch** (`AMB-03` 🔴) |
| REQ-FISH-SLEG-10 | Kỳ sau bắt đầu lại từ 0 điểm | Điểm reset cho kỳ sau (việc chốt BXH kỳ cũ: REQ-64) | Kỳ mới (nếu có) bắt đầu: mọi người `My Score : 0` | ⚪ | — | Tài liệu §3 — chỉ kiểm được sau 2026-11-01 (`RISK-02`) |

### STORY-SLEG-03 — Tính điểm BXH

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-11 | Lượt quay ở cả 3 game Slot đều được tính điểm | Điểm cộng dồn từ Treasure Chest, Avenger, Alien Blast | Quay Win ở mỗi game → `My Score` tăng sau khi thoát game. Đo: Alien 6 Win → 6; Treasure Chest 4 Win → +4 (+1 từ mốc 50.000); Avenger 3 Win → +3 | 🟢 | — | Tài liệu §3 + kiểm chứng thực tế |
| REQ-FISH-SLEG-12 | Mỗi lượt Win được +1 điểm | Win = lượt quay có tổng tiền thắng **lớn hơn** mức cược của lượt đó | Alien Blast, cược 1.000, 40 lượt có 6 lượt `win > 1000` (tổng thắng 28.000) → `My Score : 6` | 🟢 | — | Tài liệu §3, §10 + kiểm chứng thực tế |
| REQ-FISH-SLEG-13 | Lượt hoà vốn không được tính là Win | Lượt có tiền thắng **bằng** mức cược không +1 điểm | Trong 40 lượt trên có 7 lượt `win = 1000` → điểm vẫn là 6 (không phải 13) | 🟢 | — | Tài liệu (định nghĩa "Win") + kiểm chứng thực tế |
| REQ-FISH-SLEG-14 | Mức cược của slot nhiều dòng = giá trị dòng × số dòng | Ở Treasure Chest/Avenger, "mức cược" để so Win là **tổng cược** (Value × Lines) | Value 100 × 20 dòng = 2.000: lượt `WinCash = 2000` **không** +1; lượt `WinCash > 2000` +1 | 🟢 | — | Kiểm chứng thực tế — tài liệu không nói rõ với slot nhiều dòng |
| REQ-FISH-SLEG-15 | Mỗi 50.000 vàng thắng được +1 điểm | Điểm = số Win + ⌊tổng vàng thắng / 50.000⌋ | Tổng vàng thắng cộng dồn 58.700 → có +1 điểm từ phần vàng thắng | 🟢 | — | Tài liệu §3, §10 + kiểm chứng thực tế |
| REQ-FISH-SLEG-16 | Phần vàng thắng chưa đủ 50.000 được giữ lại trong phiên | Phần dư dưới 50.000 chỉ giữ trong phiên chơi đang diễn ra | Phiên 1 thắng 28.000, phiên 2 thắng 30.700 → theo tài liệu: không có +1 (mỗi phiên < 50.000). **Đo thực tế: có +1** (cộng dồn qua phiên và qua game) | 🟢 | — | Tài liệu §3, §10 — **lệch UI** (`AMB-06` 🔴) |
| REQ-FISH-SLEG-17 | "Vàng thắng" tính trên tổng tiền thắng, chưa trừ cược | Vàng thắng dùng cho điểm và nhiệm vụ là tổng tiền thắng của các lượt | Nhiệm vụ K4 sau 74 lượt hiển thị `84600` = Σ tiền thắng các lượt (không trừ tiền cược) | 🟢 | — | Tài liệu (định nghĩa) + kiểm chứng thực tế |
| REQ-FISH-SLEG-18 | Không áp dụng mức cược tối thiểu | Lượt quay ở mọi mức cược đều được tính điểm và nhiệm vụ | Quay ở mức thấp nhất (Alien 1.000; Treasure Chest/Avenger 100 × 20) → điểm và T4 đều tăng | 🟢 | — | Tài liệu §3 + kiểm chứng thực tế |
| REQ-FISH-SLEG-19 | Người chưa sub vẫn được tính điểm | Điều kiện sub chỉ áp dụng khi nhận thưởng | Account `is_sub: false` quay Win → `My Score` tăng, có hạng trên BXH | 🟢 | — | Tài liệu §3, §4 + kiểm chứng thực tế |
| REQ-FISH-SLEG-20 | Điểm hiển thị tăng ngay trong phiên khi đủ mỗi 50.000 | Trong một phiên, đủ mỗi 50.000 vàng thắng thì điểm hiển thị tăng | Đang trong game, thắng cộng dồn ≥ 50.000 → điểm hiển thị tăng mà không cần thoát game | ⚪ | — | Tài liệu §3 — không có chỗ hiển thị điểm trong game (gắn với REQ-05) |

### STORY-SLEG-04 — Hiển thị BXH & thể lệ

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-21 | Khối BXH hiển thị top 3 | Top 3 gồm avatar, nickname, điểm, huy hiệu hạng | Tab hiển thị 3 vị trí `Rank1`→`Rank3` với nickname và điểm khớp `top[0..2]` server trả | 🟢 | — | Kiểm chứng thực tế · mockup §9 |
| REQ-FISH-SLEG-22 | Hiển thị hạng và điểm của người dùng | Khối BXH có `My ranking` và `My Score` | Nhãn **khớp mẫu** `My ranking : <n>` và `My Score : <n>`, giá trị = `rank`/`score` server trả | 🟢 | — | Tài liệu §10 + kiểm chứng thực tế |
| REQ-FISH-SLEG-23 | Người chưa có điểm hiển thị hạng 0 | Người chưa có điểm thấy hạng `0` | Account 0 điểm → `My ranking : 0`; trong BXH đầy đủ dòng của mình hiển thị số thứ tự `0` | 🟢 | — | Kiểm chứng thực tế — ngoài tài liệu (`AMB-11`) |
| REQ-FISH-SLEG-24 | BXH xếp theo điểm giảm dần | Người điểm cao xếp trên | Sau khi đạt 6 điểm, account xếp hạng 4, trên `BEOTEST` (5 điểm) và dưới hạng 3 (498 điểm) | 🟢 | — | Tài liệu §10 + kiểm chứng thực tế |
| REQ-FISH-SLEG-25 | Bằng điểm: ai đạt trước xếp trên | Hai người bằng điểm → người đạt số điểm đó sớm hơn xếp trên | Account A đạt N điểm trước account B (cùng N) → A có hạng nhỏ hơn B | 🟢 | — | Tài liệu §3, §10 — chưa kiểm chứng (cần 2 account cùng điểm) |
| REQ-FISH-SLEG-26 | BXH đầy đủ hiển thị tối đa Top 100 | Bấm vào khối BXH mở danh sách đầy đủ | Bấm khối BXH (`OnClick_Rank`) → popup top 3 + danh sách từ hạng 4; số dòng tối đa 100 | 🟢 | — | Tài liệu §10 + kiểm chứng thực tế (popup mở được; giới hạn 100 chưa kiểm được — chỉ 5 người có điểm, `RISK-03`) |
| REQ-FISH-SLEG-74 | BXH đầy đủ ghim dòng của người dùng ở cuối | Tách từ REQ-26 | Popup BXH đầy đủ có dòng `itemYour` (số thứ tự, nickname, điểm của người dùng) cố định cuối danh sách | 🟢 | — | Tài liệu §10 ("thứ hạng của người dùng") + kiểm chứng thực tế |
| REQ-FISH-SLEG-27 | BXH tự làm mới mỗi 60 giây | Khối BXH có đồng hồ `Refresh in: mm:ss` đếm tới lần làm mới | Đồng hồ đếm ngược từ `01:00`; về 0 thì client gọi lại BXH (`time_refresh: 60000`) | 🟢 | — | Kiểm chứng thực tế — ngoài tài liệu |
| REQ-FISH-SLEG-28 | Popup Rule hiển thị mô tả sự kiện | Rule có tiêu đề, thời gian, mô tả | Bấm `Rule` → popup tiêu đề `Rule`, dòng thời gian (REQ-07), đoạn mô tả = `rules` server trả; nút `Back` đóng popup | 🟢 | — | Kiểm chứng thực tế |
| REQ-FISH-SLEG-29 | Thể lệ có phần giải cuối sự kiện | Màn sự kiện có phần thể lệ giải cuối sự kiện (cơ cấu giải, điều kiện sub, cách rút thăm) | Rule (hoặc vị trí tương đương) mô tả được cơ cấu giải §8.2 và điều kiện nhận giải §8.1 | ⚪ | — | Tài liệu §10 "Giao diện" — Rule hiện chỉ có 1 câu mô tả + thời gian (`AMB-07`) |

### STORY-SLEG-05 — Nhiệm vụ hằng ngày

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-30 | Mỗi ngày hiển thị đúng 5 nhiệm vụ | | Khối nhiệm vụ có 5 dòng = 5 phần tử `daily_tasks` | 🟢 | — | Tài liệu §5 + kiểm chứng thực tế |
| REQ-FISH-SLEG-31 | Cơ cấu 2 dễ · 2 trung bình · 1 khó | | Nhóm (`group`) của 5 nhiệm vụ = `easy, easy, medium, medium, hard`. Ngày 20261016: D3, D1, T2, T4, K4 | 🟢 | — | Tài liệu §5 + kiểm chứng thực tế |
| REQ-FISH-SLEG-32 | 5 nhiệm vụ trong ngày không trùng nhau | | 5 mã (`code`) đôi một khác nhau | 🟢 | — | Tài liệu §5, §10 + kiểm chứng thực tế (1 ngày) |
| REQ-FISH-SLEG-33 | Nhiệm vụ hiển thị theo thứ tự dễ → khó | | Dòng 1–2 thuộc nhóm dễ, 3–4 trung bình, 5 khó | 🟢 | — | Tài liệu §5 + kiểm chứng thực tế |
| REQ-FISH-SLEG-34 | Nhiệm vụ lấy từ kho 15 nhiệm vụ | Kho gồm D1–D5, T1–T6, K1–K4 với điều kiện và số lượng theo §5 | Mọi `code` trong ngày thuộc kho; `completion_point` và tên khớp bảng (ví dụ T4 "Spin 300 times in total" = 300, K4 "Win a total of 20,000,000 gold" = 20.000.000) | 🟢 | — | Tài liệu §5 + kiểm chứng thực tế (5/15 mã) |
| REQ-FISH-SLEG-35 | Nhiệm vụ reset lúc 00:00 giờ Myanmar (UTC+6:30) | | Bộ nhiệm vụ đổi và tiến độ về 0 lúc 00:00 UTC+6:30. **Đo thực tế:** `time_refresh` trỏ tới **00:00 UTC+7** (`17:00Z`) | 🟢 | — | Tài liệu §5, §10 — **lệch UI** (`AMB-03` 🔴) |
| REQ-FISH-SLEG-36 | Mọi người dùng cùng một bộ nhiệm vụ trong ngày | | 2 account bất kỳ cùng ngày → cùng danh sách `code` | 🟢 | — | Tài liệu §10 + kiểm chứng thực tế (`chicken` và `camella2` cùng D3, D1, T2, T4, K4 ngày 20261016) |
| REQ-FISH-SLEG-37 | Mỗi dòng nhiệm vụ hiển thị tên, phần thưởng, tiến độ, nút | | Dòng có: tên nhiệm vụ (tiếng Anh), biểu tượng + số lượng phần thưởng (`x5000`, `x10`, `x<n>`), tiến độ `<hiện tại>/<mục tiêu>` và nút (`Go` khi chưa xong — xem REQ-72) | 🟢 | — | Kiểm chứng thực tế (tiến độ hiển thị `0/20000000` không phân cách hàng nghìn — `AMB-11`) |
| REQ-FISH-SLEG-38 | Nhiệm vụ "nhiều phiên" cộng dồn lượt quay ở mọi game | T4 "Quay tổng cộng 300 lần" | Sau 40 lượt Alien + 20 Treasure Chest + 10 Avenger + 3 Treasure Chest + 1 Alien → tiến độ `74/300` | 🟢 | — | Tài liệu §5, §10 + kiểm chứng thực tế |
| REQ-FISH-SLEG-39 | Nhiệm vụ cộng dồn vàng thắng qua nhiều phiên | K4 "Thắng tổng cộng 20.000.000 vàng" | Tiến độ K4 = Σ vàng thắng mọi phiên mọi game (đo `84600`) | 🟢 | — | Tài liệu §5, §10 + kiểm chứng thực tế |
| REQ-FISH-SLEG-40 | Mỗi phiên hợp lệ ở bất kỳ game Slot được tính 1 cho nhiệm vụ phiên | D1 "Hoàn thành 5 phiên chơi Slot"; phiên = vào game đến khi thoát | Mỗi lần vào → quay → thoát ở bất kỳ game nào → D1 +1 ngay sau khi thoát. **Đo thực tế không nhất quán** (9 phiên, chỉ 4 được tính) | 🟢 | — | Tài liệu §5 + định nghĩa "Phiên chơi" — **lệch UI** (`AMB-09` 🔴) |
| REQ-FISH-SLEG-41 | Nhiệm vụ "trong 1 phiên" không cộng dồn giữa các phiên và giữa các game | D3/T2/K3 (số Win trong 1 phiên), D4/T1/K1 (vàng thắng trong 1 phiên) | Phiên 1 đạt 6 Win, phiên 2 đạt 4 Win → D3 (10 Win/1 phiên) vẫn `0/1` | 🟢 | — | Tài liệu §10 + kiểm chứng thực tế |
| REQ-FISH-SLEG-42 | BigWin = lượt thắng từ 50 lần mức cược (Alien Blast tính cả chuỗi Cascade) | Dùng cho T3, K2 | Lượt thắng ≥ 50 × cược → tính 1 BigWin; < 50 × cược (kể cả khi game hiện chữ BIG WIN từ 7×) → không tính | 🟢 | — | Tài liệu (định nghĩa), §10 — mâu thuẫn ghi chú "7 lần cược" ở T3 (`AMB-08`) |
| REQ-FISH-SLEG-43 | Bấm Go ở nhiệm vụ áp dụng mọi game → mở Alien Blast | | Người dùng đã sub bấm `Go` ở nhiệm vụ `game: all` → vào scene Alien Blast (`go_game: reactoonz`) | 🟢 | — | Tài liệu §5 + kiểm chứng thực tế (với account chưa sub — xem REQ-44) |
| REQ-FISH-SLEG-44 | Người chưa sub bấm Go thấy popup mời đăng ký sub | | Account `is_sub: false` bấm `Go` → hiện popup mời sub, **không** vào game. **Đo thực tế:** vào thẳng Alien Blast | 🟢 | — | Tài liệu §4, §5 — **lệch UI, nghi bug** (`AMB-10` 🔴) |
| REQ-FISH-SLEG-45 | Nhiệm vụ riêng một game điều hướng thẳng vào game đó | | Nhiệm vụ có `game` = một game cụ thể (ví dụ T6 "Quay 50 lần ở Alien Blast") → `Go` mở đúng game đó | 🟢 | — | Tài liệu §5 — chưa gặp nhiệm vụ riêng game trong ngày khảo sát |
| REQ-FISH-SLEG-46 | Thưởng nhiệm vụ chỉ nhận trong ngày diễn ra nhiệm vụ | | Nhiệm vụ hoàn thành hôm nay, chưa nhận → sau 00:00 reset không còn nhận được | 🟢 | — | Tài liệu §4 — chưa kiểm chứng |
| REQ-FISH-SLEG-72 | Nhiệm vụ đã đạt: nút đổi từ `Go` sang `Claim` | Trạng thái "đạt, chưa nhận" thể hiện bằng nhãn nút | Tiến độ đạt mục tiêu (`1/1`, `300/300`) → nhãn nút = `Claim`; nhiệm vụ chưa đạt giữ `Go` | 🟢 | — | Kiểm chứng thực tế — tài liệu chỉ gọi chung là "Nhận" |
| REQ-FISH-SLEG-73 | Server báo hoàn thành nhiệm vụ ngay trong phiên chơi | Không cần thoát game mới biết đã xong | Ngay khi lượt quay làm nhiệm vụ đạt mục tiêu → client nhận push `NoticeOfMission` (`event: SLOT-LEGENDS`, `content: "<cur>/<target>"`, `status: 1`). Đo: D3 lúc 10:03:48Z, T2 10:09:20Z, T4 10:19:23Z | 🟢 | — | Kiểm chứng thực tế · `API · NoticeOfMission` — hiển thị toast `MissionNoti` chưa chụp được |

### STORY-SLEG-06 — Thưởng nhiệm vụ

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-47 | Mỗi nhiệm vụ thưởng 5.000 vàng + 10 Star + vật phẩm | | Mỗi dòng hiển thị `x5000` (vàng), `x10` (Star) và vật phẩm; `reward.coin = 5000`, `reward.star = 10` | 🟢 | — | Tài liệu §6 + kiểm chứng thực tế |
| REQ-FISH-SLEG-48 | Vật phẩm thưởng gán theo vị trí nhiệm vụ trong ngày | | Vị trí 1: 2 x2 Đạn (`FastShoot 2`) · 2: 2 Đóng băng (`Freeze 2`) · 3: 2 Tập trung (`Snipe 2`) · 4: 1 x4 Đạn (`FastShootX4 1`) · 5: 1 x2 Đạn + 1 Tập trung (`FastShoot 1`, `Snipe 1`) | 🟢 | — | Tài liệu §6 + kiểm chứng thực tế (vị trí 3 tài liệu ghi "2 x2 Tập trung" — `AMB-08`) |
| REQ-FISH-SLEG-49 | Người đã sub bấm Nhận: cộng vàng và vật phẩm ngay | | Account đã sub, nhiệm vụ hoàn thành → bấm Nhận → số dư +5.000, vật phẩm vào kho, dòng chuyển trạng thái đã nhận | 🟢 | — | Tài liệu §4, §10 — chưa kiểm chứng: 9/9 account đăng nhập được đều `is_sub: false` (`AMB-14`) |
| REQ-FISH-SLEG-50 | Người chưa sub bấm Claim: không được cộng thưởng | | `chicken` (`is_sub: false`) hoàn thành T4 → bấm `Claim` → server `ClaimTaskRewardSlotLegends` trả `err: 4, status: false`; số dư giữ nguyên 19.424.290; nút vẫn `Claim` | 🟢 | — | Tài liệu §4 + kiểm chứng thực tế |
| REQ-FISH-SLEG-71 | Người chưa sub bấm Claim nhiệm vụ: hiện popup mời sub | Tách từ REQ-50 (một REQ = một rule) | Account chưa sub bấm `Claim` ở nhiệm vụ đã xong → hiện popup mời sub. **Đo thực tế:** không có phản hồi nào trên UI | 🟢 | — | Tài liệu §4 — **lệch UI, nghi bug** (`AMB-10` 🔴) |
| REQ-FISH-SLEG-51 | 10 Star của nhiệm vụ cộng vào tiến trình theo thời điểm đã chốt | | Theo §10: cộng **ngay khi hoàn thành**; theo §4: cộng khi hoàn thành **và** bấm nhận. **Đo thực tế:** hoàn thành 3 nhiệm vụ → `current_star` vẫn `0` trước khi nhận (khớp §4) | 🟢 | — | Tài liệu §4 / §10 — mâu thuẫn nội bộ (`AMB-12`) |
| REQ-FISH-SLEG-52 | Tối đa 50 Star và 25.000 vàng mỗi ngày từ nhiệm vụ | | Hoàn thành đủ 5 nhiệm vụ → tổng nhận trong ngày = 50 Star, 25.000 vàng | 🟢 | — | Tài liệu §6 — chưa kiểm chứng |

### STORY-SLEG-07 — Thưởng theo tiến trình Star

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-53 | Thanh tiến trình có 5 mốc 50 · 150 · 350 · 700 · 1.200 Star | | Thanh Star hiển thị 5 mốc với nhãn `50`, `150`, `350`, `700`, `1200`; `star_reward[].star` khớp | 🟢 | — | Tài liệu §7 + kiểm chứng thực tế |
| REQ-FISH-SLEG-54 | Hiển thị số Star hiện có | | Ô số Star = `current_star` server trả (đo: `0`) | 🟢 | — | Kiểm chứng thực tế |
| REQ-FISH-SLEG-55 | Phần thưởng mỗi mốc đúng bảng §7 | | Mốc 1: 10.000 vàng + 5 Đóng băng + Ocean Gun 1 ngày · Mốc 2: 50.000 + 10 Tập trung + Steel Gun 1 ngày · Mốc 3: 100.000 + 20 x2 Đạn + Cosmos Gun 1 ngày · Mốc 4: 200.000 + 10 x4 Đạn + Galaxy Gun 1 ngày · Mốc 5: 300.000 + 20 x4 Đạn + Galaxy Gun 7 ngày | 🟢 | — | Tài liệu §7 + kiểm chứng thực tế (`star_reward`) |
| REQ-FISH-SLEG-56 | Bấm quà mốc chưa đạt: xem trước phần thưởng, không cộng thưởng | | 0 Star, bấm quà mốc 1 → popup liệt kê `x10000` vàng, `x5` Đóng băng, Ocean Gun `1 DAY`; số dư không đổi | 🟢 | — | Kiểm chứng thực tế — ngoài tài liệu (client vẫn gửi yêu cầu nhận, server trả `err: 2` — `AMB-13`) |
| REQ-FISH-SLEG-57 | Người đã sub bấm Nhận mốc đã đạt: cộng thưởng ngay | | Đạt ≥ 50 Star, đã sub → bấm quà mốc 1 → nhận đủ thưởng mốc 1, mốc chuyển trạng thái đã nhận | 🟢 | — | Tài liệu §4, §7 — chưa kiểm chứng (`AMB-14`) |
| REQ-FISH-SLEG-58 | Người chưa sub bấm Nhận mốc đã đạt: popup mời sub | | Đạt ≥ 50 Star, chưa sub → bấm quà → popup mời sub, chưa nhận | 🟢 | — | Tài liệu §4, §7 — chưa kiểm chứng (cần ≥ 50 Star) |
| REQ-FISH-SLEG-59 | Thưởng mốc nhận được đến hết thời gian sự kiện | | Mốc đạt từ ngày trước vẫn nhận được trong ngày sau, cho tới `end` | 🟢 | — | Tài liệu §4 — chưa kiểm chứng |

### STORY-SLEG-08 — Điều kiện sub & popup mời sub

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-60 | Server trả trạng thái sub của người dùng | Cờ quyết định hành vi nhận thưởng | Response BXH và nhiệm vụ có trường boolean `is_sub` (đo: `false` với `chicken`) | 🟢 | — | `API · leaderboardWinnerSlotLegends` · `SlotLegendsDayMission` |
| REQ-FISH-SLEG-61 | Popup mời sub có nội dung quyền lợi, nút Đăng ký, nút X | | Popup hiển thị nội dung giới thiệu quyền lợi; `Đăng ký` dẫn tới luồng đăng ký gói; `X` đóng popup | ⚪ | — | Tài liệu §4 — chưa quan sát được popup (`AMB-10`) |
| REQ-FISH-SLEG-62 | Đăng ký sub từ popup thì nhận được các thưởng đã đạt | | Chưa sub, đã đạt tiến trình → đăng ký sub từ popup → nhận được thưởng nhiệm vụ (trong ngày) và mốc đã đạt | ⚪ | — | Tài liệu §4 — luồng đăng ký gói nằm ngoài game, chưa kiểm được (`RISK-04`) |
| REQ-FISH-SLEG-63 | Người đã sub từ trước sự kiện mặc nhiên đủ điều kiện | | Account sub trước `start` → `is_sub: true`, nhận thưởng không cần đăng ký lại | 🟢 | — | Tài liệu §4 — chưa kiểm chứng (không có account đã sub — `AMB-14`) |

### STORY-SLEG-09 — Giải cuối sự kiện

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-64 | Hết kỳ: chốt BXH | | Sau `end`, BXH không còn thay đổi | 🟢 | — | Tài liệu §8.1 — chỉ kiểm được sau 2026-11-01 (`RISK-02`) |
| REQ-FISH-SLEG-65 | Danh sách xét giải = top 50 người đủ điều kiện (đang sub tại thời điểm tổng kết) | | Duyệt BXH từ hạng 1, bỏ qua người không sub, dừng khi đủ 50 người | 🟢 | — | Tài liệu §8.1, §10 — đội Dev xác minh |
| REQ-FISH-SLEG-66 | Rút thăm lần lượt Khuyến khích ×2 → Ba → Nhì → Nhất | | 5 lượt theo đúng thứ tự; mỗi lượt 1 người | 🟢 | — | Tài liệu §8.1 — đội Dev xác minh |
| REQ-FISH-SLEG-67 | Người đã trúng không tham gia lượt sau | | 5 người trúng đôi một khác nhau | 🟢 | — | Tài liệu §8.1 — đội Dev xác minh |
| REQ-FISH-SLEG-68 | Cơ cấu giải theo bảng §8.2 | | Nhất: 500.000 MMK + 50.000.000 vàng + 50 x4 Đạn + Cosmos Gun 30 ngày · Nhì: 30.000.000 vàng + 30 x4 Đạn + Cosmos Gun 14 ngày · Ba: 10.000.000 vàng + 15 x4 Đạn + Cosmos Gun 7 ngày · KK (×2): 5.000.000 vàng + 15 x2 Đạn + Cosmos Gun 7 ngày | 🟢 | — | Tài liệu §8.2 |
| REQ-FISH-SLEG-69 | Giải gửi qua hộp thư | | Người trúng nhận thư trong Mail box chứa phần thưởng (trừ 500.000 MMK chuyển thủ công) | 🟢 | — | Tài liệu §10 "Trả thưởng" — liên quan module `MAIL` |
| REQ-FISH-SLEG-75 | Mở thư giải thưởng nhận được đủ vàng và vật phẩm | Tác tạo "thư" phải dùng được đúng mục đích | Người trúng mở thư giải → nhận vào tài khoản đúng phần vàng + vật phẩm của giải (REQ-68); thư chuyển trạng thái đã nhận | 🟢 | — | Tài liệu §10 — đội Dev / người trúng xác minh sau khi rút thăm (`RISK-02`) |

### STORY-SLEG-10 — Lỗi & edge case

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-FISH-SLEG-70 | Yêu cầu nhận thưởng bị server từ chối phải có phản hồi cho người dùng | Khi server trả lỗi (`err ≠ 0`), người dùng cần biết vì sao không nhận được | Gửi nhận thưởng bị từ chối → UI hiện thông báo lý do (chưa đạt / chưa sub / đã nhận). **Đo thực tế:** `err: 2` không có thông báo | ⚪ | — | Kiểm chứng thực tế — ngoài tài liệu (`AMB-13`) |

---

## 6.3. Đặc tả dữ liệu

Game không có form nhập liệu ở module này. Bảng dưới là **trường hiển thị** ánh xạ với dữ liệu server (quan sát thụ động).

| Trường (nhãn UI) | Loại UI | Ràng buộc / định dạng | REQ liên quan | Ánh xạ dữ liệu server |
|---|---|---|---|---|
| Đếm ngược hết kỳ (nhãn tab) | Label | `Refresh in: <d>d:<hh>:<mm>:<ss>` | 02, 09 | `leaderboardWinnerSlotLegends.time_end_event` (ms) |
| Thời gian kỳ (Rule) | Label | `YYYY-MM-DD HH:mm:ss --- YYYY-MM-DD HH:mm:ss` | 07, 08 | `start`, `end` |
| Mô tả (Rule) | Label | Văn bản server trả | 28 | `rules` |
| Đồng hồ làm mới BXH | Label | `Refresh in: mm:ss`, chu kỳ 60 s | 27 | `time_refresh = 60000` |
| My ranking / My Score | Label | `My ranking : <n>` · `My Score : <n>` | 22, 23 | `rank`, `score` |
| Top BXH | Danh sách | nickname, điểm, avatar | 21, 26 | `top[] {nickname, score, rank, avatar, id, change, status_claim, award}` |
| Tên nhiệm vụ | Label | Tiếng Anh, sinh từ khoá dịch + tham số | 34, 37 | `daily_tasks[].task_name` · `nameKey` (`sl_mission_<code>`) · `nameArgs` |
| Tiến độ nhiệm vụ | Label trong nút Go | `<current>/<target>`, số nguyên không phân cách | 37–41 | `current_point` / `completion_point` |
| Trạng thái nhiệm vụ | (nút) | Vẫn `0` cả khi đã đạt chưa nhận (trạng thái "đạt" suy từ `current_point ≥ completion_point`, nút đổi thành `Claim`); giá trị sau khi nhận chưa quan sát được | 49–51 | `daily_tasks[].status` |
| Nhóm / mã / game / điều hướng | — | `easy|medium|hard` · `D1..K4` · `all|<game>` · `reactoonz` | 31–34, 43–45 | `group`, `code`, `game`, `go_game` |
| Phần thưởng nhiệm vụ | Biểu tượng + `x<n>` | vàng · Star · vật phẩm | 47, 48 | `reward {coin, star, item_json{FastShoot, FastShootX4, Freeze, Snipe, …}, gun_json{…}}` |
| Số Star | Label | số nguyên | 54 | `current_star` (còn có `star` — chưa rõ nghĩa) |
| Cờ có thưởng chờ nhận | — | `1` khi có nhiệm vụ đạt chưa nhận · `2` khi không có (suy từ quan sát) | 72 | `status_reward` |
| Thông báo hoàn thành trong phiên | Toast (`MissionNoti`) | `{title, content: "<cur>/<target>", status: 1, event: "SLOT-LEGENDS"}` | 73 | Push `NoticeOfMission` |
| Mốc Star | 5 nút quà + nhãn | 50 · 150 · 350 · 700 · 1200 | 53, 55–59 | `star_reward[] {id, star, reward, status}` |
| Súng thưởng có thời hạn | Label | `<n> DAY` | 55 | `gun_json.<Gun> = <số ngày>` |
| Trạng thái sub | — | boolean | 60 | `is_sub` |

**Tên vật phẩm UI ↔ khoá dữ liệu (suy từ đối chiếu bảng §6/§7 với payload):** x2 Đạn = `FastShoot` · x4 Đạn = `FastShootX4` · Đóng băng = `Freeze` · Tập trung = `Snipe` · Ocean Gun = `OceannGun` (sai chính tả trong khoá) · Steel/Cosmos/Galaxy Gun = `SteelGun`/`CosmosGun`/`GalaxyGun`.

---

## 6.4. Business rules & thông báo

| REQ ID | Rule / Trigger | Thông báo mong đợi (nguyên văn) |
|---|---|---|
| REQ-FISH-SLEG-12/13/14 | Win khi `tiền thắng > tổng cược của lượt` | — (không có thông báo; chỉ điểm thay đổi) |
| REQ-FISH-SLEG-15/16 | `Điểm = Σ Win + ⌊Σ vàng thắng / 50.000⌋` | — |
| REQ-FISH-SLEG-44 / 50 / 58 | Chưa sub bấm Go / Nhận | Tài liệu: popup mời sub (nội dung chưa có nguyên văn). UI: không có popup |
| REQ-FISH-SLEG-56 | Bấm quà mốc chưa đạt | Popup xem trước phần thưởng (không có chữ). Server: `{"err": 2, "status": false}` |
| REQ-FISH-SLEG-70 | Server từ chối nhận thưởng | Không có thông báo (đang thiếu) |
| REQ-FISH-SLEG-50 / 71 | Chưa sub bấm `Claim` nhiệm vụ đã đạt | Tài liệu: popup mời sub. UI: không phản hồi. Server: `{"err": 4, "status": false}` |

---

## 6.5. Ma trận phân quyền (theo trạng thái sub)

Hệ thống chỉ có 1 vai trò (Người chơi); ma trận theo **trạng thái sub** — điều kiện quyết định quyền nhận thưởng.

| Hành động | Chưa sub | Đã sub |
|---|---|---|
| Xem tab Slot Legends, BXH, Rule | ✅ | ❔ |
| Được tính điểm BXH | ✅ | ❔ |
| Được tính tiến độ nhiệm vụ | ✅ | ❔ |
| Bấm Go → vào game | ✅ (vào thẳng game — tài liệu yêu cầu popup mời sub, `AMB-10`) | ❔ |
| Nhận thưởng nhiệm vụ | ❌ (server trả `err: 4`, không cộng — nhưng thiếu popup mời sub) | ❔ |
| Nhận thưởng mốc Star | ❔ (chưa đạt mốc 50) | ❔ |
| Đủ điều kiện giải cuối sự kiện | ❔ (tài liệu: không) | ❔ (tài liệu: có) |

`Tổng 14 ô = Đã kiểm chứng 5 · Suy diễn 0 · Chưa rõ 9 · Không áp dụng 0`. Cột **Đã sub** toàn `❔`: 9/9 account đăng nhập được đều `is_sub: false` → `AMB-14` 🔴. Hai ô `❔` của cột Chưa sub: chưa đạt mốc 50 Star (và theo `AMB-12` có thể không bao giờ đạt được), giải cuối chỉ xét sau `end`.

---

## 6.6. Ma trận trạng thái

Áp dụng chung cho **nhiệm vụ** và **mốc Star** (cùng vòng đời "phần thưởng có thể nhận").

| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện |
|---|---|---|---|
| Chưa đạt (`status 0`) | Bấm Go (nhiệm vụ) · bấm quà để xem trước (mốc) | Không đổi | Mọi người dùng |
| Chưa đạt | Chơi đủ điều kiện | Đạt, chưa nhận | Hệ thống (server tính) |
| Đạt, chưa nhận | Bấm Nhận | Đã nhận | Người đã sub |
| Đạt, chưa nhận | Bấm Nhận | Không đổi + popup mời sub | Người chưa sub |
| Đạt, chưa nhận (nhiệm vụ) | Qua 00:00 reset | Hết hạn — mất thưởng | Hệ thống |
| Đạt, chưa nhận (mốc) | Qua `end` | Hết hạn | Hệ thống |
| Đã nhận | — | — | — |

Kỳ sự kiện: `status_event = 1` (đang diễn ra) → hết `end` → chốt BXH → rút thăm → gửi thư. Giá trị `status_event` khi kết thúc chưa quan sát (BXH các sự kiện khác đang trả `-1`).

---

## 6.7. Ambiguities & Risks

### Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-01 | `Slot_Legends_Event.md` (tiêu đề "ĐỀ XUẤT") có phải bản cuối dev dùng để code không? | Mọi chỗ lệch dưới đây có thể là tài liệu lỗi thời chứ không phải bug | 🔴 | Là bản cuối → tài liệu là chuẩn | ❓ | — |
| AMB-02 | Kỳ kéo dài 30 ngày (tài liệu) hay 57 ngày (bản TEST: 2026-09-05 07:28 → 2026-11-01 00:00)? Mốc thật của đợt? | Sai thời lượng → sai mốc tham chiếu §7 (đạt mốc 5 sau 24 ngày) | 🔴 | Theo cấu hình PO chốt; bản TEST có thể chỉ là cấu hình thử | ❓ | — |
| AMB-03 | Mốc thời gian của sự kiện theo múi giờ nào? Tài liệu: reset 00:00 **UTC+6:30**; đo thực tế cả hết kỳ lẫn reset nhiệm vụ đều 00:00 **UTC+7** | Người chơi Myanmar bị reset lúc 23:30 giờ địa phương — mất thưởng nhiệm vụ chưa nhận sớm 30 phút | 🔴 | UTC+6:30 như tài liệu | ❓ | — |
| AMB-04 | Banner Home (1 lần/ngày) và icon trong từng game đã làm chưa? `getListPopups` trả 6 banner cũ, không có Slot Legends — kể cả với 8 account chưa đăng nhập trong ngày; không có node icon nào trong 3 game | Thiếu lối vào → giảm tham gia | 🔴 | Chưa làm (⚪) | ❓ | — |
| AMB-05 | §10 ghi "3 tab: BXH, Nhiệm vụ, Thưởng tiến trình"; UI và mockup King of Fishing là **1 màn gộp** | TC kiểm "3 tab" sẽ FAIL oan | 🟡 | 1 màn gộp như mockup là đúng | ❓ | — |
| AMB-06 | Phần vàng thắng < 50.000 giữ **trong phiên** (tài liệu) hay **cộng dồn cả kỳ** (thực tế: 28.000 + 30.700 → +1 điểm)? | Sai công thức → BXH sai, ảnh hưởng giải cuối | 🔴 | Theo tài liệu (giữ trong phiên) | ❓ | — |
| AMB-07 | Thể lệ giải cuối sự kiện hiển thị ở đâu? Rule hiện chỉ có 1 câu + thời gian | Người chơi không biết cơ cấu giải và điều kiện sub | 🟡 | Cần bổ sung vào Rule | ❓ | — |
| AMB-08 | Mâu thuẫn nội bộ tài liệu: T3 "Đạt 3 lần BigWin" nhưng điều kiện ghi "Đạt 1 lượt" và chú thích "BIG WIN từ 7 lần cược"; K2 "5 lần BigWin" nhưng điều kiện ghi "2 lượt"; vị trí 3 ghi "2 x2 Tập trung" (payload: `Snipe 2`) | TC không biết dùng số nào | 🟡 | Dùng cột "Số lượng" (T3 = 3, K2 = 5), BigWin ≥ 50×, vị trí 3 = 2 Tập trung | ❓ | — |
| AMB-09 | "Phiên hợp lệ" là gì và D1 cộng khi nào? 9 phiên đo được, chỉ 4 được tính (bảng dưới) | Nhiệm vụ D1 không hoàn thành được như mô tả | 🔴 | Mỗi phiên có ≥ 1 lượt quay = 1, cộng ngay khi thoát | ❓ | — |
| AMB-10 | Người chưa sub bấm Go phải thấy popup mời sub (§4) — thực tế vào thẳng Alien Blast | Lệch luồng chuyển đổi sub — mục tiêu chính của sự kiện | 🔴 | **Nghi bug** | ❓ | — |
| AMB-11 | Hiển thị: người chưa có điểm hiển thị hạng `0`; tiến độ `0/20000000` không phân cách hàng nghìn trong khi tên có `20,000,000` | Khó đọc, dễ hiểu nhầm | 🟢 | Ghi nhận, không chặn | ❓ | — |
| AMB-12 | 10 Star cộng khi nào? §4: khi hoàn thành **và** bấm nhận; §10: ngay khi hoàn thành. **Thực tế:** 3 nhiệm vụ đã xong, Star vẫn 0 trước khi nhận. Hệ quả: người **chưa sub** không bao giờ bấm nhận được → **không bao giờ tích Star**, mâu thuẫn bảng §4 "Tiến trình mốc Star: chưa sub — Được tính bình thường" | Người chưa sub không thể đạt mốc → popup mời sub ở mốc (REQ-58) không bao giờ xuất hiện | 🔴 | Star cộng khi nhận (theo thực tế + §4) | ❓ | — |
| AMB-13 | Bấm quà mốc chưa đạt: client vẫn gửi `ClaimStreakRewardSlotLegends`, server trả `err: 2` không có thông báo. Mã lỗi nghĩa là gì, UI có cần báo? | Người dùng không hiểu vì sao không nhận được | 🟢 | Hiện popup xem trước là đủ | ❓ | — |
| AMB-14 | Account nào đang sub? Đã kiểm cả 10 account trong `.env`: 9 account đăng nhập được đều `is_sub: false`; `Giangtran` đăng nhập lỗi `Username or password is incorect!` (thông tin trong `.env` có thể sai) | Không kiểm được nhánh "đã sub": 1/2 ma trận 6.5 là `❔` | 🔴 | — | ❓ | — |

**Bảng đo cho AMB-09** (cùng ngày, account `chicken`, D1 "Complete 5 Slot sessions"):

| # | Phiên | Số lượt quay | D1 sau khi thoát |
|---|---|---|---|
| 1 | Alien Blast (vào từ nút Go) | 40 | 1 |
| 2 | Treasure Chest | 0 | 1 |
| 3 | Treasure Chest | 20 | 1 |
| 4 | Avenger | 10 | 2 |
| 5 | Treasure Chest | 3 | 3 |
| 6 | Alien Blast | 0 | 3 |
| 7 | Avenger | 0 | 3 |
| 8 | Alien Blast | 1 | 3 |
| 9 | Alien Blast | 226 | 4 |

### Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-01 | Kết quả quay ngẫu nhiên | Không chủ động tạo được Win, BigWin, mức thắng ≥ 1.000.000/phiên → nhiều nhiệm vụ (D4, T1, T3, K1, K2) khó kiểm bằng chơi thật | Xin dev cấu hình kết quả quay / công cụ cộng tiến độ trên bản TEST; kiểm công thức bằng log quay (route `reactoonzSpin`, `SL2`) |
| RISK-02 | Giải cuối và reset kỳ chỉ xảy ra sau `end` (2026-11-01) | REQ-10, 64–69 không kiểm được trong đợt test hiện tại | Xin bản TEST có kỳ ngắn (vài giờ) để chạy trọn vòng đời; Dev cung cấp log rút thăm |
| RISK-03 | Chỉ 5 người có điểm | Không kiểm được giới hạn Top 100, phân trang, hoà điểm | Dùng nhiều account test cùng tích điểm; xin dev nạp dữ liệu BXH mẫu |
| RISK-04 | Luồng đăng ký sub nằm ngoài game (nhà mạng) | REQ-62 không kiểm được end-to-end | Xin account đã sub sẵn + account chưa sub; Dev xác minh nhánh đăng ký |
| RISK-05 | Tiêu vàng khi kiểm | Mỗi lượt quay tốn vàng; account test không có cơ chế nạp | Quay ở mức thấp nhất; theo dõi số dư đầu/cuối; xin cơ chế cấp vàng |
| RISK-06 | Thời điểm reset (00:00) | Kiểm reset nhiệm vụ / hết hạn thưởng cần chạy đúng nửa đêm (UTC+6:30 hoặc UTC+7) | Lên lịch phiên test qua nửa đêm hoặc xin dev đổi giờ server bản TEST |

---

## 6.8. Phân rã Epic / Story

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-SLEG-01 | Lối vào & khung màn hình | REQ-FISH-SLEG-01 → 06 | 6 | AMB-04, AMB-05 | 3 REQ ⚪ (banner, icon) |
| STORY-SLEG-02 | Thời gian & vòng đời kỳ | 07 → 10 | 4 | AMB-02, AMB-03, RISK-02 | REQ-10 ⚪ |
| STORY-SLEG-03 | Tính điểm BXH | 11 → 20 | 10 | AMB-06, RISK-01 | REQ-20 ⚪ |
| STORY-SLEG-04 | Hiển thị BXH & thể lệ | 21 → 29, 74 | 10 | AMB-07, AMB-11, RISK-03 | REQ-29 ⚪ |
| STORY-SLEG-05 | Nhiệm vụ hằng ngày | 30 → 46, 72, 73 | 19 | AMB-03, AMB-08, AMB-09, AMB-10, RISK-06 | |
| STORY-SLEG-06 | Thưởng nhiệm vụ | 47 → 52, 71 | 7 | AMB-12, AMB-14 | |
| STORY-SLEG-07 | Thưởng tiến trình Star | 53 → 59 | 7 | AMB-13, AMB-14 | |
| STORY-SLEG-08 | Điều kiện sub & popup mời sub | 60 → 63 | 4 | AMB-10, AMB-14, RISK-04 | REQ-61, 62 ⚪ |
| STORY-SLEG-09 | Giải cuối sự kiện | 64 → 69, 75 | 7 | RISK-02 | Đội Dev xác minh phần backend |
| STORY-SLEG-10 | Lỗi & edge case | 70 | 1 | AMB-13 | |

**Tổng: 10 Story / 75 REQ** — `6 + 4 + 10 + 10 + 19 + 7 + 7 + 4 + 7 + 1 = 75 ✔`. Mọi REQ thuộc đúng một Story, không mồ côi, không trùng.

**Đối chiếu AMB / RISK:**

| Nhóm | Mã | Nằm ở đâu |
|---|---|---|
| AMB cấp Epic | AMB-01 | Toàn module — quyết định cách hiểu mọi chỗ lệch |
| AMB thuộc Story | AMB-02, 03 | STORY-02 (AMB-03 cũng ảnh hưởng STORY-05) |
| AMB thuộc Story | AMB-04, 05 | STORY-01 |
| AMB thuộc Story | AMB-06 | STORY-03 |
| AMB thuộc Story | AMB-07, 11 | STORY-04 |
| AMB thuộc Story | AMB-08, 09, 10 | STORY-05 (AMB-10 cũng ở STORY-08) |
| AMB thuộc Story | AMB-12 | STORY-06 |
| AMB thuộc Story | AMB-13 | STORY-07, STORY-10 |
| AMB thuộc Story | AMB-14 | STORY-06, 07, 08 |
| RISK cấp Epic | RISK-05 | Toàn module |
| RISK thuộc Story | RISK-01 | STORY-03, 05 |
| RISK thuộc Story | RISK-02 | STORY-02, 09 |
| RISK thuộc Story | RISK-03 | STORY-04 |
| RISK thuộc Story | RISK-04 | STORY-08 |
| RISK thuộc Story | RISK-06 | STORY-05 |

Đủ 14/14 AMB và 6/6 RISK có chủ.

**Hạng mục cấp Epic:** AMB-01 (cách hiểu tài liệu) · RISK-05 (chi phí vàng) · ma trận 6.5 và 6.6 (áp dụng chung cho STORY-05 → 08).

**Thứ tự triển khai đề xuất:**
1. STORY-03 → 04 (tính điểm & BXH — kiểm được ngay, nền tảng của giải cuối).
2. STORY-05 (nhiệm vụ) — **BLOCKED một phần** bởi AMB-09 (D1) và AMB-03 (giờ reset).
3. STORY-06 → 08 (thưởng & sub) — **BLOCKED** bởi AMB-14 (chưa có account đã sub) và AMB-10.
4. STORY-01, 02 (lối vào, thời gian) — chờ AMB-02/03/04.
5. STORY-09 (giải cuối) — chờ hết kỳ hoặc bản TEST kỳ ngắn (RISK-02).
6. STORY-10.

---

## Danh mục Evidence

| Tên tệp | Màn hình | Trạng thái | REQ chứng minh |
|---|---|---|---|
| [events_default_viewport.png](evidence/events_default_viewport.png) | Popup Events | Mở mặc định (tab Online Gifts) | 01 |
| [sleg_tab_after_74_spins_viewport.png](evidence/sleg_tab_after_74_spins_viewport.png) | Tab Slot Legends | Sau 74 lượt — 14 điểm, hạng 4, D1 3/5, T4 74/300 | 01, 02, 06, 21, 22, 30, 37, 38, 53, 54 |
| [../_discovery/evidence/sleg_overview_fullpage.png](../_discovery/evidence/sleg_overview_fullpage.png) | Tab Slot Legends | Account 0 điểm (`girlcute`) — `My ranking : 0` | 23 |
| [sleg_rule_popup_viewport.png](evidence/sleg_rule_popup_viewport.png) | Popup Rule | Mở | 07, 08, 28, 29 |
| [sleg_rank_full_viewport.png](evidence/sleg_rank_full_viewport.png) | BXH đầy đủ | Account chưa có điểm (hạng 0) | 23, 26 |
| [sleg_mission_go_nonsub_viewport.png](evidence/sleg_mission_go_nonsub_viewport.png) | Alien Blast | Sau khi account chưa sub bấm Go — vào thẳng game | 43, 44 |
| [sleg_after_40_spins_viewport.png](evidence/sleg_after_40_spins_viewport.png) | Tab Slot Legends | Sau 40 lượt Alien Blast — 6 điểm, hạng 4 | 11, 12, 13, 24 |
| [sleg_after_sltc_viewport.png](evidence/sleg_after_sltc_viewport.png) | Tab Slot Legends | Sau 20 lượt Treasure Chest — 11 điểm | 11, 14, 15, 16 |
| [sleg_star_gift_click_nonsub_viewport.png](evidence/sleg_star_gift_click_nonsub_viewport.png) | Popup xem trước thưởng mốc 1 | 0 Star, chưa sub | 55, 56 |
| [lobby_after_login_viewport.png](evidence/lobby_after_login_viewport.png) | Sảnh | Ngay sau đăng nhập — không có banner Slot Legends | 03 |
| [sleg_3_missions_done_viewport.png](evidence/sleg_3_missions_done_viewport.png) | Tab Slot Legends | Sau 300 lượt — D3, T2, T4 xong, nút `Claim`; 58 điểm; Star 0 | 15, 16, 38, 41, 51, 72 |
| [sleg_claim_nonsub_viewport.png](evidence/sleg_claim_nonsub_viewport.png) | Tab Slot Legends | Sau khi account chưa sub bấm `Claim` T4 — không có popup | 50, 71 |

Mọi ảnh là **viewport 1920×1080** (game canvas không cuộn — viewport = toàn trang). Ảnh có nickname account test và người chơi khác trên BXH (dữ liệu môi trường TEST).

---

## 6.9. Nhật ký thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 2026-10-16 | Hybrid recon (`Slot_Legends_Event.md` + bản TEST) | REQ-FISH-SLEG-01 → 75 | 🟢 Thêm | Khởi tạo tài liệu: 75 REQ (9 ⚪), 10 Story, 14 AMB (9 🔴), 6 RISK. Tài liệu là chuẩn kỳ vọng; chỗ UI làm khác ghi AMB 🔴 / nghi bug. Cổng tự soát: tách REQ-71 khỏi REQ-50 và REQ-74 khỏi REQ-26 (một REQ = một rule), thu hẹp REQ-10, thêm REQ-75 cho tác dụng của thư giải (tác tạo phải dùng được) | — (chưa có TC) |
