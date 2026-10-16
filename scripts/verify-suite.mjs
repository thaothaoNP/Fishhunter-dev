import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  AGY_CONFIG_REL_FROM_PLUGIN,
  AGY_VIDEO_DIR_FROM_PLUGIN,
  applyBrowserModeProfile,
  detectBrowserModeStatus,
} from './browser-mode.mjs';
import {
  parseSkillDocument,
  resolveContextPointers,
  syncAntigravity,
} from './sync-antigravity.mjs';
import {
  buildGroupScopeKey,
  formatCellPlainText,
  parseMarkdownFile,
  parseMarkdownTables,
  queryTestCases,
} from './testcases-viewer/src/lib/parser.ts';
import { EXPORT_COLUMNS } from './testcases-viewer/src/lib/export.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listFiles(dirPath, ext = '.md') {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(ext))
    .map((d) => path.join(dirPath, d.name))
    .sort();
}

test('Seam 1: Project defaults to Headless Mode (1920x1080, GPU disabled, Antigravity synced)', () => {
  const status = detectBrowserModeStatus(REPO_ROOT);
  assert.equal(status.mode, 'headless', 'Repo must default to Headless Mode');
  assert.equal(status.viewport, '1920,1080', 'Headless Mode must default to 1920,1080 viewport');
  assert.equal(status.gpuDisabled, true, 'Headless Mode must disable hardware GPU rendering');
  assert.equal(status.videoEnabled, false, 'MCP session video must default to OFF');
  assert.equal(status.antigravitySynced, true, 'Antigravity MCP config must be synced with Claude MCP');
  assert.ok(
    status.launchOptions.args.includes('--disable-dev-shm-usage'),
    'playwright-mcp-config.json must include --disable-dev-shm-usage in Headless Mode'
  );
  assert.ok(
    status.antigravityArgs.includes(AGY_CONFIG_REL_FROM_PLUGIN),
    'Antigravity MCP args must reference ../../../.claude/playwright-mcp-config.json'
  );
});

test('Seam 1: Browser Mode Switch module toggles deterministically in-process across both harnesses', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'browser-mode-test-'));

  try {
    // 1. Switch to Headed Mode with Video ON via in-process interface
    const headed = applyBrowserModeProfile(tmpRoot, { mode: 'headed', videoEnabled: true });
    assert.equal(headed.mode, 'headed');
    assert.equal(headed.viewport, '1600,750');
    assert.equal(headed.gpuDisabled, false);
    assert.equal(headed.videoEnabled, true);
    assert.equal(headed.antigravitySynced, true);
    assert.ok(!headed.claudeArgs.includes('--headless'));
    assert.ok(headed.launchOptions.args.includes('--window-position=0,0'));
    assert.ok(headed.claudeArgs.includes('--output-dir=reports/mcp-videos'));
    assert.ok(headed.antigravityArgs.includes(`--output-dir=${AGY_VIDEO_DIR_FROM_PLUGIN}`));

    // 2. Switch back to Headless Mode with Video OFF idempotently
    applyBrowserModeProfile(tmpRoot, { mode: 'headless', videoEnabled: false });
    const headless = applyBrowserModeProfile(tmpRoot, { mode: 'headless', videoEnabled: false });
    assert.equal(headless.mode, 'headless');
    assert.equal(headless.viewport, '1920,1080');
    assert.equal(headless.gpuDisabled, true);
    assert.equal(headless.videoEnabled, false);
    assert.equal(headless.antigravitySynced, true);
    assert.equal(
      headless.claudeArgs.filter((a) => a === '--headless').length,
      1,
      'Must not duplicate --headless flag across repeated toggles'
    );
    assert.ok(!headless.claudeArgs.some((a) => a.startsWith('--save-video=')));

    // 3. Single CLI smoke assertion for argument parsing
    const cliStatus = execFileSync(
      process.execPath,
      [path.join(REPO_ROOT, 'scripts', 'browser-mode.mjs'), 'status', '--root', tmpRoot],
      { encoding: 'utf8' }
    );
    assert.match(cliStatus, /HEADLESS.*1920,1080.*Antigravity MCP Synced: YES/i);
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
});

test('Seam 1: /browser-mode Workflow Dispatcher and Playwright Rules document Headless Mode default & switch', () => {
  const cmdPath = path.join(REPO_ROOT, '.claude', 'commands', 'browser-mode.md');
  assert.ok(fs.existsSync(cmdPath), '.claude/commands/browser-mode.md must exist');
  const content = fs.readFileSync(cmdPath, 'utf8');
  assert.match(content, /scripts\/browser-mode\.mjs/);
  assert.match(content, /1920[×x,]1080/);
  assert.match(content, /1600[×x,]750/);

  const pwRules = fs.readFileSync(path.join(REPO_ROOT, '.claude', 'rules', 'playwright_rules.md'), 'utf8');
  assert.match(pwRules, /Headless Mode/i);
  assert.match(pwRules, /scripts\/browser-mode\.mjs/);
  assert.ok(!pwRules.includes('Bắt buộc mở browser có hiển thị (headed) trong quá trình thiết lập và debug test'));

  const selRules = fs.readFileSync(path.join(REPO_ROOT, '.claude', 'rules', 'selenium_rules.md'), 'utf8');
  assert.match(selRules, /Headless Mode/i);
  assert.ok(!selRules.includes('Headed mode: Bắt buộc khi debug'));
});

test('Seam 2: Always-Loaded Context (CLAUDE.md + skill descriptions) meets strict token/size budget', () => {
  const claudeMdPath = path.join(REPO_ROOT, 'CLAUDE.md');
  const claudeDoc = parseSkillDocument(fs.readFileSync(claudeMdPath, 'utf8'));

  assert.ok(claudeDoc.lines <= 140, `CLAUDE.md must be <= 140 lines (got ${claudeDoc.lines} lines)`);
  assert.ok(
    claudeDoc.bytes <= 12288,
    `CLAUDE.md must be <= 12 KB / 12,288 bytes (got ${claudeDoc.bytes} bytes)`
  );

  const skillsDir = path.join(REPO_ROOT, '.claude', 'skills');
  const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  let totalDescBytes = 0;
  for (const d of skillDirs) {
    const skillFile = path.join(skillsDir, d.name, 'SKILL.md');
    const doc = parseSkillDocument(fs.readFileSync(skillFile, 'utf8'));
    assert.ok(doc.description.length > 0, `${d.name}/SKILL.md must have a non-empty description`);
    totalDescBytes += Buffer.byteLength(doc.description, 'utf8');
  }

  const totalAlwaysLoadedBytes = claudeDoc.bytes + totalDescBytes;
  assert.ok(
    totalAlwaysLoadedBytes <= 16800,
    `Total Always-Loaded Context must be <= 16,800 bytes (>= 65% reduction from 48 KB baseline), got ${totalAlwaysLoadedBytes}`
  );
});

test('Seam 2: All top-level SKILL.md entry points, Workflow Dispatchers, and combined workflow entry payloads meet Progressive Disclosure budgets', () => {
  const skillsDir = path.join(REPO_ROOT, '.claude', 'skills');
  const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  assert.equal(skillDirs.length, 20, 'All 20 skills must be preserved');

  const skillByteMap = new Map();
  for (const d of skillDirs) {
    const skillPath = path.join(skillsDir, d.name, 'SKILL.md');
    const doc = parseSkillDocument(fs.readFileSync(skillPath, 'utf8'));
    skillByteMap.set(d.name, doc.bytes);
    assert.ok(doc.lines < 180, `${d.name}/SKILL.md must be under 180 lines (got ${doc.lines})`);
    assert.ok(doc.bytes <= 15360, `${d.name}/SKILL.md must be <= 15 KB (got ${doc.bytes} bytes)`);
  }

  const commandsDir = path.join(REPO_ROOT, '.claude', 'commands');
  const commandFiles = listFiles(commandsDir, '.md');
  assert.ok(commandFiles.length >= 33, 'Must have all 32 original commands + browser-mode.md');

  for (const cmdPath of commandFiles) {
    const content = fs.readFileSync(cmdPath, 'utf8');
    const doc = parseSkillDocument(content);
    const name = path.basename(cmdPath);
    assert.ok(doc.lines <= 120, `Command ${name} must be <= 120 lines (got ${doc.lines})`);
    assert.ok(doc.bytes <= 8192, `Command ${name} must be <= 8 KB (got ${doc.bytes} bytes)`);

    let declaredSkillsBytes = 0;
    for (const s of doc.skills) {
      declaredSkillsBytes += skillByteMap.get(s) ?? 0;
    }

    const { disclosedRefsBytes } = resolveContextPointers(content, {
      sourceFile: cmdPath,
      repoRoot: REPO_ROOT,
    });

    const combinedEntryBytes = doc.bytes + declaredSkillsBytes + disclosedRefsBytes;
    assert.ok(
      combinedEntryBytes <= 66560,
      `Combined workflow entry payload for ${name} must be <= 66,560 bytes (got ${combinedEntryBytes} bytes)`
    );
  }
});

test('Seam 3: All Context Pointers, Markdown links, and frontmatter skill references resolve via the Skill Document module', () => {
  const skillsDir = path.join(REPO_ROOT, '.claude', 'skills');
  const validSkills = new Set(
    fs
      .readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  );

  const filesToScan = [
    path.join(REPO_ROOT, 'CLAUDE.md'),
    path.join(REPO_ROOT, 'README.md'),
    path.join(REPO_ROOT, 'HUONG_DAN_CAI_DAT_VA_SU_DUNG.md'),
    ...listFiles(path.join(REPO_ROOT, '.claude', 'rules')),
    ...listFiles(path.join(REPO_ROOT, '.claude', 'commands')),
  ];

  for (const skillName of validSkills) {
    const sDir = path.join(skillsDir, skillName);
    filesToScan.push(...listFiles(sDir));
    filesToScan.push(...listFiles(path.join(sDir, 'references')));
  }

  let totalPointersResolved = 0;

  for (const filePath of filesToScan) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relFile = path.relative(REPO_ROOT, filePath);

    if (
      filePath.includes(`${path.sep}.claude${path.sep}commands${path.sep}`) ||
      (filePath.includes(`${path.sep}.claude${path.sep}skills${path.sep}`) &&
        path.basename(filePath) === 'SKILL.md')
    ) {
      const doc = parseSkillDocument(content);
      assert.ok(doc.description.length > 0, `${relFile} must have a non-empty description`);
      assert.equal(
        doc.hasUnquotedColon,
        false,
        `${relFile} has an unquoted colon in description ('${doc.rawDescription}'); wrap in double quotes for strict YAML parsers`
      );

      if (filePath.includes(`${path.sep}.claude${path.sep}commands${path.sep}`)) {
        assert.ok(doc.skills.length >= 1, `${relFile} must declare at least 1 primary skill`);
        for (const s of doc.skills) {
          assert.ok(validSkills.has(s), `${relFile} references non-existent skill '${s}'`);
        }
      }
    }

    const { pointers, brokenPointers } = resolveContextPointers(content, {
      sourceFile: filePath,
      repoRoot: REPO_ROOT,
    });
    totalPointersResolved += pointers.length;
    assert.deepEqual(
      brokenPointers,
      [],
      `Broken Context Pointer(s) in ${relFile}: ${brokenPointers.map((b) => b.rawTarget).join(', ')}`
    );
  }

  assert.ok(
    totalPointersResolved >= 250,
    `Expected at least 250 Context Pointers (including code-labeled links) to be verified across the suite, got ${totalPointersResolved}`
  );

  // Ensure CLAUDE.md Section 5 indexes all 36 slash commands so agents never guess command filenames
  const claudeMdContent = fs.readFileSync(path.join(REPO_ROOT, 'CLAUDE.md'), 'utf8');
  for (const cmdFile of listFiles(path.join(REPO_ROOT, '.claude', 'commands'), '.md')) {
    const cmdSlug = `/${path.basename(cmdFile, '.md')}`;
    assert.ok(
      claudeMdContent.includes(cmdSlug),
      `CLAUDE.md must list slash command '${cmdSlug}' in its Context Pointers index`
    );
  }
});

test('Seam 3: Core QA Domain Invariants, Offline Report Viewer Table Schemas, and TestCase Catalog Query Module are verified in-process', () => {
  const rbtDir = path.join(REPO_ROOT, '.claude', 'skills', 'skills-rbt-manual-testing');

  // 1. Parse skills-rbt-manual-testing/SKILL.md through the real TestCase viewer parser
  const rbtSkill = fs.readFileSync(path.join(rbtDir, 'SKILL.md'), 'utf8');
  const rbtTables = parseMarkdownTables(rbtSkill);
  const tcSchemaTable = rbtTables.find(
    (t) => t.headers.length === 13 && t.headers[0] === 'TC ID' && t.headers[12] === 'Tags'
  );
  assert.ok(
    tcSchemaTable,
    'skills-rbt-manual-testing/SKILL.md must contain a valid 13-column Test Cases table parsed by parseMarkdownTables()'
  );
  assert.equal(EXPORT_COLUMNS.length, 13, 'export.ts must define exactly 13 export columns');

  // Verify the TestCase parser + queryTestCases + formatCellPlainText on a synthetic 13-column table using the exact SKILL.md header
  const headerLine = `| ${tcSchemaTable.headers.join(' | ')} |`;
  const sepLine = `|${tcSchemaTable.headers.map(() => '---').join('|')}|`;
  const sampleMd = [
    '# Manual Test Cases — Login Module',
    '## Nhóm A — Smoke (2 TC)',
    headerLine,
    sepLine,
    '| `TC_LOGIN_010` | `REQ-LOGIN-01` | Login | Thấp | **Đăng nhập** thành công | Đã có tài khoản | 1. Nhập user<br>2. Bấm Login | Mong đợi vào Dashboard | Medium | `user=admin` | Yes | UI | `@Smoke, @Login` |',
    '| `TC_LOGIN_002` | `REQ-LOGIN-02` | Login | Cao | 🐞 Khoá tài khoản khi sai 5 lần | Đã có tài khoản | 1. Nhập sai 5 lần | Báo lỗi khoá 15 phút | Critical | `pass=wrong` | Yes | UI | `@Security, @Regression` |',
  ].join('\n');

  const parsedFile = parseMarkdownFile('test_cases_login.md', sampleMd);
  assert.equal(parsedFile.testCases.length, 2, 'parseMarkdownFile must parse 13-column TC rows');
  assert.deepEqual(parsedFile.testCases[0].tags, ['@Smoke', '@Login']);
  assert.equal(
    formatCellPlainText(parsedFile.testCases[0].steps),
    '1. Nhập user\n2. Bấm Login',
    'formatCellPlainText must normalize <br> to newline and strip inline markdown'
  );

  const queried = queryTestCases([parsedFile], {
    scopeKey: buildGroupScopeKey('test_cases_login.md', 'Nhóm A — Smoke'),
    sort: { key: 'id', dir: 1 },
  });
  assert.deepEqual(
    queried.filtered.map((tc) => tc.id),
    ['TC_LOGIN_002', 'TC_LOGIN_010'],
    'queryTestCases must natural-sort TC IDs (TC_002 before TC_010)'
  );
  assert.equal(queried.stats.critical, 1);
  assert.equal(queried.stats.medium, 1);
  assert.equal(queried.exportBaseName, 'test_cases_login');

  // Verify bilingual Risk Level sorting (Cao < Thấp) and case-insensitive Set priority filtering
  const byRisk = queryTestCases([parsedFile], {
    priorities: new Set(['Critical', 'MEDIUM']),
    sort: { key: 'risk', dir: 1 },
  });
  assert.deepEqual(
    byRisk.filtered.map((tc) => tc.id),
    ['TC_LOGIN_002', 'TC_LOGIN_010'],
    'queryTestCases must support case-insensitive Set priorities and bilingual Risk Level ordering (Cao before Thấp)'
  );

  // 2. 4 Test Rings, 15 Field Types, ISO 25010, and Granularity GỘP/TÁCH in RBT references
  const rbtRings = fs.readFileSync(
    path.join(rbtDir, 'references', 'FOUR_RINGS_AND_QUALITY_GATE.md'),
    'utf8'
  );
  assert.match(rbtRings, /VÒNG 1\s*[—-]\s*SMOKE/i);
  assert.match(rbtRings, /VÒNG 2\s*[—-]\s*FUNCTIONAL/i);
  assert.match(rbtRings, /VÒNG 3\s*[—-]\s*TECHNICAL/i);
  assert.match(rbtRings, /VÒNG 4\s*[—-]\s*NON-FUNCTIONAL/i);

  const fieldTypes = fs.readFileSync(
    path.join(rbtDir, 'references', 'FIELD_VALIDATION_15_TYPES.md'),
    'utf8'
  );
  assert.match(fieldTypes, /15/);

  const isoChecklist = fs.readFileSync(
    path.join(rbtDir, 'references', 'ISO_25010_CHECKLIST.md'),
    'utf8'
  );
  assert.match(isoChecklist, /ISO\s*25010/i);

  const rbtModes = fs.readFileSync(
    path.join(rbtDir, 'references', 'MODES_QUICK_AND_FULL_RBT.md'),
    'utf8'
  );
  assert.match(rbtModes, /GỘP/);
  assert.match(rbtModes, /TÁCH/);

  // 3. Requirements Analyzer ID continuity, _discovery no-REQ-ID rule, and 10-point REQ self-gate
  const reqSkill = fs.readFileSync(
    path.join(REPO_ROOT, '.claude', 'skills', 'skills-requirements-analyzer', 'SKILL.md'),
    'utf8'
  );
  assert.match(reqSkill, /REQ-<MODULE>-<NN>|REQ-<PREFIX>-<NN>/);
  assert.match(reqSkill, /AMB-/);
  assert.match(reqSkill, /RISK-/);

  // 4. Parse Execution Viewer & Bug Viewer table schemas in skills-manual-test-executor & skills-bug-reporter via parseMarkdownTables()
  const execSkill = fs.readFileSync(
    path.join(REPO_ROOT, '.claude', 'skills', 'skills-manual-test-executor', 'SKILL.md'),
    'utf8'
  );
  const execTables = parseMarkdownTables(execSkill);
  assert.ok(
    execTables.some(
      (t) =>
        t.headers.join(' | ') === 'TC ID | Test Scenario | Kết quả | Bước fail | Ghi chú' &&
        t.rows.length >= 1
    ),
    'skills-manual-test-executor/SKILL.md must contain a parseable Execution Viewer table with sample rows'
  );
  assert.match(execSkill, /PASS/);
  assert.match(execSkill, /FAIL/);
  assert.match(execSkill, /BLOCKED/);
  assert.match(execSkill, /SKIPPED/);

  const bugSkill = fs.readFileSync(
    path.join(REPO_ROOT, '.claude', 'skills', 'skills-bug-reporter', 'SKILL.md'),
    'utf8'
  );
  const bugTables = parseMarkdownTables(bugSkill);
  assert.ok(
    bugTables.some(
      (t) =>
        t.headers.join(' | ') ===
          'Mã bug | Module | Tiêu đề ngắn | Severity | Priority | Trạng thái | TC liên quan | Ngày phát hiện' &&
        t.rows.length >= 1
    ),
    'skills-bug-reporter/SKILL.md must contain a parseable Bugs Viewer catalog table with sample rows'
  );

  // 5. Ensure unused UI pass-through wrappers in scripts/testcases-viewer/src/components/ui/ remain pruned
  const uiFiles = fs.readdirSync(
    path.join(REPO_ROOT, 'scripts', 'testcases-viewer', 'src', 'components', 'ui')
  );
  assert.deepEqual(
    uiFiles.sort(),
    ['button.tsx', 'input.tsx'],
    'scripts/testcases-viewer/src/components/ui/ must only retain used UI modules (button.tsx, input.tsx)'
  );
});

test('Seam 4: Unified Evidence Capture (Screenshot & Video for Pass & Fail) and Vision Token Optimization', () => {
  const reportingRules = fs.readFileSync(
    path.join(REPO_ROOT, '.claude', 'rules', 'reporting_rules.md'),
    'utf8'
  );
  assert.match(reportingRules, /trang_thai_cuoi_cua_test/);
  assert.match(reportingRules, /trang_thai_khi_that_bai/);
  assert.match(reportingRules, /fullPage:\s*false/);
  assert.match(reportingRules, /fullPage:\s*true/);
  assert.match(reportingRules, /VIDEO_MODE/);
  assert.match(reportingRules, /video_bang_chung_pass/);
  assert.match(reportingRules, /video_khi_that_bai/);
  assert.match(reportingRules, /reports\/videos\//);

  const templatesDir = path.join(
    REPO_ROOT,
    '.claude',
    'skills',
    'skills-framework-architect',
    'references'
  );
  for (const tplName of [
    'TEMPLATES_PLAYWRIGHT_TS.md',
    'TEMPLATES_PLAYWRIGHT_JAVA.md',
    'TEMPLATES_PYTEST_AND_CICD.md',
  ]) {
    const tpl = fs.readFileSync(path.join(templatesDir, tplName), 'utf8');
    assert.match(tpl, /VIDEO_MODE|video\.mode/, `${tplName} must support adaptive VIDEO_MODE`);
    assert.match(tpl, /video_bang_chung_pass/, `${tplName} must attach PASS video when VIDEO_MODE=on`);
    assert.match(tpl, /video_khi_that_bai/, `${tplName} must attach FAIL video`);
    assert.match(tpl, /reports\/screenshots/, `${tplName} must persist screenshots to reports/screenshots/`);
    assert.match(tpl, /fullPage|setFullPage|full_page/, `${tplName} must differentiate PASS viewport vs FAIL fullPage`);
  }

  const selTpl = fs.readFileSync(path.join(templatesDir, 'TEMPLATES_SELENIUM_JAVA.md'), 'utf8');
  assert.match(selTpl, /reports\/screenshots/, 'TEMPLATES_SELENIUM_JAVA.md must persist screenshots to reports/screenshots/');
  assert.match(selTpl, /fullPage/, 'TEMPLATES_SELENIUM_JAVA.md must differentiate PASS viewport vs FAIL fullPage');

  const execSkill = fs.readFileSync(
    path.join(REPO_ROOT, '.claude', 'skills', 'skills-manual-test-executor', 'SKILL.md'),
    'utf8'
  );
  assert.match(execSkill, /_pass\.png/, 'skills-manual-test-executor must capture _pass.png evidence');
  assert.match(execSkill, /fullPage=false/, 'skills-manual-test-executor must use viewport fullPage=false on PASS');
  assert.match(execSkill, /_fail\.png|_error/i, 'skills-manual-test-executor must capture failure evidence');

  const uiRecon = fs.readFileSync(
    path.join(
      REPO_ROOT,
      '.claude',
      'skills',
      'skills-requirements-analyzer',
      'references',
      'UI_RECON_AND_EVIDENCE.md'
    ),
    'utf8'
  );
  assert.ok(
    !uiRecon.includes('Chụp xong **BẮT BUỘC dùng `Read` mở lại chính tệp ảnh đó**'),
    'UI_RECON_AND_EVIDENCE.md must not force reading every PNG into LLM vision context'
  );
  const webCmd = fs.readFileSync(
    path.join(REPO_ROOT, '.claude', 'commands', 'generate-requirements-from-website.md'),
    'utf8'
  );
  assert.ok(
    !webCmd.includes('bắt buộc dùng `Read` mở lại từng ảnh'),
    'generate-requirements-from-website.md must not force reading every PNG into LLM vision context'
  );
});

test('Seam 5: Dual-Harness Antigravity Sync Module verified in-process (Zero Duplicate Skills & Guardrails)', () => {
  // 1. Verify REPO_ROOT is 100% in sync via in-process call to syncAntigravity()
  const syncResult = syncAntigravity(REPO_ROOT, { checkOnly: true });
  assert.equal(
    syncResult.inSync,
    true,
    `Expected zero Dual-Harness drift, got drift=${JSON.stringify(syncResult.drift)}, broken=${JSON.stringify(syncResult.brokenSkillPointers)}`
  );
  assert.equal(syncResult.commandsSynced, 36, 'All 36 slash commands must be synced to .agents/skills/');

  // 2. Verify zero duplicate skill registrations across Antigravity workspace discovery & plugins
  const wsSkillsJson = readJson(path.join(REPO_ROOT, '.agents', 'skills.json'));
  const entryPaths = (wsSkillsJson.entries ?? []).map((e) => e.path);
  assert.deepEqual(
    entryPaths,
    ['.claude/skills'],
    '.agents/skills.json must register only .claude/skills (since .agents/skills is auto-discovered by workspace discovery)'
  );

  const pluginDir = path.join(REPO_ROOT, '.agents', 'plugins', 'claude-testing-skills');
  assert.ok(
    !fs.existsSync(path.join(pluginDir, 'skills.json')),
    '.agents/plugins/claude-testing-skills/skills.json must not exist (would duplicate workspace skills in Antigravity <skills>)'
  );
  assert.ok(
    !fs.existsSync(path.join(pluginDir, 'skills')),
    '.agents/plugins/claude-testing-skills/skills/ must not exist (would duplicate workspace skills in Antigravity <skills>)'
  );

  // 3. Verify root package.json and CI guardrail workflow exist
  const pkgJson = readJson(path.join(REPO_ROOT, 'package.json'));
  assert.ok(pkgJson?.scripts?.check, 'package.json must define a "check" script');
  assert.ok(pkgJson?.scripts?.test, 'package.json must define a "test" script');
  assert.ok(pkgJson?.scripts?.sync, 'package.json must define a "sync" script');
  assert.ok(
    fs.existsSync(path.join(REPO_ROOT, '.github', 'workflows', 'verify-suite.yml')),
    '.github/workflows/verify-suite.yml CI guardrail must exist'
  );
  assert.ok(
    !fs.existsSync(path.join(REPO_ROOT, '.codegraph')),
    '.codegraph directory must not exist in this Markdown skill suite'
  );
});
