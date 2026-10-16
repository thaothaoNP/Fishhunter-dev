---
name: update-automation-from-impact
description: "Cập nhật mã nguồn Test Automation hiện có theo Impact Report (chế độ Delta) — ánh xạ TC thay đổi sang script tương ứng và chỉ sửa đúng phần thay đổi (PLAN / APPLY modes)."
skills:
  - skills-coverage-traceability
  - skills-qa-automation-engineer
---

# Update Automation from Impact (Workflow Dispatcher)

Mắt xích cuối trong chuỗi cập nhật Delta 3 tầng (`/update-requirements-from-ticket` -> `/update-testcases-from-impact` -> **`/update-automation-from-impact`**): ánh xạ các Test Cases vừa thay đổi sang đúng file Automation Script / Page Object tương ứng và **chỉ cập nhật phần bị ảnh hưởng**, bảo toàn tuyệt đối phần code ổn định đã tích lũy.

## Inputs & Modes
- **Impact Source**: File `docs/requirements/<module>/impact/impact_<TICKET-ID>.md`, `docs/testcases/<module>/impact/impact_plan_<TICKET-ID>.md`, hoặc danh sách mã `TC_ID` vừa được cập nhật.
- **Updated Manual Test Cases**: File `docs/testcases/<module>/test_cases_<module>.md` (nguồn sự thật chứa kỳ vọng mới).
- **Automation Directory**: Đường dẫn thư mục chứa test scripts và Page Objects (`tests/`, `pages/`).
- **Mode**:
  - `PLAN` (Mặc định): Ánh xạ `TC_ID -> Script/POM` và lập kế hoạch sửa chi tiết từng dòng tại `reports/automation_impact_plan.md` (không sửa code).
  - `APPLY`: Lập kế hoạch như `PLAN`, sau khi người dùng duyệt thì trực tiếp cập nhật code và chạy lại kiểm chứng (cả bài test vừa sửa lẫn các bài test dùng chung Page Object).

## Context Pointers (Lazy-Load On Demand)
- **TC-to-Script Mapping Rules**: `.claude/skills/skills-coverage-traceability/SKILL.md`
- **Automation Coding Standards**: `.claude/skills/skills-qa-automation-engineer/SKILL.md`
- **DOM Inspection & Resilient Locators (chỉ đọc khi thay đổi có thêm trường/UI mới)**:
  - `.claude/skills/skills-ui-debug-agent/SKILL.md`
  - `.claude/skills/skills-smart-locator-agent/SKILL.md`

## Browser Mode & Delta Governance Rules
- **Cấm sinh lại cả file/module**: Chỉ sửa đúng câu lệnh assert, dữ liệu đầu vào hoặc hàm Page Object gắn với các `TC_ID` nằm trong danh sách Delta.
- **Cấm tự ý xóa file script của TC bị Archive (`🗑️`)**: Với các TC bị gỡ bỏ theo ticket, chỉ đánh dấu `test.skip(...)` / `@Test(enabled = false)` kèm comment ghi rõ mã ticket và chờ người dùng xác nhận trước khi xóa hẳn.
- **Tách biệt TC Mới hoàn toàn (`➕ Viết mới`)**: Các TC mới chưa từng có script sẽ được liệt kê vào mục ngoài phạm vi và điều hướng sang `/generate-automation-from-testcases`.
- **Default Headless Mode (`1920x1080`)**: Mặc định dùng **Headless (`1920x1080`)** khi cần quét DOM cho trường mới hoặc chạy kiểm chứng; chuyển sang Headed bằng `/browser-mode` (`node scripts/browser-mode.mjs headed`) nếu cần quan sát trực tiếp.

## Execution Steps

### Bước 1: Đọc Delta & Ánh xạ `TC_ID ↔ Automation Script`
1. Đọc Impact Report và nội dung mới nhất của các TC thuộc nhóm `⚠️ Review & sửa` và `🗑️ Archive` trong file Test Cases để xác định chính xác điểm thay đổi (`Expected Result`, `Steps`, `Test Data`, `Precondition`, hay `UI Field mới`).
2. Ánh xạ từng `TC_ID` sang file test và Page Object theo thứ tự độ tin cậy của `skills-coverage-traceability`:
   - `✅ Chắc chắn`: Khớp nhãn `allure.label('testId', 'TC_xxx')` hoặc mã `TC_xxx` trong tên hàm test.
   - `⚠️ Suy luận`: Khớp theo mô tả ngữ nghĩa (bắt buộc tách riêng để người dùng xác nhận).
   - `❓ Chưa automate`: Ghi nhận vào báo cáo, không chạm vào code.

### Bước 2: Lập Kế hoạch Cập nhật Delta & Xin Duyệt (HITL Checkpoint ⏸️)
1. Thiết lập hành động cụ thể cho từng mục kèm vị trí `file:line`:
   - Đổi `Expected Result` -> Sửa đúng dòng assertion trong file test.
   - Đổi `Steps` / thêm `UI Field mới` -> Cập nhật hàm trong Page Object + lấy locator thật từ DOM.
   - Đổi `Validation / Test Data` -> Cập nhật dữ liệu đầu vào (giữ chuẩn traceable `auto_`).
   - `🗑️ Archive TC` -> Gắn annotation `skip` kèm mã ticket.
2. Xuất báo cáo `reports/automation_impact_plan.md`.

⏸️ **DỪNG LẠI (HITL Checkpoint)**: Nếu `Mode = PLAN` -> Kết thúc. Nếu `Mode = APPLY` -> Chờ người dùng duyệt kế hoạch (đặc biệt xác nhận các mục `⚠️ Suy luận` và `🗑️ Archive`).

### Bước 3: Áp dụng Thay đổi & Chạy Kiểm chứng Hồi quy Cùng POM *(Chỉ khi `Mode = APPLY`)*
1. Sửa đúng các vị trí đã được duyệt, giữ nguyên mã `TC_ID` trong tên hàm/Allure label để không làm đứt liên kết RTM.
2. **Kiểm chứng 2 lớp**:
   - Chạy các bài test vừa cập nhật -> Phải **PASS 2 lần liên tiếp**.
   - Chạy toàn bộ các bài test khác có **dùng chung Page Object** vừa sửa -> Đảm bảo thay đổi POM không làm gãy các bài test lân cận.
3. Cập nhật kết quả thực thi và danh sách `Code cũ -> Code mới` vào `reports/automation_impact_plan.md`.

## Output
- `reports/automation_impact_plan.md` và *(khi `Mode = APPLY`)* các file Test / Page Object đã được đồng bộ Delta & kiểm chứng.
