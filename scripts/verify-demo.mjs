import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const requiredFiles = ["index.html", "demo/index.html", "demo/styles.css", "demo/app.js", "demo/data.js"];
const requiredText = [
  "AI 项目自治演示舱",
  "AI 黑客松 Demo V1.0",
  "开始 AI 自动演示",
  "数据解析",
  "AI 思考",
  "任务生成",
  "问题输出",
  "问题跟进列表",
  "处理进展",
  "完成时间",
  "新建 / 历史",
  "过去7天",
  "添加一个或多个文档 / 链接",
  "添加文档链接",
  "AI建议及措施",
  "责任领域",
  "2026-W1909",
  "2024-W3648",
  "于佑全",
  "涂良建",
  "飞书通知",
  "tOS交付进展汇报W23",
  "tOS17.0",
  "47%",
  "1% (30/330)",
  "Note 60 Pro",
  "Open 49"
];
const requiredDataKeys = ["summaryMetrics", "scenario", "signals", "flowSteps", "issueRecords", "contestFit"];

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }
}

const html = fs.readFileSync(path.join(root, "demo/index.html"), "utf8");
const appSource = fs.readFileSync(path.join(root, "demo/app.js"), "utf8");
const cssSource = fs.readFileSync(path.join(root, "demo/styles.css"), "utf8");
const allCopy = [html, appSource, fs.readFileSync(path.join(root, "demo/data.js"), "utf8")].join("\n");

if (allCopy.includes("AI 黑客松 Demo 3.0") || allCopy.includes("Demo 1.0") || allCopy.includes("飞书报告。")) {
  fail("Demo copy should not retain stale 3.0/old 1.0 or report-only wording");
}

for (const text of requiredText) {
  if (!allCopy.includes(text)) {
    fail(`Missing minimal demo copy: ${text}`);
  }
}

for (const businessSignal of [
  "需求未释放",
  "Slim规划未定",
  "IR验收计划未锁定",
  "1123 条 SR",
  "已转测 781 条",
  "新增负向舆情 67 条",
  "超期19"
]) {
  if (!allCopy.includes(businessSignal)) {
    fail(`Missing real W23 business signal: ${businessSignal}`);
  }
}

for (const loaderText of ["demoAssetBase", "__loadDemoScript__", "styles.css", "data.js", "app.js"]) {
  if (!html.includes(loaderText)) {
    fail(`Missing adaptive asset loader text in demo/index.html: ${loaderText}`);
  }
}

if (html.includes('src="/demo/app.js"') || html.includes('href="/demo/styles.css"')) {
  fail("demo/index.html should not use static absolute demo asset paths; they break file:// local preview");
}

const localFileUrl = new URL("demo/index.html", `file://${root.endsWith("/") ? root : `${root}/`}`);
const localStyleUrl = new URL("./styles.css", localFileUrl);
if (!localStyleUrl.href.endsWith("/demo/styles.css")) {
  fail(`file:// stylesheet path would resolve incorrectly: ${localStyleUrl.href}`);
}

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "demo/data.js"), "utf8"), context, { filename: "demo/data.js" });
const demoData = context.window.DEMO_DATA;

if (!demoData || typeof demoData !== "object") {
  fail("window.DEMO_DATA was not defined");
}

for (const key of requiredDataKeys) {
  if (!(key in demoData)) {
    fail(`Missing data key: ${key}`);
  }
}

for (const id of ["demo-root", "primary-action", "flow-rail", "analysis-workbench", "signal-strip", "ai-stage", "result-card", "evidence-line"]) {
  if (!html.includes(id)) {
    fail(`Missing minimal demo DOM id: ${id}`);
  }
}

const buttonCount = (html.match(/<button\b/g) || []).length;
if (buttonCount !== 1) {
  fail(`Static HTML should keep only one primary boot button; dynamic controls render from app.js, found ${buttonCount}`);
}

for (const clutterId of ["source-cloud", "dimension-grid", "task-distribution-panel", "deliverable-upload-button", "qa-reject-button", "contest-fit-grid"]) {
  if (html.includes(clutterId)) {
    fail(`Minimal demo should not include clutter DOM id: ${clutterId}`);
  }
}

if (!Array.isArray(demoData.flowSteps) || demoData.flowSteps.length !== 4) {
  fail("Expected exactly 4 flow steps");
}

for (const label of ["数据解析", "AI 思考", "任务生成", "问题输出"]) {
  if (!demoData.flowSteps.some((step) => step.label === label)) {
    fail(`Missing flow step label: ${label}`);
  }
}

for (const step of demoData.flowSteps) {
  for (const field of ["label", "action", "headline", "detail", "evidence"]) {
    if (!step[field] || typeof step[field] !== "string") {
      fail(`Flow step ${step.label || step.id} is missing ${field}`);
    }
  }
}

if (!Array.isArray(demoData.signals) || demoData.signals.length < 4 || demoData.signals.length > 6) {
  fail("Minimal demo should show 4-6 input signal groups");
}

if (!Array.isArray(demoData.issueRecords) || demoData.issueRecords.length < 3) {
  fail("Expected at least 3 generated issue records");
}

for (const record of demoData.issueRecords) {
  for (const field of ["id", "week", "project", "description", "progress", "aiSuggestion", "targetDate", "owner", "ownerName", "ownerAvatar", "status", "completedAt", "submitter"]) {
    if (!record[field] || typeof record[field] !== "string") {
      fail(`Issue record ${record.id || "unknown"} is missing ${field}`);
    }
  }
  if (!record.aiReview || typeof record.aiReview !== "object") {
    fail(`Issue record ${record.id || "unknown"} is missing structured aiReview`);
  }
  for (const field of ["responsibility", "collaboration", "actions", "consensus", "difference", "decision", "experience"]) {
    if (!record.aiReview[field]) {
      fail(`Issue record ${record.id || "unknown"} aiReview is missing ${field}`);
    }
  }
}

if (!Array.isArray(demoData.analysisHistory) || demoData.analysisHistory.length < 3) {
  fail("Expected at least 3 analysis history records");
}

if (!Array.isArray(demoData.analysisSources) || demoData.analysisSources.length < 2) {
  fail("Expected multiple document/link sources for new analysis intake");
}

if (!Array.isArray(demoData.larkNotifications) || demoData.larkNotifications.length < 2) {
  fail("Expected at least 2 Lark notification records");
}

for (const person of ["于佑全", "涂良建"]) {
  if (!demoData.larkNotifications.some((notice) => notice.to === person)) {
    fail(`Expected Lark notification recipient: ${person}`);
  }
}

for (const editableToken of ["owner-person", "avatar", "lark-notification-feed", "issue-progress", "issue-status", "issue-completed-at", "data-issue-field"]) {
  if (!appSource.includes(editableToken) && !cssSource.includes(editableToken)) {
    fail(`Generated issue table needs editable field token: ${editableToken}`);
  }
}

for (const featureToken of [
  "analysis-workbench",
  "analysis-modal",
  "analysis-modal-trigger",
  "analysis-dialog",
  "analysis-intake",
  "document-chip",
  "analysis-history",
  "sticky-col-1",
  "sticky-col-2",
  "sticky-col-3",
  "status-picker",
  "status-option",
  "ai-review-card",
  "ai-review-line",
  "ai-review-actions"
]) {
  if (!appSource.includes(featureToken) && !cssSource.includes(featureToken) && !html.includes(featureToken)) {
    fail(`Missing new demo feature token: ${featureToken}`);
  }
}

if (appSource.includes("<select") || cssSource.includes(".issue-status select")) {
  fail("Status editing should use a custom glass status picker instead of native select");
}

for (const waitingToken of ["issue-waiting-panel", "waiting-scan-line", "waiting-table-preview", "waiting-pulse"]) {
  if (!appSource.includes(waitingToken) && !cssSource.includes(waitingToken)) {
    fail(`Problem output waiting state needs tech motion token: ${waitingToken}`);
  }
}

for (const cssText of ["--void", "--neon", "--glass", "demo-shell", "stage-orb", "signal-card"]) {
  if (!cssSource.includes(cssText)) {
    fail(`Missing minimal tech CSS token: ${cssText}`);
  }
}

if (cssSource.includes("clamp(")) {
  fail("Demo CSS should use stable font sizes instead of viewport-scaled clamp()");
}

if (cssSource.includes("radial-gradient")) {
  fail("Demo CSS should avoid radial gradient orb/blob backgrounds");
}

for (const oldClass of ["task-card", "doc-block", "dimension-card", "source-pill"]) {
  if (cssSource.includes(oldClass) || appSource.includes(oldClass)) {
    fail(`Minimal demo should remove repeated old class: ${oldClass}`);
  }
}

const stepMs = Number(appSource.match(/STEP_MS\s*=\s*(\d+)/)?.[1] || 0);
if (stepMs < 1700) {
  fail(`AI demo timing is too fast for judge review: step=${stepMs}`);
}

if (!appSource.includes("advanceStep") || !appSource.includes("renderCurrentStage")) {
  fail("Minimal demo needs clear one-button stage transition functions");
}

const rootIndex = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!rootIndex.includes("demo/index.html")) {
  fail("Root index.html must route to demo/index.html for Vercel");
}

console.log("Demo verification passed");
