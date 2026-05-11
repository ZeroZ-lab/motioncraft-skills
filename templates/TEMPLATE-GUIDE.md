# TEMPLATE-GUIDE — 模板选择指引

> MotionCraft 提供 4 个 starter 模板。选择模板是 /mc-compose Phase 0 的人工确认步骤。

## 模板选择决策表

| 模板 | 视觉风格 | 推荐场景 | 不推荐场景 |
|------|---------|---------|-----------|
| dark-tech | 暗色 + 霓虹绿色 (#00ff88) | AI/编程/技术/editorial-tech | 温暖色调/手绘风格/企业报告 |
| minimal-clean | 白底 + 蓝色强调 (#2563eb) | 教学/科普/企业/minimal | 深色背景/数据密集/强观点表达 |
| bold-editorial | 暗蓝底 + 金色强调 (#FFD700) | 观点/评测/editorial/bold | 数据展示/代码展示/极简风格 |
| data-visualization | 深蓝灰底 + 蓝色强调 (#3b82f6) | 统计/报告/金融/data-visualization | 温暖色调/叙事驱动/手绘风格 |

## Brief 信号 → 模板推荐

从 brief 的 `style` 和 `topic` 字段推断推荐模板：

| style 信号 | topic 信号 | 推荐模板 |
|-----------|-----------|---------|
| dark, tech, neon, cyber | AI, 编程, 技术, 开发 | dark-tech |
| clean, minimal, white, light | 教学, 科普, 企业, 入门 | minimal-clean |
| bold, editorial, opinion, contrast | 观点, 评测, 评论, editorial | bold-editorial |
| data, chart, graph, statistics | 统计, 报告, 金融, 数据 | data-visualization |

**无明确信号时**：默认推荐 dark-tech（覆盖最广）。

**人类 override**：Agent 推荐仅供参考，用户可 override 选择任何模板或创建自定义模板。

## 自定义模板最低要求

创建自定义模板需满足以下 6 项：

1. **styles.css** 含 `:root` CSS 变量定义（至少 16 个 `--mc-*` 变量，带 fallback 值）
   - 颜色变量 7 个：--mc-bg, --mc-bg-alt, --mc-text, --mc-text-muted, --mc-primary, --mc-accent, --mc-border
   - 字体变量 4 个：--mc-font-primary, --mc-font-secondary, --mc-heading-size, --mc-body-size
   - 间距变量 3 个：--mc-spacing-sm, --mc-spacing-md, --mc-spacing-lg
   - 运动变量 4 个：--mc-duration-default, --mc-easing-default, --mc-enter-type, --mc-exit-type
   - 注释块包含 MotionCraft CSS Variable Convention 说明

2. **index.html** 含 HyperFrames 集成属性
   - `data-composition-id="PLACEHOLDER_COMPOSITION_ID"`（使用时替换为实际值）
   - `data-start="0"`, `data-width="1920"`, `data-height="1080"`
   - 所有 CDN `<script>` / `<link>` 带 `integrity` + `crossorigin="anonymous"` SRI 属性

3. **motion.js** 含 GSAP timeline 骨架
   - `gsap.timeline({ paused: true })` 创建
   - `window.__timelines['PLACEHOLDER_COMPOSITION_ID'] = tl;` 注册

4. **storyboard.json** 含基础结构
   - `total_duration` 字段
   - `_comment` 字段说明用途

5. **template.md** 含视觉系统描述
   - 视觉系统参数（颜色、字体、间距）
   - 风格说明
   - "何时选择" + "何时不选择"指引

6. **SRI 安全**：所有 CDN script/link 带 integrity + crossorigin 属性