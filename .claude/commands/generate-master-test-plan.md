---
description: "Sinh Master Test Plan cấp quản lý (theo cấu trúc ISO/IEC/IEEE 29119-3 & ánh xạ IEEE 829) — phạm vi, chiến lược, tiêu chí vào/ra, môi trường, nhân lực, lịch trình, rủi ro dự án."
skills:
  - skills-test-summary-reporter
---

# Generate Master Test Plan (Workflow Dispatcher)

Biên soạn tài liệu **Master Test Plan** cấp quản lý để gửi PM/PO/Khách hàng phê duyệt trước đợt kiểm thử — xác định rõ phạm vi (In-scope / Out-of-scope), chiến lược, tiêu chí Entry/Suspension/Exit, môi trường, nhân sự, lịch trình, rủi ro dự án và bảng ánh xạ chuẩn **ISO/IEC/IEEE 29119-3 & IEEE 829-2008**.

## Inputs
- **Release / Milestone (`<mốc>`)**: Tên đợt phát hành / Sprint / UAT.
- **Repository Artifacts** *(Tự động quét trước khi hỏi)*: `docs/requirements/`, `docs/testcases/`, `docs/bugs/`, `traceability_matrix.md`.
- **Management Inputs** *(Hỏi người dùng nếu chưa có)*: Phạm vi ngoài (Out-of-scope), lịch trình các mốc, phân công nhân sự, môi trường & bộ tiêu chí Exit riêng (nếu khác mặc định).

## Context Pointers (Lazy-Load On Demand)
- **Exit Criteria Standard & Professional Boundaries**: `.claude/skills/skills-test-summary-reporter/SKILL.md`
- **Risk-Based Testing & Quality Characteristics**: `.claude/skills/skills-rbt-manual-testing/SKILL.md`

## Nguyên tắc Bắt buộc (Strict Governance Rules)
1. **Không tự bịa thông tin quản lý**: Lịch trình, ngày mốc, nhân sự, người duyệt nếu chưa được cung cấp phải điền `❓ Chờ <vai trò> xác nhận` và liệt kê ngay ở đầu tài liệu (mục **Ô còn treo**).
2. **Đồng bộ 100% Tiêu chí Exit với `/generate-test-summary-report`**: Lấy nguyên bộ 7 Tiêu chí Exit chuẩn từ `skills-test-summary-reporter` (trừ khi dự án có quy định riêng) để lúc kết thúc kỳ test chấm điểm khớp hoàn toàn.
3. **Không để trống mục `2.2 Ngoài phạm vi (Out of Scope)`**: Tự động trích các mục đánh dấu `➖ Ngoài phạm vi` từ cuối các file `test_cases_<module>.md` và hỏi xác nhận thêm với người dùng (hiệu năng, pentest, các module không đổi).
4. **Quy tắc ghi chuẩn tham chiếu**: Chỉ ghi **tên mục** của chuẩn (`ISO/IEC/IEEE 29119-3 — Test Plan` và `IEEE 829-2008`), **tuyệt đối không ghi số điều khoản (`clause 7.x`)** và **không tuyên bố "tuân thủ"** (chỉ ghi *"Biên soạn theo cấu trúc ISO/IEC/IEEE 29119-3 — Test Plan"*).

## Execution Steps

### Bước 1: Tự động Quét Repo để Thu thập Dữ liệu Sẵn có
1. Đọc `docs/requirements/` (`README.md`, `_index.md`, `_discovery/system_map.md`) để lấy danh sách module, số lượng REQ và các điểm mơ hồ còn treo.
2. Đọc `docs/testcases/` và `docs/bugs/` để thống kê số lượng Test Cases hiện có, các mục `➖ Ngoài phạm vi` đã ghi nhận, và số lượng bug đang mở ảnh hưởng tới Tiêu chí Vào (Entry Criteria).

### Bước 2: Chốt Thông tin Quản lý với Người dùng (HITL Checkpoint ⏸️)
⏸️ **DỪNG LẠI (HITL Checkpoint)**: Trình bày tóm tắt dữ liệu đã tự động thu thập từ repo và hỏi gộp **1 lượt duy nhất** các thông tin quản lý chưa thể tự suy ra:
- Phạm vi module đợt này & xác nhận danh sách **Ngoài phạm vi (2.2)**;
- Lịch trình các mốc chính (Viết TC, Bắt đầu test, Code freeze, Release) & Nhân sự phân công;
- Môi trường kiểm thử (riêng hay dùng chung) & xác nhận dùng bộ **Tiêu chí Exit** chuẩn hay bộ riêng;
- Có điểm nào làm khác Chiến lược kiểm thử cấp tổ chức không (cho mục `11.2 Deviations`).

### Bước 3: Xuất File Master Test Plan (`docs/test_plan_<mốc>.md`)
Tạo file `docs/test_plan_<mốc>.md` với bảng metadata đầu trang (ghi rõ danh sách **Ô còn treo** nếu có) và đầy đủ **11 mục chuẩn**:
1. **Mục tiêu**: Mục tiêu nghiệp vụ và chất lượng của đợt kiểm thử.
2. **Phạm vi**: `2.1 Trong phạm vi` (bảng Module, Prefix, Số REQ, Số TC) & `2.2 NGOÀI phạm vi (Out of Scope)` (Không kiểm thử | Lý do | Ai chịu trách nhiệm).
3. **Chiến lược kiểm thử**: Các loại test thực hiện (Functional, Regression, Retest bug, Cross-module, UAT), tỷ trọng Manual/Automation và thứ tự ưu tiên theo rủi ro sản phẩm (trỏ tới `docs/testcases/`).
4. **Tiêu chí Vào / Ra / Tạm dừng**: `4.1 Tiêu chí VÀO (Entry)` (6 điều kiện), `4.2 Tiêu chí RA (Exit)` (7 tiêu chí khớp `skills-test-summary-reporter`), `4.3 Tiêu chí TẠM DỪNG (Suspension) & Tiếp tục`.
5. **Môi trường & Dữ liệu test**: Quy định môi trường (không ghi URL/credentials nhạy cảm vào file), quy tắc dùng chung môi trường và dữ liệu traceable.
6. **Nhân lực & Phân công**: Vai trò, người phụ trách, module.
7. **Lịch trình & Mốc**: Các mốc thời gian và điều kiện hoàn thành.
8. **Rủi ro DỰ ÁN & Biện pháp**: Rủi ro tổ chức/hạ tầng/nhân sự/tài liệu của đợt test (tách biệt với rủi ro sản phẩm).
9. **Sản phẩm bàn giao (Deliverables)**: Danh mục tài liệu đầu ra và nơi lưu.
10. **Phê duyệt**: Bảng chữ ký QA Lead & PM/PO.
11. **Ánh xạ chuẩn tài liệu**: `11.1 Đối chiếu mục (1–10)` sang tên mục của **ISO/IEC/IEEE 29119-3** & **IEEE 829-2008**, và `11.2 Điểm làm khác chiến lược chung (Deviations)` (ghi rõ `Không áp dụng` nếu không có, không để bảng rỗng).

## Output
- `docs/test_plan_<mốc>.md`
