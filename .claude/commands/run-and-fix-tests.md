---
description: "Thực thi bộ Test Automation hiện có, phân loại lỗi theo 6 nhóm nguyên nhân gốc rễ (Root Cause) và tự động sửa các lỗi thuộc phạm vi QA/Automation cho đến khi chạy xanh (RUN / FIX modes)."
skills:
  - skills-test-report-analyzer
---

# Run and Fix Tests (Workflow Dispatcher)

Thực thi bộ Test Automation hiện có (Smoke / Regression / Module), phân tích log lỗi thực tế theo **6 nhóm nguyên nhân gốc rễ (Root Cause Categories)** và tự động khắc phục các lỗi thuộc tầng Automation (`Locator`, `Data`, `Script`, `Flaky/Timing`) trong khi giữ nguyên hiện trường các lỗi thuộc về Ứng dụng (`🐛 Application Bug`).

## Inputs & Modes
- **Scope / Filter**: Toàn bộ suite (mặc định), hoặc lọc theo tag (`@smoke`, `@regression`), module hay đường dẫn file test.
- **Test Runner Command** *(Tự động suy từ `package.json`, `pom.xml`, `pytest.ini` nếu không truyền)*.
- **Mode**:
  - `RUN` (Mặc định): Chạy bộ test -> Phân loại toàn bộ lỗi gom theo Root Cause -> Xuất báo cáo `reports/run_and_fix_report.md`.
  - `FIX`: Thực hiện như `RUN`, sau khi người dùng duyệt danh sách sửa thì tự động sửa các lỗi Automation và chạy lại kiểm chứng (tối đa 3 vòng, phải PASS 2 lần liên tiếp).

## Context Pointers (Lazy-Load On Demand)
- **6 Failure Categories & Root Cause Clustering**: `.claude/skills/skills-test-report-analyzer/SKILL.md`
- **Broken Locator Healing (chỉ đọc khi có lỗi `🎯 Locator`)**: `.claude/skills/skills-locator-healer-agent/SKILL.md`
- **Flaky & Timing Remediation (chỉ đọc khi có lỗi `⏱️ Flaky/Timing`)**: `.claude/skills/skills-flaky-test-analyzer/SKILL.md`
- **Browser DOM Inspection**: `.claude/skills/skills-ui-debug-agent/SKILL.md`

## Browser Mode & Safety Rules
- **Default Headless Mode (`1920x1080`)**: Mặc định chạy bộ test và quét lại DOM ở chế độ **Headless (`1920x1080`)** để đạt tốc độ cao nhất; khi cần quan sát trực quan hoặc xử lý đăng nhập phức tạp thì chuyển sang Headed bằng `/browser-mode` (`node scripts/browser-mode.mjs headed` hoặc `--headed` / `HEADLESS=false` / `-Dheadless=false`).
- **🚨 Nguyên tắc Bất khả xâm phạm với `🐛 Application Bug`**: Tuyệt đối **CẤM sửa bài test cho xanh khi nguyên nhân là lỗi của ứng dụng** (cấm nới lỏng assertion, cấm đổi `expected` theo `actual` sai, cấm gắn `.skip` / `@Ignore` để giấu lỗi). Mọi `🐛 Application Bug` phải giữ nguyên trạng thái đỏ và chuyển sang `/create-bug-report`.

## Execution Steps

### Bước 1: Thực thi Baseline Test Suite
1. Xác định lệnh chạy phù hợp với stack (`npx playwright test`, `mvn test`, `pytest`) và chạy ở chế độ **Headless (`1920x1080`)**.
2. Nếu bộ test không thể khởi chạy do lỗi biên dịch/thiếu thư viện -> dừng ngay và báo rõ lỗi hạ tầng. Nếu **100% PASS** -> xuất báo cáo ngắn gọn và kết thúc.

### Bước 2: Phân loại Failure theo 6 Nhóm & Gom cụm theo Root Cause
Đọc stack trace + error log thực tế và gom các bài test cùng gãy tại một điểm (VD: 8 bài test cùng gãy ở `LoginPage.login()`) thành **1 cụm vấn đề**:
- `🌐 Environment` (Server sập, DB/mạng lỗi) -> **DỪNG NGAY**, báo người dùng, không sửa code.
- `🐛 Application Bug` (API trả 500, tính toán/nghiệp vụ sai so với spec) -> **KHÔNG sửa test**, giữ nguyên đỏ để báo `/create-bug-report`.
- `🎯 Broken Locator` -> Đưa vào danh sách sửa bằng `skills-locator-healer-agent`.
- `📊 Test Data Issue` (Trùng unique key, dữ liệu hết hạn) -> Đưa vào danh sách sửa sang dữ liệu động traceable (`auto_<module>_<timestamp>`).
- `🧪 Test Script Issue` (Sai cú pháp, thiếu bước setup, test viết lệch spec) -> Đưa vào danh sách sửa script.
- `⏱️ Flaky / Timing` (Race condition, thiếu auto-wait/network wait) -> Đưa vào danh sách sửa bằng `skills-flaky-test-analyzer`.

### Bước 3: Xuất Báo cáo Phân tích & Xin Duyệt (HITL Checkpoint ⏸️)
- Xuất file `reports/run_and_fix_report.md` gồm: Bảng tổng quan (`PASS`/`FAIL`/`SKIP`/`FLAKY`), Bảng gom cụm Root Cause, và tách bạch rõ **Danh sách Sẽ Sửa (`🎯`/`📊`/`🧪`/`⏱️`)** vs **Danh sách Không Sửa (`🐛`/`🌐`)**.

⏸️ **DỪNG LẠI (HITL Checkpoint)**: Nếu `Mode = RUN` -> Kết thúc. Nếu `Mode = FIX` -> Chờ người dùng duyệt danh sách sửa.

### Bước 4: Tự động Sửa & Chạy Lại Kiểm chứng *(Chỉ khi `Mode = FIX`)*
1. Sửa tuần tự theo thứ tự ưu tiên: `🎯 Locator` (kiểm chứng trên DOM thật) -> `📊 Data` -> `🧪 Script` -> `⏱️ Flaky`. Ghi rõ từng thay đổi (`file:line`, `Code cũ -> Code mới`).
2. Chạy lại các file vừa sửa và toàn bộ phạm vi ban đầu (tối đa 3 vòng lặp). Mỗi bài test được sửa phải **PASS 2 lần liên tiếp**; nếu việc sửa không giải quyết được nguyên nhân gốc thì rollback thay đổi đó.
3. Cập nhật bảng so sánh `Pass Rate Baseline -> Pass Rate Sau Khi Sửa` vào `reports/run_and_fix_report.md`.

## Output
- `reports/run_and_fix_report.md` và *(khi `Mode = FIX`)* mã nguồn Automation đã được sửa & kiểm chứng chạy xanh.
