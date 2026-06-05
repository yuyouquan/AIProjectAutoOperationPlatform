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
  await page.click("#start-ai-analysis");
  await page.waitForTimeout(10800);

  const state = await page.evaluate(() => {
    const buttonHeights = Array.from(document.querySelectorAll("button")).map((button) => Math.round(button.getBoundingClientRect().height));
    const critical = Array.from(document.querySelectorAll(".top-glass-bar, .glass-panel, .metric-chip, .thinking-card, .task-card, .doc-block"));
    const badRects = critical.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width <= 0 || rect.height <= 0 || rect.left < -1 || rect.right > window.innerWidth + 1;
    }).map((element) => element.className);
    const panel = document.querySelector(".glass-panel");
    const panelStyle = panel ? getComputedStyle(panel) : null;

    return {
      title: document.title,
      root: Boolean(document.querySelector("#workbench-root")),
      styleLoaded: getComputedStyle(document.body).backgroundImage !== "none",
      backdropFilter: panelStyle ? panelStyle.backdropFilter || panelStyle.webkitBackdropFilter || "" : "",
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      buttonMinHeight: buttonHeights.length ? Math.min(...buttonHeights) : 0,
      thinkingCards: document.querySelectorAll("#ai-thinking-feed .thinking-card").length,
      generatedTasks: ((document.querySelector("#task-distribution-panel")?.textContent || "").match(/已分发/g) || []).length,
      feishuReady: (document.querySelector("#feishu-doc-panel")?.textContent || "").includes("管理建议"),
      escalationReady: (document.querySelector("#escalation-feed")?.textContent || "").includes("预警任务下发人"),
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
  if (state.buttonMinHeight < 44) {
    fail(`Button min height ${state.buttonMinHeight}px is below 44px on ${viewport.width}x${viewport.height}`);
  }
  if (state.thinkingCards < 5) {
    fail(`Expected at least 5 AI thinking cards on ${viewport.width}x${viewport.height}`);
  }
  if (state.generatedTasks < 4) {
    fail(`Expected at least 4 generated tasks on ${viewport.width}x${viewport.height}`);
  }
  if (!state.feishuReady || !state.escalationReady) {
    fail(`Report/escalation output missing on ${viewport.width}x${viewport.height}`);
  }
  if (state.badRects.length) {
    fail(`Elements overflow viewport on ${viewport.width}x${viewport.height}: ${state.badRects.join(", ")}`);
  }

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
