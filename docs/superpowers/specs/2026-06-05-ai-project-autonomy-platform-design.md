# AI Project Autonomy Platform Design

Date: 2026-06-05
Contest submission deadline: 2026-06-06 24:00

## Decision

Use direction C: a full-domain project task autonomy platform.

The submission story should be broad enough to show platform ambition, but the
Demo 1.0 should prove one complete closed loop. The approved scope is:

- Contest scheme: full-domain project autonomy platform.
- Demo scope: one AI risk-to-task closed loop.

## One-Sentence Pitch

Use AI to connect project management, defect management, big-data quality, and
after-sales systems, then automatically identify project-node risks, create
tasks, track closure, and generate management reports.

## Problem

Project operations currently depend on repeated manual collection and judgment:

- Project managers gather project status, defects, experience metrics, and
  after-sales signals from multiple systems.
- Risk judgment depends on personal experience and manual notes.
- Tasks are created after meetings rather than when risk signals appear.
- Follow-up is scattered across reports, chats, spreadsheets, and task systems.
- Weekly reports and meeting materials are repeatedly rebuilt from similar raw
  data.

## Target Users

- Project manager: needs risk discovery, task creation, and status tracking.
- Department owner: needs clear responsibilities and priority.
- Management reviewer: needs concise risk summary and closure trend.
- Contest judge: needs to see practical AI value, not only report generation.

## Data Sources

Demo and deck should describe the platform as read-only first, write-enabled
later:

- Project management system: project name, stage, node, owner, schedule, weekly
  meeting data.
- Defect management system: defect count, priority, resolution rate, reopen
  signal, blocking defect.
- Big-data system: stability, performance, power, user experience metrics.
- After-sales system: ARR, VOC, negative sentiment, top complaints.
- Existing meeting/wiki/sheet data: weekly meeting tasks, project status,
  risk sheets, responsibility and due date.

## AI Capabilities

The AI layer has five capabilities:

1. Data collection agent: collects and normalizes cross-system project data.
2. Project-node reasoning: understands the current node such as KO, PR, QR,
   STR, PIR, MPR, MQR, and changes risk checks by node.
3. Risk recognition: detects quality, schedule, experience, resource, and
   after-sales risks from current and historical signals.
4. Task generation: creates suggested tasks with description, risk grade,
   responsible department, responsible person, due date, evidence, and
   acceptance criteria.
5. Tracking and report generation: monitors Open/Ongoing/Closed status,
   escalates overdue risks, and generates weekly meeting and management reports.

## Demo 1.0 Story

The demo should follow one end-to-end flow:

1. Data source overview
   - Show four source cards: project management, defects, big data, after-sales.
   - Show sample signals such as project node, risk status, defect backlog,
     experience metric abnormality, and VOC issue.

2. Node-aware risk radar
   - Select a sample project such as CAMON or tOS.
   - Show the current node and the risks AI thinks should be checked at that
     node.
   - Use real-looking sample risks: performance, power, stability, defect
     closure, module requirement lock, after-sales negative feedback.

3. AI task generation
   - Show AI-generated tasks from detected risks.
   - Task fields: risk title, source evidence, risk grade, owner department,
     owner, due date, status, recommended action.
   - Make clear that Demo 1.0 generates task suggestions; future integration
     can write to the formal task system.

4. Autonomous tracking board
   - Show Open, Ongoing, Need Escalation, Closed.
   - Highlight overdue or repeatedly reopened risks.
   - Show automatic reminder/escalation logic.

5. Report output
   - Generate weekly meeting summary and management summary.
   - Include the change from manual collection to AI collection and tracking.

## PPT Structure

Use a one-page scheme for the required submission and a short deck for roadshow
or backup.

### One-Page Scheme

- Title: AI Project Autonomy Platform
- Core pain: manual collection, scattered data, delayed risk tracking, repeated
  reports.
- Solution diagram: data sources -> AI reasoning -> task autonomy -> reports.
- Demo proof: one closed loop from CAMON/tOS risk signal to generated task.
- Business value: faster risk discovery, less manual work, better task closure,
  management visibility.
- Contest increment: during the contest, build Demo 1.0 for node-aware risk
  detection and task generation.

### Short PPT Deck

1. Cover: AI Project Autonomy Platform.
2. Pain: project management still depends on human collection and follow-up.
3. Vision: from multi-system data to autonomous project operations.
4. Architecture: source systems, data layer, AI agent, task/report layer.
5. Demo flow: one closed loop.
6. Sample output: AI-generated risk task and weekly report.
7. Business value: efficiency, timeliness, consistency, closed-loop quality.
8. Roadmap: Demo 1.0, system integration, write-back automation, model tuning.

## Existing Foundation vs Contest Increment

Because the contest rules emphasize fairness for existing projects, materials
must separate existing foundation from new contest output.

Existing foundation:

- IPM weekly meeting management already has project overview, issue follow-up,
  department reports, and meeting rotation data.
- Existing wiki/sheets contain weekly meeting tasks, project status, risks,
  owners, and due dates.
- The team understands project management business and system data structures.

Contest increment:

- AI node-aware risk reasoning.
- Cross-system risk-to-task generation logic.
- Demo 1.0 interface for risk radar, task generation, tracking board, and report
  output.
- Clear task schema and closed-loop story for future task-system integration.

## Design Principles

- Show business closure, not only AI chat.
- Make the AI reasoning visible enough for judges to trust the output.
- Use real project language from IPM and weekly meeting materials.
- Avoid overpromising direct write-back in Demo 1.0; position write-back as the
  next integration step.
- Keep the demo focused on one credible project chain.

## Demo Data Examples

Use sanitized or sample-like versions of observed fields:

- Project: CAMON 60 Pro 5G / CO7_H8110 / N6878
- Risk state: high risk, medium risk, normal
- Node fields: KO, PR0, QR0, PR1, QR1, PR2, QR2, PIR, MPR, MQR
- Issue fields: previous backlog, this-week closed, continued backlog, closure
  rate, ranking
- Task fields: tOS version, project name, dimension, problem/task description,
  progress, planned completion time, responsible department, owner, proposer,
  status

## Testing And Verification

For Demo 1.0:

- Run local app successfully.
- Verify each main view at desktop width.
- Click through the complete demo flow.
- Verify no text overlap in cards, tables, or buttons.
- Verify the report output can be copied or displayed cleanly.

For PPT:

- Export editable PPTX.
- Render preview/contact sheet.
- Check every slide has a clear claim and proof object.
- Confirm the deck says Demo 1.0 is suggestion/automation proof, not a completed
  production write-back integration.

## Locked Execution Choices

- Chinese product name: AI 项目自治运营平台.
- Language: all PPT copy, Demo interface copy, report samples, task examples,
  and roadshow wording must be written in Chinese.
- Demo write-back wording: show AI-generated task suggestions and a simulated
  "create task" action. State clearly that production write-back is the next
  integration step.
- Submission shape: deliver both an editable PPTX one-page scheme and a local
  interactive HTML Demo 1.0. The short PPT deck can be generated from the same
  story if time permits.
