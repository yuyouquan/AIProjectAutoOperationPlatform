import { chromium } from "playwright";

const url = process.env.DEMO_URL || "http://localhost:4173/demo/";
const desktopShot = "outputs/ai-project-autonomy-platform/demo/demo-desktop.png";
const mobileShot = "outputs/ai-project-autonomy-platform/demo/demo-mobile.png";

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function runScenario(page, viewport, screenshotPath) {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: "networkidle" });

  const intakeState = await page.evaluate(() => {
    const workbenchText = [
      document.querySelector("#analysis-workbench")?.textContent || "",
      document.querySelector("#analysis-modal-root")?.textContent || ""
    ].join(" ");
    const triggerRect = document.querySelector(".analysis-modal-trigger")?.getBoundingClientRect();
    const historyItems = document.querySelectorAll(".analysis-history-item").length;
    const sourceChips = document.querySelectorAll(".document-chip").length;
    const linkInput = document.querySelector(".analysis-link-input");

    return {
      hasWorkbench: Boolean(document.querySelector("#analysis-workbench")),
      hasTrigger: Boolean(document.querySelector(".analysis-modal-trigger")),
      triggerHeight: triggerRect ? Math.round(triggerRect.height) : 0,
      modalOpen: document.querySelector(".analysis-modal")?.classList.contains("open") || false,
      historyItems,
      sourceChips,
      hasLinkInput: Boolean(linkInput),
      text: workbenchText
    };
  });

  if (!intakeState.hasWorkbench || !intakeState.hasTrigger || !intakeState.hasLinkInput) {
    fail(`Analysis modal trigger/workbench is missing on ${viewport.width}x${viewport.height}: ${JSON.stringify(intakeState)}`);
  }
  if (intakeState.historyItems < 3 || intakeState.sourceChips < 2) {
    fail(`Analysis intake/history needs realistic source and history records on ${viewport.width}x${viewport.height}: ${JSON.stringify(intakeState)}`);
  }
  if (intakeState.modalOpen || intakeState.triggerHeight > 58) {
    fail(`Analysis modal should be collapsed into one compact button before opening on ${viewport.width}x${viewport.height}: ${JSON.stringify(intakeState)}`);
  }
  if (!intakeState.text.includes("新建 / 历史") || !intakeState.text.includes("添加一个或多个文档 / 链接") || !intakeState.text.includes("过去7天")) {
    fail(`Analysis modal copy is missing on ${viewport.width}x${viewport.height}: ${intakeState.text}`);
  }

  await page.locator(".analysis-modal-trigger").click();
  const openModalState = await page.evaluate(() => {
    const modal = document.querySelector(".analysis-modal");
    const dialog = document.querySelector(".analysis-dialog");
    const rect = dialog?.getBoundingClientRect();
    return {
      open: modal?.classList.contains("open") || false,
      hasSearch: Boolean(document.querySelector(".analysis-search-input")),
      hasClose: Boolean(document.querySelector(".analysis-modal-close")),
      text: dialog?.textContent || "",
      width: rect ? Math.round(rect.width) : 0,
      height: rect ? Math.round(rect.height) : 0
    };
  });
  if (!openModalState.open || !openModalState.hasSearch || !openModalState.hasClose) {
    fail(`Analysis modal did not open correctly on ${viewport.width}x${viewport.height}: ${JSON.stringify(openModalState)}`);
  }
  if (!openModalState.text.includes("添加一个或多个文档 / 链接") || !openModalState.text.includes("过去7天")) {
    fail(`Analysis modal content is missing on ${viewport.width}x${viewport.height}: ${openModalState.text}`);
  }
  await page.locator(".analysis-modal-close").click();

  const initialLayout = await page.evaluate(() => {
    const signalRect = document.querySelector(".signal-panel")?.getBoundingClientRect();
    const stageRect = document.querySelector("#ai-stage")?.getBoundingClientRect();
    const resultRect = document.querySelector("#result-card")?.getBoundingClientRect();
    const flowRect = document.querySelector("#flow-rail")?.getBoundingClientRect();

    return {
      signalWidth: signalRect ? Math.round(signalRect.width) : 0,
      stageWidth: stageRect ? Math.round(stageRect.width) : 0,
      signalHeight: signalRect ? Math.round(signalRect.height) : 0,
      stageHeight: stageRect ? Math.round(stageRect.height) : 0,
      flowTop: flowRect ? Math.round(flowRect.top) : 0,
      resultTop: resultRect ? Math.round(resultRect.top) : 99999,
      upperBottom: signalRect && stageRect ? Math.round(Math.max(signalRect.bottom, stageRect.bottom)) : 99999
    };
  });

  if (viewport.width >= 1200) {
    const widthRatio = initialLayout.signalWidth / initialLayout.stageWidth;
    if (widthRatio < 0.92 || widthRatio > 1.08) {
      fail(`Desktop input and AI stage should be near 50/50 before running: ${JSON.stringify(initialLayout)}`);
    }
    if (initialLayout.stageHeight > 450 || initialLayout.signalHeight > 450) {
      fail(`Desktop input and AI stage are too tall before running: ${JSON.stringify(initialLayout)}`);
    }
    if (initialLayout.resultTop > 720) {
      fail(`Problem output table area starts too low before running: ${JSON.stringify(initialLayout)}`);
    }
  }

  const waitingState = await page.evaluate(() => {
    const panel = document.querySelector(".issue-waiting-panel");
    const scanLine = document.querySelector(".waiting-scan-line");
    const pulse = document.querySelector(".waiting-pulse");
    const tablePreview = document.querySelector(".waiting-table-preview");
    const scanStyle = scanLine ? getComputedStyle(scanLine) : null;
    const pulseStyle = pulse ? getComputedStyle(pulse) : null;
    const rect = panel?.getBoundingClientRect();

    return {
      hasPanel: Boolean(panel),
      hasPreview: Boolean(tablePreview),
      hasScanLine: Boolean(scanLine),
      scanAnimation: scanStyle?.animationName || "",
      pulseAnimation: pulseStyle?.animationName || "",
      text: panel?.textContent || "",
      height: rect ? Math.round(rect.height) : 0
    };
  });

  if (!waitingState.hasPanel || !waitingState.hasPreview || !waitingState.hasScanLine) {
    fail(`Problem output waiting panel is missing on ${viewport.width}x${viewport.height}: ${JSON.stringify(waitingState)}`);
  }
  if (waitingState.scanAnimation === "none" || waitingState.pulseAnimation === "none") {
    fail(`Problem output waiting panel has no visible motion on ${viewport.width}x${viewport.height}: ${JSON.stringify(waitingState)}`);
  }
  if (!waitingState.text.includes("正在构建问题跟进列表") || !waitingState.text.includes("解析风险证据")) {
    fail(`Problem output waiting copy is not concrete enough on ${viewport.width}x${viewport.height}: ${waitingState.text}`);
  }
  if (viewport.width >= 1200 && waitingState.height > 260) {
    fail(`Problem output waiting panel is too tall for one-screen layout on ${viewport.width}x${viewport.height}: ${waitingState.height}`);
  }

  await page.click("#primary-action");
  await page.waitForTimeout(15400);
  await page.locator("[data-issue-field='progress']").first().fill("已由项目经理补充：6/8 前输出闭环复盘，并同步责任部门。");
  await page.locator(".status-trigger").first().click();
  await page.locator(".status-option[data-status='已完成']").first().click();
  await page.locator("[data-issue-field='completedAt']").first().fill("2026-06-09");
  await page.waitForTimeout(250);

  const state = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const primaryButtonHeight = Math.round(document.querySelector("#primary-action")?.getBoundingClientRect().height || 0);
    const critical = Array.from(document.querySelectorAll(".hero-panel, .glass-card, .metric, .flow-step, .signal-card, .result-card"));
    const badRects = critical.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width <= 0 || rect.height <= 0 || rect.left < -1 || rect.right > window.innerWidth + 1;
    }).map((element) => element.className);
    const panel = document.querySelector(".glass-card");
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const resultText = document.querySelector("#result-content")?.textContent || "";
    const stageText = document.querySelector("#ai-stage")?.textContent || "";
    const stageRect = document.querySelector("#ai-stage")?.getBoundingClientRect();
    const stageCopyRect = document.querySelector(".stage-copy")?.getBoundingClientRect();
    const evidenceRect = document.querySelector("#evidence-line")?.getBoundingClientRect();
    const issueTableRect = document.querySelector("#issue-table")?.getBoundingClientRect();
    const tableShell = document.querySelector(".issue-table-shell");
    const tableShellRect = tableShell?.getBoundingClientRect();
    const stickyHeaders = Array.from(document.querySelectorAll(".issue-table th:nth-child(-n+3)")).map((cell) => getComputedStyle(cell).position);
    const nativeSelectCount = document.querySelectorAll("select").length;
    const statusTrigger = document.querySelector(".status-trigger");
    const statusStyle = statusTrigger ? getComputedStyle(statusTrigger) : null;
    let rightScrollWorks = false;
    if (tableShell) {
      tableShell.scrollLeft = tableShell.scrollWidth;
      const submitterRect = document.querySelector(".issue-submitter")?.getBoundingClientRect();
      rightScrollWorks = Boolean(submitterRect && submitterRect.right <= window.innerWidth + 1 && submitterRect.left >= 0);
    }
    const stageAfterStyle = document.querySelector("#ai-stage")
      ? getComputedStyle(document.querySelector("#ai-stage"), "::after")
      : null;

    return {
      title: document.title,
      root: Boolean(document.querySelector("#demo-root")),
      styleLoaded: getComputedStyle(document.body).backgroundImage !== "none",
      backdropFilter: panelStyle ? panelStyle.backdropFilter || panelStyle.webkitBackdropFilter || "" : "",
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      buttonCount: buttons.length,
      primaryActionCount: document.querySelectorAll("#primary-action").length,
      primaryButtonHeight,
      completedSteps: document.querySelectorAll(".flow-step.done").length,
      signalCards: document.querySelectorAll(".signal-card").length,
      resultReady: document.querySelector("#result-card")?.classList.contains("ready") || false,
      hasRealW23: resultText.includes("tOS17.0") && resultText.includes("47%") && resultText.includes("Note 60 Pro") && resultText.includes("Open 49"),
      hasIssueTable: Boolean(document.querySelector("#issue-table")) && resultText.includes("问题跟进列表") && resultText.includes("处理进展") && resultText.includes("完成时间"),
      hasStructuredAiReview: document.querySelectorAll(".ai-review-card").length >= 4
        && resultText.includes("责任领域")
        && resultText.includes("协同领域")
        && resultText.includes("AI建议及措施")
        && resultText.includes("2026-W1909")
        && resultText.includes("2024-W3648"),
      hasOwnerAvatars: document.querySelectorAll(".owner-person .avatar").length >= 4 && resultText.includes("于佑全") && resultText.includes("涂良建"),
      hasLarkNotice: stageText.includes("飞书通知") && stageText.includes("已通知 于佑全") && stageText.includes("已通知 涂良建"),
      editableFields: {
        progress: document.querySelectorAll("[data-issue-field='progress']").length,
        status: document.querySelectorAll("[data-issue-field='status']").length,
        completedAt: document.querySelectorAll("[data-issue-field='completedAt']").length
      },
      editedValues: {
        progress: document.querySelector("[data-issue-field='progress']")?.value || "",
        status: document.querySelector("[data-issue-field='status']")?.dataset.value || "",
        completedAt: document.querySelector("[data-issue-field='completedAt']")?.value || ""
      },
      hasCustomStatus: nativeSelectCount === 0 && document.querySelectorAll(".status-picker .status-trigger").length >= 4 && Boolean(statusStyle && statusStyle.borderRadius !== "0px"),
      hasStickyColumns: stickyHeaders.length === 3 && stickyHeaders.every((position) => position === "sticky"),
      tableCanScroll: tableShell ? tableShell.scrollWidth > tableShell.clientWidth : false,
      rightScrollWorks,
      tableShellFitsViewport: tableShellRect ? tableShellRect.left >= -1 && tableShellRect.right <= window.innerWidth + 1 : false,
      tableScrollMetrics: tableShell ? {
        clientWidth: Math.round(tableShell.clientWidth),
        scrollWidth: Math.round(tableShell.scrollWidth),
        rectLeft: tableShellRect ? Math.round(tableShellRect.left) : 0,
        rectRight: tableShellRect ? Math.round(tableShellRect.right) : 0
      } : null,
      hasThinkingEvidence: stageText.includes("问题跟进列表已生成") || stageText.includes("AI 正在推理"),
      aiStageWidth: stageRect ? Math.round(stageRect.width) : 0,
      stageCopyWidth: stageCopyRect ? Math.round(stageCopyRect.width) : 0,
      evidenceWidth: evidenceRect ? Math.round(evidenceRect.width) : 0,
      issueTableTop: issueTableRect ? Math.round(issueTableRect.top) : 99999,
      stageHasLightLayer: Boolean(stageAfterStyle && stageAfterStyle.content !== "none" && stageAfterStyle.backgroundImage !== "none"),
      badRects
    };
  });

  if (consoleErrors.length) {
    fail(`Console errors on ${viewport.width}x${viewport.height}: ${consoleErrors.join(" | ")}`);
  }
  if (!state.root || !state.styleLoaded) {
    fail(`Demo did not load required root/style on ${viewport.width}x${viewport.height}`);
  }
  if (!state.backdropFilter.includes("blur")) {
    fail(`Glass blur style missing on ${viewport.width}x${viewport.height}`);
  }
  if (state.overflowX > 0) {
    fail(`Horizontal overflow ${state.overflowX}px on ${viewport.width}x${viewport.height}`);
  }
  if (state.primaryActionCount !== 1 || state.buttonCount < 4) {
    fail(`Expected one primary demo action plus secondary controls on ${viewport.width}x${viewport.height}, found ${JSON.stringify({ buttonCount: state.buttonCount, primaryActionCount: state.primaryActionCount })}`);
  }
  if (state.primaryButtonHeight < 44) {
    fail(`Primary button height ${state.primaryButtonHeight}px is below 44px on ${viewport.width}x${viewport.height}`);
  }
  if (state.completedSteps < 4 || !state.resultReady) {
    fail(`Expected complete four-step demo flow on ${viewport.width}x${viewport.height}`);
  }
  if (state.signalCards < 4 || state.signalCards > 6) {
    fail(`Expected 4-6 concise signal cards on ${viewport.width}x${viewport.height}`);
  }
  if (!state.hasRealW23 || !state.hasIssueTable || !state.hasThinkingEvidence || !state.hasStructuredAiReview) {
    fail(`Real W23 issue table output is missing on ${viewport.width}x${viewport.height}`);
  }
  if (!state.hasCustomStatus) {
    fail(`Custom status picker is missing on ${viewport.width}x${viewport.height}`);
  }
  if (viewport.width >= 1200 && (!state.hasStickyColumns || !state.tableCanScroll || !state.rightScrollWorks || !state.tableShellFitsViewport)) {
    fail(`Desktop issue table needs sticky first three columns and in-container horizontal scroll: ${JSON.stringify({ hasStickyColumns: state.hasStickyColumns, tableCanScroll: state.tableCanScroll, rightScrollWorks: state.rightScrollWorks, tableShellFitsViewport: state.tableShellFitsViewport, tableScrollMetrics: state.tableScrollMetrics })}`);
  }
  if (!state.hasOwnerAvatars) {
    fail(`Owner avatars/names are missing on ${viewport.width}x${viewport.height}`);
  }
  if (!state.hasLarkNotice) {
    fail(`Lark notification evidence is missing on ${viewport.width}x${viewport.height}`);
  }
  if (viewport.width >= 1200 && state.issueTableTop > 740) {
    fail(`Issue table is not visible enough in the first desktop viewport: top=${state.issueTableTop}`);
  }
  if (state.editableFields.progress < 3 || state.editableFields.status < 3 || state.editableFields.completedAt < 3) {
    fail(`Editable issue fields are missing on ${viewport.width}x${viewport.height}: ${JSON.stringify(state.editableFields)}`);
  }
  if (!state.editedValues.progress.includes("项目经理补充") || state.editedValues.status !== "已完成" || state.editedValues.completedAt !== "2026-06-09") {
    fail(`Editable issue fields did not retain user changes on ${viewport.width}x${viewport.height}: ${JSON.stringify(state.editedValues)}`);
  }
  if (viewport.width >= 1200 && (state.aiStageWidth < 620 || state.stageCopyWidth < 430 || state.evidenceWidth < 430)) {
    fail(`AI stage/output area is too small on ${viewport.width}x${viewport.height}: stage=${state.aiStageWidth}, copy=${state.stageCopyWidth}, evidence=${state.evidenceWidth}`);
  }
  if (!state.stageHasLightLayer) {
    fail(`AI stage needs a visible light layer on ${viewport.width}x${viewport.height}`);
  }
  if (state.badRects.length) {
    fail(`Elements overflow viewport on ${viewport.width}x${viewport.height}: ${state.badRects.join(", ")}`);
  }

  await page.waitForTimeout(2400);
  await page.evaluate(() => {
    if (document.activeElement && "blur" in document.activeElement) document.activeElement.blur();
    const shell = document.querySelector(".issue-table-shell");
    if (shell) shell.scrollLeft = 0;
  });
  await page.waitForTimeout(250);
  await page.addStyleTag({
    content: "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }"
  });
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return state;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  const desktop = await runScenario(page, { width: 1440, height: 1000 }, desktopShot);
  const mobile = await runScenario(page, { width: 390, height: 844 }, mobileShot);
  console.log("Glass workbench browser verification passed");
  console.log(JSON.stringify({ desktop, mobile }, null, 2));
} finally {
  await browser.close();
}
