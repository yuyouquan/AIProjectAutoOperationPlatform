const C = {
  bg: "#F3F6FB",
  ink: "#152033",
  muted: "#5A667A",
  line: "#DCE4EF",
  blue: "#246BFE",
  blue2: "#EAF1FF",
  amber: "#B86B00",
  amber2: "#FFF3DC",
  green: "#157A4C",
  green2: "#E8F7EF",
  red: "#BE342E",
  red2: "#FFE9E8",
  white: "#FFFFFF",
  dark: "#101A2C",
};

function box(ctx, slide, x, y, w, h, fill = C.white, line = C.line) {
  return ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill,
    line: ctx.line(line, 1),
  });
}

function label(ctx, slide, text, x, y, w, h, opts = {}) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h,
    fontSize: opts.size ?? 18,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? false,
    typeface: opts.face ?? "Microsoft YaHei",
    fill: opts.fill ?? "#00000000",
    line: ctx.line("#00000000", 0),
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
  });
}

function pill(ctx, slide, text, x, y, w, fill, color) {
  box(ctx, slide, x, y, w, 30, fill, fill);
  label(ctx, slide, text, x + 12, y + 6, w - 24, 18, { size: 12, bold: true, color });
}

function sourceCard(ctx, slide, title, text, x, y) {
  box(ctx, slide, x, y, 230, 78);
  label(ctx, slide, title, x + 14, y + 12, 200, 20, { size: 15, bold: true });
  label(ctx, slide, text, x + 14, y + 37, 198, 28, { size: 10.5, color: C.muted });
}

function stageCard(ctx, slide, idx, title, text, x, y, w) {
  box(ctx, slide, x, y, w, 88, C.white);
  pill(ctx, slide, idx, x + 12, y + 12, 40, C.blue2, C.blue);
  label(ctx, slide, title, x + 60, y + 13, w - 72, 20, { size: 15, bold: true });
  label(ctx, slide, text, x + 14, y + 40, w - 28, 24, { size: 9.5, color: C.muted });
}

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();

  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill: C.bg, line: ctx.line("#00000000", 0) });
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: 94, fill: C.dark, line: ctx.line(C.dark, 0) });
  label(ctx, slide, "AI 项目自治运营平台", 44, 18, 440, 36, { size: 30, bold: true, color: C.white });
  label(ctx, slide, "从多系统数据到风险识别、任务创建、跟踪闭环和管理汇报", 44, 62, 650, 20, { size: 13.5, color: "#C9D6EA" });
  pill(ctx, slide, "Demo 1.0：风险任务闭环", 980, 30, 230, C.blue, C.white);

  label(ctx, slide, "核心痛点", 44, 118, 160, 22, { size: 18, bold: true });
  box(ctx, slide, 44, 150, 270, 312);
  label(ctx, slide, "人工收集慢", 68, 176, 210, 22, { size: 18, bold: true, color: C.red });
  label(ctx, slide, "项目经理需要从项目、缺陷、大数据、售后等多个系统反复复制整理。", 68, 206, 210, 48, { size: 12, color: C.muted });
  label(ctx, slide, "风险发现晚", 68, 270, 210, 22, { size: 18, bold: true, color: C.amber });
  label(ctx, slide, "风险往往在周会或人工复盘时才显性化，任务创建和催办滞后。", 68, 300, 210, 48, { size: 12, color: C.muted });
  label(ctx, slide, "闭环不统一", 68, 364, 210, 22, { size: 18, bold: true, color: C.blue });
  label(ctx, slide, "报告、聊天、表格和任务系统之间信息割裂，责任与验收口径容易丢失。", 68, 394, 210, 48, { size: 12, color: C.muted });

  label(ctx, slide, "平台方案", 344, 118, 160, 22, { size: 18, bold: true });
  box(ctx, slide, 344, 150, 592, 312);
  sourceCard(ctx, slide, "项目管理系统", "节点、进度、责任部门、周会数据", 370, 178);
  sourceCard(ctx, slide, "缺陷管理系统", "缺陷存量、关闭率、Reopen、P0/P1", 370, 274);
  sourceCard(ctx, slide, "体验大数据系统", "稳定性、性能、功耗、启动、卡顿", 370, 370);
  box(ctx, slide, 626, 198, 250, 210, C.blue2, "#B9CBFF");
  label(ctx, slide, "AI 节点感知推理", 654, 226, 190, 24, { size: 19, bold: true, color: C.blue });
  label(ctx, slide, "按 KO / PR / QR / STR / PIR 等节点自动判断该看哪些风险，而不是简单生成周报。", 654, 262, 190, 66, { size: 12.5, color: "#2B4B8E" });
  label(ctx, slide, "输出：风险等级、证据来源、责任部门、责任人、截止时间、验收口径", 654, 346, 190, 42, { size: 11.5, color: "#2B4B8E" });
  label(ctx, slide, "→", 896, 285, 24, 28, { size: 24, bold: true, color: C.blue });

  label(ctx, slide, "任务自治闭环", 966, 118, 180, 22, { size: 18, bold: true });
  box(ctx, slide, 966, 150, 270, 312);
  stageCard(ctx, slide, "1", "自动识别风险", "跨系统信号触发风险，并解释命中规则。", 990, 176, 222);
  stageCard(ctx, slide, "2", "自动生成任务", "生成责任、截止时间、验收口径和证据。", 990, 278, 222);
  stageCard(ctx, slide, "3", "自动跟踪汇报", "跟踪状态变化，并生成周会摘要。", 990, 380, 222);

  box(ctx, slide, 44, 492, 1192, 146);
  label(ctx, slide, "Demo 1.0 证明链路", 68, 516, 180, 22, { size: 18, bold: true });
  stageCard(ctx, slide, "A", "数据源总览", "汇聚项目、缺陷、大数据、售后信号。", 68, 552, 208);
  stageCard(ctx, slide, "B", "节点风险雷达", "按当前节点识别 CAMON/tOS 高风险。", 296, 552, 220);
  stageCard(ctx, slide, "C", "AI 任务生成", "生成责任、截止时间和验收口径。", 536, 552, 220);
  stageCard(ctx, slide, "D", "跟踪与报告", "输出周会摘要，写回留作下一步集成。", 776, 552, 220);

  box(ctx, slide, 1018, 552, 194, 88, C.green2, "#B9E5CA");
  label(ctx, slide, "业务价值", 1036, 566, 110, 20, { size: 16, bold: true, color: C.green });
  label(ctx, slide, "更早发现风险\n减少人工整理\n提升闭环质量", 1036, 586, 150, 36, { size: 9.5, color: "#1E6242" });

  label(ctx, slide, "赛事增量：AI 节点风险推理 + 风险到任务生成 + 本地交互 Demo；既有系统作为数据基础，不宣称 Demo 已完成生产写回。提交物：一页纸 PPTX + HTML Demo 1.0", 44, 654, 1192, 36, { size: 11, color: C.muted });

  return slide;
}
