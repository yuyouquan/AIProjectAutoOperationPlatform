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
      milestoneDate: "2026-10-21",
      summary: "模块化需求与体验指标同时存在不确定性，AI 建议优先锁定竞品基线和关键交付排期。"
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
      milestoneDate: "2026-06-15",
      summary: "基线构建、需求锁定、体验指标封板存在并发风险，AI 建议建立跨部门闭环任务。"
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
      milestoneDate: "2026-07-01",
      summary: "售后/VOC 与体验大数据出现流畅度相关信号，AI 建议在 QR2 前形成体验风险清单。"
    }
  ],
  sources: [
    {
      name: "项目管理系统",
      signal: "节点、进度、责任部门、周会数据",
      freshness: "已同步 W23",
      health: "正常",
      evidence: "项目名称、基线名、风险状态、KO/PR/QR/PIR/MPR/MQR 节点"
    },
    {
      name: "缺陷管理系统",
      signal: "缺陷存量、关闭率、Reopen、P0/P1",
      freshness: "已同步 25 条遗留问题",
      health: "需关注",
      evidence: "上周遗留 25，本周新增 0，本周关闭 0，综合关闭率 0%"
    },
    {
      name: "体验大数据系统",
      signal: "稳定性、性能、功耗、启动、卡顿",
      freshness: "已同步 145/125 版本",
      health: "异常",
      evidence: "正常启动占比、严重慢切换率、游戏 FPS、续航满足率"
    },
    {
      name: "售后与 VOC 系统",
      signal: "ARR、VOC、差评、核心痛点",
      freshness: "已同步 TOP 投诉",
      health: "需关注",
      evidence: "流畅度、续航、游戏体验为新增负向舆情核心痛点"
    }
  ],
  summaryMetrics: [
    { label: "接入信号", value: "4 类", trend: "项目 / 缺陷 / 大数据 / 售后" },
    { label: "样例项目", value: "3 个", trend: "CAMON + tOS 闭环验证" },
    { label: "识别风险", value: "5 项", trend: "高风险 3 项 / 中风险 2 项" },
    { label: "报告耗时", value: "分钟级", trend: "替代人工重复收集整理" }
  ],
  aiTrace: [
    {
      title: "收集",
      signal: "读取项目节点、缺陷遗留、体验指标、售后 VOC",
      output: "统一项目运行画像"
    },
    {
      title: "理解",
      signal: "识别 KO / PR / QR / STR / PIR 等节点",
      output: "匹配当前节点的风险检查规则"
    },
    {
      title: "判断",
      signal: "结合关闭率、Reopen、体验异常、需求未锁定",
      output: "输出风险等级、证据和影响范围"
    },
    {
      title: "生成",
      signal: "补齐责任部门、责任人、截止时间、验收口径",
      output: "生成可执行任务建议"
    },
    {
      title: "跟踪",
      signal: "监控 Open / Ongoing / 升级 / Closed",
      output: "形成周会摘要和管理建议"
    }
  ],
  nodeRules: [
    { node: "IR/STR", focus: "需求锁定、基线可构建、交付件完整度", risk: "需求未加锁、基线门禁阻断、交付件缺失" },
    { node: "PR1", focus: "体验指标、竞品基线、关键资源排期", risk: "指标未封板、竞品机未统一、关键资源未到位" },
    { node: "QR2", focus: "缺陷收敛、体验口碑、售后趋势", risk: "关闭率低、负向舆情集中、体验指标反复" },
    { node: "PIR/MPR", focus: "上市质量、售后反馈、复盘闭环", risk: "ARR/VOC 高发、同类问题复发、复盘措施未落地" }
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
      action: "组织性能、整机 SE、项目管理三方确认竞品机，并输出指标封板时间。",
      acceptance: "竞品机清单、指标封板时间、影响项目范围三项信息齐套。"
    },
    {
      id: "risk-module",
      projectId: "camon-co7",
      level: "高",
      dimension: "需求锁定",
      title: "模块化配件 PD 与交付计划未定",
      nodeRule: "PR1 节点需锁定核心价值点需求和关键交付排期",
      evidence: "模块化配件 AI mori 和 AI 智能补光灯的 PD 与交付计划未定，影响 RMT 复评。",
      source: "项目管理系统 + 周会 Wiki",
      ownerDept: "产品与解决方案部",
      owner: "整机 PPM",
      dueDate: "2026-06-05",
      status: "Need Escalation",
      action: "推动 PPM 输出 PD 锁定结果和关键节点排期，并形成 RMT 复评材料。",
      acceptance: "PD 锁定、节点排期、RMT 复评材料完成。"
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
      action: "输出根因分析与门禁改善措施，补齐异常代码入库复盘。",
      acceptance: "根因、修复动作、防呆门禁策略三项完成。"
    },
    {
      id: "risk-ci",
      projectId: "tos-17",
      level: "中",
      dimension: "工程效能",
      title: "CI 环境异常导致多项目编译报错",
      nodeRule: "IR/STR 阶段需保障版本构建链路稳定",
      evidence: "查询 APK 配置返回 500，导致 81 个项目编译报错，影响时长 8h。",
      source: "CI 构建数据 + 周会重点任务",
      ownerDept: "软件架设与技术规划部",
      owner: "徐超云",
      dueDate: "2026-06-11",
      status: "Open",
      action: "复盘接口 500 原因，补齐异常监控和自动降级策略。",
      acceptance: "接口异常监控、降级策略、影响项目复盘完成。"
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
      action: "结合缺陷与大数据定位高频场景，形成 QR2 前体验风险清单。",
      acceptance: "TOP 场景、影响机型、整改责任人、验证时间齐套。"
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
  },
  contestFit: [
    {
      requirement: "一页纸可视化方案",
      evidence: "已生成 PPTX，讲清痛点、方案、Demo 闭环和业务价值。",
      status: "已覆盖"
    },
    {
      requirement: "Demo 1.0",
      evidence: "本地 HTML Demo 可交互展示数据收集、风险识别、任务生成、看板跟踪和报告输出。",
      status: "已覆盖"
    },
    {
      requirement: "既有立项增量",
      evidence: "明确既有 IPM/周会数据是基础，新增能力是 AI 节点风险推理与风险到任务生成。",
      status: "已说明"
    },
    {
      requirement: "业务价值",
      evidence: "减少人工收集整理，更早发现风险，提高任务闭环质量和管理层可视性。",
      status: "已突出"
    },
    {
      requirement: "可落地性",
      evidence: "采用先读后写策略，Demo 不宣称已完成生产写回，正式系统写回作为下一步集成。",
      status: "已约束"
    }
  ]
};
