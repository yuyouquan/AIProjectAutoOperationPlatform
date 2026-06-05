# AI 项目自治运营平台

面向 AI 黑客松的参赛 Demo 与一页纸方案。目标是用 AI 把项目管理中的人工收集、风险判断、任务创建、跟踪催办和周会报告生成，收敛为一个可解释、可落地的自治闭环。

## Demo 3.0

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

1. 方案输入：以真实飞书 Wiki `tOS交付进展汇报W23` 为样例，只展示老板最关心的关键风险信号。
2. 数据解析：AI 将周会文档、SPUG/TOnes、IPM、QMS/Jira、CRM、Trancare、研发站点等信号归一到项目节点。
3. AI 思考：逐步解释为什么 47% 构建成功率、APR TOP10 解决率 1% (30/330)、Note 60 Pro 67 条舆情、Open 49/超期19 需要升级。
4. 任务生成：自动生成可分发任务，补齐背景说明、参考信息、清晰目标、责任人、截止时间和验收口径。
5. 问题输出：自动生成类似 IPM 问题跟进的列表，处理进展、状态、完成时间可继续修改，并可作为后续写回系统的数据结构。

## 参赛提交物

- 一页纸 PPTX：`outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx`
- PPT 预览图：`outputs/ai-project-autonomy-platform/presentations/preview/slide-01.png`
- Demo 页面：`demo/index.html`
- Vercel 线上 Demo：`https://ai-project-auto-operation-platform.vercel.app`
- Demo QA 截图：`outputs/ai-project-autonomy-platform/demo/demo-desktop.png`、`outputs/ai-project-autonomy-platform/demo/demo-mobile.png`

## 既有基础与赛事增量

既有基础：IPM 项目周会管理、项目概况、问题跟进、部门汇报以及周会 Wiki/表格中的项目状态、风险、责任人、截止时间等数据。

赛事增量：AI 节点风险推理、跨系统风险到任务生成、催办上升预警、本地交互 Demo、参赛增量说明和真实 W23 验证数据。Demo 3.0 采用先读后写策略，不宣称已完成正式生产系统写回；任务系统写回作为下一步集成。

## 验证

```bash
/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/verify-demo.mjs
```

浏览器交互与截图验收：

```bash
NODE_PATH=/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/verify-glass-workbench.mjs
```

预期输出：

```text
Demo verification passed
Glass workbench browser verification passed
```
