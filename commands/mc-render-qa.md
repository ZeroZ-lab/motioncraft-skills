---
description: 渲染质检 — 预览、渲染、检查、修复、导出
---

# Command: /mc-render-qa

## Goal

Render, inspect, fix, and export the final video.

## Phases

### Phase A: Preview Check
**Skills:** verify-render-qa
**Process:** 确认 preview 完全正常
**Output:** preview 通过证据

### Phase B: Render Check
**Process:** 执行渲染，检查输出
**Output:** render 输出

### Phase C: Quality Inspection
**Process:** 逐项质检（技术 + 视觉 + 内容 + 动效）
**Output:** 质检清单

### Phase D: Scout Review
**Agent:** render-qa-auditor
**Input:** render 输出 + 质检清单
**Output:** auditor verdict

### Phase E: User Confirmation（Checkpoint 3）
**Process:** 展示 QA 报告 + auditor 反馈，等待用户批准
**Output:** 06-qa-report.md

### Phase F: Export
**Process:** 最终导出
**Output:** output/video.mp4 + thumbnail.png + storyboard.json

## Entry Conditions
- [ ] project/ 工程已完成
- [ ] preview 已通过

## Exit Conditions
- [ ] 06-qa-report.md 存在
- [ ] 最终导出文件完整
- [ ] 用户已确认可以发布

## 实现

加载 CANON.md → 调用 skills/verify-render-qa/SKILL.md。
