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

1. 方案输入：选择项目场景，展示项目交付件、群聊、云文档和多系统原始信号。
2. 数据解析：AI 将 SPUG/TOnes、IPM、UTP、BOM、SAP、MES、MOM、QMS、CRM、Trancare 等信号归一到项目节点。
3. AI 思考：逐步展示原始数据、解析结果、AI 思考过程和决策输出，让评委看到判断依据。
4. 任务闭环：自动生成任务，一键分发，补齐背景说明、参考信息、清晰目标、责任和验收口径。
5. 交付件质检：责任人一键上传交付件和进展说明，AI 检测完成质量并可建议打回。
6. 催办预警：对未完成或超期任务提醒责任人，并预警任务下发人。
7. 报告输出：自动生成周报、月报和飞书文档草稿。
8. 参赛要求覆盖：说明一页纸方案、Demo 2.0、既有立项增量、业务价值和可落地性。

## 参赛提交物

- 一页纸 PPTX：`outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx`
- PPT 预览图：`outputs/ai-project-autonomy-platform/presentations/preview/slide-01.png`
- Demo 页面：`demo/index.html`
- Vercel 线上 Demo：`https://ai-project-auto-operation-platform.vercel.app`
- Demo QA 截图：`outputs/ai-project-autonomy-platform/demo/demo-desktop.png`、`outputs/ai-project-autonomy-platform/demo/demo-mobile.png`

## 既有基础与赛事增量

既有基础：IPM 项目周会管理、项目概况、问题跟进、部门汇报以及周会 Wiki/表格中的项目状态、风险、责任人、截止时间等数据。

赛事增量：AI 节点风险推理、跨系统风险到任务生成、交付件质量检测、催办上升预警、本地交互 Demo、参赛增量说明和验证数据。Demo 2.0 采用先读后写策略，不宣称已完成正式生产系统写回；任务系统写回作为下一步集成。

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
