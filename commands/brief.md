---
description: 视频任务定义 — 把模糊创意变成可执行视频任务
---

# Command: /brief

## Goal

Transform a vague video idea into a structured, validated brief.

## Phases

### Phase 1: Clarification
**Skills:** define-brief
**Process:**
1. 5W1H 澄清
2. Goal Review 评分
**Output:** 01-brief.md（draft）

### Phase 2: Scout Review
**Agent:** brief-auditor
**Input:** 01-brief.md（draft）
**Output:** scout-feedback

### Phase 3: User Confirmation
**Process:** 展示 brief + scout 反馈，等待用户批准
**Output:** 01-brief.md（final）

## Entry Conditions
- [ ] 用户提供了视频想法或主题

## Exit Conditions
- [ ] 01-brief.md 存在且为最终版
- [ ] 用户已批准

## Next Steps
- If approved → /title-cover

## 实现

加载 CANON.md → 调用 skills/define-brief/SKILL.md。
