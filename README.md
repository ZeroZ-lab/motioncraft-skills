# MotionCraft Skills

Web 动画视频生产技能套件 — Claude Code Plugin。

把模糊的视频创意，通过 8 步结构化流程，转化为可预览、可渲染、可复用的 Web 动画视频工程。

## 核心理念

> **先定义视频承诺，再设计理解路径，再生成可渲染工程。** 工具只是执行层，workflow 才是生产系统。

## 8 步 Pipeline

```
Init → Brief → Title/Cover → Script Beats → Storyboard → Styleframes → Web Motion Composition → Render QA
```

| 步骤 | 命令 | 产出 | 人工确认 |
|------|------|------|---------|
| 0. Init | `/init` | 项目初始化 + 模板选择 | ✅ Checkpoint 0 |
| 1. Brief | `/brief` | 视频任务定义 | |
| 2. Title/Cover | `/title-cover` | 点击理由与承诺 | ✅ Checkpoint 1 |
| 3. Script Beats | `/script` | 叙事节奏点 | |
| 4. Storyboard | `/storyboard` | 可执行场景 | ✅ Checkpoint 2 |
| 5. Styleframes | `/styleframes` | 静态关键帧 | |
| 6. Composition | `/compose` | Web 动画工程 | |
| 7. Render QA | `/render-qa` | QA 报告 + 导出 | ✅ Checkpoint 3 |

## 快速开始

### 安装

在 Claude Code 中添加 marketplace：

```
Plugins → Add Marketplace → ZeroZ-lab/motioncraft-skills
```

然后在 Installed 中启用 `motioncraft`。

### 使用

从一条模糊的想法开始：

```
/init
```

选择项目名和模板后，运行 `/brief` 定义视频内容。然后按顺序走完 pipeline：

```
/brief            → 定义视频任务
/title-cover      → 确认标题和封面
/script           → 拆解叙事节奏
/storyboard       → 设计每一幕场景，确认分镜
/styleframes      → 设计静态画面
/compose          → 生成 GSAP + HTML 动画工程
/render-qa        → 渲染、质检、导出
```

4 个 Checkpoint 需要你确认后才继续。

## 示例项目

`docs/video/deepseek-v4/` 包含一个完整示例，覆盖 brief → title-cover → script-beats → storyboard → styleframes 全 5 步 pipeline，包含 HyperFrames 渲染集成。

## 产出物

```
docs/video/<name>/
├── 01-brief.md
├── 02-title-cover.md
├── 03-script-beats.md
├── 04-storyboard.md
├── 05-styleframes.md
└── 06-qa-report.md

project/
├── .mc-project.json
├── index.html
├── styles.css
├── motion.js
├── storyboard.json
└── assets/

output/
├── video.mp4
├── thumbnail.png
└── storyboard.json
```

## 8 条宪法

所有技能继承以下不可变规则（[CANON.md](CANON.md)）：

1. **Promise First** — 标题封面先于内容
2. **One Scene One Message** — 一幕一意
3. **Static Before Motion** — 静态成立再动
4. **Motion Serves Understanding** — 动画服务理解
5. **Storyboard Is Contract** — 分镜是合同
6. **Verify Don't Assume** — 渲染后必须验证
7. **Scope Discipline** — 不改该改之外的
8. **Source Material First** — 素材驱动，不凭空发明

## 技术栈

默认推荐：

- **HyperFrames** — HTML → Preview → Render（需要 `data-composition-id` + `window.__timelines` 集成）
- **HTML / CSS / SVG** — 画面结构
- **GSAP** — 时间轴动画
- **PixiJS / Three.js** — 仅在需要特效时调用

## 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| Node.js | >= 22 | HyperFrames 强制要求 |
| FFmpeg | 7.x | 音频/视频编码 |
| FFprobe | 7.x | 媒体信息探测 |
| Chrome/Chromium | 系统安装 | HyperFrames 帧捕获 |
| GSAP | 3.12+ | CDN 加载或本地引入 |
| HyperFrames CLI | 0.4+ | `npx hyperframes doctor` 检查 |

## 7 个审查角色

| 角色 | 审查阶段 | 职责 |
|------|---------|------|
| project-initializer | Init | 项目名推断 + 模板推荐 |
| brief-auditor | Brief | 商业价值 + 受众精准度 + 可行性 |
| title-cover-scout | Title/Cover | 点击理由 + 承诺一致性 + 认知张力 |
| storyboard-reviewer | Storyboard | 节奏 + 信息密度 + 视觉可行性 |
| styleframe-reviewer | Styleframes | 构图 + 排版层级 + 动效潜力 |
| motion-engineer | Composition | 技术方案 + scene block 选型 + 性能 |
| render-qa-auditor | Render QA | 渲染完整性 + 视觉质量 + 导出规格 |

## 项目结构

```
motioncraft-skills/
├── CANON.md                    # 宪法（8 条）
├── AGENTS.md                   # 入口配置
├── CLAUDE.md                   # Claude 侧指针
├── skills/                     # 8 核心技能
│   ├── define-project/
│   ├── define-brief/
│   ├── design-title-cover/
│   ├── design-script-beats/
│   ├── design-storyboard/
│   ├── design-styleframes/
│   ├── build-web-motion/
│   └── verify-render-qa/
├── commands/                   # 8 斜杠命令
├── agents/                     # 7 审查角色
└── references/                 # 动效原则 + 模式库
```

## 与 Unified Skills 的关系

MotionCraft 继承了 [Unified Skills](https://github.com/ZeroZ-lab/unified-skills) 的设计模式（SKILL.md 格式、Agent 角色化、Scout Army 审查、HARD GATE 门控），但专注于视频生产领域。两者可以并行安装使用。

## License

MIT
