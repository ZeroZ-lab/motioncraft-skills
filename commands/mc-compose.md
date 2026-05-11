---
description: Web 动画工程生成 — 把分镜变成可渲染工程
---

# Command: /mc-compose

## Goal

Transform storyboard + styleframes into a renderable web motion project.

## Phases

### Phase 0: Template Selection
**Skills:** build-web-motion
**Process:**
1. 读取 brief 的 style + topic 字段
2. 根据 `templates/TEMPLATE-GUIDE.md` 推荐映射表推断推荐模板
3. 向用户展示推荐模板 + 其他选项，等待人类确认或 override
4. 用户确认后，使用选定模板初始化工程结构
**Output:** 选定模板名称 + 人类确认证据

### Phase 1: Project Setup
**Skills:** build-web-motion
**Process:**
1. 读取 storyboard + styleframes
2. 基于 Phase 0 选定模板初始化工程结构
**Output:** project/ 目录

### Phase 2: Scene-by-Scene Implementation
**Skills:** build-web-motion
**Agent:** motion-engineer
**Process:**
1. 逐 scene 实现 HTML/CSS/GSAP（优先从 Scene Block Library 查找匹配 block）
2. 每个 scene 独立 preview
3. Timeline 集成
**Output:** 完整 project/

### Phase 3: Full Preview
**Process:** 完整 timeline preview 验证
**Output:** preview 通过证据

## Entry Conditions
- [ ] 04-storyboard.md 已批准
- [ ] 05-styleframes.md 已完成

## Exit Conditions
- [ ] 模板已选定且人类确认
- [ ] project/ 工程完整
- [ ] 所有 scene preview 通过
- [ ] 完整 timeline preview 通过

## Next Steps
- If complete → /mc-render-qa

## 实现

加载 CANON.md → 调用 skills/build-web-motion/SKILL.md。
