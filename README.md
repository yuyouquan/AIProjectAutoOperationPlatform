# AI 项目自治运营平台

面向 AI 黑客松的参赛 Demo 与一页纸方案。目标是用 AI 把项目管理中的人工收集、风险判断、任务创建、跟踪催办和周会报告生成，收敛为一个可解释、可落地的自治闭环。

## Demo 1.0

本地打开：

```bash
python3 -m http.server 4173
```

访问：

```text
http://localhost:4173/
```

线上地址：

```text
https://ai-project-auto-operation-platform.vercel.app
```

演示主线：

1. 数据源总览：项目管理、缺陷、体验大数据、售后与 VOC 四类信号。
2. AI 推理链路：收集、理解、判断、生成、跟踪。
3. 节点风险雷达：按 CAMON / tOS 样例项目识别节点风险。
4. AI 任务生成：把风险转成带责任、截止时间、证据和验收口径的任务建议。
5. 自治跟踪看板：模拟创建任务后，看板与报告同步更新。
6. 周会报告输出：生成面向项目周会和管理层的中文摘要。
7. 参赛要求覆盖：说明一页纸方案、Demo 1.0、既有立项增量、业务价值和可落地性。

## 参赛提交物

- 一页纸 PPTX：`outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx`
- PPT 预览图：`outputs/ai-project-autonomy-platform/presentations/preview/slide-01.png`
- Demo 页面：`demo/index.html`
- Vercel 线上 Demo：`https://ai-project-auto-operation-platform.vercel.app`
- Demo QA 截图：`outputs/ai-project-autonomy-platform/demo/demo-desktop.png`、`outputs/ai-project-autonomy-platform/demo/demo-mobile.png`

## 既有基础与赛事增量

既有基础：IPM 项目周会管理、项目概况、问题跟进、部门汇报以及周会 Wiki/表格中的项目状态、风险、责任人、截止时间等数据。

赛事增量：AI 节点风险推理、跨系统风险到任务生成、本地交互 Demo、参赛增量说明和验证数据。Demo 1.0 采用先读后写策略，不宣称已完成正式生产系统写回；任务系统写回作为下一步集成。

## 验证

```bash
/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/verify-demo.mjs
```

预期输出：

```text
Demo verification passed
```
