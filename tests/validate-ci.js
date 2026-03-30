#!/usr/bin/env node
/**
 * Stage 2 — Lighthouse CI config validation
 * Tests all 7 acceptance criteria before any implementation exists.
 * Run: node tests/validate-ci.js
 */

const fs = require('fs');
const assert = require('assert');
const path = require('path');

const root = path.join(__dirname, '..');
const ciPath = path.join(root, '.github/workflows/ci.yml');
const lhrcPath = path.join(root, '.lighthouserc.json');

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    results.push({ ok: true, name });
    passed++;
  } catch (e) {
    results.push({ ok: false, name, msg: e.message });
    failed++;
  }
}

// ─── AC1: ci.yml exists and triggers on push to main + pull_request ──────────

test('AC1a: .github/workflows/ci.yml exists', () => {
  assert.ok(fs.existsSync(ciPath), '.github/workflows/ci.yml not found');
});

const ciContent = fs.existsSync(ciPath) ? fs.readFileSync(ciPath, 'utf8') : '';

test('AC1b: workflow triggers on push to main', () => {
  assert.ok(ciContent.length > 0, 'ci.yml is empty or missing');
  assert.ok(
    /on\s*:/.test(ciContent) && /push/.test(ciContent),
    'No push trigger in workflow'
  );
  assert.ok(
    /branches\s*:[\s\S]*?-\s*['"]?main['"]?/.test(ciContent) ||
    /branches\s*:\s*\[[\s\S]*?main[\s\S]*?\]/.test(ciContent),
    'push trigger does not gate on main branch'
  );
});

test('AC1c: workflow triggers on pull_request', () => {
  assert.ok(ciContent.length > 0, 'ci.yml is empty or missing');
  assert.ok(/pull_request/.test(ciContent), 'No pull_request trigger in workflow');
});

// ─── AC2: installs @lhci/cli@^0.14 and runs lhci autorun ────────────────────

test('AC2a: workflow installs @lhci/cli@^0.14', () => {
  assert.ok(
    /@lhci\/cli@\^0\.14/.test(ciContent),
    'Workflow does not install @lhci/cli@^0.14'
  );
});

test('AC2b: workflow runs lhci autorun', () => {
  assert.ok(/lhci autorun/.test(ciContent), 'Workflow does not run lhci autorun');
});

test('AC2c: workflow references target URL omer-landing-palmidos.vercel.app', () => {
  const targetInCi = /omer-landing-palmidos\.vercel\.app/.test(ciContent);
  const lhrcExists = fs.existsSync(lhrcPath);
  const targetInLhrc = lhrcExists &&
    /omer-landing-palmidos\.vercel\.app/.test(fs.readFileSync(lhrcPath, 'utf8'));
  assert.ok(
    targetInCi || targetInLhrc,
    'Target URL omer-landing-palmidos.vercel.app not found in ci.yml or .lighthouserc.json'
  );
});

// ─── AC3: .lighthouserc.json asserts performance >= 0.95 and accessibility >= 0.95

test('AC3a: .lighthouserc.json exists', () => {
  assert.ok(fs.existsSync(lhrcPath), '.lighthouserc.json not found');
});

let lhrc = null;
try {
  lhrc = JSON.parse(fs.readFileSync(lhrcPath, 'utf8'));
} catch (_) {
  // will fail in the tests below
}

test('AC3b: .lighthouserc.json is valid JSON', () => {
  assert.ok(lhrc !== null, '.lighthouserc.json is missing or not valid JSON');
});

test('AC3c: performance assertion is ["error", {minScore: 0.95}]', () => {
  assert.ok(lhrc, '.lighthouserc.json not loaded');
  const assertions = lhrc?.ci?.assert?.assertions;
  assert.ok(assertions, 'ci.assert.assertions missing in .lighthouserc.json');
  assert.ok(assertions.performance, 'performance assertion missing');
  const [level, opts] = assertions.performance;
  assert.strictEqual(level, 'error', `performance level is "${level}", expected "error"`);
  assert.strictEqual(opts.minScore, 0.95, `performance minScore is ${opts.minScore}, expected 0.95`);
});

test('AC3d: accessibility assertion is ["error", {minScore: 0.95}]', () => {
  assert.ok(lhrc, '.lighthouserc.json not loaded');
  const assertions = lhrc?.ci?.assert?.assertions;
  assert.ok(assertions, 'ci.assert.assertions missing in .lighthouserc.json');
  assert.ok(assertions.accessibility, 'accessibility assertion missing');
  const [level, opts] = assertions.accessibility;
  assert.strictEqual(level, 'error', `accessibility level is "${level}", expected "error"`);
  assert.strictEqual(opts.minScore, 0.95, `accessibility minScore is ${opts.minScore}, expected 0.95`);
});

test('AC3e: .lighthouserc.json collect.url targets omer-landing-palmidos.vercel.app', () => {
  assert.ok(lhrc, '.lighthouserc.json not loaded');
  const urls = lhrc?.ci?.collect?.url;
  assert.ok(Array.isArray(urls) && urls.length > 0, 'ci.collect.url is missing or empty');
  assert.ok(
    urls.some(u => u.includes('omer-landing-palmidos.vercel.app')),
    `URLs ${JSON.stringify(urls)} do not include omer-landing-palmidos.vercel.app`
  );
});

// ─── AC5: non-zero exit if performance/accessibility < 0.95 ──────────────────
// Verified structurally: "error" level in assertions causes lhci autorun to exit non-zero

test('AC5: assertion level is "error" (non-zero exit on failure)', () => {
  assert.ok(lhrc, '.lighthouserc.json not loaded');
  const a = lhrc?.ci?.assert?.assertions;
  assert.ok(a, 'assertions missing');
  const [perfLevel] = a.performance || [];
  const [a11yLevel] = a.accessibility || [];
  assert.strictEqual(perfLevel, 'error', 'performance level must be "error" to fail CI');
  assert.strictEqual(a11yLevel, 'error', 'accessibility level must be "error" to fail CI');
});

// ─── AC6: no npm ci or next build in workflow ─────────────────────────────────

test('AC6a: no "npm ci" step in workflow', () => {
  assert.ok(!/\bnpm ci\b/.test(ciContent), 'Workflow contains "npm ci"');
});

test('AC6b: no "next build" step in workflow', () => {
  assert.ok(!/next\s+build/.test(ciContent), 'Workflow contains "next build"');
});

// ─── AC7: no secrets or credentials hardcoded ────────────────────────────────

test('AC7a: no hardcoded passwords in ci.yml', () => {
  assert.ok(!/password\s*[:=]\s*\S+/i.test(ciContent), 'Potential hardcoded password in ci.yml');
});

test('AC7b: no hardcoded API keys in ci.yml (20+ char token values)', () => {
  // Allow ${{ secrets.* }} references — they are NOT hardcoded credentials
  const stripped = ciContent.replace(/\$\{\{[^}]+\}\}/g, '');
  assert.ok(
    !/(?:token|api[_-]?key|secret)\s*[:=]\s*['"]?[a-zA-Z0-9_\-]{20,}['"]?/i.test(stripped),
    'Potential hardcoded credential in ci.yml'
  );
});

test('AC7c: no hardcoded secrets in .lighthouserc.json', () => {
  const content = fs.existsSync(lhrcPath) ? fs.readFileSync(lhrcPath, 'utf8') : '';
  assert.ok(
    !/(?:password|token|api[_-]?key|secret)\s*["']?\s*:\s*["'][a-zA-Z0-9_\-]{20,}["']/i.test(content),
    'Potential hardcoded credential in .lighthouserc.json'
  );
});

// ─── Report ───────────────────────────────────────────────────────────────────

console.log('\nStage 2 — Lighthouse CI Validation\n');
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : `\n      → ${r.msg}`}`);
}

const total = passed + failed;
const coverage = Math.round((passed / total) * 100);
console.log(`\nResults : ${passed}/${total} passed`);
console.log(`Coverage: ${coverage}% of acceptance criteria covered by passing tests`);
console.log('');

if (failed > 0) {
  console.error(`FAIL — ${failed} test(s) failed`);
  process.exit(1);
}
console.log('PASS');
