window.DEMO_DATA = {
  summaryMetrics: [
    { label: "自动读取", value: "10 类系统", note: "项目 / 质量 / 制造 / 售后" },
    { label: "AI 识别", value: "3 个风险", note: "质量、进度、成本联动判断" },
    { label: "任务生成", value: "4 条任务", note: "含背景、目标、责任、验收" },
    { label: "报告输出", value: "飞书 Docx", note: "周报 / 月报 / 上升预警" }
  ],

  scenarios: [
    {
      id: "camon-pr1",
      name: "TECNO CAMON 60 Pro 5G｜PR1 节点",
      code: "CO7_H8110",
      node: "PR1",
      ownerDept: "PS_产品项目管理一部",
      status: "高风险",
      businessGoal: "QR1 前锁定体验基线、模块化配件交付计划和缺陷收敛责任。",
      currentSignal: "项目处于 PR1，体验基线、模块化配件 PD、缺陷关闭率三类信号同时异常。",
      inputs: ["PR1 交付件清单", "项目周会群聊纪要", "竞品基线 Wiki", "缺陷遗留表", "售后 VOC 摘要"],
      risks: ["性能竞品基线未统一", "模块化配件 PD 与交付计划未定", "缺陷关闭率连续两周为 0%"]
    },
    {
      id: "tos-str",
      name: "tOS 17.0｜STR 需求锁定",
      code: "tOS17.x",
      node: "STR",
      ownerDept: "软件项目管理",
      status: "中高风险",
      businessGoal: "需求锁定前识别基线构建、门禁阻断和体验指标封板风险。",
      currentSignal: "基线构建曾出现 8h 阻断，CI 环境和需求锁定还未形成稳定闭环。",
      inputs: ["需求池", "构建日报", "门禁异常群聊", "测试计划", "体验指标表"],
      risks: ["异常代码入库导致版本不可用", "CI 环境 500 影响多项目编译", "需求锁定口径未同步"]
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

  dimensions: [
    {
      title: "质量",
      value: "QMS / CRM / Jira / Trancare",
      insight: "缺陷遗留 25 条，关闭率 0%，VOC 流畅度反馈集中。"
    },
    {
      title: "进度",
      value: "研发 / 生产 / 出货 / 上市 / 清尾",
      insight: "模块化配件 PD 未锁定，RMT 复评材料未齐套。"
    },
    {
      title: "成本",
      value: "工时 / 返工 / 替代料",
      insight: "SAP/BOM/MES/MOM 显示成本影响链路还未回写周报。"
    }
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
      raw: "QMS/Jira 缺陷遗留=25；关闭=0；CRM/VOC 反馈=流畅度、续航、游戏体验集中。",
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
      raw: "SAP/BOM 工时与替代料评估未回写；MES/MOM 返工影响成本未进入周报。",
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
    distributionTitle: "一键上传和分发",
    distributionNote: "每条任务包含背景说明、参考信息、清晰目标、责任人、验收口径和证据来源。",
    tasks: [
      {
        title: "统一性能竞品基线并输出指标封板时间",
        level: "高",
        owner: "系统应用开发部 / 性能代表",
        due: "2026-06-12",
        goal: "完成竞品机清单、指标封板时间、影响项目范围三项确认。",
        evidence: "IPM PR1 节点 + 体验大数据异常",
        status: "待分发"
      },
      {
        title: "锁定模块化配件 PD 与 RMT 复评材料",
        level: "高",
        owner: "产品与解决方案部 / 整机 PPM",
        due: "2026-06-05",
        goal: "完成 PD 锁定、节点排期、RMT 复评材料。",
        evidence: "周会群聊 + 云文档",
        status: "需催办"
      },
      {
        title: "输出缺陷收敛计划和阻塞原因",
        level: "高",
        owner: "硬件部、结构部、底软通信开发部",
        due: "2026-06-10",
        goal: "关闭率从 0% 恢复到可跟踪节奏，并明确升级问题。",
        evidence: "QMS/Jira 缺陷遗留",
        status: "待分发"
      },
      {
        title: "补齐成本与工时影响说明",
        level: "中",
        owner: "供应链管理部 / 成本接口人",
        due: "2026-06-14",
        goal: "确认替代料、返工工时和成本影响路径。",
        evidence: "SAP/BOM/MES/MOM",
        status: "待确认"
      }
    ],
    qa: {
      uploaded: "责任人已上传《模块化配件 PD 锁定说明》和进展截图。",
      rejected: "AI 建议打回：检测到缺少 RMT 复评材料和供应链节点排期，需要责任人补充。"
    },
    escalations: [
      "模块化配件任务今日到期，提醒责任人 16:00 前补齐材料。",
      "缺陷关闭率连续两周 0%，预警任务下发人并建议进入周会 Top 风险。",
      "成本影响路径缺少 SAP/BOM 回写，建议下周月报单独列示。"
    ]
  },

  reportOutputs: {
    title: "TECNO CAMON 60 Pro 5G｜PR1 节点 AI 周会报告",
    target: "项目周会飞书文档",
    mode: "Demo 中展示飞书文档草稿；正式集成可通过飞书 Docx OpenAPI 自动创建或更新。",
    blocks: [
      { label: "当前判断", content: "项目处于 PR1 节点，高风险。AI 基于 SPUG/TOnes、IPM、QMS、CRM、Trancare 等信号识别 3 个重点风险。" },
      { label: "关键风险", content: "性能竞品基线未统一；模块化配件 PD 与交付计划未定；缺陷关闭率连续两周为 0%。" },
      { label: "任务分发", content: "已生成 4 条任务，包含背景说明、参考信息、清晰目标、责任部门、责任人、截止时间和验收口径。" },
      { label: "催办预警", content: "模块化配件任务今日到期，缺陷关闭停滞需要预警任务下发人，成本影响进入月报关注项。" },
      { label: "管理建议", content: "优先推进性能基线统一、模块化配件 PD 锁定和缺陷收敛计划；正式系统写回作为下一步集成。" }
    ]
  },

  contestFit: [
    { requirement: "Demo 体感", evidence: "首屏展示方案输入、AI 思考过程、任务闭环与飞书文档输出。", status: "重做强化" },
    { requirement: "业务价值", evidence: "把人工收集、判断、催办、写报告改成 AI 自动闭环。", status: "突出" },
    { requirement: "可落地性", evidence: "多系统先读后写，正式系统写回作为下一步集成边界。", status: "清晰" },
    { requirement: "既有立项增量", evidence: "新增 AI 节点推理、任务生成、交付件质检和上升预警。", status: "明确" },
    { requirement: "评审提交物", evidence: "PPT、本地 Demo、Vercel Demo、团队简历模板和立项说明均已纳入检查。", status: "覆盖" }
  ]
};
