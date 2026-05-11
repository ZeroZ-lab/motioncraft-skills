---
description: 项目初始化 — 从视频想法到可工程化的项目骨架
---

# Command: /init

## Goal

Initialize a MotionCraft project from a video idea: infer project name, select template (Checkpoint 0), create project directory, and output next-step guidance.

## Phases

### Phase 1: Project Name Inference + Confirmation (Gate 1)
**Skills:** define-project
**Process:**
1. 从用户输入推断项目名（kebab-case）
2. 推断置信度评估（高/中/低）
3. 人类确认项目名或 override
**Output:** confirmed project_name + composition_id

**composition_id 格式约束**: `^[a-z][a-z0-9-]{1,47}$` — 严格 kebab-case，2-48 字符，无特殊字符（安全要求：composition_id 插入 HTML 属性和 JS 字符串，非安全字符会导致注入风险）。

### Phase 2: Template Selection (Checkpoint 0)
**Skills:** define-project
**Agent:** project-initializer
**Process:**
1. 从用户描述推断 brief 信号（style + topic）
2. 置信度评估：
   - **高置信度**（style+topic 双信号）→ 推荐 1 个模板 + 理由 + 人类确认
   - **低置信度**（仅 topic 或无信号）→ 平等展示 4 个模板对比 + 简明适用场景，由人类选择
3. 人类确认或 override（`--template` 参数）
4. 模板名白名单校验：`[dark-tech, minimal-clean, bold-editorial, data-visualization]`

**⚠ 不可逆决策警告**: 模板选择不可逆。确认后如需更改，必须删除 `project/` 并重新运行 `/init`，这将丢失所有下游产出（brief、script、storyboard 等）。

**Output:** selected_template + 人类确认证据

### Phase 3: Project Initialization
**Skills:** define-project
**Process:**
1. 复制选定模板目录到 `project/`
2. 替换 `PLACEHOLDER_COMPOSITION_ID` → 项目名（2 个位置：index.html `data-composition-id` + motion.js `window.__timelines` key）
3. 创建 `.mc-project.json` 元数据标记
4. 创建 `docs/video/<project-name>/` 目录骨架（仅目录，不创建空文件）
5. 创建 `assets/` 素材子目录
**Output:** project/ 目录 + .mc-project.json

### Phase 4: Output + Next-Step Guidance
**Process:**
1. 输出项目名、选定模板、创建的文件清单
2. 追加引导："接下来运行 `/brief` 定义视频内容"
**Output:** 项目信息 + 下一步引导

## Entry Conditions
- [ ] 用户提供了视频想法、主题描述或显式项目名
- [ ] project/ 目录不存在（已有 project/ 时拒绝执行）

## Exit Conditions
- [ ] 项目名已确认 + composition_id 格式校验通过
- [ ] 模板已确认 + 模板名在白名单中
- [ ] project/ 目录已初始化
- [ ] .mc-project.json 已创建
- [ ] PLACEHOLDER_COMPOSITION_ID 双位置已替换
- [ ] 下一步引导已输出

## Next Steps
- → /brief

## 实现

加载 CANON.md → 调用 skills/define-project/SKILL.md。