# MotionCraft Skills

> 宪法 + 7 技能 + 7 命令 + 6 角色 + Scene Block Library + Template Scaffolding = Web 动画视频生产技能套件。

## 如果你是一个 AI Agent

停。先读完这一节再做任何事。

MotionCraft 是一套视频生产技能——每个 SKILL.md 里的流程、红旗表、常见说辞表都是经过设计的，不是随意写的散文。随意修改措辞会改变 agent 行为，产生无法预料的后果。

**修改技能之前：**
1. 先通读整个技能。理解每个章节为什么存在。
2. 读 [CANON.md](CANON.md)。技能继承宪法的 8 条规则——技能级别的步骤不能与宪法冲突。
3. 新增技能时，遵循命名规范：`<phase>-<name>/SKILL.md`。

**创建 PR 之前：**
1. 确认无 stub 残留——每个步骤必须有可操作的内容，不能是占位符。
2. 确认命名规范：`<phase>-<name>/SKILL.md`。
3. 确认技能包含：入口/出口条件、可操作流程、常见说辞表、红旗清单、验证清单。

## 纲领

MotionCraft Workflow 是一套把主题、脚本或资料转化为 Web 动画视频的技能化生产流程。它通过 Brief、标题封面、脚本节奏、分镜、静态关键帧、Web 动画工程和渲染质检，稳定产出可预览、可渲染、可复用的视频工程。

**最核心的不是 HyperFrames、GSAP 或 PixiJS，而是：先定义视频承诺，再设计理解路径，再生成可渲染工程。**

## 纲领

[CANON.md](CANON.md) — 8 条不可变规则。技能可以添加纪律，但绝不能放松宪法条款。

## 项目结构

```
motioncraft-skills/
├── CANON.md                 纲领（8 条，最高优先级）
├── AGENTS.md                入口配置（本文件）
├── CLAUDE.md                Claude 侧指针文件（指向 AGENTS.md）
│
├── skills/                  7 技能 / 4 阶段
│   ├── define/              定义（1）
│   ├── design/              设计（4）
│   ├── build/               构建（1）
│   └── verify/              验证（1）
│
├── commands/                7 命令入口
├── agents/                  6 角色
├── templates/               4 starter 模板（dark-tech, minimal-clean, bold-editorial, data-visualization）
└── references/              参考资料 + Scene Block Library
```

## 技能按阶段分组

```
define/    → brief（视频任务定义）
design/    → title-cover（标题封面）、script-beats（叙事节奏）、
             storyboard（分镜场景）、styleframes（静态关键帧）
build/     → web-motion（Web 动画工程）
verify/    → render-qa（渲染质检）
```

## 命令映射

| 命令 | 加载的技能 | 产出 | 人工确认 |
|------|-----------|------|---------|
| `/mc-brief` | define-brief | 视频任务 brief | `docs/video/<name>/01-brief.md` |
| `/mc-title-cover` | design-title-cover | 标题封面 | `docs/video/<name>/02-title-cover.md` | ✅ Checkpoint 1 |
| `/mc-script` | design-script-beats | 叙事节奏 | `docs/video/<name>/03-script-beats.md` |
| `/mc-storyboard` | design-storyboard | 分镜场景 | `docs/video/<name>/04-storyboard.md` | ✅ Checkpoint 2 |
| `/mc-styleframes` | design-styleframes | 静态关键帧 | `docs/video/<name>/05-styleframes.md` |
| `/mc-compose` | build-web-motion | Web 动画工程 | `project/` | ✅ Checkpoint 0（模板选择） |
| `/mc-render-qa` | verify-render-qa | QA 报告 + 导出 | `docs/video/<name>/06-qa-report.md` | ✅ Checkpoint 3 |

## 4 个人工确认 Checkpoint

| Checkpoint | 位置 | 审查角色 | 问题 |
|-----------|------|---------|------|
| 0 | 模板选择 | 用户 | 选择哪个模板？推荐是否合适？ |
| 1 | 标题封面确认 | title-cover-scout | 这个标题值得点吗？封面一眼能看懂吗？视频承诺清楚吗？ |
| 2 | Storyboard 确认 | storyboard-reviewer + styleframe-reviewer | 每一幕有必要吗？画面能承载信息吗？节奏合理吗？ |
| 3 | Render QA 确认 | render-qa-auditor | 能正常渲染吗？风格符合预期吗？可以发布吗？ |

Agent 可以自动执行中间步骤，但这 4 个节点必须保留人工判断。

## 文档产出链

```
docs/video/<name>/
├── 01-brief.md           ← /mc-brief
├── 02-title-cover.md     ← /mc-title-cover
├── 03-script-beats.md    ← /mc-script
├── 04-storyboard.md      ← /mc-storyboard
├── 05-styleframes.md     ← /mc-styleframes
└── 06-qa-report.md       ← /mc-render-qa

project/
├── index.html          — 含 data-composition-id（HyperFrames 集成）
├── styles.css
├── motion.js           — 含 window.__timelines 注册
├── storyboard.json     — 含 total_duration
└── assets/

output/
├── video.mp4
├── thumbnail.png
└── storyboard.json
```

## 约定

### 命名规范
- 技能目录：`<阶段>-<技能名>/` —— 每个目录下恰好一个 `SKILL.md`
- 阶段：`define` / `design` / `build` / `verify`
- 技能名：kebab-case

### SKILL.md 格式
- 每个技能必须包含：入口/出口条件、可操作流程、常见说辞表、红旗清单、验证清单
- 引用其他技能用技能名，不用文件路径
- 引用 CANON.md 而不是重复宪法条款

### 命令
- `commands/` 下每个命令一个 `.md` 文件
- 命令加载技能，但不重复技能内容

### 参考示例
- 完整 7 步 pipeline 示例见 `docs/video/motioncraft-intro/`

## 边界

### 始终要做
- 新增技能必须遵循命名规范
- 引用 CANON.md 而不是重复宪法条款
- 调用技能前先通读整个技能
- 实现非平凡变更前先陈述假设

### 绝不能做
- 不能添加"空泛建议"而非可操作流程的技能
- 不能在技能间重复内容——用引用代替
- 不能在技能中放松宪法条款
- 不能在 storyboard 确认后重新发明场景
- 不能跳过 4 个人工确认 checkpoint（含模板选择）

## Scene Block Library

Scene Block Library 提供 8 个 GSAP 结构模板，覆盖 17 个 GSAP 策略（含别名映射）。anime.js blocks 等双引擎 Spike 验证后在 Phase 2 添加。

**Block 定位**: demo + integration spec（非 copy-paste source）。Agent 读 block.md 理解模式，在模板项目中写新代码。

**查找方式**: `references/scene-blocks/MANIFEST.json` 提供 animation_strategy → block file + engine 的结构化映射。

**模板选择**: `/mc-compose` Phase 0 通过 brief 信号推荐模板 + 人类 override 确认。见 `templates/TEMPLATE-GUIDE.md`。
