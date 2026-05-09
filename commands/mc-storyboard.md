---
description: 场景设计 — 把脚本变成可执行场景
---

# Command: /mc-storyboard

## Goal

Transform script beats into executable scenes with timing and motion intent.

## Phases

### Phase 1: Scene Design
**Skills:** design-storyboard
**Process:**
1. 读取 script-beats
2. beat → scene 映射
3. 时间轴验证
4. 动效意图标注
**Output:** 04-storyboard.md + storyboard.json

### Phase 2: Scout Review
**Agent:** storyboard-reviewer
**Input:** 04-storyboard.md
**Output:** scout-feedback

### Phase 3: User Confirmation（Checkpoint 2）
**Process:** 展示 storyboard + scout 反馈，等待用户批准
**Output:** 04-storyboard.md（final）

## Entry Conditions
- [ ] 03-script-beats.md 已完成

## Exit Conditions
- [ ] 04-storyboard.md + storyboard.json 存在
- [ ] 用户已批准 storyboard

## Next Steps
- If approved → /mc-styleframes

## 实现

加载 CANON.md → 调用 skills/design-storyboard/SKILL.md。
