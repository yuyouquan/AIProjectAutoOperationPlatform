# AI 项目自治运营平台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Chinese-language editable PPTX one-page submission and a local interactive HTML Demo 1.0 for the AI 项目自治运营平台.

**Architecture:** Use a static front-end demo with local sample data so the artifact can run without backend/auth dependencies. Use the bundled Presentations artifact-tool scripts to generate an editable PPTX and rendered previews. Keep source data, demo UI, and presentation source separate so the story can be adjusted without rewriting the interface.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, bundled Node.js at `/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`, `@oai/artifact-tool` via the Presentations skill build scripts.

---

## File Structure

- Create: `demo/index.html`
  - Single-page Chinese interactive demo shell.
- Create: `demo/styles.css`
  - Responsive, work-focused dashboard styling.
- Create: `demo/data.js`
  - Sanitized sample project, risk, issue, after-sales, task, and report data.
- Create: `demo/app.js`
  - Demo interactions: project selection, risk-to-task generation, task status changes, report rendering.
- Create: `scripts/verify-demo.mjs`
  - Static checks for required Chinese sections, scripts, and source data.
- Create: `outputs/ai-project-autonomy-platform/demo/README.md`
  - Demo usage and talk track.
- Create: `outputs/ai-project-autonomy-platform/presentations/slides/slide-01.mjs`
  - Editable one-page PPTX scheme slide.
- Create: `outputs/ai-project-autonomy-platform/presentations/profile-plan.txt`
  - Presentation task mode/profile/source plan.
- Create: `outputs/ai-project-autonomy-platform/presentations/build.sh`
  - Runs artifact-tool deck build from the bundled Presentations scripts.
- Output: `outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx`
  - Final editable PPTX.
- Output: `outputs/ai-project-autonomy-platform/presentations/preview/contact-sheet.png`
  - Rendered preview contact sheet.

GitHub remote provided by user:

- `https://github.com/yuyouquan/AIProjectAutoOperationPlatform.git`

The current directory starts as a non-git folder. After artifacts are verified,
initialize git locally, commit the first version, set this remote as `origin`,
and push `main`.

## Task 1: Build The Demo Data Contract

**Files:**
- Create: `demo/data.js`

- [ ] **Step 1: Create `demo/data.js` with Chinese sample data**

Use this exact data shape:

```js
window.DEMO_DATA = {
  projects: [
    {
      id: "camon-co7",
      name: "TECNO CAMON 60 Pro 5G",
      code: "CO7_H8110",
      baseline: "N6878",
      node: "PR1",
      status: "高风险",
      line: "CAMON 产品线",
      ownerDept: "PS_产品项目管理一部",
      nextMilestone: "QR1",
      milestoneDate: "2026-10-21"
    },
    {
      id: "tos-17",
      name: "tOS17.0",
      code: "tOS17.x",
      baseline: "A17",
      node: "IR/STR",
      status: "高风险",
      line: "tOS 版本开发",
      ownerDept: "软件项目管理",
      nextMilestone: "需求锁定",
      milestoneDate: "2026-06-15"
    },
    {
      id: "camon-cn6",
      name: "CAMON 50-CN6",
      code: "CN6_H581",
      baseline: "L6778",
      node: "QR2",
      status: "中风险",
      line: "CAMON 产品线",
      ownerDept: "PS_产品项目管理一部",
      nextMilestone: "PIR",
      milestoneDate: "2026-07-01"
    }
  ],
  sources: [
    { name: "项目管理系统", signal: "节点、进度、责任部门、周会数据", freshness: "已同步 W23", health: "正常" },
    { name: "缺陷管理系统", signal: "缺陷存量、关闭率、Reopen、P0/P1", freshness: "已同步 25 条遗留问题", health: "需关注" },
    { name: "体验大数据系统", signal: "稳定性、性能、功耗、启动、卡顿", freshness: "已同步 145/125 版本", health: "异常" },
    { name: "售后与 VOC 系统", signal: "ARR、VOC、差评、核心痛点", freshness: "已同步 TOP 投诉", health: "需关注" }
  ],
  risks: [
    {
      id: "risk-performance",
      projectId: "camon-co7",
      level: "高",
      dimension: "流畅性",
      title: "性能竞品机与整机 SE 推荐存在差距",
      nodeRule: "PR1 节点需完成体验指标与竞品基线锁定",
      evidence: "PR1 前性能竞品机未统一，影响后续指标输出与体验验收。",
      source: "项目管理系统 + 体验大数据系统",
      ownerDept: "系统应用开发部",
      owner: "性能代表",
      dueDate: "2026-06-12",
      status: "Open",
      action: "组织性能、整机 SE、项目管理三方确认竞品机，并输出指标封板时间。"
    },
    {
      id: "risk-defect",
      projectId: "tos-17",
      level: "高",
      dimension: "版本构建质量",
      title: "基线异常代码入库导致版本无法开机",
      nodeRule: "IR/STR 阶段需保障基线可构建、门禁问题可追溯",
      evidence: "A17 高通基线异常代码入库导致版本无法开机，门禁流程阻断，影响时长 8h。",
      source: "缺陷管理系统 + CI 构建数据",
      ownerDept: "系统应用开发部",
      owner: "马浩良",
      dueDate: "2026-06-11",
      status: "Ongoing",
      action: "输出根因分析与门禁改善措施，补齐异常代码入库复盘。"
    },
    {
      id: "risk-voc",
      projectId: "camon-cn6",
      level: "中",
      dimension: "售后/VOC",
      title: "流畅度负向反馈跨机型集中出现",
      nodeRule: "QR2 节点需关注上市前体验口碑与售后高频痛点",
      evidence: "VOC 样例显示流畅度、续航、游戏体验为新增负向舆情核心痛点。",
      source: "售后系统 + VOC 舆情",
      ownerDept: "产品与解决方案部",
      owner: "体验运营",
      dueDate: "2026-06-14",
      status: "Open",
      action: "结合缺陷与大数据定位高频场景，形成 QR2 前体验风险清单。"
    }
  ],
  issueSummary: {
    week: "2026-W24",
    previousBacklog: 25,
    newIssues: 0,
    closedThisWeek: 0,
    continuedBacklog: 25,
    closureRate: "0%",
    escalationDepartments: ["硬件部", "结构部", "底软通信开发部"]
  }
};
```

- [ ] **Step 2: Verify data file exists**

Run: `test -f demo/data.js && echo "demo data ready"`

Expected output: `demo data ready`

## Task 2: Build The Interactive Demo

**Files:**
- Create: `demo/index.html`
- Create: `demo/styles.css`
- Create: `demo/app.js`

- [ ] **Step 1: Create `demo/index.html`**

The page must contain these Chinese sections:

```html
<section id="source-overview">数据源总览</section>
<section id="risk-radar">节点风险雷达</section>
<section id="task-agent">AI 任务生成</section>
<section id="tracking-board">自治跟踪看板</section>
<section id="report-output">周会报告输出</section>
```

It must load `styles.css`, `data.js`, and `app.js`.

- [ ] **Step 2: Create `demo/styles.css`**

Use a restrained dashboard style: white/ink base, blue and amber accents, 8px radii, dense readable tables, responsive grids, no marketing hero.

- [ ] **Step 3: Create `demo/app.js`**

Implement:

```js
renderSources();
renderProjects();
selectProject(projectId);
renderRisks(projectId);
renderTasks(projectId);
simulateCreateTask(riskId);
renderTrackingBoard();
renderReport(projectId);
```

The default selected project is `camon-co7`.

- [ ] **Step 4: Verify demo files are present**

Run:

```bash
test -f demo/index.html && test -f demo/styles.css && test -f demo/app.js && echo "demo shell ready"
```

Expected output: `demo shell ready`

## Task 3: Add Demo Verification

**Files:**
- Create: `scripts/verify-demo.mjs`

- [ ] **Step 1: Create `scripts/verify-demo.mjs`**

The script must check:

```js
const requiredFiles = ["demo/index.html", "demo/styles.css", "demo/app.js", "demo/data.js"];
const requiredText = ["数据源总览", "节点风险雷达", "AI 任务生成", "自治跟踪看板", "周会报告输出"];
const requiredDataKeys = ["projects", "sources", "risks", "issueSummary"];
```

It should exit with code `1` and print a specific missing item if any check fails.

- [ ] **Step 2: Run verification**

Run:

```bash
/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/verify-demo.mjs
```

Expected output: `Demo verification passed`

## Task 4: Build The One-Page PPT Source

**Files:**
- Create: `outputs/ai-project-autonomy-platform/presentations/profile-plan.txt`
- Create: `outputs/ai-project-autonomy-platform/presentations/slides/slide-01.mjs`
- Create: `outputs/ai-project-autonomy-platform/presentations/build.sh`

- [ ] **Step 1: Create `profile-plan.txt`**

Include:

```text
task mode: create
primary deck-profile: product-platform
secondary gates: engineering-platform
required proof objects: data-source-to-AI-to-task architecture, demo closed loop, business value
source requirements: IPM weekly meeting data, Feishu weekly reports, sanitized sample fields
brand constraints: Chinese enterprise project-management style, no external logos
QA gates: editable PPTX, rendered preview, Chinese copy, no overpromised production write-back
known missing inputs: final team resume, final submission portal upload format
```

- [ ] **Step 2: Create `slide-01.mjs`**

The slide must add exactly one slide and use Chinese text:

- Title: `AI 项目自治运营平台`
- Subtitle: `从多系统数据到风险识别、任务创建、跟踪闭环和管理汇报`
- Left proof: four data sources.
- Center proof: AI node-aware reasoning.
- Right proof: task and report output.
- Bottom proof: Demo 1.0 increment and business value.

- [ ] **Step 3: Create `build.sh`**

Run the bundled builder:

```bash
NODE="/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
SKILL="/Users/shswyuyouquan/.codex/plugins/cache/openai-primary-runtime/presentations/26.601.10930/skills/presentations"
"$NODE" "$SKILL/scripts/build_artifact_deck.mjs" \
  --slides-dir "outputs/ai-project-autonomy-platform/presentations/slides" \
  --workspace "outputs/ai-project-autonomy-platform/presentations/workspace" \
  --out "outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx" \
  --preview-dir "outputs/ai-project-autonomy-platform/presentations/preview" \
  --layout-dir "outputs/ai-project-autonomy-platform/presentations/layout" \
  --contact-sheet "outputs/ai-project-autonomy-platform/presentations/preview/contact-sheet.png" \
  --slide-count 1
```

## Task 5: Generate And Verify PPTX

**Files:**
- Output: `outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx`
- Output: `outputs/ai-project-autonomy-platform/presentations/preview/contact-sheet.png`

- [ ] **Step 1: Run PPT builder**

Run:

```bash
bash outputs/ai-project-autonomy-platform/presentations/build.sh
```

Expected: JSON manifest with `"slideCount": 1`.

- [ ] **Step 2: Verify PPTX file**

Run:

```bash
test -s outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx && echo "pptx ready"
```

Expected output: `pptx ready`

- [ ] **Step 3: Verify preview file**

Run:

```bash
test -s outputs/ai-project-autonomy-platform/presentations/preview/contact-sheet.png && echo "preview ready"
```

Expected output: `preview ready`

## Task 6: Add Handoff README

**Files:**
- Create: `outputs/ai-project-autonomy-platform/demo/README.md`

- [ ] **Step 1: Create README**

Include:

```markdown
# AI 项目自治运营平台 Demo 1.0

打开方式：直接打开 `demo/index.html`。

演示顺序：
1. 数据源总览：说明 AI 自动收集项目管理、缺陷、大数据、售后数据。
2. 节点风险雷达：选择项目，展示 AI 按节点识别风险。
3. AI 任务生成：点击“模拟创建任务”，展示任务字段。
4. 自治跟踪看板：说明 Open/Ongoing/升级/Closed 闭环。
5. 周会报告输出：展示 AI 自动生成周会和管理层摘要。

讲解口径：Demo 1.0 先证明 AI 风险识别和任务建议闭环，正式系统写回任务平台作为下一步集成。
```

- [ ] **Step 2: Final verification**

Run:

```bash
/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/verify-demo.mjs
test -s outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx
test -s outputs/ai-project-autonomy-platform/presentations/preview/contact-sheet.png
```

Expected: all commands exit `0`.

## Task 7: Initialize GitHub Repository

**Files:**
- Modify git metadata only.

- [ ] **Step 1: Confirm remote state**

Run:

```bash
git ls-remote https://github.com/yuyouquan/AIProjectAutoOperationPlatform.git HEAD refs/heads/main refs/heads/master
```

Expected: either no output for an empty repository, or explicit refs that must
be reviewed before pushing.

- [ ] **Step 2: Initialize local git repository**

Run:

```bash
git init
git branch -M main
git remote add origin https://github.com/yuyouquan/AIProjectAutoOperationPlatform.git
```

Expected: local repo initialized with `origin` remote.

- [ ] **Step 3: Add project files**

Run:

```bash
git add demo docs outputs scripts
git status --short
```

Expected: only planned project files are staged.

- [ ] **Step 4: Commit initial submission artifacts**

Run:

```bash
git commit -m "feat: add AI project autonomy platform demo"
```

Expected: commit succeeds.

- [ ] **Step 5: Push main branch**

Run:

```bash
git push -u origin main
```

Expected: branch `main` pushed to the provided GitHub repository.
