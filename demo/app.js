(function () {
  const data = window.DEMO_DATA;
  const STEP_MS = 3200;

  const state = {
    activeIndex: -1,
    running: false,
    complete: false,
    issueEdits: {},
    statusMenuId: null,
    analysisModalOpen: false,
    customSources: [],
    timers: []
  };

  function byId(id) {
    return document.getElementById(id);
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

  function activeStep() {
    if (state.activeIndex < 0) return null;
    return data.flowSteps[state.activeIndex] || data.flowSteps[data.flowSteps.length - 1];
  }

  function renderMetrics() {
    byId("hero-metrics").innerHTML = data.summaryMetrics.map((metric, index) => `
      <article class="metric" style="--i:${index}">
        <span>${escapeHtml(metric.label)}</span>
        <strong>${escapeHtml(metric.value)}</strong>
        <em>${escapeHtml(metric.note)}</em>
      </article>
    `).join("");
  }

  function renderAnalysisWorkbench() {
    const workbench = byId("analysis-workbench");
    const modalRoot = byId("analysis-modal-root");
    if (!workbench) return;

    const sources = [...data.analysisSources.slice(0, 2), ...state.customSources];
    workbench.innerHTML = `
      <button class="analysis-modal-trigger" data-analysis-action="open-modal" type="button">
        <span>新建 / 历史</span>
        <strong>添加文档或查看分析记录</strong>
      </button>
    `;

    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="analysis-modal ${state.analysisModalOpen ? "open" : ""}" aria-hidden="${state.analysisModalOpen ? "false" : "true"}">
        <section class="analysis-dialog" role="dialog" aria-modal="true" aria-label="新建分析与历史记录">
          <header class="analysis-modal-search">
            <i aria-hidden="true"></i>
            <input class="analysis-search-input" type="search" placeholder="搜索历史...">
            <button class="analysis-modal-close" data-analysis-action="close-modal" type="button" aria-label="关闭">×</button>
          </header>
          <div class="analysis-modal-body">
            <section class="analysis-intake">
              <button class="analysis-new-entry" data-analysis-action="focus-link" type="button">
                <span>✎</span>
                <strong>添加一个或多个文档 / 链接</strong>
              </button>
              <div class="analysis-link-row">
                <input class="analysis-link-input" type="url" inputmode="url" placeholder="粘贴飞书文档 / Wiki / 表格链接">
                <button class="analysis-action" data-analysis-action="add-source" type="button">添加文档链接</button>
                <button class="analysis-action strong" data-analysis-action="start-analysis" type="button">开始入库</button>
              </div>
              <div class="document-chip-row">
                ${sources.map((source) => `
                  <i class="document-chip">
                    <b>${escapeHtml(source.type)}</b>
                    ${escapeHtml(source.name)}
                  </i>
                `).join("")}
              </div>
            </section>
            <section class="analysis-history">
              <span>过去7天</span>
              <div>
                ${data.analysisHistory.map((item, index) => `
                  <button class="analysis-history-item" data-analysis-action="history" data-history-index="${index}" type="button">
                    <span>
                      <b>${escapeHtml(item.name)}</b>
                      <em>${escapeHtml(item.status)} · ${escapeHtml(item.time)}</em>
                    </span>
                    <strong>${escapeHtml(item.count)}</strong>
                  </button>
                `).join("")}
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  function renderScenario() {
    byId("scenario-card").innerHTML = `
      <span>${escapeHtml(data.scenario.status)}</span>
      <h3>${escapeHtml(data.scenario.name)}</h3>
      <p>${escapeHtml(data.scenario.goal)}</p>
      <strong>${escapeHtml(data.scenario.oneLine)}</strong>
    `;
  }

  function renderSignals() {
    byId("signal-strip").innerHTML = data.signals.map((signal, index) => `
      <article class="signal-card" style="--i:${index}">
        <span>${escapeHtml(signal.label)}</span>
        <strong>${escapeHtml(signal.value)}</strong>
        <em>${escapeHtml(signal.source)}</em>
      </article>
    `).join("");
  }

  function stepStatus(index) {
    if (state.complete || index < state.activeIndex) return "done";
    if (index === state.activeIndex) return "active";
    return "idle";
  }

  function renderFlowRail() {
    byId("flow-rail").innerHTML = data.flowSteps.map((step, index) => `
      <article class="flow-step ${stepStatus(index)}" style="--i:${index}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${escapeHtml(step.label)}</strong>
          <em>${escapeHtml(step.action)}</em>
        </div>
      </article>
    `).join("");
  }

  function renderCurrentStage() {
    const step = activeStep();
    const kicker = byId("stage-kicker");
    const title = byId("stage-title");
    const detail = byId("stage-detail");
    const evidence = byId("evidence-line");
    const button = byId("primary-action");

    if (!step) {
      kicker.textContent = "等待启动";
      title.textContent = "AI 尚未开始分析";
      detail.textContent = "点击下方按钮后，Demo 会自动跑完数据解析、AI 思考、任务生成和问题输出。";
      evidence.textContent = "当前没有动作。唯一操作按钮会驱动整条演示流程。";
      button.textContent = "开始 AI 自动演示";
      button.disabled = false;
      return;
    }

    kicker.textContent = state.complete ? "演示完成" : `正在执行 ${String(state.activeIndex + 1).padStart(2, "0")} / ${data.flowSteps.length}`;
    title.textContent = step.headline;
    detail.textContent = step.detail;
    evidence.textContent = step.evidence;
    button.textContent = state.running ? "AI 自动演示中" : "重新演示";
    button.disabled = state.running;
    renderLarkNotifications();
  }

  function renderLarkNotifications() {
    const feed = byId("lark-notification-feed");
    if (!feed) return;

    if (state.activeIndex < 2 && !state.complete) {
      feed.innerHTML = `
        <span>飞书通知</span>
        <strong>任务生成后自动发送</strong>
      `;
      feed.classList.remove("ready");
      return;
    }

    feed.classList.add("ready");
    feed.innerHTML = `
      <span>飞书通知</span>
      <div>
        ${data.larkNotifications.map((notice) => `
          <section class="notice-pill">
            <i class="avatar">${escapeHtml(notice.avatar)}</i>
            <p><b>已通知 ${escapeHtml(notice.to)}</b>${escapeHtml(notice.text)} · ${escapeHtml(notice.time)}</p>
          </section>
        `).join("")}
      </div>
    `;
  }

  function issueValue(record, field) {
    return state.issueEdits[record.id]?.[field] ?? record[field];
  }

  function renderMultiline(value) {
    return escapeHtml(value).replaceAll("\n", "<br>");
  }

  function renderReviewValue(value) {
    return escapeHtml(value).replace(/(20\d{2}-W\d{4})/g, '<a href="#" tabindex="-1">$1</a>');
  }

  function renderAiReview(record) {
    const review = record.aiReview;
    const rows = [
      ["责任领域", review.responsibility, "owner"],
      ["协同领域", review.collaboration, "team"],
      ["AI建议及措施", review.actions, "ai"],
      ["共识", review.consensus, "agree"],
      ["分歧", review.difference, "split"],
      ["决策", review.decision, "decision"],
      ["经验", review.experience, "learn"]
    ];

    return `
      <article class="ai-review-card">
        ${rows.map(([label, value, tone]) => `
          <p class="ai-review-line ${tone}">
            <span>${label}:</span>
            <em>${renderReviewValue(value)}</em>
          </p>
        `).join("")}
        <div class="ai-review-actions">
          <button type="button" aria-label="认可 AI 预审">👍 <b>0</b></button>
          <button type="button" aria-label="不认可 AI 预审">👎 <b>0</b></button>
          <button type="button">重新预审</button>
        </div>
      </article>
    `;
  }

  function renderStatusPicker(record, selected) {
    const isOpen = state.statusMenuId === record.id;
    return `
      <div class="status-picker ${isOpen ? "open" : ""}">
        <button
          class="status-trigger"
          data-issue-field="status"
          data-issue-id="${escapeHtml(record.id)}"
          data-value="${escapeHtml(selected)}"
          type="button"
          aria-haspopup="listbox"
          aria-expanded="${isOpen ? "true" : "false"}"
        >
          <span>${escapeHtml(selected)}</span>
          <i></i>
        </button>
        <div class="status-menu" role="listbox" aria-label="${escapeHtml(record.project)} 状态">
          ${data.statusOptions.map((status) => `
            <button
              class="status-option ${status === selected ? "selected" : ""}"
              data-status-option="true"
              data-issue-id="${escapeHtml(record.id)}"
              data-status="${escapeHtml(status)}"
              type="button"
              role="option"
              aria-selected="${status === selected ? "true" : "false"}"
            >${escapeHtml(status)}</button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderIssueRows() {
    return data.issueRecords.map((record, index) => {
      const progress = issueValue(record, "progress");
      const status = issueValue(record, "status");
      const completedAt = issueValue(record, "completedAt");

      return `
        <tr class="issue-row" data-status="${escapeHtml(status)}" style="--i:${index}">
          <td class="issue-no sticky-col-1" data-label="问题序号">
            <span class="risk-tag">${escapeHtml(record.risk)}</span>
            <strong>${escapeHtml(record.week)}</strong>
            <em>${escapeHtml(record.id)}</em>
          </td>
          <td class="issue-project sticky-col-2" data-label="项目名称">${escapeHtml(record.project)}</td>
          <td class="issue-description sticky-col-3" data-label="问题&任务描述">${renderMultiline(record.description)}</td>
          <td class="issue-progress" data-label="处理进展">
            <textarea data-issue-field="progress" data-issue-id="${escapeHtml(record.id)}" aria-label="${escapeHtml(record.project)} 处理进展">${escapeHtml(progress)}</textarea>
          </td>
          <td class="issue-ai" data-label="AI 预审建议">${renderAiReview(record)}</td>
          <td class="issue-date" data-label="目标日期">${escapeHtml(record.targetDate)}</td>
          <td class="issue-owner" data-label="责任人/部门">
            <div class="owner-person">
              <span class="avatar">${escapeHtml(record.ownerAvatar)}</span>
              <div>
                <strong>${escapeHtml(record.ownerName)}</strong>
                <em>${escapeHtml(record.owner)}</em>
              </div>
            </div>
          </td>
          <td class="issue-status" data-label="状态">
            ${renderStatusPicker(record, status)}
          </td>
          <td class="issue-completed-at" data-label="完成时间">
            <input data-issue-field="completedAt" data-issue-id="${escapeHtml(record.id)}" type="date" value="${escapeHtml(completedAt)}" aria-label="${escapeHtml(record.project)} 完成时间">
          </td>
          <td class="issue-submitter" data-label="提出人">${renderMultiline(record.submitter)}</td>
        </tr>
      `;
    }).join("");
  }

  function renderResults() {
    const content = byId("result-content");
    const panel = byId("result-card");
    if (!state.complete) {
      panel.classList.remove("ready");
      content.innerHTML = `
        <div class="issue-waiting-panel" aria-label="问题跟进列表正在等待生成">
          <section class="waiting-core">
            <i class="waiting-pulse"></i>
            <span>AI 预生成</span>
            <strong>正在构建问题跟进列表</strong>
            <p>解析风险证据、责任人、处理进展、状态和完成时间字段，准备输出可编辑任务表。</p>
          </section>
          <section class="waiting-table-preview" aria-hidden="true">
            <div class="waiting-table-head">
              <i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="waiting-table-row">
              <i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="waiting-table-row">
              <i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="waiting-table-row">
              <i></i><i></i><i></i><i></i><i></i>
            </div>
            <b class="waiting-scan-line"></b>
          </section>
        </div>
      `;
      return;
    }

    panel.classList.add("ready");
    content.innerHTML = `
      <div class="issue-toolbar">
        <div>
          <span>AI 生成结果</span>
          <strong>问题跟进列表</strong>
          <p>扫描 W23 周会后自动生成，处理进展、状态、完成时间可继续修改。</p>
        </div>
        <div class="issue-count">
          <span>本周问题</span>
          <strong>${data.issueRecords.length}</strong>
        </div>
      </div>
      <div class="issue-table-shell">
        <table class="issue-table" id="issue-table">
          <thead>
            <tr>
              <th class="sticky-col-1">问题序号</th>
              <th class="sticky-col-2">项目名称</th>
              <th class="sticky-col-3">问题&任务描述</th>
              <th>处理进展</th>
              <th>AI 预审建议</th>
              <th>目标日期</th>
              <th>责任人/部门</th>
              <th>状态</th>
              <th>完成时间</th>
              <th>提出人</th>
            </tr>
          </thead>
          <tbody>${renderIssueRows()}</tbody>
        </table>
      </div>
    `;
  }

  function updateIssueEdit(target) {
    const issueId = target.dataset.issueId;
    const field = target.dataset.issueField;
    if (!issueId || !field) return null;

    const nextValue = target.value ?? target.dataset.value;
    state.issueEdits[issueId] = {
      ...(state.issueEdits[issueId] || {}),
      [field]: nextValue
    };

    const row = target.closest(".issue-row");
    if (row && field === "status") row.dataset.status = nextValue;
    return { issueId, field };
  }

  function handleIssueInput(event) {
    if (!event.target.matches("[data-issue-field]")) return;
    updateIssueEdit(event.target);
  }

  function handleIssueChange(event) {
    if (!event.target.matches("[data-issue-field]")) return;
    const edit = updateIssueEdit(event.target);
    if (edit) showToast("问题列表已更新，可继续修改处理进展、状态和完成时间");
  }

  function handleResultClick(event) {
    const statusTrigger = event.target.closest(".status-trigger");
    if (statusTrigger) {
      state.statusMenuId = state.statusMenuId === statusTrigger.dataset.issueId ? null : statusTrigger.dataset.issueId;
      renderResults();
      return;
    }

    const statusOption = event.target.closest("[data-status-option]");
    if (statusOption) {
      const issueId = statusOption.dataset.issueId;
      const status = statusOption.dataset.status;
      state.issueEdits[issueId] = {
        ...(state.issueEdits[issueId] || {}),
        status
      };
      state.statusMenuId = null;
      renderResults();
      showToast("状态已更新，后续可写回任务系统");
    }
  }

  function handleAnalysisClick(event) {
    const action = event.target.closest("[data-analysis-action]");
    if (!action) return;

    if (action.dataset.analysisAction === "open-modal") {
      state.analysisModalOpen = true;
      renderAnalysisWorkbench();
      const input = byId("analysis-modal-root").querySelector(".analysis-search-input");
      if (input) input.focus();
      return;
    }

    if (action.dataset.analysisAction === "close-modal") {
      state.analysisModalOpen = false;
      renderAnalysisWorkbench();
      return;
    }

    if (action.dataset.analysisAction === "focus-link") {
      const input = byId("analysis-modal-root").querySelector(".analysis-link-input");
      if (input) input.focus();
      return;
    }

    if (action.dataset.analysisAction === "add-source") {
      const input = byId("analysis-modal-root").querySelector(".analysis-link-input");
      const link = input.value.trim() || "https://transsioner.feishu.cn/wiki/new-analysis";
      state.customSources.push({
        type: "新增链接",
        name: link,
        meta: "待入库"
      });
      input.value = "";
      renderAnalysisWorkbench();
      showToast("已添加文档链接，可继续添加多个来源");
      return;
    }

    if (action.dataset.analysisAction === "start-analysis") {
      state.analysisModalOpen = false;
      renderAnalysisWorkbench();
      showToast("新建分析已入库，Demo 当前继续展示 W23 样例闭环");
      return;
    }

    if (action.dataset.analysisAction === "history") {
      const item = data.analysisHistory[Number(action.dataset.historyIndex || 0)];
      state.analysisModalOpen = false;
      renderAnalysisWorkbench();
      showToast(`已切换历史分析：${item.name}`);
    }
  }

  function renderAll() {
    renderMetrics();
    renderAnalysisWorkbench();
    renderScenario();
    renderSignals();
    renderFlowRail();
    renderCurrentStage();
    renderLarkNotifications();
    renderResults();
  }

  function resetDemo() {
    clearTimers();
    state.activeIndex = -1;
    state.running = false;
    state.complete = false;
    state.issueEdits = {};
    state.statusMenuId = null;
    renderAll();
  }

  function advanceStep(index) {
    state.activeIndex = index;
    renderAll();

    if (index === data.flowSteps.length - 1) {
      const doneTimer = window.setTimeout(() => {
        state.running = false;
        state.complete = true;
        renderAll();
        showToast("AI 自动演示完成，问题跟进列表已生成");
      }, STEP_MS);
      state.timers.push(doneTimer);
    }
  }

  function startDemo() {
    if (state.running) return;
    resetDemo();
    state.running = true;
    renderAll();
    data.flowSteps.forEach((_, index) => {
      const timer = window.setTimeout(() => advanceStep(index), index * STEP_MS);
      state.timers.push(timer);
    });
  }

  byId("primary-action").addEventListener("click", startDemo);
  byId("result-content").addEventListener("input", handleIssueInput);
  byId("result-content").addEventListener("change", handleIssueChange);
  byId("result-content").addEventListener("click", handleResultClick);
  byId("analysis-workbench").addEventListener("click", handleAnalysisClick);
  byId("analysis-modal-root").addEventListener("click", handleAnalysisClick);
  renderAll();
})();
