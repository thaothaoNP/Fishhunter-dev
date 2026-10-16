---
description: "Retest bug đã được dev fix trên build mới — chấm FIXED/NOT_FIXED/PARTIAL/CANNOT_VERIFY, chạy regression quanh vùng fix và cập nhật lịch sử bug (RETEST / FULL modes)."
skills:
  - skills-manual-test-executor
  - skills-bug-reporter
---

# Retest Fixed Bugs (Workflow Dispatcher)

Xác minh các lỗi (Bugs) đã được đội phát triển sửa trên bản build mới — thực thi lại chính xác các bước tái hiện trong Bug Report gốc, kiểm tra hồi quy (Regression) xung quanh vùng vừa sửa và cập nhật bảng **Lịch sử retest**.

## Inputs & Modes
- **Bug Source**: Đường dẫn file `docs/bugs/<module>/BUG_*.md` hoặc mã Jira Bug Key.
- **New Build / Version**: Phiên bản build mới cần kiểm tra (**Bắt buộc phải khác bản build lúc ghi nhận bug**).
- **Environment & Credentials**: URL môi trường kiểm thử, tài khoản test và cờ xác nhận môi trường dùng chung (Shared Environment).
- **Mode**:
  - `FULL` (Mặc định cho mọi bug `Critical` / `Major` hoặc bản sửa chạm logic dùng chung): Xác minh lại bug gốc + chạy kiểm thử hồi quy (Regression) tối đa 15 Test Cases quanh vùng sửa.
  - `RETEST` (Dùng cho bug `Minor` / `Trivial` cô lập như sửa chính tả, căn chỉnh UI): Chỉ xác minh lại đúng bug đó.

## Context Pointers (Lazy-Load On Demand)
- **Browser Execution, Evidence & Shared-Env Safety Rules**: `.claude/skills/skills-manual-test-executor/SKILL.md`
- **Bug Report Schema & Retest History Table**: `.claude/skills/skills-bug-reporter/SKILL.md`

## Browser Mode & Verification Rules
- **Default Headless Mode (`1920x1080`)**: Mặc định chạy trình duyệt ở chế độ **Headless (`1920x1080`, tắt GPU)** để thực thi nhanh; nếu cần quan sát trực tiếp hoặc xử lý bước đăng nhập thủ công thì chuyển sang Headed bằng `/browser-mode` (`node scripts/browser-mode.mjs headed`).
- **Chốt chặn Phiên bản Build**: Nếu bản build hiện tại **giống hệt** bản build lúc log bug -> ⛔ **DỪNG NGAY** và báo người dùng, không chạy retest vô nghĩa trên build cũ.
- **Không sửa nội dung gốc của Bug Report**: Giữ nguyên mô tả gốc làm bằng chứng lịch sử; chỉ nối thêm dòng mới lên đầu bảng `## Lịch sử retest` ở cuối file bug.

## Execution Steps

### Bước 1: Kiểm tra Build & Dựng lại Bối cảnh từ Bug Gốc
1. Đọc file Bug Report gốc để trích xuất nguyên văn: `Steps to Reproduce`, `Expected Result`, `Actual Result cũ`, `Build/Version gốc`, và mã `TC_ID` / `REQ_ID` liên quan.
2. Đối chiếu `Build mới ≠ Build gốc`. Nếu dữ liệu test cũ trong bug đã bị xóa, chuẩn bị dữ liệu mới có gắn prefix traceable `auto_retest_<timestamp>`.

### Bước 2: Thực thi Lại Đúng Steps Gốc (Tối thiểu 2 Lần) & Chấm 4 Trạng thái
Thực hiện đúng trình tự `navigate -> wait -> snapshot -> interact` theo đúng từng bước trong `Steps to Reproduce` **tối thiểu 2 lần liên tiếp** và chụp screenshot bằng chứng (kể cả khi đã sửa xong):
- `✅ FIXED`: Chạy đủ các bước, kết quả thực tế khớp hoàn toàn `Expected Result` trong cả 2 lần chạy.
- `❌ NOT_FIXED`: Lỗi cũ vẫn tái hiện (giữ bug mở, không tạo bug mới trùng lặp).
- `🟡 PARTIAL`: Lỗi gốc không còn nhưng hành vi mới vẫn lệch `Expected Result` hoặc chỉ đúng ở một phần trường hợp (giữ bug mở).
- `⚠️ CANNOT_VERIFY`: Môi trường lỗi, thiếu quyền hoặc không tạo được điều kiện tiền đề (tuyệt đối không đoán là `FIXED`).

### Bước 3: Chạy Regression Quanh Vùng Fix *(Chỉ khi `Mode = FULL`)*
1. Chọn tối đa **15 Test Cases** theo 3 vòng đồng tâm:
   - **Vòng 1 (Cùng REQ ID)**: Các TC kiểm thử cùng yêu cầu với bug vừa sửa.
   - **Vòng 2 (Cùng Màn hình / Form)**: Các TC thao tác trên cùng màn hình/API.
   - **Vòng 3 (Thành phần dùng chung)**: Chỉ mở khi bản fix sửa vào hàm dùng chung (Auth, Search, Filter, Export).
2. Thực thi các TC đã chọn (tuân thủ quy tắc auto-skip TC phá hủy nếu là môi trường dùng chung). Nếu phát hiện TC hồi quy bị `❌ FAIL` do bản sửa gây ra -> tách thành **Bug mới** qua `/create-bug-report` và ghi rõ *"Regression phát sinh sau khi fix BUG_xxx"*.

### Bước 4: Xuất Retest Report & Cập nhật Lịch sử Bug Gốc
1. Xuất báo cáo tại `docs/executions/<module>/retest_<timestamp>/retest_report.md` (kèm ảnh trong `evidence/`) gồm 5 mục: `1. Kết quả verify bug`, `2. Regression quanh vùng fix (ghi rõ phạm vi chọn & phần cố ý bỏ)`, `3. Regression phát sinh do fix`, `4. Dữ liệu đã tạo & dọn dẹp`, `5. Kết luận & đề xuất đóng/mở bug`.
2. Thêm dòng kết quả mới lên đầu bảng `## Lịch sử retest` ở cuối file `docs/bugs/<module>/BUG_*.md`.

## Output
- `docs/executions/<module>/retest_<timestamp>/retest_report.md`, thư mục ảnh `evidence/` và bảng `## Lịch sử retest` được cập nhật trong file Bug gốc.
