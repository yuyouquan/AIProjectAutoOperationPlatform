import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const requiredFiles = ["index.html", "demo/index.html", "demo/styles.css", "demo/app.js", "demo/data.js"];
const requiredText = ["数据源总览", "AI 推理链路", "节点风险雷达", "AI 任务生成", "自治跟踪看板", "周会报告输出", "参赛要求覆盖"];
const requiredDataKeys = ["projects", "sources", "summaryMetrics", "aiTrace", "risks", "issueSummary", "contestFit"];

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

for (const assetPath of ["/demo/styles.css", "/demo/data.js", "/demo/app.js"]) {
  if (!html.includes(assetPath)) {
    fail(`Missing absolute asset reference in demo/index.html: ${assetPath}`);
  }
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

for (const text of ["AI 项目自治运营平台", "模拟创建任务", "正式系统写回作为下一步集成", "既有立项增量", "业务价值", "可落地性"]) {
  if (!allChineseCopy.includes(text)) {
    fail(`Missing required Chinese copy: ${text}`);
  }
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
