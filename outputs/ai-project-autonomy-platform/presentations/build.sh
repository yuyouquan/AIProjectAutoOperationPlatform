#!/usr/bin/env bash
set -euo pipefail

NODE="/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
export PYTHON="/Users/shswyuyouquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
SKILL="/Users/shswyuyouquan/.codex/plugins/cache/openai-primary-runtime/presentations/26.601.10930/skills/presentations"

"$NODE" "$SKILL/scripts/build_artifact_deck.mjs" \
  --slides-dir "outputs/ai-project-autonomy-platform/presentations/slides" \
  --workspace "outputs/ai-project-autonomy-platform/presentations/workspace" \
  --out "outputs/ai-project-autonomy-platform/presentations/output/ai-project-autonomy-platform-onepage.pptx" \
  --preview-dir "outputs/ai-project-autonomy-platform/presentations/preview" \
  --layout-dir "outputs/ai-project-autonomy-platform/presentations/layout" \
  --contact-sheet "outputs/ai-project-autonomy-platform/presentations/preview/contact-sheet.png" \
  --slide-count 1
