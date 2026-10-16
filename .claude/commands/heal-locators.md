---
description: "Đối chiếu bộ định vị (Locators) trong Page Object với DOM thực tế trên trình duyệt, phát hiện locator đã gãy hoặc mong manh, tự động sửa và kiểm chứng (SCAN / HEAL modes)."
skills:
  - skills-locator-healer-agent
---

# Heal Locators (Workflow Dispatcher)

Rà soát chủ động hoặc khắc phục hàng loạt bộ định vị phần tử (Locators) trong các file Page Object sau khi giao diện ứng dụng thay đổi — đối chiếu trực tiếp với DOM thực tế trên trình duyệt để phát hiện locator đã gãy, mơ hồ hoặc bám thuộc tính động.

## Inputs & Modes
- **Target Page Object(s)**: Đường dẫn file Page Object, thư mục module hoặc toàn bộ thư mục `pages/`.
- **Target URL & Preconditions**: URL trang web tương ứng và các bước tiền đề để mở đúng trạng thái giao diện (VD: đăng nhập, mở modal/tab).
- **Error Log** *(Optional)*: Log lỗi chạy test nếu có để khoanh vùng nhanh các phần tử bị gãy.
- **Mode**:
  - `SCAN` (Mặc định): Quét Page Objects + đối chiếu DOM thực tế -> Xuất báo cáo `reports/locator_scan_report.md` kèm đề xuất locator thay thế (không sửa code).
  - `HEAL`: Thực hiện đầy đủ như `SCAN`, sau khi người dùng duyệt thì cập nhật trực tiếp vào Page Object và chạy lại test kiểm chứng (PASS 2 lần liên tiếp).

## Context Pointers (Lazy-Load On Demand)
- **Locator Healing Process & Risk Scoring**: `.claude/skills/skills-locator-healer-agent/SKILL.md`
- **Resilient Locator Priority Map**: `.claude/skills/skills-smart-locator-agent/SKILL.md`
- **Browser Inspection & Mode Switching**: `.claude/skills/skills-ui-debug-agent/SKILL.md`

## Browser Mode Standard
- **Default Headless Mode (`1920x1080`)**: Mặc định khởi chạy trình duyệt ở chế độ **Headless (`1920x1080`, tắt GPU)** để lấy DOM snapshot và đối chiếu locators nhanh chóng.
- **Opt-in Headed Mode (`1600x750`)**: Nếu cần quan sát trực quan hoặc xử lý đăng nhập phức tạp/CAPTCHA, chuyển sang Headed bằng `/browser-mode` (`node scripts/browser-mode.mjs headed`). Không gọi `browser_resize`.

## Execution Steps

### Bước 1: Trích xuất Locators từ Page Objects & Chấm điểm Rủi ro Tĩnh
1. Đọc toàn bộ các file Page Object trong phạm vi, lập danh sách mọi biến locator kèm vị trí `file:line`.
2. Phân loại rủi ro sơ bộ ngay trên mã nguồn:
   - `🔴 Sẽ gãy`: Chứa class động (`css-1a2b3c`, `sc-xxx`, `Mui...`), ID tự sinh (`:r1:`), XPath tuyệt đối hoặc chỉ số vị trí (`//div[3]/button[2]`, `nth-child`).
   - `🟡 Dễ gãy`: CSS selector phụ thuộc chuỗi cấu trúc nhiều tầng (`div > div > span`).
   - `🟢 Bền`: `getByRole`, `getByLabel`, `data-testid`, hoặc `id`/`name` cố định.

### Bước 2: Mở Trình duyệt, Đưa về Đúng Trạng thái & Đối chiếu DOM Thực tế
1. Điều hướng tới URL đích (mặc định **Headless `1920x1080`**), thực hiện các thao tác tiền đề (mở modal, chọn tab, mở dropdown) để phần tử thực sự xuất hiện trong DOM rồi chụp `browser_snapshot()`.
2. Kiểm tra từng locator trên DOM thực tế và gắn 1 trong 6 trạng thái:
   - `✅ OK`: Khớp đúng 1 phần tử và đúng đối tượng cần tương tác.
   - `⚠️ Mong manh`: Còn khớp nhưng dùng thuộc tính dễ đổi -> cần nâng cấp.
   - `🔴 Gãy`: Khớp `0` phần tử.
   - `🔴 Mơ hồ`: Khớp `> 1` phần tử (gây lỗi strict mode violation).
   - `🔴 Sai phần tử`: Khớp 1 phần tử nhưng không phải phần tử nghiệp vụ mục tiêu.
   - `❓ Chưa kiểm được`: Chưa đưa được giao diện về trạng thái chứa phần tử (ghi rõ lý do, không đoán).

### Bước 3: Sinh Bộ Định vị Thay thế & Xuất Báo cáo (HITL Checkpoint ⏸️)
1. Với mọi locator ở trạng thái `🔴` hoặc `⚠️`, áp dụng thứ tự ưu tiên của `skills-smart-locator-agent` để thiết kế locator mới và kiểm chứng ngay trên DOM (`count === 1`, bền vững sau khi reload).
2. Xuất báo cáo `reports/locator_scan_report.md` với bảng đối chiếu: `File:line | Tên biến | Locator hiện tại | Trạng thái | Locator đề xuất | Lý do`.

⏸️ **DỪNG LẠI (HITL Checkpoint)**: Nếu `Mode = SCAN` -> Kết thúc và bàn giao báo cáo. Nếu `Mode = HEAL` -> Chờ người dùng duyệt danh sách thay thế trước khi sửa code.

### Bước 4: Cập nhật Page Object & Chạy Test Kiểm chứng *(Chỉ khi `Mode = HEAL`)*
1. Thay thế locator trong Page Object nhưng **giữ nguyên tên biến/method** để không làm gãy các file test đang gọi.
2. Chạy lại các bài test sử dụng Page Object đó (tối đa 3 vòng tinh chỉnh nếu còn lỗi locator) cho đến khi **PASS 2 lần liên tiếp**. Nếu test fail do lỗi nghiệp vụ ứng dụng, giữ nguyên và đề xuất chuyển sang `/run-and-fix-tests`.

## Output
- `reports/locator_scan_report.md` và *(khi `Mode = HEAL`)* các file Page Object đã được cập nhật & kiểm chứng.
