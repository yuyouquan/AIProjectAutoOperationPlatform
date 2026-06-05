(function () {
  const data = window.DEMO_DATA;
  const STAGE_STEP_MS = 1900;
  const STAGE_COMPLETE_MS = 900;

  const state = {
    selectedScenarioId: data.scenarios[0].id,
    activeStage: -1,
    completedStages: new Set(),
    distributed: false,
    deliverableUploaded: false,
    qaRejected: false,
    running: false,
    timers: []
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function scenario() {
    return data.scenarios.find((item) => item.id === state.selectedScenarioId) || data.scenarios[0];
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(message) {
    const toast = byId("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function clearTimers() {
    state.timers.forEach((timer) => window.clearTimeout(timer));
    state.timers = [];
  }

  function statusClass(value) {
    if (String(value).includes("高") || String(value).includes("催办") || String(value).includes("预警")) return "danger";
    if (String(value).includes("中") || String(value).includes("确认") || String(value).includes("读取")) return "warn";
    return "ok";
  }

  function renderHeroMetrics() {
    byId("hero-metrics").innerHTML = data.summaryMetrics.map((metric, index) => `
      <article class="metric-chip" style="--i:${index}">
        <span>${escapeHtml(metric.label)}</span>
        <strong>${escapeHtml(metric.value)}</strong>
        <em>${escapeHtml(metric.note)}</em>
      </article>
    `).join("");
  }

  function renderScenarioOptions() {
    byId("scenario-selector").innerHTML = data.scenarios.map((item) => `
      <option value="${escapeHtml(item.id)}" ${item.id === state.selectedScenarioId ? "selected" : ""}>${escapeHtml(item.name)}</option>
    `).join("");
  }

  function renderScenarioBrief() {
    const current = scenario();
    byId("scenario-brief").innerHTML = `
      <article class="scenario-card">
        <div class="scenario-head">
          <span class="badge ${statusClass(current.status)}">${escapeHtml(current.status)}</span>
          <span class="badge">${escapeHtml(current.node)}</span>
          <span class="badge">${escapeHtml(current.code)}</span>
        </div>
        <h3>${escapeHtml(current.name)}</h3>
        <p>${escapeHtml(current.currentSignal)}</p>
        <div class="goal-box">
          <span>清晰目标</span>
          <strong>${escapeHtml(current.businessGoal)}</strong>
        </div>
        <div class="input-stack">
          ${current.inputs.map((input) => `<span>${escapeHtml(input)}</span>`).join("")}
        </div>
      </article>
    `;
  }

  function renderSources() {
    byId("source-cloud").innerHTML = `
      <div class="subhead">
        <strong>系统数据源</strong>
        <span>自动读取，不先改造原系统</span>
      </div>
      <div class="source-tags">
        ${data.systemSources.map((source, index) => `
          <button class="source-pill" type="button" style="--i:${index}" title="${escapeHtml(source.signal)}">
            <span>${escapeHtml(source.name)}</span>
            <em>${escapeHtml(source.category)}</em>
          </button>
        `).join("")}
      </div>
    `;

    byId("dimension-grid").innerHTML = data.dimensions.map((dimension, index) => `
      <article class="dimension-card" style="--i:${index}">
        <span>${escapeHtml(dimension.title)}</span>
        <strong>${escapeHtml(dimension.value)}</strong>
        <p>${escapeHtml(dimension.insight)}</p>
      </article>
    `).join("");
  }

  function stageState(index) {
    if (state.completedStages.has(index)) return "done";
    if (index === state.activeStage && state.running) return "active";
    return "pending";
  }

  function renderAnalysisStages() {
    const completedCount = state.completedStages.size;
    const currentStage = data.analysisStages[state.activeStage];
    byId("ai-core-title").textContent = state.running
      ? `正在分析：${currentStage?.title || "准备调度"}`
      : completedCount === data.analysisStages.length
        ? "AI 分析完成"
        : "等待启动";
    byId("ai-core-subtitle").textContent = state.running
      ? "智能体正在把原始信号压缩成可执行任务字段。"
      : completedCount === data.analysisStages.length
        ? "任务、质检、催办和飞书报告已生成，可继续演示上传与打回。"
        : "点击开始后，AI 会按数据源、质量、进度、成本、节点风险逐步推理。";

    byId("ai-stage-list").innerHTML = data.analysisStages.map((stage, index) => `
      <article class="stage-card ${stageState(index)}" style="--i:${index}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${escapeHtml(stage.title)}</strong>
          <em>${stageState(index) === "done" ? "已完成" : stageState(index) === "active" ? "AI 分析中" : "等待"}</em>
        </div>
      </article>
    `).join("");
  }

  function thinkingCard(stage, index) {
    const active = index === state.activeStage && state.running;
    return `
      <article class="thinking-card ${active ? "active" : "done"}" style="--i:${index}">
        <div class="thinking-head">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(stage.title)}</strong>
          <em>${active ? "实时思考" : "已沉淀"}</em>
        </div>
        <div class="thinking-grid">
          <section>
            <b>原始数据</b>
            <p>${escapeHtml(stage.raw)}</p>
          </section>
          <section>
            <b>解析结果</b>
            <p>${escapeHtml(stage.parsed)}</p>
          </section>
          <section>
            <b>AI 思考过程</b>
            <p>${escapeHtml(stage.thought)}</p>
          </section>
          <section>
            <b>决策输出</b>
            <p>${escapeHtml(stage.decision)}</p>
          </section>
        </div>
      </article>
    `;
  }

  function renderThinkingFeed() {
    const visibleStages = data.analysisStages.filter((_, index) => state.completedStages.has(index) || index === state.activeStage);
    byId("ai-thinking-feed").innerHTML = visibleStages.length
      ? visibleStages.map((stage) => thinkingCard(stage, data.analysisStages.indexOf(stage))).join("")
      : `
        <article class="thinking-empty">
          <strong>AI 思考过程将在这里展开</strong>
          <p>每一步都会展示原始数据、解析结果、思考依据和决策输出，让评委看到 AI 为什么这么判断。</p>
        </article>
      `;
  }

  function renderTaskDistribution() {
    const title = state.distributed ? "已生成并模拟分发 4 条任务" : "等待 AI 生成任务";
    byId("task-distribution-panel").innerHTML = `
      <div class="subhead">
        <strong>${title}</strong>
        <span>${escapeHtml(data.taskLoop.distributionNote)}</span>
      </div>
      <div class="task-stack">
        ${data.taskLoop.tasks.map((task, index) => `
          <article class="task-card ${state.distributed ? "ready" : ""}" style="--i:${index}">
            <div>
              <span class="badge ${statusClass(task.level)}">${escapeHtml(task.level)}风险</span>
              <span class="badge ${statusClass(task.status)}">${state.distributed ? "已分发" : escapeHtml(task.status)}</span>
            </div>
            <h3>${escapeHtml(task.title)}</h3>
            <p><b>责任：</b>${escapeHtml(task.owner)}</p>
            <p><b>目标：</b>${escapeHtml(task.goal)}</p>
            <p><b>证据：</b>${escapeHtml(task.evidence)}</p>
            <footer>截止 ${escapeHtml(task.due)}</footer>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderDeliverableQa() {
    const status = byId("deliverable-status");
    if (state.qaRejected) {
      status.textContent = data.taskLoop.qa.rejected;
      return;
    }
    if (state.deliverableUploaded) {
      status.textContent = data.taskLoop.qa.uploaded;
      return;
    }
    status.textContent = state.distributed
      ? "任务已分发，等待责任人一键上传交付件和进展说明。"
      : "等待 AI 先生成并分发任务。";
  }

  function renderEscalations() {
    byId("escalation-feed").innerHTML = `
      <div class="subhead">
        <strong>催办与上升预警</strong>
        <span>${state.distributed ? "已识别需催办任务" : "分析完成后自动生成"}</span>
      </div>
      ${data.taskLoop.escalations.map((item, index) => `
        <article class="escalation-item ${state.distributed ? "ready" : ""}" style="--i:${index}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <p>${state.distributed ? escapeHtml(item) : "等待 AI 判断是否需要提醒责任人或预警任务下发人。"}</p>
        </article>
      `).join("")}
    `;
  }

  function renderFeishuReport() {
    const ready = state.distributed;
    byId("feishu-doc-panel").innerHTML = `
      <div class="panel-title">
        <span class="panel-index">05</span>
        <div>
          <p class="eyebrow">飞书文档输出</p>
          <h2>${ready ? escapeHtml(data.reportOutputs.title) : "等待生成项目周报 / 月报"}</h2>
        </div>
      </div>
      <div class="doc-meta">
        <span>${escapeHtml(data.reportOutputs.target)}</span>
        <span>${ready ? "草稿已生成" : "AI 分析完成后生成"}</span>
      </div>
      <div class="doc-blocks">
        ${data.reportOutputs.blocks.map((block, index) => `
          <article class="doc-block ${ready ? "ready" : ""}" style="--i:${index}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>${escapeHtml(block.label)}</strong>
              <p>${ready ? escapeHtml(block.content) : "等待任务闭环完成后写入飞书文档正文。"}</p>
            </div>
          </article>
        `).join("")}
      </div>
      <p class="doc-mode">${escapeHtml(data.reportOutputs.mode)}</p>
    `;
  }

  function renderContestFit() {
    byId("contest-fit-grid").innerHTML = data.contestFit.map((item, index) => `
      <article class="fit-card" style="--i:${index}">
        <span class="badge ok">${escapeHtml(item.status)}</span>
        <strong>${escapeHtml(item.requirement)}</strong>
        <p>${escapeHtml(item.evidence)}</p>
      </article>
    `).join("");
  }

  function renderAll() {
    renderHeroMetrics();
    renderScenarioOptions();
    renderScenarioBrief();
    renderSources();
    renderAnalysisStages();
    renderThinkingFeed();
    renderTaskDistribution();
    renderDeliverableQa();
    renderEscalations();
    renderFeishuReport();
    renderContestFit();
  }

  function resetState() {
    clearTimers();
    state.activeStage = -1;
    state.completedStages.clear();
    state.distributed = false;
    state.deliverableUploaded = false;
    state.qaRejected = false;
    state.running = false;
  }

  function resetDemo() {
    resetState();
    renderAll();
    showToast("已重置 AI 项目任务智能体工作台");
  }

  function startAnalysis() {
    resetState();
    state.running = true;
    renderAll();

    data.analysisStages.forEach((stage, index) => {
      const timer = window.setTimeout(() => {
        state.activeStage = index;
        renderAll();

        const completeTimer = window.setTimeout(() => {
          state.completedStages.add(index);
          if (index === data.analysisStages.length - 1) {
            state.running = false;
            state.distributed = true;
            showToast("AI 分析完成，任务、催办和飞书文档已生成");
          }
          renderAll();
        }, STAGE_COMPLETE_MS);

        state.timers.push(completeTimer);
      }, index * STAGE_STEP_MS);

      state.timers.push(timer);
    });
  }

  function uploadDeliverable() {
    if (!state.distributed) {
      showToast("请先完成 AI 分析并分发任务");
      return;
    }
    state.deliverableUploaded = true;
    state.qaRejected = false;
    renderDeliverableQa();
    showToast("责任人已上传交付件，AI 正在检测完成质量");
  }

  function rejectDeliverable() {
    if (!state.deliverableUploaded) {
      showToast("请先模拟责任人上传交付件");
      return;
    }
    state.qaRejected = true;
    renderDeliverableQa();
    showToast("AI 建议打回：缺少 RMT 复评材料和供应链排期");
  }

  function handleScenarioChange(event) {
    state.selectedScenarioId = event.target.value;
    resetState();
    renderAll();
    showToast("已切换方案输入，AI 状态已重置");
  }

  byId("scenario-selector").addEventListener("change", handleScenarioChange);
  byId("start-ai-analysis").addEventListener("click", startAnalysis);
  byId("reset-demo").addEventListener("click", resetDemo);
  byId("deliverable-upload-button").addEventListener("click", uploadDeliverable);
  byId("qa-reject-button").addEventListener("click", rejectDeliverable);

  renderAll();
})();
