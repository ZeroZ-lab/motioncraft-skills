# line_draw — 路径/线条绘制

> engine: gsap | aliases: flow_build, pipeline_sequence | Pattern: Line Draw

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| duration (path draw) | 0.8s | 1.5s | 1.0s | 路径绘制时长 |
| duration (node appear) | 0.3s | 0.5s | 0.4s | 节点出现时长 |
| stagger (nodes) | 0.2s | 0.3s | 0.25s | 节点出现间隔 |
| easing (path) | power1.inOut | power2.inOut | power1.inOut | 路径绘制缓动 |
| easing (nodes) | back.out(1.5) | back.out(2.0) | back.out(1.7) | 节点入场缓动 |
| scale (node appear) | 0.3 | 0.7 | 0.5 | 节点初始缩放 |

## Integration Spec

### HTML 结构规范

```html
<svg class="flow-diagram" viewBox="0 0 WIDTH HEIGHT" xmlns="http://www.w3.org/2000/svg">
  <!-- Start node -->
  <circle class="flow-node" cx="X" cy="Y" r="RADIUS" />

  <!-- Flow path (curved or straight) -->
  <path class="flow-path" d="M ... C ... " />

  <!-- End node -->
  <circle class="flow-node" cx="X" cy="Y" r="RADIUS" />
</svg>
```

- `.flow-path` — SVG path 元素，stroke-dashoffset 技术实现绘制动画
- `.flow-node` — SVG circle/rect 元素，代表流程节点（起点/终点/中间点）
- 节点 label 可用 `<text class="node-label">` 标注

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-primary | #00ff88 | 路径颜色（stroke），模板可 override 为品牌色 |
| --mc-accent | #00cc6a | 节点填充色（fill） |
| --mc-text | #e0e0e0 | 节点 label 文字颜色 |
| --mc-duration-default | 1.0 | 路径绘制时长（秒） |
| --mc-easing-default | power1.inOut | 路径绘制缓动 |
| --mc-font-secondary | 'JetBrains Mono' | label 字体 |

### GSAP 代码模板（strokeDashoffset 技术，免费）

```javascript
// line_draw — 标准用法（CSS stroke-dashoffset，免费替代 drawSVG）
// Step 1: 计算路径长度并设置初始隐藏状态
const flowPaths = document.querySelectorAll('.flow-path');
const pathLengths = [];
flowPaths.forEach(function(path) {
  var len = path.getTotalLength();
  pathLengths.push(len);
  // 设置 dasharray 和 dashoffset 为路径长度 → 路径完全隐藏
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
});

const tl = gsap.timeline({ paused: true });

// Step 2: 节点出现（opacity + scale，stagger 间隔）
tl.from('.flow-node', {
  opacity: 0,
  scale: /* PARAM: scale_node, default 0.5 */,
  duration: /* PARAM: duration_node, default 0.4 */,
  stagger: /* PARAM: stagger_node, default 0.25 */,
  ease: /* PARAM: easing_node, default 'back.out(1.7)' */
})
// Step 3: 路径从起点绘制到终点
// strokeDashoffset: pathLength → 0（路径从隐藏到完全可见）
.from('.flow-path', {
  strokeDashoffset: function(i) { return pathLengths[i]; },
  duration: /* PARAM: duration_path, default 1.0 */,
  ease: /* PARAM: easing_path, default 'power1.inOut' */
}, '-=0.1');

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

### drawSVG 付费升级说明

GSAP DrawSVGPlugin (`drawSVG: 0`) 是付费插件（$25/mo），提供更精确的路径绘制控制：
- 可按百分比控制进度（`drawSVG: "0% 50%"` 绘制前半段）
- 可同时控制多个 path 的独立进度
- 支持形状（rect/circle/polygon）的边缘绘制，不只是 path

**CSS stroke-dashoffset 覆盖 80%+ 场景**，免费且功能足够：
- 单路径从起点到终点绘制 ✓
- 多路径依次绘制 ✓
- 节点 + 连线组合动画 ✓

**仅以下场景需要 drawSVG**：
- 需要精确控制"绘制到 30% 然后暂停再继续"
- 需要在同一个 path 上同时显示已绘制和未绘制部分
- 需要对 SVG 形状（rect/circle）做边缘描边动画

选择建议：先用 stroke-dashoffset，只有 storyboard 明确要求分段控制时才升级到 drawSVG。

### Alias: flow_build

**flow_build** = Diagram Build + Line Draw 组合。

**差异点**：节点先批量出现，再依次绘制连接线。

| 参数 | line_draw | flow_build |
|------|-----------|------------|
| node stagger | 0.25s | **0.25s**（所有节点先出现） |
| path stagger | 无（单路径） | **0.2s**（多连接线依次绘制） |
| 节点入场 | opacity+scale | **opacity+scale** |
| 连接线入场 | strokeDashoffset | **strokeDashoffset + stagger 0.2s** |

**flow_build 代码模板**：
```javascript
// nodes appear first (stagger 0.25s, opacity + scale)
tl.from('.flow-node', {
  opacity: 0, scale: 0.5, duration: 0.4,
  stagger: 0.25, ease: 'back.out(1.7)'
})
// then connectors draw (stagger 0.2s, strokeDashoffset)
.from('.flow-path', {
  strokeDashoffset: function(i) { return pathLengths[i]; },
  duration: 1.0,
  stagger: 0.2, ease: 'power1.inOut'
}, '-=0.1');
```

### Alias: pipeline_sequence

**pipeline_sequence** = 步骤方框按顺序出现 + 箭头在步骤间绘制。

**必需 HTML 结构**：
```html
<div class="pipeline-container">
  <div class="pipeline-step">Step 1</div>
  <svg class="step-arrow" viewBox="0 0 60 20">
    <path class="flow-path" d="M 10 10 L 50 10" />
  </svg>
  <div class="pipeline-step">Step 2</div>
  <svg class="step-arrow" viewBox="0 0 60 20">
    <path class="flow-path" d="M 10 10 L 50 10" />
  </svg>
  <div class="pipeline-step">Step 3</div>
</div>
```

| 参数 | line_draw | pipeline_sequence |
|------|-----------|-------------------|
| 元素类型 | SVG 节点 + 路径 | **HTML 步骤框 + SVG 箭头** |
| step stagger | 无 | **0.6s**（每个步骤 0.4s） |
| arrow draw | 单路径 | **步骤间箭头依次绘制** |

**pipeline_sequence 代码模板**：
```javascript
// steps appear in sequence (stagger 0.6s, each 0.4s)
tl.from('.pipeline-step', {
  opacity: 0, y: 20, duration: 0.4,
  stagger: 0.6, ease: 'power2.out'
})
// arrows draw between steps (stagger 0.3s)
.from('.step-arrow .flow-path', {
  strokeDashoffset: function(i) { return pathLengths[i]; },
  duration: 0.6,
  stagger: 0.3, ease: 'power1.inOut'
}, '-=0.3');
```

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改路径颜色、宽度
```css
:root {
  --mc-primary: #3b82f6;    /* override 路径颜色 */
}
.flow-path {
  stroke-width: 3;           /* override 路径宽度 */
}
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 多路径（多条 `.flow-path` 依次绘制）
- 分叉/汇聚流程（路径从一个节点分叉到多个节点）
- 中间节点（3+ 个 `.flow-node`，stagger 控制出现节奏）
- 方向箭头（在 path 末端添加 arrowhead marker）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 使用 `drawSVG: 0`（GSAP DrawSVGPlugin）以为免费 | drawSVG 是付费插件 $25/mo；用 CSS strokeDashoffset 代替（免费，覆盖 80%+ 场景） |
| CSS `.flow-path { strokeDasharray: 9999 }` 然后 GSAP 也写 `strokeDashoffset: 9999` | JS 必须先用 `path.getTotalLength()` 计算真实长度，设置 dasharray/dashoffset 为真实值，再 animate 到 0 |
| 路径绘制速度不一致（短路径和长路径同 duration） | 根据路径长度调整 duration：长路径更长时长，或统一速度（duration = pathLength / speed） |
| 节点和路径同时动画 | 先节点出现（stagger 0.25s），再路径绘制（overlap -0.1s） |
| 没有 direction arrows（方向不明） | 在 path 末端添加 SVG arrowhead `<marker>` 或三角形节点 |
| strokeDashoffset 设为固定值而非 getTotalLength() | 必须用 `getTotalLength()` 动态计算，不同路径长度不同 |
| CSS 定义 `opacity: 0` + GSAP `.from({opacity:0})` | CSS 定义最终可见状态（strokeDashoffset: 0），JS 初始化隐藏状态 |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
|----------------|-----------|------|
| animation_strategy: line_draw | 使用 line_draw block | 直接匹配 |
| animation_strategy: flow_build | 使用 line_draw block + flow_build alias | 别名匹配 |
| animation_strategy: pipeline_sequence | 使用 line_draw block + pipeline_sequence alias | 别名匹配 |
| content_type: process | --mc-primary 用于路径，--mc-accent 用于节点 | 流程型配色 |
| duration | duration_path + duration_node + stagger + overlap | 总时长 ≈ node_duration + node_stagger + path_duration |