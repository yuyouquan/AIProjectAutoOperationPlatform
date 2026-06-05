(function () {
  const data = window.DEMO_DATA;
  let selectedProjectId = "camon-co7";
  const createdTasks = new Set();

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

  window.renderHeroMetrics = function renderHeroMetrics() {
    byId("hero-metrics").innerHTML = data.summaryMetrics.map((metric, index) => `
      <div class="hero-metric" style="--i:${index}">
        <span>${metric.label}</span>
        <strong>${metric.value}</strong>
        <em>${metric.trend}</em>
      </div>
    `).join("");
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
      "6. 参赛增量：本轮新增 AI 节点风险推理、风险到任务生成、本地交互 Demo 与验证数据，不把既有系统成熟度作为评审优势。"
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

  window.renderHeroMetrics();
  window.renderSources();
  window.renderAgentFlow();
  window.renderProjects();
  window.selectProject(selectedProjectId);
  window.renderContestFit();
  bindCopyReport();
})();
