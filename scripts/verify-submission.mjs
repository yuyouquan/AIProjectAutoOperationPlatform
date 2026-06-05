import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function fail(message) {
  console.error(message);
  process.exit(1);
}

function mustExist(file, minBytes = 1) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    fail(`Missing required artifact: ${file}`);
  }
  const stat = fs.statSync(absolute);
  if (stat.size < minBytes) {
    fail(`Artifact is too small or empty: ${file}`);
  }
}

function mustContain(file, texts) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  for (const text of texts) {
    if (!content.includes(text)) {
      fail(`Missing "${text}" in ${file}`);
    }
  }
}

[
  ["demo/index.html", 1000],
  ["demo/styles.css", 1000],
  ["demo/app.js", 1000],
  ["demo/data.js", 1000],
  ["index.html", 300],
  ["vercel.json", 20],
  ["README.md", 1000],
  ["outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx", 10000],
  ["outputs/ai-project-autonomy-platform/presentations/preview/slide-01.png", 10000],
  ["outputs/ai-project-autonomy-platform/presentations/preview/contact-sheet.png", 10000],
  ["outputs/ai-project-autonomy-platform/demo/demo-desktop.png", 10000],
  ["outputs/ai-project-autonomy-platform/demo/demo-mobile.png", 10000],
  ["outputs/ai-project-autonomy-platform/demo/README.md", 1000],
  ["outputs/ai-project-autonomy-platform/submission-checklist.md", 1000],
  ["outputs/ai-project-autonomy-platform/submission-support/team-resume-template.md", 1000],
  ["outputs/ai-project-autonomy-platform/submission-support/project-status-statement.md", 1000]
].forEach(([file, minBytes]) => mustExist(file, minBytes));

mustContain("demo/index.html", [
  "数据源总览",
  "AI 推理链路",
  "节点风险雷达",
  "AI 任务生成",
  "自治跟踪看板",
  "周会报告输出",
  "参赛要求覆盖"
]);

mustContain("demo/data.js", [
  "既有立项增量",
  "业务价值",
  "可落地性",
  "正式系统写回作为下一步集成"
]);

mustContain("outputs/ai-project-autonomy-platform/submission-checklist.md", [
  "一页纸方案",
  "Demo 1.0",
  "https://ai-project-auto-operation-platform.vercel.app",
  "团队简历",
  "立项情况",
  "业务价值",
  "可落地性"
]);

mustContain("outputs/ai-project-autonomy-platform/submission-support/project-status-statement.md", [
  "已有基础",
  "本次赛事新增增量",
  "可落地路径"
]);

console.log("Submission verification passed");
