---
description: 叙事节奏设计 — 拆解脚本节奏点
---

# Command: /script

## Goal

Break the video promise into narrative beats with timing.

## Phases

### Phase 1: Structure & Beats
**Skills:** design-script-beats
**Process:**
1. 读取 brief + title-cover
2. 选择叙事结构
3. 拆解 beats + 时长分配
4. 理解路径检查
**Output:** 03-script-beats.md

## Entry Conditions
- [ ] 01-brief.md 已批准
- [ ] 02-title-cover.md 已批准

## Exit Conditions
- [ ] 03-script-beats.md 存在
- [ ] beats 时长分配匹配 brief

## Next Steps
- If complete → /storyboard

## 实现

加载 CANON.md → 调用 skills/design-script-beats/SKILL.md。
