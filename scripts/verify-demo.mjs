import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const requiredFiles = ["index.html", "demo/index.html", "demo/styles.css", "demo/app.js", "demo/data.js"];
const requiredText = ["AI 自动巡检演示台", "开始 AI 自动巡检", "飞书文档输出", "数据源总览", "AI 推理链路", "节点风险雷达", "AI 任务生成", "自治跟踪看板", "周会报告输出", "参赛要求覆盖"];
const requiredDataKeys = ["projects", "sources", "summaryMetrics", "automationRun", "aiTrace", "risks", "issueSummary", "contestFit"];

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const file of requiredFiles) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    fail(`Missing required file: ${file}`);
  }
}

const html = fs.readFileSync(path.join(root, "demo/index.html"), "utf8");
for (const text of requiredText) {
  if (!html.includes(text)) {
    fail(`Missing required Chinese section text: ${text}`);
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

if (html.includes('href="./styles.css"')) {
  fail("demo/index.html should not use an initial ./styles.css href; /demo clean URLs request /styles.css before the adaptive loader runs");
}

const localFileUrl = new URL("demo/index.html", `file://${root.endsWith("/") ? root : `${root}/`}`);
const localStyleUrl = new URL("./styles.css", localFileUrl);
if (!localStyleUrl.href.endsWith("/demo/styles.css")) {
  fail(`file:// stylesheet path would resolve incorrectly: ${localStyleUrl.href}`);
}

const context = { window: {} };
vm.createContext(context);
const dataSource = fs.readFileSync(path.join(root, "demo/data.js"), "utf8");
vm.runInContext(dataSource, context, { filename: "demo/data.js" });

const demoData = context.window.DEMO_DATA;
if (!demoData || typeof demoData !== "object") {
  fail("window.DEMO_DATA was not defined");
}

for (const key of requiredDataKeys) {
  if (!(key in demoData)) {
    fail(`Missing data key: ${key}`);
  }
}

if (!Array.isArray(demoData.projects) || demoData.projects.length < 3) {
  fail("Expected at least 3 demo projects");
}

if (!Array.isArray(demoData.risks) || demoData.risks.length < 5) {
  fail("Expected at least 5 demo risks");
}

const allChineseCopy = [
  html,
  fs.readFileSync(path.join(root, "demo/app.js"), "utf8"),
  fs.readFileSync(path.join(root, "demo/data.js"), "utf8")
].join("\n");
const appSource = fs.readFileSync(path.join(root, "demo/app.js"), "utf8");
const cssSource = fs.readFileSync(path.join(root, "demo/styles.css"), "utf8");

for (const text of ["AI 项目自治运营平台", "开始 AI 自动巡检", "原始数据解析", "解析结果", "AI 思考过程", "决策输出", "模拟写入任务系统", "模拟创建任务", "正式系统写回作为下一步集成", "既有立项增量", "业务价值", "可落地性"]) {
  if (!allChineseCopy.includes(text)) {
    fail(`Missing required Chinese copy: ${text}`);
  }
}

const requiredWorkbenchText = [
  "AI 项目任务智能体工作台",
  "方案输入",
  "智能体数据解析",
  "AI 思考过程",
  "任务闭环中枢",
  "交付件质检",
  "催办与上升预警",
  "飞书文档输出",
  "SPUG/TOnes",
  "IPM",
  "UTP",
  "BOM",
  "SAP",
  "MES",
  "MOM",
  "QMS",
  "CRM",
  "Trancare"
];

for (const text of requiredWorkbenchText) {
  if (!allChineseCopy.includes(text)) {
    fail(`Missing redesigned workbench copy: ${text}`);
  }
}

for (const domId of [
  "workbench-root",
  "scenario-selector",
  "start-ai-analysis",
  "ai-stage-list",
  "ai-thinking-feed",
  "task-distribution-panel",
  "deliverable-upload-button",
  "qa-reject-button",
  "escalation-feed",
  "feishu-doc-panel"
]) {
  if (!html.includes(domId)) {
    fail(`Missing redesigned workbench DOM id: ${domId}`);
  }
}

for (const key of ["scenarios", "systemSources", "analysisStages", "taskLoop", "reportOutputs"]) {
  if (!(key in demoData)) {
    fail(`Missing redesigned workbench data key: ${key}`);
  }
}

for (const cssText of ["backdrop-filter", "--glass", "--aqua", "workbench-grid", "thinking-card"]) {
  if (!cssSource.includes(cssText)) {
    fail(`Missing glass workbench CSS token: ${cssText}`);
  }
}

if (!Array.isArray(demoData.automationRun?.steps) || demoData.automationRun.steps.length < 7) {
  fail("Expected at least 7 AI auto-inspection steps");
}

for (const step of demoData.automationRun.steps) {
  for (const field of ["rawData", "parsedData", "thinking", "decision"]) {
    if (!step[field] || typeof step[field] !== "string") {
      fail(`Automation step ${step.id || step.title} is missing ${field}`);
    }
  }
}

if (html.includes("runner-thinking-card")) {
  fail("AI thinking process should be embedded inside inspection task logs, not shown as a separate runner-thinking-card module");
}

for (const logClass of ["log-thinking", "log-thinking-grid", "log-raw", "log-parsed", "log-reasoning", "log-decision"]) {
  if (!appSource.includes(logClass)) {
    fail(`Missing task-embedded AI thinking class in demo/app.js: ${logClass}`);
  }
}

for (const domId of ["feishu-output-card", "feishu-output-status", "feishu-doc-title", "feishu-doc-blocks", "copy-feishu-doc-button"]) {
  if (!html.includes(domId)) {
    fail(`Missing Feishu document output DOM id: ${domId}`);
  }
}

const stepMs = Number(appSource.match(/AUTO_RUN_STEP_MS\s*=\s*(\d+)/)?.[1] || 0);
const completeMs = Number(appSource.match(/AUTO_RUN_COMPLETE_MS\s*=\s*(\d+)/)?.[1] || 0);
if (stepMs < 1600 || completeMs < 900) {
  fail(`AI auto-inspection timing is too fast for judge review: step=${stepMs}, complete=${completeMs}`);
}

if (!demoData.automationRun.feishuDocument || !Array.isArray(demoData.automationRun.feishuDocument.blocks) || demoData.automationRun.feishuDocument.blocks.length < 4) {
  fail("Expected automationRun.feishuDocument with at least 4 report blocks");
}

if (!Array.isArray(demoData.aiTrace) || demoData.aiTrace.length < 5) {
  fail("Expected at least 5 AI trace steps");
}

if (!Array.isArray(demoData.contestFit) || demoData.contestFit.length < 5) {
  fail("Expected contest-fit evidence for submission requirements");
}

const rootIndex = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!rootIndex.includes("demo/index.html")) {
  fail("Root index.html must route to demo/index.html for Vercel");
}

console.log("Demo verification passed");
