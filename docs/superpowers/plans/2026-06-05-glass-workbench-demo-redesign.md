# Glass Workbench Demo Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the hackathon Demo into a bright glassmorphism AI project autonomy workbench that clearly shows data intake, AI analysis/thinking, task distribution, deliverable QA, reminder/escalation, and Feishu report output.

**Architecture:** Keep the current static deployment shape: `demo/index.html` loads `demo/styles.css`, `demo/data.js`, and `demo/app.js` through the adaptive asset loader. Replace the long step-by-step page with a first-screen workbench: left input/data-source cockpit, center AI reasoning stage, right task/report output rail, plus compact supporting bands below for submission fit.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node verification scripts, Playwright/browser verification through the local static server.

---

### Task 1: Add Failing Verification For The New Demo Contract

**Files:**
- Modify: `scripts/verify-demo.mjs`

- [ ] **Step 1: Write the failing verification**

Add checks for the new workbench copy, data keys, interaction IDs, and glassmorphism tokens:

```javascript
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

const cssSource = fs.readFileSync(path.join(root, "demo/styles.css"), "utf8");
for (const cssText of ["backdrop-filter", "--glass", "--aqua", "workbench-grid", "thinking-card"]) {
  if (!cssSource.includes(cssText)) {
    fail(`Missing glass workbench CSS token: ${cssText}`);
  }
}
```

- [ ] **Step 2: Run verification to confirm RED**

Run: `node scripts/verify-demo.mjs`

Expected: FAIL with `Missing redesigned workbench copy: AI 项目任务智能体工作台`.

- [ ] **Step 3: Commit the failing test**

Run:

```bash
git add scripts/verify-demo.mjs
git commit -m "test: define glass workbench demo contract"
```

### Task 2: Rebuild The Workbench Markup

**Files:**
- Modify: `demo/index.html`

- [ ] **Step 1: Replace page content with a focused workbench shell**

Keep the existing adaptive asset loader. Replace the body content with:

```html
<body>
  <main class="workbench-page" id="workbench-root">
    <section class="hero-band" aria-label="AI 项目任务智能体工作台">
      <nav class="top-glass-bar">
        <div>
          <p class="eyebrow">AI 黑客松 Demo 2.0</p>
          <h1>AI 项目任务智能体工作台</h1>
        </div>
        <label class="scenario-search" for="scenario-selector">
          <span>方案输入</span>
          <select id="scenario-selector" aria-label="选择演示项目场景"></select>
        </label>
        <div class="top-actions">
          <button class="ghost-button" id="reset-demo" type="button">重置</button>
          <button class="primary-button" id="start-ai-analysis" type="button">开始 AI 分析</button>
        </div>
      </nav>

      <div class="hero-copy">
        <p>把项目交付件、群聊、云文档和多系统原始数据，自动解析成风险、任务、催办和飞书周报。</p>
        <div class="hero-metrics" id="hero-metrics"></div>
      </div>
    </section>

    <section class="workbench-grid" aria-label="AI 项目自治运营工作台">
      <aside class="glass-panel input-panel">
        <div class="panel-title">
          <span class="panel-index">01</span>
          <div>
            <p class="eyebrow">方案输入</p>
            <h2>项目与原始信号</h2>
          </div>
        </div>
        <div id="scenario-brief"></div>
        <div class="source-cloud" id="source-cloud"></div>
        <div class="dimension-grid" id="dimension-grid"></div>
      </aside>

      <section class="glass-panel ai-panel">
        <div class="panel-title">
          <span class="panel-index">02</span>
          <div>
            <p class="eyebrow">智能体数据解析</p>
            <h2>AI 分析与思考过程</h2>
          </div>
        </div>
        <div class="ai-core">
          <div class="orbital-core" aria-hidden="true"></div>
          <div>
            <strong id="ai-core-title">等待启动</strong>
            <p id="ai-core-subtitle">点击开始后，AI 会按数据源、质量、进度、成本、节点风险逐步推理。</p>
          </div>
        </div>
        <div class="stage-list" id="ai-stage-list"></div>
        <div class="thinking-feed" id="ai-thinking-feed"></div>
      </section>

      <aside class="glass-panel output-panel">
        <div class="panel-title">
          <span class="panel-index">03</span>
          <div>
            <p class="eyebrow">任务闭环中枢</p>
            <h2>生成、分发、质检、预警</h2>
          </div>
        </div>
        <div class="task-distribution-panel" id="task-distribution-panel"></div>
        <div class="deliverable-panel">
          <div>
            <strong>交付件质检</strong>
            <p id="deliverable-status">等待责任人上传进展说明与交付件。</p>
          </div>
          <button class="mini-button" id="deliverable-upload-button" type="button">一键上传</button>
          <button class="mini-button danger" id="qa-reject-button" type="button">AI 建议打回</button>
        </div>
        <div class="escalation-feed" id="escalation-feed"></div>
      </aside>
    </section>

    <section class="lower-grid">
      <article class="glass-panel report-panel" id="feishu-doc-panel"></article>
      <article class="glass-panel fit-panel">
        <div class="panel-title">
          <span class="panel-index">04</span>
          <div>
            <p class="eyebrow">评审适配</p>
            <h2>参赛要求覆盖</h2>
          </div>
        </div>
        <div id="contest-fit-grid"></div>
      </article>
    </section>
  </main>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script>/* keep adaptive bootDemo loader */</script>
</body>
```

- [ ] **Step 2: Run verification**

Run: `node scripts/verify-demo.mjs`

Expected: still FAIL because data and script rendering are not implemented yet.

### Task 3: Replace Demo Data With Workbench-Centric Chinese Scenario Data

**Files:**
- Modify: `demo/data.js`

- [ ] **Step 1: Define the new data contract**

Create `window.DEMO_DATA` with these keys:

```javascript
window.DEMO_DATA = {
  summaryMetrics: [
    { label: "自动读取", value: "10 类系统", note: "项目 / 缺陷 / 大数据 / 售后" },
    { label: "AI 识别", value: "3 个风险", note: "质量、进度、成本联动判断" },
    { label: "任务生成", value: "4 条任务", note: "含背景、目标、责任、验收" },
    { label: "报告输出", value: "飞书 Docx", note: "周报 / 月报 / 上升预警" }
  ],
  scenarios: [
    {
      id: "camon-pr1",
      name: "TECNO CAMON 60 Pro 5G｜PR1 节点",
      node: "PR1",
      ownerDept: "PS_产品项目管理一部",
      businessGoal: "QR1 前锁定体验基线、模块化配件交付计划和缺陷收敛责任。",
      inputs: ["PR1 交付件清单", "项目周会群聊纪要", "竞品基线 Wiki", "缺陷遗留表", "售后 VOC 摘要"],
      risks: ["性能竞品基线未统一", "模块化配件 PD 与交付计划未定", "缺陷关闭率连续两周为 0%"]
    }
  ],
  systemSources: [
    { name: "SPUG/TOnes", category: "项目任务", signal: "项目节点、交付件、周会任务、责任人", health: "已接入" },
    { name: "IPM", category: "项目管理", signal: "项目概况、里程碑、风险状态、部门周报", health: "已接入" },
    { name: "UTP", category: "测试验证", signal: "测试计划、验证结论、阻塞项", health: "可读取" },
    { name: "BOM", category: "物料", signal: "关键物料、替代料、试产准备", health: "可读取" },
    { name: "SAP", category: "供应链", signal: "采购、成本、库存、出货计划", health: "可读取" },
    { name: "MES", category: "制造", signal: "试产良率、产线异常、工站问题", health: "可读取" },
    { name: "MOM", category: "制造运营", signal: "生产节拍、异常停线、返工数据", health: "可读取" },
    { name: "QMS", category: "质量", signal: "质量门禁、8D、问题闭环", health: "可读取" },
    { name: "CRM", category: "售后", signal: "客诉、差评、区域反馈、ARR", health: "可读取" },
    { name: "Trancare", category: "售后", signal: "维修、返修、服务网点问题", health: "可读取" }
  ],
  analysisStages: [
    {
      id: "parse",
      title: "解析多源输入",
      raw: "交付件=PR1 清单；群聊=三方未确认竞品机；云文档=模块化配件 PD 未定；IPM=高风险。",
      parsed: "识别出项目节点、交付件缺口、群聊承诺、文档结论和系统字段的同一项目实体。",
      thought: "先把人写在不同位置的信息归一到项目节点，避免项目经理逐条复制。",
      decision: "形成 PR1 节点运行画像，并进入质量、进度、成本三类分析。"
    },
    {
      id: "quality",
      title: "质量风险判断",
      raw: "QMS 缺陷遗留=25；关闭=0；CRM/VOC 反馈=流畅度、续航、游戏体验集中。",
      parsed: "质量问题不是新增爆发，而是收敛停滞和同类 VOC 前置风险叠加。",
      thought: "PR1 阶段如果质量闭环不动，后续 QR 会把风险放大成版本验收问题。",
      decision: "生成缺陷收敛专项任务，要求责任部门输出关闭计划和阻塞原因。"
    },
    {
      id: "progress",
      title: "进度与交付件判断",
      raw: "模块化配件 AI mori / AI 智能补光灯 PD 未锁定；RMT 复评材料未齐套。",
      parsed: "核心价值点交付件缺少明确目标、负责人和完成时间。",
      thought: "这类风险不能只提醒，需要转成可分发任务并带上背景说明和验收标准。",
      decision: "生成模块化配件 PD 锁定任务，一键分发给 PPM、ID、供应链协同人。"
    },
    {
      id: "cost",
      title: "成本与工时判断",
      raw: "SAP/BOM 工时与替代料评估未回写；返工影响成本未进入周报。",
      parsed: "成本风险目前不是金额超标，而是缺少可解释的工时和物料影响来源。",
      thought: "管理层周报需要看到成本影响路径，否则任务优先级不够清晰。",
      decision: "在报告中输出成本待确认项，暂不升级为高风险任务。"
    },
    {
      id: "task",
      title: "生成任务与催办",
      raw: "任务候选=4；超期=1；需上升预警=1；飞书周会输出=待生成。",
      parsed: "把风险转成任务字段：背景、参考信息、清晰目标、责任部门、验收口径。",
      thought: "评委需要看到 AI 不是只写报告，而是把风险推进到任务系统并持续催办。",
      decision: "生成任务、模拟分发、检查上传交付件质量，并输出飞书周会文档。"
    }
  ],
  taskLoop: {
    tasks: [
      {
        title: "统一性能竞品基线并输出指标封板时间",
        owner: "系统应用开发部 / 性能代表",
        due: "2026-06-12",
        goal: "完成竞品机清单、指标封板时间、影响项目范围三项确认。",
        evidence: "IPM PR1 节点 + 体验大数据异常"
      },
      {
        title: "锁定模块化配件 PD 与 RMT 复评材料",
        owner: "产品与解决方案部 / 整机 PPM",
        due: "2026-06-05",
        goal: "完成 PD 锁定、节点排期、RMT 复评材料。",
        evidence: "周会群聊 + 云文档"
      },
      {
        title: "输出缺陷收敛计划和阻塞原因",
        owner: "硬件部、结构部、底软通信开发部",
        due: "2026-06-10",
        goal: "关闭率从 0% 恢复到可跟踪节奏，并明确升级问题。",
        evidence: "QMS/Jira 缺陷遗留"
      },
      {
        title: "补齐成本与工时影响说明",
        owner: "供应链管理部 / 成本接口人",
        due: "2026-06-14",
        goal: "确认替代料、返工工时和成本影响路径。",
        evidence: "SAP/BOM/MES/MOM"
      }
    ]
  },
  reportOutputs: {
    title: "TECNO CAMON 60 Pro 5G｜PR1 节点 AI 周会报告",
    blocks: ["当前判断", "关键风险", "任务分发", "催办预警", "管理建议"]
  },
  contestFit: [
    { requirement: "Demo 体感", evidence: "首屏展示输入、AI 思考、任务闭环与飞书输出。", status: "重做强化" },
    { requirement: "业务价值", evidence: "把人工收集、判断、催办、写报告改成 AI 自动闭环。", status: "突出" },
    { requirement: "可落地性", evidence: "多系统先读后写，正式写回作为下一步集成边界。", status: "清晰" },
    { requirement: "既有项目增量", evidence: "新增 AI 节点推理、任务生成、交付件质检和上升预警。", status: "明确" }
  ]
};
```

- [ ] **Step 2: Run verification**

Run: `node scripts/verify-demo.mjs`

Expected: still FAIL because `demo/app.js` has not rendered the new DOM yet.

### Task 4: Implement Workbench Interaction Logic

**Files:**
- Modify: `demo/app.js`

- [ ] **Step 1: Replace old renderer with workbench renderers**

Implement these functions:

```javascript
const state = {
  selectedScenarioId: data.scenarios[0].id,
  activeStage: -1,
  completedStages: new Set(),
  distributed: false,
  deliverableUploaded: false,
  qaRejected: false,
  timers: []
};

function renderHeroMetrics() {}
function renderScenarioOptions() {}
function renderScenarioBrief() {}
function renderSources() {}
function renderAnalysisStages() {}
function renderThinkingFeed() {}
function renderTaskDistribution() {}
function renderDeliverableQa() {}
function renderEscalations() {}
function renderFeishuReport() {}
function startAnalysis() {}
function resetDemo() {}
function uploadDeliverable() {}
function rejectDeliverable() {}
```

Use `setTimeout` to advance stages every `1900ms`, with a `900ms` completion window so each thinking card is readable. On the final stage, set `distributed = true`, render generated tasks, escalation, and Feishu report blocks.

- [ ] **Step 2: Add interaction handlers**

Bind:

```javascript
byId("scenario-selector").addEventListener("change", handleScenarioChange);
byId("start-ai-analysis").addEventListener("click", startAnalysis);
byId("reset-demo").addEventListener("click", resetDemo);
byId("deliverable-upload-button").addEventListener("click", uploadDeliverable);
byId("qa-reject-button").addEventListener("click", rejectDeliverable);
```

- [ ] **Step 3: Run verification**

Run: `node scripts/verify-demo.mjs`

Expected: PASS for static contract.

### Task 5: Build Bright Glassmorphism Styling And Motion

**Files:**
- Modify: `demo/styles.css`

- [ ] **Step 1: Replace old dark long-page CSS with the bright glass workbench system**

Define:

```css
:root {
  --bg: #eaf8ff;
  --ink: #0b2447;
  --muted: #4f6f8e;
  --glass: rgba(255, 255, 255, 0.46);
  --glass-strong: rgba(255, 255, 255, 0.72);
  --aqua: #20d6ff;
  --blue: #2478ff;
  --mint: #55f0c2;
  --amber: #ffb84d;
  --danger: #ff5f7e;
  --line: rgba(255, 255, 255, 0.58);
  --shadow: 0 24px 70px rgba(47, 132, 190, 0.18);
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

Create styles for `.workbench-page`, `.hero-band`, `.top-glass-bar`, `.scenario-search`, `.workbench-grid`, `.glass-panel`, `.source-cloud`, `.ai-core`, `.orbital-core`, `.stage-list`, `.thinking-card`, `.task-distribution-panel`, `.deliverable-panel`, `.escalation-feed`, `.lower-grid`, `.report-panel`, `.toast`, mobile breakpoints, and `prefers-reduced-motion`.

- [ ] **Step 2: Run browser visual verification**

Run local server:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/demo/` and verify:

- desktop has no blank slab, no overlap, no horizontal overflow
- mobile has no horizontal overflow
- buttons are at least 44px high
- AI thinking cards appear inside the central AI analysis panel
- final report panel shows Feishu document output

### Task 6: Update Documentation And Submission Checklist

**Files:**
- Modify: `README.md`
- Modify: `outputs/ai-project-autonomy-platform/demo/README.md`
- Modify: `outputs/ai-project-autonomy-platform/submission-checklist.md`

- [ ] **Step 1: Update Chinese demo description**

Update the demo narrative from “自动巡检演示台” to “AI 项目任务智能体工作台”, with these points:

```markdown
演示主线：
1. 方案输入：选择项目场景，展示交付件、群聊、云文档、多系统原始数据。
2. 数据解析：AI 将 SPUG/TOnes、IPM、UTP、BOM、SAP、MES、MOM、QMS、CRM、Trancare 等信号归一到项目节点。
3. AI 思考：逐步展示原始数据、解析结果、思考依据、决策输出。
4. 任务闭环：自动生成任务，一键分发，责任人上传交付件，AI 质检并可建议打回。
5. 催办预警：对未完成或超期任务提醒责任人并预警任务下发人。
6. 报告输出：自动生成周报、月报和飞书文档草稿。
```

- [ ] **Step 2: Run submission verification**

Run: `node scripts/verify-submission.mjs`

Expected: PASS.

### Task 7: Final Verification And Commit

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run full local verification**

Run:

```bash
node scripts/verify-demo.mjs
node scripts/verify-submission.mjs
```

Expected:

```text
Demo verification passed
Submission verification passed
```

- [ ] **Step 2: Run Playwright/browser checks**

Use the in-app browser or Playwright against `http://localhost:4173/demo/` to check:

- computed stylesheet loaded
- no console errors
- `#workbench-root` exists
- `#ai-thinking-feed .thinking-card` count is at least 5 after starting analysis
- `#task-distribution-panel` shows generated tasks after completion
- `#feishu-doc-panel` shows the Feishu report title after completion
- `document.documentElement.scrollWidth <= window.innerWidth` for desktop and mobile

- [ ] **Step 3: Commit only Demo redesign files**

Run:

```bash
git add demo/index.html demo/styles.css demo/app.js demo/data.js scripts/verify-demo.mjs README.md outputs/ai-project-autonomy-platform/demo/README.md outputs/ai-project-autonomy-platform/submission-checklist.md docs/superpowers/plans/2026-06-05-glass-workbench-demo-redesign.md
git commit -m "feat: redesign demo as glass AI workbench"
```

Leave unrelated PPT files unstaged.
