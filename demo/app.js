(function () {
  const data = window.DEMO_DATA;
  const AUTO_RUN_STEP_MS = 1800;
  const AUTO_RUN_COMPLETE_MS = 1150;
  let selectedProjectId = "camon-co7";
  const createdTasks = new Set();
  const autoRun = {
    activeIndex: -1,
    completed: new Set(),
    timers: [],
    running: false
  };

  function badgeClass(value) {
    if (String(value).includes("高") || String(value).includes("异常") || value === "Need Escalation") return "danger";
    if (String(value).includes("中") || String(value).includes("需关注") || value === "Open" || value === "Ongoing") return "warn";
    return "ok";
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function currentProject() {
    return data.projects.find((project) => project.id === selectedProjectId) || data.projects[0];
  }

  function risksFor(projectId) {
    return data.risks.filter((risk) => risk.projectId === projectId);
  }

  function showToast(message) {
    const toast = byId("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function clearAutoRunTimers() {
    autoRun.timers.forEach((timer) => window.clearTimeout(timer));
    autoRun.timers = [];
  }

  function automationRisks() {
    const riskIds = new Set(data.automationRun.steps.flatMap((step) => step.riskIds || []));
    return data.risks.filter((risk) => riskIds.has(risk.id));
  }

  function isFeishuDocReady() {
    return autoRun.completed.has(data.automationRun.steps.length - 1);
  }

  function feishuDocumentText() {
    const doc = data.automationRun.feishuDocument;
    return [
      `# ${doc.title}`,
      "",
      `输出对象：${doc.target}`,
      `生成方：${doc.owner}`,
      "",
      ...doc.blocks.flatMap((block, index) => [
        `${index + 1}. ${block.label}`,
        block.content,
        ""
      ]),
      `说明：${doc.outputMode}`
    ].join("\n").trim();
  }

  function renderLogThinking(step, active) {
    const items = [
      { className: "log-raw", label: "原始数据解析", value: step.rawData },
      { className: "log-parsed", label: "解析结果", value: step.parsedData },
      { className: "log-reasoning", label: "AI 思考过程", value: step.thinking },
      { className: "log-decision", label: "决策输出", value: step.decision }
    ];
    return `
      <div class="log-thinking ${active ? "active" : "complete"}">
        <div class="log-thinking-title">
          <span>${active ? "AI 正在解析当前巡检任务" : "AI 已完成该任务解析"}</span>
        </div>
        <div class="log-thinking-grid">
          ${items.map((item) => `
            <section class="log-thinking-item ${item.className}">
              <strong>${item.label}</strong>
              <p>${item.value}</p>
            </section>
          `).join("")}
        </div>
      </div>
    `;
  }

  window.renderHeroMetrics = function renderHeroMetrics() {
    byId("hero-metrics").innerHTML = data.summaryMetrics.map((metric, index) => `
      <div class="hero-metric" style="--i:${index}">
        <span>${metric.label}</span>
        <strong>${metric.value}</strong>
        <em>${metric.trend}</em>
      </div>
    `).join("");
  };

  window.renderAutoRunner = function renderAutoRunner() {
    const steps = data.automationRun.steps;
    const total = steps.length;
    const completedCount = autoRun.completed.size;
    const activeStep = steps[autoRun.activeIndex];
    const progressPercent = total ? Math.round((completedCount / total) * 100) : 0;

    byId("runner-subtitle").textContent = data.automationRun.subtitle;
    byId("runner-status-text").textContent = autoRun.running ? "AI 巡检中" : completedCount === total ? "巡检完成" : "等待启动";
    byId("runner-progress-text").textContent = `${completedCount} / ${total}`;
    byId("runner-progress-bar").style.width = `${progressPercent}%`;

    const runnerLog = byId("runner-log");
    runnerLog.innerHTML = steps.map((step, index) => {
      const done = autoRun.completed.has(index);
      const active = index === autoRun.activeIndex && autoRun.running;
      return `
        <article class="log-line ${done ? "done" : ""} ${active ? "active" : ""}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>${step.source} · ${step.title}</strong>
            <p>${done || active ? step.detail : "等待 AI 调度执行"}</p>
            ${done ? `<em>${step.result}</em>` : ""}
            ${done || active ? renderLogThinking(step, active) : ""}
          </div>
        </article>
      `;
    }).join("");
    const activeLog = runnerLog.querySelector(".log-line.active");
    if (activeLog) {
      activeLog.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else if (completedCount === total) {
      runnerLog.scrollTop = runnerLog.scrollHeight;
    }

    byId("runner-focus-card").innerHTML = activeStep ? `
      <span class="badge ${autoRun.completed.has(autoRun.activeIndex) || !autoRun.running ? "ok" : "warn"}">${autoRun.completed.has(autoRun.activeIndex) || !autoRun.running ? "已解析" : "执行中"}</span>
      <h3>${activeStep.title}</h3>
      <p>${activeStep.result}</p>
    ` : `
      <span class="badge">待启动</span>
      <h3>AI 将自动替项目经理跑一遍巡检流程</h3>
      <p>启动后可看到每一步读取了什么系统、命中了什么规则、生成了哪些任务。</p>
    `;

    window.renderFeishuOutput();

    byId("runner-outcomes").innerHTML = data.automationRun.outcomes.map((item) => `
      <div class="outcome-card">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
        <em>${item.note}</em>
      </div>
    `).join("");

    const generatedVisible = autoRun.completed.has(5) || autoRun.completed.has(6) || autoRun.completed.has(7);
    byId("generated-task-grid").innerHTML = automationRisks().map((risk) => {
      const isCreated = createdTasks.has(risk.id);
      return `
        <article class="generated-task ${generatedVisible ? "visible" : ""} ${isCreated ? "created" : ""}">
          <span class="badge ${badgeClass(risk.level)}">${risk.level}风险</span>
          <h4>${risk.title}</h4>
          <p><strong>责任：</strong>${risk.ownerDept} / ${risk.owner}</p>
          <p><strong>截止：</strong>${risk.dueDate}</p>
          <p><strong>验收：</strong>${risk.acceptance}</p>
          <em>${isCreated ? "已模拟写入任务系统" : generatedVisible ? "待人审写入" : "等待 AI 生成"}</em>
        </article>
      `;
    }).join("");
  };

  window.renderFeishuOutput = function renderFeishuOutput() {
    const doc = data.automationRun.feishuDocument;
    const ready = isFeishuDocReady();
    const activeReportStep = data.automationRun.steps[autoRun.activeIndex]?.id === "report";
    const status = byId("feishu-output-status");
    const copyButton = byId("copy-feishu-doc-button");
    byId("feishu-output-card").className = `feishu-output-card ${ready ? "ready" : activeReportStep ? "active" : "idle"}`;
    status.className = `badge ${ready ? "ok" : activeReportStep ? "warn" : ""}`;
    status.textContent = ready ? "飞书文档草稿已生成" : activeReportStep ? "正在生成飞书文档" : "等待飞书文档输出";
    byId("feishu-doc-meta").innerHTML = `
      <span>${doc.target}</span>
      <span>${doc.owner}</span>
      <span>${ready ? "可复制正文" : "巡检完成后输出"}</span>
    `;
    byId("feishu-doc-title").textContent = ready ? doc.title : "等待 AI 生成项目周会文档";
    byId("feishu-doc-blocks").innerHTML = doc.blocks.map((block, index) => `
      <article class="feishu-doc-block ${ready ? "ready" : ""}" style="--i:${index}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${block.label}</strong>
          <p>${ready ? block.content : "等待巡检完成后写入飞书文档正文。"}</p>
        </div>
      </article>
    `).join("");
    copyButton.disabled = !ready;
    copyButton.textContent = ready ? "复制飞书文档正文" : "等待文档生成";
  };

  window.resetAutoRun = function resetAutoRun() {
    clearAutoRunTimers();
    autoRun.activeIndex = -1;
    autoRun.completed.clear();
    autoRun.running = false;
    automationRisks().forEach((risk) => createdTasks.delete(risk.id));
    window.selectProject(data.automationRun.projectId);
    window.renderAutoRunner();
    showToast("已重置 AI 自动巡检演示");
  };

  window.startAutoRun = function startAutoRun() {
    clearAutoRunTimers();
    autoRun.activeIndex = -1;
    autoRun.completed.clear();
    autoRun.running = true;
    automationRisks().forEach((risk) => createdTasks.delete(risk.id));
    selectedProjectId = data.automationRun.projectId;
    window.renderProjects();
    window.renderRisks(selectedProjectId);
    window.renderTasks(selectedProjectId);
    window.renderTrackingBoard();
    window.renderReport(selectedProjectId);
    window.renderAutoRunner();

    data.automationRun.steps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        autoRun.activeIndex = index;
        if (step.id === "write-back") {
          (step.riskIds || []).forEach((riskId) => createdTasks.add(riskId));
          window.renderTasks(selectedProjectId);
          window.renderTrackingBoard();
          window.renderReport(selectedProjectId);
        }
        window.renderAutoRunner();
        const completeTimer = window.setTimeout(() => {
          autoRun.completed.add(index);
          if (index === data.automationRun.steps.length - 1) {
            autoRun.running = false;
            showToast("AI 自动巡检完成，已生成任务和飞书文档草稿");
          }
          window.renderAutoRunner();
        }, AUTO_RUN_COMPLETE_MS);
        autoRun.timers.push(completeTimer);
      }, index * AUTO_RUN_STEP_MS);
      autoRun.timers.push(timer);
    });
  };

  window.renderSources = function renderSources() {
    byId("source-grid").innerHTML = data.sources.map((source, index) => `
      <article class="source-card" style="--i:${index}">
        <span class="badge ${badgeClass(source.health)}">${source.health}</span>
        <h3>${source.name}</h3>
        <p>${source.signal}</p>
        <p><strong>同步状态：</strong>${source.freshness}</p>
        <p><strong>样例证据：</strong>${source.evidence}</p>
      </article>
    `).join("");
  };

  window.renderAgentFlow = function renderAgentFlow() {
    byId("agent-flow-list").innerHTML = data.aiTrace.map((step, index) => `
      <article class="flow-step" style="--i:${index}">
        <div class="flow-index">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h3>${step.title}</h3>
          <p>${step.signal}</p>
          <strong>${step.output}</strong>
        </div>
      </article>
    `).join("");
  };

  window.renderProjects = function renderProjects() {
    byId("project-list").innerHTML = data.projects.map((project, index) => `
      <button class="project-card ${project.id === selectedProjectId ? "active" : ""}" type="button" data-project-id="${project.id}" aria-pressed="${project.id === selectedProjectId}" style="--i:${index}">
        <h3>${project.name}</h3>
        <p>${project.line} / ${project.code}</p>
        <div class="project-meta">
          <span class="badge ${badgeClass(project.status)}">${project.status}</span>
          <span class="badge">${project.node}</span>
          <span class="badge">${project.nextMilestone}</span>
        </div>
      </button>
    `).join("");

    document.querySelectorAll("[data-project-id]").forEach((button) => {
      button.addEventListener("click", () => window.selectProject(button.dataset.projectId));
    });
  };

  window.selectProject = function selectProject(projectId) {
    selectedProjectId = projectId;
    window.renderProjects();
    const detail = document.querySelector(".project-detail");
    detail.classList.add("is-swapping");
    window.setTimeout(() => {
      window.renderRisks(projectId);
      window.renderTasks(projectId);
      window.renderTrackingBoard();
      window.renderReport(projectId);
      window.requestAnimationFrame(() => detail.classList.remove("is-swapping"));
    }, 90);
  };

  function renderProjectSummary(project) {
    byId("project-summary").innerHTML = `
      <h3>${project.name}</h3>
      <p>${project.summary}</p>
      <div class="summary-grid">
        <div class="summary-item"><span>项目编码</span><strong>${project.code}</strong></div>
        <div class="summary-item"><span>当前节点</span><strong>${project.node}</strong></div>
        <div class="summary-item"><span>风险状态</span><strong>${project.status}</strong></div>
        <div class="summary-item"><span>下一节点</span><strong>${project.nextMilestone} / ${project.milestoneDate}</strong></div>
      </div>
    `;
  }

  function renderNodeRules(project) {
    byId("node-rule-strip").innerHTML = data.nodeRules.map((rule) => `
      <div class="rule-card ${project.node === rule.node ? "active" : ""}">
        <strong>${rule.node}${project.node === rule.node ? " · 当前" : ""}</strong>
        <span>关注：${rule.focus}</span>
        <span>风险：${rule.risk}</span>
      </div>
    `).join("");
  }

  window.renderRisks = function renderRisks(projectId) {
    const project = data.projects.find((item) => item.id === projectId) || currentProject();
    renderProjectSummary(project);
    renderNodeRules(project);

    const risks = risksFor(project.id);
    byId("risk-list").innerHTML = risks.map((risk, index) => `
      <article class="risk-card" style="--i:${index}">
        <div><span class="badge ${badgeClass(risk.level)}">${risk.level}风险</span></div>
        <div>
          <h3>${risk.title}</h3>
          <p class="evidence"><strong>节点规则：</strong>${risk.nodeRule}</p>
          <p class="evidence"><strong>证据：</strong>${risk.evidence}</p>
          <p class="evidence"><strong>来源：</strong>${risk.source}</p>
        </div>
        <div class="risk-action"><strong>AI 建议：</strong>${risk.action}</div>
      </article>
    `).join("");
  };

  window.renderTasks = function renderTasks(projectId) {
    const rows = risksFor(projectId).map((risk) => {
      const created = createdTasks.has(risk.id);
      const status = created ? "已模拟创建" : risk.status;
      return `
        <tr class="${created ? "created-row" : ""}">
          <td>
            <div class="task-title">${risk.title}</div>
            <div class="task-evidence">证据：${risk.evidence}</div>
            <div class="task-evidence">验收：${risk.acceptance}</div>
          </td>
          <td><span class="badge ${badgeClass(risk.level)}">${risk.level}</span></td>
          <td>${risk.ownerDept}<br>${risk.owner}</td>
          <td>${risk.dueDate}</td>
          <td><span class="badge ${badgeClass(status)}">${status}</span></td>
          <td><button class="small-button ${created ? "is-done" : ""}" type="button" data-risk-id="${risk.id}" ${created ? "disabled" : ""}>${created ? "已创建" : "模拟创建任务"}</button></td>
        </tr>
      `;
    }).join("");

    byId("task-table-body").innerHTML = rows;
    document.querySelectorAll("[data-risk-id]").forEach((button) => {
      button.addEventListener("click", () => window.simulateCreateTask(button.dataset.riskId));
    });
  };

  window.simulateCreateTask = function simulateCreateTask(riskId) {
    if (createdTasks.has(riskId)) return;
    const button = document.querySelector(`[data-risk-id="${riskId}"]`);
    if (button) {
      button.disabled = true;
      button.classList.add("is-loading");
      button.textContent = "AI 生成中";
    }
    window.setTimeout(() => {
      createdTasks.add(riskId);
      window.renderTasks(selectedProjectId);
      window.renderTrackingBoard();
      window.renderReport(selectedProjectId);
      showToast("已模拟创建任务：正式系统写回作为下一步集成");
    }, 260);
  };

  window.renderTrackingBoard = function renderTrackingBoard() {
    const columns = [
      { key: "Open", title: "Open 待处理" },
      { key: "Ongoing", title: "Ongoing 跟进中" },
      { key: "Need Escalation", title: "需升级" },
      { key: "已模拟创建", title: "已模拟创建" }
    ];
    const selectedRisks = risksFor(selectedProjectId);

    byId("tracking-columns").innerHTML = columns.map((column) => {
      const cards = selectedRisks.filter((risk) => {
        const status = createdTasks.has(risk.id) ? "已模拟创建" : risk.status;
        return status === column.key;
      });
      return `
        <div class="board-column">
          <h3>${column.title} · ${cards.length}</h3>
          ${cards.map((risk, index) => `
            <article class="board-card" style="--i:${index}">
              <h4>${risk.title}</h4>
              <p>${risk.ownerDept} / ${risk.owner}</p>
              <p>截止：${risk.dueDate}</p>
              <span class="badge ${badgeClass(risk.level)}">${risk.level}风险</span>
            </article>
          `).join("") || "<p>暂无任务</p>"}
        </div>
      `;
    }).join("");
  };

  window.renderReport = function renderReport(projectId) {
    const project = data.projects.find((item) => item.id === projectId) || currentProject();
    const risks = risksFor(project.id);
    const highCount = risks.filter((risk) => risk.level === "高").length;
    const createdCount = risks.filter((risk) => createdTasks.has(risk.id)).length;
    const report = [
      `【${project.name}｜${project.node} 节点 AI 周会摘要】`,
      "",
      `1. 当前判断：${project.status}。AI 基于 ${project.line}、缺陷、体验大数据和售后信号，识别出 ${risks.length} 项需跟踪风险，其中高风险 ${highCount} 项。`,
      `2. 关键风险：${risks.map((risk) => risk.title).join("；")}。`,
      `3. 任务闭环：已模拟创建 ${createdCount}/${risks.length} 个风险任务，字段包含责任部门、责任人、截止时间、证据来源和验收口径。`,
      `4. 问题趋势：${data.issueSummary.week} 遗留问题 ${data.issueSummary.continuedBacklog} 条，本周关闭 ${data.issueSummary.closedThisWeek} 条，综合关闭率 ${data.issueSummary.closureRate}。`,
      `5. 管理建议：优先推动 ${risks[0]?.ownerDept || project.ownerDept} 对高风险任务给出闭环计划；正式系统写回任务平台作为下一步集成。`,
      "6. 输出渠道：Demo 已生成飞书文档草稿正文，正式集成后可自动创建或更新项目周会 Docx。",
      "7. 参赛增量：本轮新增 AI 节点风险推理、风险到任务生成、本地交互 Demo 与验证数据，不把既有系统成熟度作为评审优势。"
    ].join("\n");

    byId("report-meta").innerHTML = `
      <div><span>项目</span><strong>${project.name}</strong></div>
      <div><span>当前节点</span><strong>${project.node}</strong></div>
      <div><span>风险数量</span><strong>${risks.length}</strong></div>
      <div><span>模拟创建</span><strong>${createdCount}</strong></div>
    `;
    byId("report-text").textContent = report;
  };

  window.renderContestFit = function renderContestFit() {
    byId("contest-fit-grid").innerHTML = data.contestFit.map((item, index) => `
      <article class="fit-card" style="--i:${index}">
        <span class="badge ok">${item.status}</span>
        <h3>${item.requirement}</h3>
        <p>${item.evidence}</p>
      </article>
    `).join("");
  };

  function bindCopyReport() {
    byId("copy-report-button").addEventListener("click", async () => {
      const text = byId("report-text").textContent;
      try {
        await navigator.clipboard.writeText(text);
        showToast("报告已复制");
      } catch {
        showToast("当前浏览器不支持自动复制，可手动选中报告文本");
      }
    });
  }

  function bindCopyFeishuDoc() {
    byId("copy-feishu-doc-button").addEventListener("click", async () => {
      if (!isFeishuDocReady()) {
        showToast("请先完成 AI 自动巡检，再复制飞书文档正文");
        return;
      }
      try {
        await navigator.clipboard.writeText(feishuDocumentText());
        showToast("飞书文档正文已复制");
      } catch {
        showToast("当前浏览器不支持自动复制，可手动复制下方飞书文档预览");
      }
    });
  }

  function bindAutoRunner() {
    byId("start-auto-run").addEventListener("click", window.startAutoRun);
    byId("reset-auto-run").addEventListener("click", window.resetAutoRun);
  }

  window.renderHeroMetrics();
  window.renderAutoRunner();
  window.renderSources();
  window.renderAgentFlow();
  window.renderProjects();
  window.selectProject(selectedProjectId);
  window.renderContestFit();
  bindCopyReport();
  bindCopyFeishuDoc();
  bindAutoRunner();
})();
