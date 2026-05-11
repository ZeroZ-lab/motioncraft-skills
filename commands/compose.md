---
description: Web 动画工程生成 — 把分镜变成可渲染工程
---

# Command: /compose

## Goal

Transform storyboard + styleframes into a renderable web motion project.

## Phases

### Phase 1: Project Setup + Read Project Info
**Skills:** build-web-motion
**Process:**
1. 读取 storyboard + styleframes
2. 从 `project/.mc-project.json` 读取已选定模板信息（composition_id + selected_template）
3. 读取现有 `project/` 工程结构（由 /init 创建）

**Fallback（v1.7.0 兼容）**: project/ 存在但 .mc-project.json 不存在 → 从 CSS 变量推断模板来源 → 自动生成 .mc-project.json → 继续正常流程

**Output:** 选定模板信息 + project/ 工程结构

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
- [ ] project/ 目录已存在（由 /init 创建）
- [ ] .mc-project.json 已存在（或可通过 fallback 推断生成）

**前置检查**: 如果 project/ 目录不存在，拒绝执行并提示"请先运行 /init 初始化项目"。

## Exit Conditions
- [ ] project/ 工程完整
- [ ] 所有 scene preview 通过
- [ ] 完整 timeline preview 通过
- [ ] .mc-project.json 已存在（确保项目身份可追踪）

## Next Steps
- If complete → /render-qa

## 实现

加载 CANON.md → 调用 skills/build-web-motion/SKILL.md。