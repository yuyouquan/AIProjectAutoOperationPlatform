window.DEMO_DATA = {
  summaryMetrics: [
    { label: "样例来源", value: "W23 周报", note: "tOS交付进展汇报W23" },
    { label: "AI 识别", value: "4 类高风险", note: "需求 / 构建 / 质量 / 售后" },
    { label: "输出", value: "4 条问题任务", note: "含进展、状态、完成时间" }
  ],

  scenario: {
    name: "tOS交付进展汇报W23｜真实周会样例",
    status: "高风险",
    goal: "把周会文档里的分散风险，自动转成可追责、可催办、可写回飞书的管理闭环。",
    oneLine: "老板看到的不是更多周报，而是 AI 自动指出哪个项目、哪个部门、哪天必须闭环。"
  },

  signals: [
    {
      label: "项目节点",
      value: "tOS17.0 需求未释放、Slim规划未定、IR验收计划未锁定",
      source: "飞书 Wiki / IPM"
    },
    {
      label: "构建质量",
      value: "tOS17.0 整机构建一次成功率 47%，10 次报错影响 6h",
      source: "SPUG/TOnes / 构建平台"
    },
    {
      label: "基础体验",
      value: "APR TOP10 模块解决率仅 1% (30/330)，阻塞挂测质量",
      source: "QMS / Jira"
    },
    {
      label: "售后声音",
      value: "Note 60 Pro 新增负向舆情 67 条，流畅度跨机型最集中",
      source: "CRM / Trancare / VOC"
    },
    {
      label: "站点反馈",
      value: "软件问题 959，Open 49，超期 19，影像/AI/系统应用集中",
      source: "研发站点 / 门店反馈"
    }
  ],

  analysisSources: [
    { type: "飞书 Wiki", name: "tOS交付进展汇报W23", meta: "当前样例 / 5 个风险信号" },
    { type: "IPM 周会", name: "2026-W23 项目问题跟进", meta: "问题列表 / 责任人 / 节点" },
    { type: "外部链接", name: "可粘贴一个或多个文档链接", meta: "支持飞书文档、Wiki、表格链接" }
  ],

  analysisHistory: [
    { name: "tOS W23 风险扫描", status: "已生成 4 条任务", time: "刚刚", count: "4" },
    { name: "Note 60 Pro VOC 聚类", status: "67 条舆情归因", time: "06-04", count: "3" },
    { name: "APR TOP10 闭环复盘", status: "30/330 进展预警", time: "06-03", count: "5" }
  ],

  flowSteps: [
    {
      id: "parse",
      label: "数据解析",
      action: "读取 W23 周会并归一风险信号",
      headline: "AI 正在解析 tOS W23 周会文档",
      detail: "从飞书 Wiki 中抽取版本、项目节点、责任人、截止时间、构建成功率、Jira、VOC 和站点反馈，把散落段落转成统一项目视图。",
      evidence: "识别：tOS17.0 需求/Slim/IR计划未锁定；1123 条 SR 已转测 781 条；整机构建一次成功率 47%。"
    },
    {
      id: "think",
      label: "AI 思考",
      action: "判断哪些风险需要升级为任务",
      headline: "AI 正在推理当前最该盯的风险",
      detail: "不把周报重新排版，而是按节点规则判断：低构建成功率、APR 闭环慢、VOC 上升和站点超期是否会影响挂测、上市和管理层决策。",
      evidence: "推理：47% 构建成功率会拖慢集成；APR TOP10 解决率 1% (30/330) 会影响挂测质量；Open 49/超期19 需要上升预警。"
    },
    {
      id: "task",
      label: "任务生成",
      action: "生成可分发任务和验收口径",
      headline: "AI 已生成关键管理任务",
      detail: "自动补齐背景说明、参考信息、清晰目标、责任部门、责任人、截止时间和验收方式，让任务可以一键上传和分发。",
      evidence: "任务：6/5 锁定模块化需求；6/12 明确 Slim 规划；6/15 输出 IR 验收策略；同步催办 LK7KOS17-8 跑测工具和 APR TOP10 闭环。"
    },
    {
      id: "report",
      label: "问题输出",
      action: "生成可编辑问题跟进列表",
      headline: "问题跟进列表已生成",
      detail: "把 AI 判断、风险证据、任务分发、催办预警和管理建议输出为项目问题列表，处理进展、状态和完成时间可由用户继续维护。",
      evidence: "输出：4 条 W23 高风险问题任务；正式系统写回作为下一步集成，当前 Demo 证明从读数到任务闭环的核心路径。"
    }
  ],

  statusOptions: ["待确认", "进行中", "预警中", "已完成", "已打回"],

  issueRecords: [
    {
      id: "2026-W23-01",
      risk: "Highlight",
      week: "2026-W23",
      project: "tOS17.0_BUILD",
      description: "【问题描述】tOS17.0 整机构建一次成功率 47%，10 次报错影响 6h；公共分区一次成功率 75%。\n【问题影响】低构建成功率会拖慢集成验证和挂测节奏。\n【问题诉求】6/8 前输出报错 TOP 根因与稳定提升方案。",
      progress: "1. 已按报错类型归类为流程缺陷、环境偶发、代码评审。\n2. 集成维护开发部牵头拉通底软通信和软件架设，6/8 前给出 TOP3 改进动作。",
      aiSuggestion: "责任领域：集成维护开发部（优先级：紧急）\n协同领域：底软通信开发部、软件架设与技术规划\nAI建议：建立构建失败 TOP 榜，每日自动同步失败原因和责任部门。\n决策：优先处理影响整机构建的一类问题。",
      aiReview: {
        responsibility: "产品与解决方案部（优先级：紧急）",
        collaboration: "影像部、架构部、工业设计部、结构部、硬件部、采购部",
        actions: "多 Sensor 布局与 ID/堆叠冲突，6/8 前需收敛方案。",
        consensus: "多 Sensor 布局与 ID/堆叠冲突，6/8 前需收敛方案。",
        difference: "影像价值取向、器件路线及架构选型未统一。",
        decision: "立即跨部门评审，完成方案摸排并锁定 ID 方向。",
        experience: "2026-W1909：多光谱方案未定影响堆叠与 ID；2024-W3648：闪光灯共孔受 ID/架构限制，需统一方案后导入。"
      },
      targetDate: "6-8",
      owner: "集成维护开发部",
      ownerName: "于佑全",
      ownerAvatar: "佑",
      submitter: "AI智能体\n2026-06-05",
      status: "进行中",
      completedAt: "2026-06-08"
    },
    {
      id: "2026-W23-02",
      risk: "Highlight",
      week: "2026-W23",
      project: "tOS17.0_PLAN",
      description: "【问题描述】模块化需求未释放、Slim版本规划未确定、新增需求未加锁；IR验收计划端到端策略未明确。\n【问题影响】会影响 tOS17.0 后续节点评审和版本验收。\n【问题诉求】6/5 锁定模块化需求，6/12 明确 Slim 规划，6/15 输出 IR 验收策略。",
      progress: "6/3：12 条技术迁移已通过评审并完成 IR 加锁。\n下一步：项目管理部推动 Slim 规划和 IR 验收策略同会评审。",
      aiSuggestion: "责任领域：项目管理部（优先级：紧急）\n协同领域：产品、研发、质量管理部\nAI建议：把 6/5、6/12、6/15 三个节点生成催办任务，并在逾期前 1 天提醒任务下发人。\n决策：未锁定事项进入周会置顶风险。",
      aiReview: {
        responsibility: "项目管理部（优先级：紧急）",
        collaboration: "产品、研发、质量管理部、版本管理部",
        actions: "把 6/5、6/12、6/15 三个节点生成催办任务，并在逾期前 1 天提醒任务下发人。",
        consensus: "模块化需求、Slim 规划和 IR 策略必须在 W23 内锁定。",
        difference: "新增需求是否继续准入仍需产品与版本管理共同裁决。",
        decision: "未锁定事项进入周会置顶风险，任务下发人收到上升预警。",
        experience: "2025-W4903：规划未锁定导致 FPC 与结构方案返工；2024-W3126：IR 策略滞后影响版本验收。"
      },
      targetDate: "6-15",
      owner: "项目管理部",
      ownerName: "涂良建",
      ownerAvatar: "涂",
      submitter: "AI智能体\n2026-06-05",
      status: "待确认",
      completedAt: "2026-06-15"
    },
    {
      id: "2026-W23-03",
      risk: "Highlight",
      week: "2026-W23",
      project: "tOS17.0_APR",
      description: "【问题描述】应用 APR 超标 TOP10 模块问题解决率仅 1% (30/330)。\n【问题影响】影响版本挂测质量，遗留重点问题无法及时闭环。\n【问题诉求】责任人按模块输出收敛计划和每日闭环数量。",
      progress: "当前 30/330 已解决，剩余问题集中在系统应用、移动互联、影像等模块。\n建议今天下发 TOP10 模块责任清单。",
      aiSuggestion: "责任领域：系统应用开发部（优先级：紧急）\n协同领域：移动互联、影像、质量管理部\nAI建议：按模块负责人生成任务，状态每日从 Jira/QMS 自动刷新。\n经验：解决率低于 20% 时自动上升预警。",
      aiReview: {
        responsibility: "系统应用开发部（优先级：紧急）",
        collaboration: "移动互联、影像、质量管理部、测试部",
        actions: "按模块负责人生成任务，状态每日从 Jira/QMS 自动刷新。",
        consensus: "APR TOP10 必须从问题清单转成模块负责人清单。",
        difference: "低复现问题是否纳入版本阻塞项仍需质量管理部确认。",
        decision: "解决率低于 20% 自动上升预警，逾期任务同步下发人。",
        experience: "2025-W1709：无网通信问题因责任链不清导致闭环延迟；2024-W2821：质量阈值提前冻结后挂测返工减少。"
      },
      targetDate: "6-6",
      owner: "系统应用开发部",
      ownerName: "于佑全",
      ownerAvatar: "佑",
      submitter: "AI智能体\n2026-06-05",
      status: "预警中",
      completedAt: "2026-06-06"
    },
    {
      id: "2026-W23-04",
      risk: "Highlight",
      week: "2026-W23",
      project: "VOC_NOTE60PRO",
      description: "【问题描述】Note 60 Pro 新增负向舆情 67 条，流畅度问题跨机型最集中；研发站点软件问题 959，Open 49，超期19。\n【问题影响】影响上市口碑、售后满意度和站点闭环效率。\n【问题诉求】输出 VOC TOP 问题责任归因和 Open 问题修复节奏。",
      progress: "已汇总 CRM、Trancare、VOC 负向舆情和研发站点反馈，流畅度、背板灯效、游戏体验为 TOP3。\n下一步：将 VOC TOP 问题与 Open 49/超期19 站点问题关联到项目任务和版本修复计划。",
      aiSuggestion: "责任领域：软件产品规划（优先级：高）\n协同领域：系统应用、影像、售后服务\nAI建议：将 67 条新增舆情聚类为 3 类任务，并同步责任部门。\n决策：上市口碑风险进入周报上升预警。",
      aiReview: {
        responsibility: "软件产品规划（优先级：高）",
        collaboration: "系统应用、影像、售后服务、门店反馈团队",
        actions: "将 67 条新增舆情聚类为 3 类任务，并同步责任部门。",
        consensus: "流畅度、背板灯效和游戏体验是当前口碑风险主线。",
        difference: "站点 Open 49 与 VOC 负向舆情的责任归属还需统一口径。",
        decision: "上市口碑风险进入周报上升预警，关联版本修复节奏。",
        experience: "2026-W1220：VOC 聚类提前导入后减少售后重复反馈；2025-W3308：站点超期未上升导致 Open 问题跨版本遗留。"
      },
      targetDate: "6-7",
      owner: "软件产品规划",
      ownerName: "涂良建",
      ownerAvatar: "涂",
      submitter: "AI智能体\n2026-06-05",
      status: "进行中",
      completedAt: "2026-06-07"
    }
  ],

  larkNotifications: [
    { to: "于佑全", avatar: "佑", text: "已发送 tOS17.0 构建质量与 APR 闭环任务", time: "刚刚" },
    { to: "涂良建", avatar: "涂", text: "已发送 Slim/IR 计划与 VOC 风险任务", time: "刚刚" }
  ],

  contestFit: [
    { label: "简洁", value: "一屏四步，一次点击，不再堆重复模块" },
    { label: "体感", value: "AI 的解析、推理、任务和报告过程逐步出现" },
    { label: "业务价值", value: "把人工读周报、找风险、催责任人变成自动闭环" },
    { label: "可落地性", value: "先读飞书和系统数据，再做人审写回任务系统" }
  ]
};
