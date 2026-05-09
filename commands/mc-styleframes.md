---
description: 静态关键帧设计 — 每一幕的静态画面
---

# Command: /mc-styleframes

## Goal

Design static keyframes for every scene before animation.

## Phases

### Phase 1: Visual System + Keyframes
**Skills:** design-styleframes
**Process:**
1. 定义视觉系统
2. 逐幕设计 keyframe
3. 构图检查
4. 动效潜力评估
**Output:** 05-styleframes.md

### Phase 2: Scout Review
**Agent:** styleframe-reviewer
**Input:** 05-styleframes.md
**Output:** scout-feedback

## Entry Conditions
- [ ] 04-storyboard.md 已批准

## Exit Conditions
- [ ] 05-styleframes.md 存在
- [ ] 每个 scene 有 styleframe
- [ ] styleframe-reviewer 已审查

## Next Steps
- If complete → /mc-compose

## 实现

加载 CANON.md → 调用 skills/design-styleframes/SKILL.md。
