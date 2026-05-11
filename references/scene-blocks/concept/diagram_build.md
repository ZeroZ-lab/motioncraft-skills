# diagram_build — 架构图逐步构建

> engine: gsap | aliases: concept_layers, card_stack | Pattern: P5 Diagram Build

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| duration (layer) | 0.4s | 0.6s | 0.5s | 每层出现时长 |
| duration (connection) | 0.6s | 1.0s | 0.8s | 连接线绘制时长 |
| overlap (layer→layer) | 0.2s | 0.3s | 0.25s | 层间时间差 |
| overlap (layer→connection) | 0.2s | 0.3s | 0.25s | 层与连接线时间差 |
| y offset (layer) | 15px | 30px | 20px | 层上移偏移 |
| easing | power1.inOut | power2.inOut | power1.inOut | 平滑过渡 |

## Integration Spec

### HTML 结构规范

```html
<div class="scene" id="scene-N">
  <!-- 层级元素 -->
  <div class="layer-1">顶层标签</div>

  <!-- SVG 连接线 -->
  <svg class="connections-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet">
    <path class="connection-1" d="M960 360 L960 460" stroke-linecap="round"/>
    <path class="connection-2" d="M960 540 L960 640" stroke-linecap="round"/>
  </svg>

  <div class="layer-2">中间层标签</div>
  <div class="layer-3">底层标签</div>
</div>
```

- `.layer-N` — 每层架构/概念元素，最多 3-4 层
- `.connection-N` — SVG path 连接线，连接相邻层
- `.connections-svg` — SVG 容器，absolute 定位覆盖全 scene

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-primary | #00ff88 | 层高亮色（border + text），模板可 override 为品牌色 |
| --mc-border | #2a2a3a | 连接线颜色，stroke 属性引用 |
| --mc-bg-alt | #1a1a2e | 层背景色 |
| --mc-text | #e0e0e0 | 层内辅助文字颜色 |
| --mc-font-secondary | 'JetBrains Mono', monospace | 层标签字体 |
| --mc-body-size | 1rem | 层标签字号 |
| --mc-spacing-md | 1rem | 层内 padding 间距 |
| --mc-spacing-lg | 2rem | 层内水平 padding |
| --mc-duration-default | 0.5 | 每层动画时长（秒） |
| --mc-easing-default | power1.inOut | 入场缓动 |

### GSAP 代码模板

**重要：连接线绘制使用 CSS stroke-dashoffset 技术，不使用 drawSVG。**

drawSVG 是 GSAP MorphSVG 插件的付费功能。CSS stroke-dashoffset 覆盖 80%+ 场景免费可用。drawSVG 仅在有精确路径控制需求时作为可选付费升级。

```javascript
// diagram_build — 标准用法（CSS stroke-dashoffset 线条绘制）
const tl = gsap.timeline({ paused: true });

// 1. 初始化连接线：计算每条 path 总长度，设置 stroke-dasharray 和 stroke-dashoffset
const connPaths = document.querySelectorAll('.connection-1, .connection-2');
connPaths.forEach(path => {
  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength; // 隐藏线条
});

// 2. 逐层构建 + 连接线绘制
tl.from('.layer-1', {
  opacity: 0,
  y: /* PARAM: y_offset, default 20 */,
  duration: /* PARAM: duration_layer, default 0.5 */,
  ease: /* PARAM: easing, default 'power1.inOut' */
})
.from('.layer-2', {
  opacity: 0, y: 20, duration: 0.5, ease: 'power1.inOut'
}, '-=/* PARAM: overlap, default 0.25 */')
// 连接线 1 绘制（stroke-dashoffset 从 pathLength → 0）
.to('.connection-1', {
  strokeDashoffset: 0,
  duration: /* PARAM: duration_connection, default 0.8 */,
  ease: /* PARAM: easing, default 'power1.inOut' */
}, '-=/* PARAM: overlap, default 0.25 */')
.from('.layer-3', {
  opacity: 0, y: 20, duration: 0.5, ease: 'power1.inOut'
}, '-=0.25')
// 连接线 2 绘制（stroke-dashoffset 从 pathLength → 0）
.to('.connection-2', {
  strokeDashoffset: 0,
  duration: 0.8, ease: 'power1.inOut'
}, '-=0.25');

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

> **Note**: drawSVG (`gsap.from('.connection-N', { drawSVG: 0 })`) 是付费 GSAP 插件（MorphSVG）。CSS stroke-dashoffset 覆盖 80%+ 线条绘制场景，免费可用。仅在有精确路径分段控制、路径方向反转等高级需求时，drawSVG 才是必要的付费升级。

### Alias: concept_layers

**差异点**：concept_layers 是 diagram_build 的叠加变体——层从上往下叠加，而非从下往上构建。

| 参数 | diagram_build | concept_layers |
|------|--------------|----------------|
| 方向 | 从上往下逐层构建 | 从上往下叠加展示 |
| opacity | 0 → 1 | **0 → 0.85-1.0**（层间透明度区分） |
| y offset | 固定 20px | **每层递增**：20 + i*5 px |
| 连接线 | 有（连接相邻层） | **可选**（纯叠加不需要连接线） |
| 最大层数 | 3 层 | **3-4 层** |
| easing | power1.inOut | **power2.out**（叠加减速感） |

**concept_layers 代码模板**：
```javascript
// concept_layers — 层叠加展示
const tl = gsap.timeline({ paused: true });
const layers = document.querySelectorAll('.concept-layer');

layers.forEach((layer, i) => {
  tl.from(layer, {
    opacity: 0,
    y: 20 + i * 5,
    duration: 0.5,
    ease: 'power2.out'
  }, i > 0 ? '-=0.25' : 0);
});
```

### Alias: card_stack

**差异点**：card_stack 是 diagram_build 的堆叠变体——卡片以微小 y 偏移 + rotation 堆叠，而非正对排列。

| 参数 | diagram_build | card_stack |
|------|--------------|------------|
| 方向 | 正对排列 | **堆叠**（卡片轻微错位） |
| y offset | 20px（入场） | **8-15px**（堆叠偏移，入场后） |
| rotation | 无 | **1-3deg**（堆叠旋转） |
| 连接线 | 有 | **无**（卡片堆叠不需要连接线） |
| 最大卡片 | 3 层 | **3-4 张** |
| easing | power1.inOut | **power2.out** |

**card_stack 代码模板**：
```javascript
// card_stack — 卡片堆叠分类
const cards = document.querySelectorAll('.stack-card');
const tl = gsap.timeline({ paused: true });

cards.forEach((card, i) => {
  tl.to(card, {
    y: i * 12,
    rotation: (i - 1) * 2,
    duration: 0.6,
    ease: 'power2.out'
  }, i > 0 ? '-=0.3' : 0);
});
```

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改颜色、间距、字号
```css
:root {
  --mc-primary: #3b82f6;    /* override 层高亮色 */
  --mc-border: #4a4a5a;     /* override 连接线颜色 */
  --mc-bg-alt: #252540;     /* override 层背景色 */
}
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 增加第 4 层（`.layer-4`）及对应连接线（`.connection-3`）
- 改连接线路径形状（曲线代替直线：`d="M960 360 Q960 410 960 460"`）
- 改层级布局（左右而非上下：flex-direction: row）
- 添加层内图标/标签（`<span class="layer-icon">...</span>`）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 所有层同时出现 | 逐层构建，每层 overlap 0.2-0.3s |
| 层间没有 overlap | 层间 overlap 0.2-0.3s 保持节奏流畅 |
| 连接线与层同时出现 | 先层出现，后连接线绘制（因果逻辑） |
| 使用 drawSVG 插制连接线 | 使用 CSS stroke-dashoffset（免费覆盖 80%+ 场景） |
| CSS 设置 opacity:0 + GSAP .from({opacity:0}) | CSS 定义最终可见状态，GSAP animate FROM hidden |
| SVG path 未初始化 strokeDasharray/dashoffset | 必须先 path.getTotalLength() 设置初始值隐藏线条 |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
|----------------|-----------|------|
| animation_strategy: diagram_build | 使用 diagram_build block | 直接匹配 |
| animation_strategy: concept_layers | 使用 diagram_build block + concept_layers alias | 别名匹配 |
| animation_strategy: card_stack | 使用 diagram_build block + card_stack alias | 别名匹配 |
| content_type: concept | --mc-primary / --mc-border 系列变量 | 概念型配色 |
| duration | duration_layer + duration_connection + overlap 参数 | 总时长 = 各层 + 连接线 - overlap |
| visual (架构图) | `.layer-N` + `.connection-N` SVG paths | 视觉元素映射 |