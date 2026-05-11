---
name: build-web-motion
description: 生成 Web 动画工程。使用 cuando storyboard + styleframes 已批准需要生成可渲染工程
---

# Web Motion Composition — Web 动画工程生成

> 领域: workflow | 宪法: 第 5（Storyboard Is Contract）、第 6（Verify Don't Assume）条

## 入口/出口
- **入口**: 已批准 storyboard + styleframes
- **出口**: `project/` 工程目录 + preview 验证证据
- **指向**: 完成后调用 `verify-render-qa`
- **假设已加载**: CANON.md + `design-storyboard` + `design-styleframes`

## 何时不使用
- 视频不需要 Web 动画（实拍、3D 渲染等）
- 已有可用的动画工程

## Iron Law

<HARD-GATE>
**把分镜翻译成可渲染的 Web 工程。**
所有 scene 必须来自 storyboard。所有动画必须进入 timeline。
不做一边想创意一边写代码的事。
不重新发明场景——composition 只执行 storyboard 的合同。
</HARD-GATE>

## 技术栈

默认推荐：

```
HyperFrames         — HTML → Preview → Render
HTML / CSS / SVG    — 画面结构
GSAP                — 时间轴动画（默认引擎）
anime.js            — 时间轴动画（补充引擎：morph/spring/blur）
PixiJS / Three.js   — 仅在需要特效时调用
```

### 引擎选择规则

engine_preference 是 advisory per CANON §5。默认 gsap。anime.js 仅在以下条件使用：

| 条件 | engine_preference | 理由 |
|------|-----------------|------|
| 策略需要 SVG morph | animejs | GSAP MorphSVG 付费 ($25/mo) |
| 策略需要 spring physics | animejs | GSAP elastic.out 是近似替代 |
| visual_effect 引用 React-Bits animejs 组件 | animejs | 提取目标引擎为 animejs |
| 否则 | gsap | 默认引擎 |

### HyperFrames 双注册规范

GSAP 和 anime.js timeline 在同一 composition 中共存，各自独立注册：

**GSAP 注册（必须）**:
```javascript
window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = gsapTimeline;
```

**anime.js 注册（anime.js 珞略时必须）**:
```javascript
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = animeTimeline;
```

**关键差异：**
- GSAP seek 使用**秒**（`tl.seek(2.5)`）
- anime.js v3 seek 使用**毫秒**（`tl.seek(2500)`）
- anime.js v4 seek 单位待确认（参考 `references/animejs-video-guide.md`）

**CSS 状态模型（关键）：**
- 元素 CSS 定义"最终可见状态"（opacity:1, transform:none, filter:none）
- GSAP `.from({opacity:0})` 从隐藏状态动画到 CSS 可见状态
- anime.js 动画也从隐藏值到 CSS 可见值
- **错误做法：** CSS 同时设置 `opacity:0` — `.from({opacity:0})` 动画到 `opacity:0`，元素永远不可见

## HyperFrames 集成规范

所有 Web 动画工程必须包含以下 HyperFrames 集成，否则无法渲染。

### HTML 要求

根容器（包含所有 scene 的最外层 `<div>`）必须设置以下属性：

```html
<div class="video-container"
     data-composition-id="<project-name>"
     data-start="0"
     data-width="1920"
     data-height="1080">
  <!-- scenes here -->
</div>
```

- `data-composition-id`: 项目唯一标识符，使用 kebab-case（如 `motioncraft-intro`）
- `data-start`: 固定为 `"0"`
- `data-width` / `data-height`: 与 brief 中 resolution 一致

### GSAP Timeline 要求

```javascript
// 1. Timeline 必须使用 { paused: true } 创建
//    HyperFrames 控制播放，timeline 不自动运行
const tl = gsap.timeline({ paused: true });

// ... scene 动画代码 ...

// 2. Timeline 注册到 window.__timelines
//    HyperFrames 通过此对象自动发现 timeline
window.__timelines = window.__timelines || {};
window.__timelines['<project-name>'] = tl;
```

**关键规则：**
- `{ paused: true }` 不可省略 — 省略后 timeline 自动播放，HyperFrames 无法控制
- `window.__timelines` 不可改为其他名称（如 `window.__hf`） — HyperFrames 只识别 `__timelines`
- `<project-name>` 必须与 HTML 中 `data-composition-id` 一致

### anime.js Timeline 要求（anime.js 珞略时）

```javascript
// 1. Timeline 必须使用 autoplay: false 创建
//    等效于 GSAP { paused: true }
const tl = anime.createTimeline({ autoplay: false });

// ... anime.js 动画代码 ...

// 2. Timeline 注册到 window.__hfAnime
//    HyperFrames 通过此对象自动发现 anime.js timeline
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<project-name>'] = tl;
```

**关键规则：**
- `autoplay: false` 不可省略
- `window.__hfAnime` 不可改为其他名称 — HyperFrames 只识别 `__hfAnime`
- anime.js seek 使用毫秒（v3），GSAP seek 使用秒 — Preview 时注意单位差异
- 参考 `references/animejs-video-guide.md` 完整规范

### 集成检查清单

- [ ] HTML 根容器有 `data-composition-id`、`data-start`、`data-width`、`data-height`
- [ ] GSAP timeline 使用 `{ paused: true }` 创建
- [ ] GSAP Timeline 注册到 `window.__timelines[<composition-id>]`
- [ ] anime.js timeline 使用 `autoplay: false` 创建（anime.js 珞略时）
- [ ] anime.js Timeline 注册到 `window.__hfAnime[<composition-id>]`（anime.js 珞略时）
- [ ] composition-id 在 HTML 和 JS 中一致

## 音频集成（可选）

背景音乐和音效通过 HyperFrames `<audio>` 元素集成。音频是可选的——无音频也能正常渲染。

### 免费音频资源

| 库 | 类型 | 许可证 | 署名 |
|----|------|--------|------|
| [Pixabay Music](https://pixabay.com/music/) | BGM | Pixabay License | 不需要 |
| [Mixkit Music](https://mixkit.co/free-stock-music/) | BGM | Mixkit License | 不需要 |
| [Mixkit SFX](https://mixkit.co/free-sound-effects/) | SFX | Mixkit License | 不需要 |

### HTML 结构

`<audio>` 元素放在根容器内（与 scene 同级），不需要 `class="clip"`：

```html
<div data-composition-id="<project-name>" data-start="0" data-width="1920" data-height="1080">
  <!-- scenes -->

  <!-- 背景音乐（全时长） -->
  <audio id="bg-music"
         data-start="0"
         data-duration="<total-duration>"
         data-track-index="3"
         data-volume="0.15"
         src="assets/audio/bg-music.mp3"></audio>

  <!-- 音效（特定时间点） -->
  <audio id="sfx-whoosh"
         data-start="5"
         data-duration="1"
         data-track-index="2"
         data-volume="0.7"
         src="assets/audio/whoosh.wav"></audio>
</div>
```

### 音频属性

| 属性 | 说明 | 推荐 |
|------|------|------|
| `data-start` | 开始时间（秒） | 对齐 storyboard scene 起始时间 |
| `data-duration` | 持续时长（秒） | BGM = 视频总时长，SFX = 音效长度 |
| `data-track-index` | 音轨索引 | BGM = 3，SFX = 2 |
| `data-volume` | 音量 0.0-1.0 | BGM ≤ 0.2，SFX 0.5-0.8 |
| `src` | 文件路径 | BGM 推荐 .mp3，SFX 推荐 .wav |

### 音频集成检查清单

- [ ] 音频文件已放入 `assets/audio/`
- [ ] `<audio>` 元素在根容器内（与 scene 同级）
- [ ] `data-track-index` ≥ 2（BGM=3，SFX=2）
- [ ] `data-volume` BGM ≤ 0.2，SFX 0.5-0.8
- [ ] `data-start` 与 storyboard scene 时间对齐
- [ ] 音频时长不超过视频总时长

### Timeline 延伸（重要）

如果添加音频，motion.js 末尾必须确保 timeline 覆盖完整时长：

```javascript
// 确保音频不被截断
tl.set({}, {}, STORYBOARD_DURATION);

window.__timelines = window.__timelines || {};
window.__timelines['<project-name>'] = tl;
```

## 流程

### Step 1：读取合同 + 模板选择

读取 storyboard 和 styleframes，理解每个 scene 的完整定义。不猜测，不发明。

**1.1 模板选择**（Checkpoint 0 — 人类确认）

1. 读取 brief 的 `style` 和 `topic` 字段
2. 根据 `templates/TEMPLATE-GUIDE.md` 推荐映射表推断推荐模板
3. 向用户展示推荐 + 所有 4 个模板选项，等待确认或 override
4. 确认后，使用选定模板作为工程起点

**1.2 读取 storyboard**

读取 storyboard 时，特别关注每个 scene 的：
- `content_type`：6 种内容类型之一
- `animation_strategy`：对应 `references/scene-animation-guide.md` 策略词表中的策略名
- `engine_preference`：可选，默认 gsap（advisory per CANON §5）
- `visual_effect`：可选，React-Bits 效果名（参考 `references/react-bits-catalog.md`）
- `effect_justification`：visual_effect 存在时必填（CANON §4）

读取 styleframes 时，特别关注 anime.js 珞略的：
- `animation_intent`：morph/spring/blur 珞略需要额外参数
  - morph_source/morph_target：自然语言形状描述，需翻译为 SVG path
  - spring_stiffness/spring_damping：anime.js spring 参数
  - reveal_timing：per-char | per-word | per-line

### Step 2：初始化工程 + 读取 MANIFEST

**2.1 初始化工程**

基于 Step 1.1 选定的模板，复制模板目录为 `project/`：
- 替换 `PLACEHOLDER_COMPOSITION_ID` 为实际项目名
- 保留模板的 styles.css、motion.js 骨架、storyboard.json 结构

```
project/
  index.html          — 主入口（从模板复制）
  styles.css          — 全局样式（从模板复制）
  motion.js           — GSAP timeline 骨架（从模板复制）
  storyboard.json     — 分镜数据（从模板复制，填充实际 scenes）
  assets/
    images/           — 图片素材
    audio/            — 音频素材（BGM + SFX）
```

anime.js 珞略时添加 `motion-anime.js`。文件分离规则不变。

**2.2 读取 Scene Block MANIFEST**

读取 `references/scene-blocks/MANIFEST.json`，建立 `animation_strategy → block` 映射。

**2.3 CANON §3 Hard Gate — 静态验证先行**

<HARD-GATE>
**先让画面成立，再让画面动起来。**
静态构图不成立的场景，动效也救不回来（CANON §3）。
在进入 Step 3 动画组装之前，必须完成 styleframe 静态验证——确认每个 scene 的静态状态构图成立。
不可跳过此门控直接进入动画组装。
</HARD-GATE>

### Step 3：逐 scene 组装（assemble 模式）

按 storyboard 的顺序，逐个 scene 组装动画代码。优先从 Scene Block Library 查找匹配 block，不从零发明。

**3.1 查找匹配 block**

读取 scene 的 `animation_strategy` → 在 MANIFEST.json 中查找 → 读取对应 block 的 integration guide (.md)。

- 查到匹配 block → 进入 3.2 组装路径
- **未查到匹配 block** → 标注 scene 为 `custom`，走 fallback 路径（从零发明）

**3.2 读 block demo（可选）**

在浏览器中打开 block demo .html 验证动画效果，或加 `?static=true` 模式验证静态构图。

**3.3 在模板项目中写代码**

按 block.md Integration Spec 的代码模板，在 project/ 中写新代码：
- HTML 结构按 spec 的 selector 命名
- CSS 变量使用模板的 `--mc-*` 变量（block 默认值被模板 override）
- GSAP 代码按 spec 的代码模板 + 参数位置
- 项目拥有代码（非复制粘贴 block demo）

**3.4 参数 override**

**快速路径**：CSS 变量 override — 改颜色、字号、间距
```css
:root { --mc-primary: #3b82f6; }  /* override 标题颜色 */
```

**扩展路径**：HTML 结构修改匹配 storyboard — 增减元素、改布局

**3.5 验证结构匹配 storyboard**

确认 scene 的 HTML 结构、动画时长、视觉效果与 storyboard 一致。

---

**Fallback 路径（block 未匹配时）**：

当 MANIFEST.json 中无匹配 block（如 anime.js 策略在 Phase 1 未覆盖），标注 scene 为 `custom`，使用以下旧模式实现：

```javascript
// Fallback: 从零发明动画（仅当 block 未匹配时使用）
// 3.1 HTML 结构 — 每个 scene 一个容器
// 3.2 CSS 样式 — 使用 styleframes 定义的视觉系统
// 3.3 Timeline — 根据 engine_preference 选择引擎
```

根据 `engine_preference` 选择对应引擎：

**GSAP 珞略**（engine_preference: gsap 或默认）：
- 所有动画进入主 GSAP timeline
- 使用 `gsap.timeline()` 管理序列
- 每个 scene 的动画时长匹配 storyboard
- 使用 `references/motion-principles.md` 中的动效标准

**anime.js 珞略**（engine_preference: animejs）：
- anime.js 动画进入 anime.js timeline（`motion-anime.js` 文件）
- GSAP 仍管理 scene 可见性和过渡（GSAP timeline 是主控）
- anime.js timeline 只负责 scene 内的 morph/spring/blur 效果
- 参考 `references/animejs-video-guide.md` 完整规范

**动画策略查找**：读取每个 scene 的 `animation_strategy` 值，在 `references/scene-animation-guide.md` 中查找对应的代码模板和参数范围。不重新发明动画方案——从 Guide 的策略执行。

**Scene label（推荐）**：在每个 scene 动画块前插入 `tl.addLabel('<scene_id>')`，使用 storyboard 中的 scene id（如 `scene_01`）。这允许在 preview 时通过 `tl.time()` 或 label 跳转到特定 scene。

```javascript
const tl = gsap.timeline({ paused: true });

// scene_01: hook (0s - 4s) | strategy: title_reveal → Block: title_reveal
tl.addLabel('scene_01')
  .from('#scene-01 .title', { opacity: 0, y: 30, duration: 1, ease: 'power2.out' })
  .from('#scene-01 .subtitle', { opacity: 0, duration: 0.8 }, '-=0.5')
  // ...

// scene_02: problem (4s - 10s) | strategy: text_highlight → Block: text_highlight
tl.addLabel('scene_02')
  .to('#scene-01', { opacity: 0, duration: 0.5 })
  .from('#scene-02 .problem-text', { opacity: 0, scale: 0.8, duration: 0.8 })
  // ...

// 注册 timeline（HyperFrames 集成）
window.__timelines = window.__timelines || {};
window.__timelines['<project-name>'] = tl;
```

### Step 4：技术指导（motion-engineer）

分派 `agents/motion-engineer.md` 指导：

- scene block 选型建议
- GSAP easing 和 duration 优化
- 性能优化（will-change, transform vs top/left）
- SVG vs Canvas 选型
- 何时使用 PixiJS

### Step 5：Preview 验证

<HARD-GATE>
**每个 scene 实现后必须 preview 验证。**
不累积 5 个 scene 后再一起看。每个 scene 独立验证。
</HARD-GATE>

**Preview 方法：**

**方法 1：浏览器直接打开**
- 用浏览器打开 `project/index.html`
- 在控制台手动播放 timeline：`window.__timelines['<composition-id>'].play()`

**方法 2：单 scene 验证**
- 在控制台跳转到特定 scene 起始时间：`tl.time(<scene-start>).play()`
- scene 起始时间从 `storyboard.json` 获取

**方法 3：截图验证**
- 使用 Playwright MCP 工具截图对比 styleframe
- 暂停 timeline 在关键帧：`tl.pause(<time>)`，然后截图

验证项：
- [ ] scene 结构与 storyboard 一致
- [ ] 视觉效果与 styleframe 一致
- [ ] 动画时长匹配 storyboard
- [ ] 无 JS 错误（打开 DevTools Console 检查）
- [ ] 无缺资源（Network tab 无 404）

### Step 5.5：Duration Gate

<HARD-GATE>
**Timeline 实际时长必须与 storyboard 目标时长匹配，容差 5%。**
超过 5% 偏差必须修复后才能进入 Step 6。
</HARD-GATE>

**验证方法：** 在浏览器控制台执行：

```javascript
const actualDuration = tl.duration();
const targetDuration = <storyboard-total-duration>;
const deviation = Math.abs(actualDuration - targetDuration) / targetDuration * 100;
console.log(`目标: ${targetDuration}s, 实际: ${actualDuration.toFixed(2)}s, 偏差: ${deviation.toFixed(1)}%`);
```

**判断标准：**

| 偏差 | 状态 | 处理 |
|------|------|------|
| 0-5% | PASS | 继续下一步 |
| 5-15% | WARNING | 记录偏差，调整 scene 间 `+=` 延迟值 |
| >15% | BLOCKING | 必须修复 |

**常见修复方式：**
- 偏短 → 增加 scene 间 `+=` 延迟值、增加 ending scene 停留时间
- 偏长 → 减少 scene 间 overlap、缩短非关键动画、或回到 storyboard 缩减 scene

### Step 6：Timeline 集成

所有 scene 通过后，组装完整 timeline：

- 检查 scene 间转场
- **运行 Duration Gate 验证（Step 5.5）**
- 检查整体节奏感
- Preview 完整视频

### Step 7：产出

```markdown
# Web Motion Composition: <视频名称>

## 工程结构
- project/index.html
- project/styles.css
- project/motion.js
- project/storyboard.json
- project/assets/

## Scene 实现清单
- [ ] scene_01: ✅ preview 通过
- [ ] scene_02: ✅ preview 通过
- ...

## Timeline 验证
- total_duration: Xs
- scene_count: X
- 与 storyboard 对齐: ✅

## Motion Engineer 指导采纳
- [具体指导及采纳情况]
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| 视觉效果与 styleframe 不一致 | 调整 CSS/GSAP 参数 |
| 动画时长不匹配 | 调整 GSAP duration |
| JS 错误 | 修复代码，重新 preview |
| 缺资源 | 标注缺失，创建占位或获取资源 |
| 性能问题 | 简化动画，减少同时运动元素 |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "先写完所有 scene 再调" | 一个 scene 的 bug 会让后续全部出错。逐个验证。 |
| "这里可以加点 storyboard 之外的效果" | Storyboard 是合同。不重新发明。 |
| "setTimeout 更简单" | 所有动画必须进入 GSAP timeline。散落 setTimeout = 无法管理。 |
| "用 GSAP 插件解决" | 先用基础 API。插件只在必要时引入。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- 添加 storyboard 之外的 scene
- 动画不进入 GSAP timeline（GSAP 珞略）或 anime.js timeline（anime.js 珞略）
- anime.js timeline 省略 `autoplay: false`
- anime.js timeline 注册到 `window.__timelines`（应注册到 `window.__hfAnime`）
- CSS 和动画引擎双重设置隐藏状态（opacity:0 in CSS + .from({opacity:0})）
- 多个 scene 累积后才做 preview
- 一边想创意一边写代码
- 不查找 MANIFEST.json 中对应 block 直接从零发明（assemble 模式必须先查 block）
- 跳过 CANON §3 静态验证门控直接进入动画组装
- visual_effect 没有 effect_justification（CANON §4 violation）
</HARD-GATE>

## 验证清单

- [ ] 每个 scene 结构来自 storyboard
- [ ] 视觉效果来自 styleframes
- [ ] GSAP 动画在 GSAP timeline 中
- [ ] anime.js 动画在 anime.js timeline 中（anime.js 珞略时）
- [ ] GSAP 注册到 `window.__timelines`
- [ ] anime.js 注册到 `window.__hfAnime`（anime.js 珞略时）
- [ ] 每个 scene 使用了 MANIFEST.json 中映射的 block 作为参考（或标注为 custom）
- [ ] CANON §3 静态验证已完成（styleframe 构图成立）
- [ ] 每个 scene 独立 preview 通过
- [ ] 完整 timeline preview 通过
- [ ] 总时长匹配 brief（Duration Gate 5% tolerance）
- [ ] anime.js spring 使用 stretch() 对齐 storyboard 时长
- [ ] visual_effect 有 effect_justification（CANON §4）
- [ ] 无 JS 错误
- [ ] 无缺资源
