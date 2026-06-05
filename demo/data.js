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
  automationRun: {
    projectId: "camon-co7",
    title: "AI 自动巡检演示台",
    subtitle: "把项目经理原来手工收集、判断、建任务、催办、写报告的动作串成一条可见的 AI 流程。",
    steps: [
      {
        id: "read-ipm",
        source: "项目管理系统",
        title: "读取项目节点",
        detail: "识别 TECNO CAMON 60 Pro 5G 当前处于 PR1，下一节点 QR1。",
        result: "PR1 节点需要重点确认体验指标、竞品基线和关键资源排期。",
        rawData: "项目=TECNO CAMON 60 Pro 5G；节点=PR1；下一节点=QR1；风险状态=高风险；基线=N6878。",
        parsedData: "抽取当前节点、项目线、下一里程碑和风险状态，匹配 PR1 节点检查清单。",
        thinking: "PR1 不是简单进度汇报节点，体验指标、竞品基线和资源排期会直接影响 QR1 是否能顺利验收。",
        decision: "把项目放入高风险巡检队列，后续优先查体验指标和关键交付排期。"
      },
      {
        id: "read-defects",
        source: "缺陷管理系统",
        title: "读取缺陷遗留",
        detail: "拉取 W24 遗留问题 25 条，本周关闭 0 条，综合关闭率 0%。",
        result: "缺陷收敛未形成有效关闭趋势，需要进入周会重点跟踪。",
        rawData: "W24 遗留=25；新增=0；关闭=0；综合关闭率=0%；升级部门=硬件部、结构部、底软通信开发部。",
        parsedData: "识别缺陷没有新增但也没有关闭，说明风险不是数量爆发，而是收敛动作停滞。",
        thinking: "如果关闭率持续为 0，周会只看问题列表会漏掉责任推进力度不足的问题，必须生成闭环任务。",
        decision: "标记为缺陷收敛风险，要求责任部门给出关闭计划和阻塞原因。"
      },
      {
        id: "read-bigdata",
        source: "体验大数据系统",
        title: "读取体验指标",
        detail: "读取性能、流畅度、功耗、启动、卡顿等体验指标异常信号。",
        result: "性能竞品机和整机 SE 推荐不一致，影响后续体验验收。",
        rawData: "指标=正常启动占比、严重慢切换率、游戏 FPS、续航满足率；异常=性能竞品机与整机 SE 推荐不一致。",
        parsedData: "把体验指标按流畅性、性能、功耗、启动稳定性归类，并定位到 PR1 竞品基线未统一。",
        thinking: "体验数据本身只是信号，真正影响节点的是竞品基线未锁定，后续指标封板会缺少统一参照。",
        decision: "生成性能基线确认候选任务，要求性能、整机 SE、项目管理三方确认。"
      },
      {
        id: "read-voc",
        source: "售后与 VOC 系统",
        title: "读取售后反馈",
        detail: "同步流畅度、续航、游戏体验等新增负向舆情核心痛点。",
        result: "售后/VOC 信号可作为 QR 阶段前置风险输入。",
        rawData: "TOP 反馈=流畅度、续航、游戏体验；趋势=新增负向舆情；关联机型=CAMON 50-CN6 与同类平台。",
        parsedData: "把售后/VOC 按体验维度聚合，识别出可提前输入 QR 阶段的口碑风险。",
        thinking: "售后问题通常滞后出现，但同类机型的高频反馈可以反向提醒当前项目提前规避。",
        decision: "把 VOC 作为辅助证据写入体验风险，不直接生成任务，等待与节点规则合并判断。"
      },
      {
        id: "reason-risk",
        source: "AI 节点推理",
        title: "判断节点风险",
        detail: "结合 PR1 节点规则、体验指标异常和模块化需求未锁定信号。",
        result: "识别 2 个高风险：性能竞品基线未统一、模块化配件 PD 与交付计划未定。",
        rawData: "规则=PR1 需锁定体验指标、竞品基线、关键资源排期；信号=性能基线不一致、模块化配件 PD 未定。",
        parsedData: "将系统字段转成节点规则命中结果：体验基线未闭环、核心价值点需求未锁定。",
        thinking: "两个信号都不是普通信息缺失，而是会影响 PR1 到 QR1 的验收条件，必须从风险升格为任务。",
        decision: "确认 2 个高风险进入任务生成，分别绑定证据来源、责任部门和验收口径。"
      },
      {
        id: "generate-task",
        source: "AI 任务生成",
        title: "生成风险任务",
        detail: "自动补齐责任部门、责任人、截止时间、证据来源和验收口径。",
        result: "生成 2 条任务建议，进入人审后模拟写入任务系统。",
        rawData: "风险=性能竞品基线未统一、模块化配件 PD 与交付计划未定；字段=责任、截止、证据、验收口径。",
        parsedData: "把风险标题、节点规则、证据来源、责任部门和验收条件转换成任务草稿字段。",
        thinking: "任务必须可执行，不能只写风险描述，所以要补齐谁负责、什么时候完成、用什么证明完成。",
        decision: "生成 2 条待人审任务草稿，并在演示中准备同步到自治看板。",
        riskIds: ["risk-performance", "risk-module"]
      },
      {
        id: "write-back",
        source: "任务系统",
        title: "模拟写入任务系统",
        detail: "把 AI 生成的任务建议同步到自治跟踪看板，并标记为已模拟创建。",
        result: "项目经理不再手工复制任务字段，后续正式系统写回作为下一步集成。",
        rawData: "任务草稿=2；写回模式=Demo 模拟创建；目标=任务表、自治跟踪看板、周会报告。",
        parsedData: "识别当前是先读后写的演示链路，采用本地状态同步替代正式生产写回。",
        thinking: "评审需要看到闭环能力，但不能夸大生产集成状态，因此写回用模拟方式明确边界。",
        decision: "将 2 条任务标记为已模拟创建，同步刷新任务表、看板和报告。正式写回作为下一步集成。",
        riskIds: ["risk-performance", "risk-module"]
      },
      {
        id: "report",
        source: "飞书文档",
        title: "输出飞书文档",
        detail: "自动汇总当前节点、风险证据、责任分派、闭环状态和管理建议，生成飞书文档草稿。",
        result: "形成可复制的飞书文档版周会报告，供项目周会和管理层同步。",
        rawData: "输入=项目状态、风险数量、已创建任务数、缺陷趋势、管理建议；输出=飞书 Docx 文档。",
        parsedData: "把任务闭环状态、风险证据和节点判断压缩成飞书文档标题、摘要、风险清单和行动项。",
        thinking: "周会报告不应只停留在 Demo 页面里，最终要进入项目团队每天使用的飞书文档工作流。",
        decision: "生成飞书文档草稿，项目经理可复制正文或在正式集成后自动创建/更新飞书 Docx。"
      }
    ],
    outcomes: [
      { label: "自动读取", value: "4 个系统", note: "项目 / 缺陷 / 大数据 / 售后" },
      { label: "自动识别", value: "2 个高风险", note: "基于 PR1 节点规则" },
      { label: "自动生成", value: "2 条任务", note: "带责任、证据和验收口径" },
      { label: "人工节省", value: "约 70%", note: "减少周会前重复整理" }
    ],
    feishuDocument: {
      title: "TECNO CAMON 60 Pro 5G｜PR1 节点 AI 周会报告",
      owner: "AI 项目自治运营平台",
      target: "项目周会飞书文档",
      outputMode: "Demo 1.0 生成飞书文档草稿；正式集成可通过飞书 Docx OpenAPI 自动创建或更新文档。",
      blocks: [
        {
          label: "当前判断",
          content: "项目处于 PR1 节点，高风险。AI 基于项目管理、缺陷、体验大数据和售后/VOC 信号识别 2 个重点风险。"
        },
        {
          label: "关键风险",
          content: "性能竞品基线未统一；模块化配件 PD 与交付计划未定。两项均影响 PR1 到 QR1 的验收条件。"
        },
        {
          label: "任务闭环",
          content: "已生成 2 条任务草稿，字段包含责任部门、责任人、截止时间、证据来源和验收口径。"
        },
        {
          label: "管理建议",
          content: "优先推动系统应用开发部与产品解决方案部完成基线确认、PD 锁定和 RMT 复评材料。"
        },
        {
          label: "输出方式",
          content: "Demo 中先生成飞书文档正文预览；正式版本通过飞书文档接口写入项目周会文档。"
        }
      ]
    }
  },
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
