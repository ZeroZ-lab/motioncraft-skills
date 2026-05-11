---
description: 定义标题封面 — 点击理由与视频承诺
---

# Command: /title-cover

## Goal

Define the video's click reason, promise, and cover concept.

## Phases

### Phase 1: Title Options
**Skills:** design-title-cover
**Process:**
1. 读取 brief
2. 生成 3-5 个标题选项
3. 设计封面概念
**Output:** 02-title-cover.md（draft）

### Phase 2: Scout Review
**Agent:** title-cover-scout
**Input:** 02-title-cover.md（draft）
**Output:** scout-feedback

### Phase 3: User Confirmation（Checkpoint 1）
**Process:** 展示标题选项 + 封面概念 + scout 反馈，等待用户批准
**Output:** 02-title-cover.md（final）

## Entry Conditions
- [ ] 01-brief.md 已批准

## Exit Conditions
- [ ] 02-title-cover.md 存在且为最终版
- [ ] 用户已确认标题和封面

## Next Steps
- If approved → /script

## 实现

加载 CANON.md → 调用 skills/design-title-cover/SKILL.md。
