// Deep TestCase Catalog & Offline Report Viewer Markdown Table Module (`src/lib/parser.ts`)

export interface TestCase {
  // Khoá duy nhất trong phạm vi 1 file, gán theo thứ tự xuất hiện.
  // KHÔNG dùng `id` làm khoá React: một TC ID có thể xuất hiện nhiều lần trong cùng file
  // (bảng tóm tắt, bảng nhắc lại...) → key trùng làm React render sai dòng.
  uid: string
  id: string
  reqIds: string[]
  module: string
  risk: string
  title: string
  preCondition: string
  steps: string
  testData: string
  expected: string
  priority: string
  automatable: string
  autoType: string
  tags: string[]
  group: string // heading gần nhất phía trên bảng (VD: "Nhóm A — Hiển thị trang & UI")
  sourceFile: string
}

export interface ParsedFile {
  fileName: string
  docTitle: string
  testCases: TestCase[]
}

export interface MarkdownTable {
  heading: string
  headers: string[]
  rows: string[][]
}

export type SortKey = 'id' | 'title' | 'priority' | 'risk' | 'group'

export interface TestCaseQuery {
  search?: string
  priorities?: Set<string> | string[]
  automatable?: string
  tag?: string
  scopeKey?: string
  sort?: { key: SortKey; dir: 1 | -1 }
}

export interface TestCaseQueryResult {
  allCases: TestCase[]
  filtered: TestCase[]
  allTags: string[]
  stats: Record<string, number>
  exportBaseName: string
}

// Tách cell theo dấu | nhưng bỏ qua \| (pipe được escape trong cell)
export function splitCells(line: string): string[] {
  const cells: string[] = []
  let cur = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '\\' && line[i + 1] === '|') {
      cur += '|'
      i++
    } else if (ch === '|') {
      cells.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  cells.push(cur.trim())
  // bỏ cell rỗng ở 2 đầu do pipe bao ngoài
  if (cells.length && cells[0] === '') cells.shift()
  if (cells.length && cells[cells.length - 1] === '') cells.pop()
  return cells
}

function isSeparatorRow(line: string): boolean {
  return /^\|?[\s:|-]+\|?$/.test(line) && line.includes('-')
}

function cleanGroupName(raw: string): string {
  return raw.replace(/^#+\s*/, '').replace(/\s*\(\d+\s*TC\)\s*$/i, '').trim()
}

// Chuẩn hoá thống nhất markdown inline (`, **, *) và thẻ <br> thành plain text
export function formatCellPlainText(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .trim()
}

// Bỏ markdown inline (`, *, **) cho các field ngắn trên 1 dòng
function stripInline(s: string): string {
  return formatCellPlainText(s).replace(/\s+/g, ' ').trim()
}

/**
 * Parses all pipe-escaped Markdown tables in a document (used by Offline Report Viewers
 * and contract verification for Test Cases, Execution Reports, and Bug Catalogs).
 */
export function parseMarkdownTables(content: string): MarkdownTable[] {
  const lines = content.split(/\r?\n/)
  const tables: MarkdownTable[] = []
  let currentHeading = ''
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const heading = line.match(/^#{1,4}\s+(.+)/)
    if (heading) {
      currentHeading = cleanGroupName(heading[1])
      i++
      continue
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length && isSeparatorRow(lines[i + 1].trim())) {
      const headers = splitCells(line.trim())
      const rows: string[][] = []
      i += 2
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!isSeparatorRow(lines[i].trim())) {
          rows.push(splitCells(lines[i].trim()))
        }
        i++
      }
      tables.push({ heading: currentHeading, headers, rows })
      continue
    }
    i++
  }

  return tables
}

// Map tên cột (đã lowercase) → key nội bộ
function columnKey(header: string): string | null {
  const h = header.toLowerCase().replace(/\*/g, '').trim()
  if (h === 'tc id') return 'id'
  if (h === 'req id') return 'req'
  if (h === 'module') return 'module'
  if (h.includes('risk')) return 'risk'
  if (h.includes('scenario') || h.includes('test title') || h.includes('test case title')) return 'title'
  if (h.includes('pre-condition') || h.includes('precondition')) return 'pre'
  if (h.includes('test steps')) return 'steps'
  if (h.includes('test data')) return 'data'
  if (h.includes('expected')) return 'expected'
  if (h === 'priority') return 'priority'
  if (h === 'automatable') return 'automatable'
  if (h.includes('auto type')) return 'autoType'
  if (h === 'tags') return 'tags'
  return null
}

export function parseMarkdownFile(fileName: string, content: string): ParsedFile {
  const lines = content.split(/\r?\n/)
  let docTitle = fileName.replace(/\.md$/i, '')
  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)/)
    if (h1) {
      docTitle = h1[1].trim()
      break
    }
  }

  const tables = parseMarkdownTables(content)
  const testCases: TestCase[] = []
  let seq = 0

  for (const table of tables) {
    const keys = table.headers.map(columnKey)
    const hasBody = keys.includes('title') || keys.includes('steps') || keys.includes('expected')
    if (!keys.includes('id') || !hasBody) continue

    for (const cells of table.rows) {
      const row: Record<string, string> = {}
      keys.forEach((k, idx) => {
        if (k && idx < cells.length) row[k] = cells[idx]
      })
      if (row.id && /TC/i.test(row.id)) {
        testCases.push({
          uid: fileName + '#' + seq++,
          id: stripInline(row.id),
          reqIds: (row.req || '')
            .split(',')
            .map((s) => stripInline(s).trim())
            .filter(Boolean),
          module: stripInline(row.module || ''),
          risk: stripInline(row.risk || ''),
          title: row.title || '',
          preCondition: row.pre || '',
          steps: row.steps || '',
          testData: row.data || '',
          expected: row.expected || '',
          priority: stripInline(row.priority || ''),
          automatable: stripInline(row.automatable || ''),
          autoType: stripInline(row.autoType || ''),
          tags: (row.tags || '')
            .split(/[\s,;]+/)
            .map((t) => stripInline(t).trim())
            .filter((t) => t.startsWith('@')),
          group: table.heading,
          sourceFile: fileName,
        })
      }
    }
  }

  return { fileName, docTitle, testCases }
}

export const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export const RISK_ORDER: Record<string, number> = {
  high: 0,
  cao: 0,
  medium: 1,
  'trung bình': 1,
  low: 2,
  thấp: 2,
}

// So sánh TC ID theo số tự nhiên (TC_002 < TC_010)
export function compareTcId(a: string, b: string): number {
  return a.localeCompare(b, 'vi', { numeric: true, sensitivity: 'base' })
}

// So sánh text hiển thị (Nhóm, Test Scenario): bỏ markdown inline và ký hiệu dẫn đầu
export function compareText(a: string, b: string): number {
  const norm = (s: string) =>
    stripInline(s)
      .replace(/^[^\p{L}\p{N}]+/u, '')
      .trim()
  return norm(a).localeCompare(norm(b), 'vi', { numeric: true, sensitivity: 'base' })
}

export function buildGroupScopeKey(fileName: string, group = ''): string {
  return `${fileName}::${group}`
}

export function parseGroupScopeKey(scopeKey: string): { fileName: string; group: string } {
  if (!scopeKey) return { fileName: '', group: '' }
  const idx = scopeKey.indexOf('::')
  if (idx === -1) return { fileName: scopeKey, group: '' }
  return {
    fileName: scopeKey.slice(0, idx),
    group: scopeKey.slice(idx + 2),
  }
}

/**
 * Deep catalog query interface encapsulating group scope filtering, priority/automatable/tag
 * filters, full-text search, multi-column tie-break sorting, and summary statistics.
 */
export function queryTestCases(
  parsedFiles: ParsedFile[],
  query: TestCaseQuery = {}
): TestCaseQueryResult {
  const allCases = parsedFiles.flatMap((f) => f.testCases)
  const tagSet = new Set<string>()
  for (const tc of allCases) {
    for (const t of tc.tags) tagSet.add(t)
  }
  const allTags = [...tagSet].sort()

  const q = (query.search ?? '').trim().toLowerCase()
  const scopeKey = query.scopeKey ?? ''
  const prioritySet = new Set(
    [...(query.priorities ?? [])].map((p) => p.toLowerCase())
  )
  const autoFilter = (query.automatable ?? '').toLowerCase()
  const tagFilter = query.tag ?? ''
  const sort = query.sort ?? { key: 'id', dir: 1 }

  let rows = allCases
  if (scopeKey) {
    const { fileName, group } = parseGroupScopeKey(scopeKey)
    rows = rows.filter((tc) => tc.sourceFile === fileName && (group === '' || tc.group === group))
  }
  if (prioritySet.size > 0) {
    rows = rows.filter((tc) => prioritySet.has(tc.priority.toLowerCase()))
  }
  if (autoFilter) {
    rows = rows.filter((tc) => tc.automatable.toLowerCase() === autoFilter)
  }
  if (tagFilter) {
    rows = rows.filter((tc) => tc.tags.includes(tagFilter))
  }
  if (q) {
    rows = rows.filter((tc) =>
      [
        tc.id,
        tc.reqIds.join(' '),
        tc.title,
        tc.steps,
        tc.expected,
        tc.testData,
        tc.preCondition,
        tc.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    )
  }

  const dir = sort.dir
  const primary = (a: TestCase, b: TestCase): number => {
    switch (sort.key) {
      case 'id':
        return compareTcId(a.id, b.id)
      case 'title':
        return compareText(a.title, b.title)
      case 'group':
        return compareText(a.group, b.group)
      case 'priority':
        return (
          (PRIORITY_ORDER[a.priority.toLowerCase()] ?? 9) -
          (PRIORITY_ORDER[b.priority.toLowerCase()] ?? 9)
        )
      case 'risk':
        return (
          (RISK_ORDER[a.risk.toLowerCase()] ?? 9) - (RISK_ORDER[b.risk.toLowerCase()] ?? 9)
        )
    }
  }

  const filtered = [...rows].sort((a, b) => dir * primary(a, b) || compareTcId(a.id, b.id))

  const stats: Record<string, number> = {}
  for (const tc of filtered) {
    const p = tc.priority.toLowerCase() || 'khác'
    stats[p] = (stats[p] ?? 0) + 1
  }

  const { fileName: selectedFile } = parseGroupScopeKey(scopeKey)
  const source = selectedFile || (parsedFiles.length === 1 ? parsedFiles[0].fileName : '')
  const exportBaseName = source ? source.replace(/\.(md|markdown|txt)$/i, '') : 'test_cases'

  return {
    allCases,
    filtered,
    allTags,
    stats,
    exportBaseName,
  }
}
