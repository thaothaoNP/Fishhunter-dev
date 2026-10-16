---
name: skills-locator-healer-agent
description: "Scan and heal broken or fragile UI locators in Page Objects reactively (from test failure logs) or proactively (after frontend UI changes) by inspecting live DOM."
---

# Locator Healer Agent

Purpose: Automatically repair broken locators when automation tests fail.

---

## When to Use

Use this skill when:

- A test fails with "element not found" or "element detached" errors
- UI has changed and existing locators no longer work
- After a frontend deployment that modifies DOM structure

Workflow: `/heal-locators` (2 modes — SCAN chỉ báo cáo, HEAL sửa + verify).

---

## Hai Kiểu Kích Hoạt

| Kiểu | Trigger | Input | Đường vào |
|---|---|---|---|
| **Reactive** — chữa theo lỗi | Test fail với `ElementNotFound` / `strict mode violation` | Error log + stack trace | `/run-and-fix-tests`, `/analyze-test-report`, `/analyze-flaky-tests` |
| **Proactive** — rà cả loạt | UI vừa đổi, chưa chạy test cũng rà được | Page Object + URL | `/heal-locators` |

Kiểu proactive **không có error log để lần theo** — phải trích toàn bộ locator từ Page Object, mở browser đưa về đúng trạng thái chứa element, rồi đối chiếu từng cái. Bắt được cả locator **mong manh** (còn chạy nhưng bám thuộc tính dễ đổi) lẫn locator **sai element** (match 1 element nhưng không phải element cần — test vẫn xanh mà thao tác nhầm chỗ).

---

## Responsibilities

When a locator fails:

1. Inspect current DOM or UI hierarchy
2. Compare old locator with current page structure
3. Identify updated attributes
4. Generate a replacement locator
5. Re-run test to verify the fix

---

## Detection Strategy

Locator is considered broken when:

- Element not found (NoSuchElementException / TimeoutError)
- Element detached from DOM
- Selector matches zero elements
- Selector matches wrong element (different text/position)

---

## Healing Workflow

### Step 1: Analyze the Error
- Read error log to identify which locator failed
- Identify the Page Object file and line number

### Step 2: Inspect Current DOM
- Open the page using Playwright MCP tools (mặc định **Headless Mode** `1920x1080`, tắt GPU; nếu cần qua CAPTCHA/OTP hoặc user muốn xem trực tiếp thì bật Headed Mode qua `node scripts/browser-mode.mjs headed`)
- Navigate to the same state as the failing test (`browser_navigate` → `browser_wait_for` → `browser_snapshot`)
- Inspect the target area in DOM

### Step 3: Find Alternative Locator
Try the following in priority order:

1. Accessibility attributes (`aria-label`, `role`)
2. `data-testid` / `data-test`
3. `id` (if stable, not auto-generated)
4. Semantic locator (Playwright `getByRole`, `getByLabel`)
5. `css selector` (stable attributes)
6. `xpath` (relative, not positional)

### Step 4: Validate & Replace
- Verify the new locator matches exactly one element
- Verify the element is the correct one (text, position, behavior)
- Replace the broken locator in the Page Object class
- Re-run the test

---

## Difference from Smart Locator Agent

| Aspect | Locator Healer | Smart Locator |
|--------|---------------|---------------|
| **Trigger** | Test failure (reactive) | New element (proactive) |
| **Input** | Broken locator + error log | HTML/DOM element |
| **Goal** | Fix existing locator | Generate new locator |
| **Workflow** | Error → Inspect → Replace → Verify | Inspect → Generate → Validate |

---

## Verification

After healing:

- [ ] Locator must match exactly one element
- [ ] Element is the correct target (verify text/attributes)
- [ ] Test must pass successfully
- [ ] Locator is stable across page reloads

---

## Rules References

- `.claude/rules/locator_strategy.md` — Master locator priority map
- `.claude/rules/automation_rules.md` — General automation best practices
- `.claude/skills/skills-smart-locator-agent/SKILL.md` — Sinh locator thay thế
- `.claude/skills/skills-ui-debug-agent/SKILL.md` — Inspect DOM đúng trạng thái