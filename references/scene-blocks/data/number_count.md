# number_count — 数字计数动画

> engine: gsap | aliases: data_dashboard | Pattern: P4 Number Count

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| duration (count) | 1.0s | 2.0s | 1.5s | 数字计数时长（快节奏 → 1.0s，讲解节奏 → 2.0s） |
| duration (label) | 0.3s | 0.5s | 0.4s | 标签淡入时长 |
| easing (count) | power1.out | power2.out | power1.out | 先快后慢，符合"越来越接近目标"的心理预期 |
| easing (label) | power2.out | power2.out | power2.out | 标签入场缓动 |
| hold after count | 0.5s | 1.0s | 0.5s | 计数完成后停留时间（强制 ≥ 0.5s） |
| overlap (label→count) | 0.1s | 0.3s | 0.1s | 标签与计数动画时间差 |
| format | locale | comma | unit | locale | 数字格式化方式 |

## Integration Spec

### HTML 结构规范

```html
<div class="scene" id="scene-N">
  <div class="metric">
    <div class="metric-label">月活用户</div>
    <div class="metric-number">12,847</div>
    <div class="metric-unit">人</div>
  </div>
</div>
```

- `.metric` — 指标容器，flex column 居中
- `.metric-label` — 指标标签，说明数字含义（font-weight: 400, muted color）
- `.metric-number` — 数字元素，font-weight: 700，monospace 字体（JetBrains Mono），HTML 中显示格式化后的目标值
- `.metric-unit` — 单位元素，可选（如"人"、"%"、"万"）

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-primary | #00ff88 | 数字强调色，模板可 override 为品牌色 |
| --mc-text-muted | #6b6b7b | 标签与单位颜色 |
| --mc-font-secondary | 'JetBrains Mono', monospace | 数字 monospace 字体 |
| --mc-heading-size | 2.5rem | 数字字号 |
| --mc-body-size | 1rem | 标签字号 |
| --mc-duration-default | 1.5 | 计数动画时长（秒） |
| --mc-easing-default | power1.out | 计数缓动 |
| --mc-spacing-sm | 0.5rem | 元素间距 |

### GSAP 代码模板

```javascript
// number_count — 标准用法
// Strategy: counter {value: 0} → target, onUpdate formats with locale string
const counter = { value: 0 };
const targetValue = /* PARAM: target, e.g. 12847 */;
const numberEl = document.querySelector('.metric-number');

const tl = gsap.timeline({ paused: true });

// Phase 1: label fades in
tl.from('.metric-label', {
  opacity: 0,
  y: /* PARAM: y_offset_label, default 10 */,
  duration: /* PARAM: duration_label, default 0.4 */,
  ease: /* PARAM: easing_label, default 'power2.out' */
});

// Phase 2: number counts from 0 to target
tl.to(counter, {
  value: targetValue,
  duration: /* PARAM: duration_count, default 1.5 */,
  ease: /* PARAM: easing_count, default 'power1.out' */,
  onUpdate: () => {
    numberEl.textContent = Math.round(counter.value).toLocaleString();
  }
}, '-=/* PARAM: overlap, default 0.1 */');

// Hold ≥ 0.5s after count completes (mandatory data dwell rule)
tl.to({}, { duration: /* PARAM: hold, default 0.5 */ });

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

### 格式化选项

| format 值 | onUpdate 实现 | 示例 |
|-----------|-------------|------|
| locale | `Math.round(counter.value).toLocaleString()` | 12,847 |
| comma | `Math.round(counter.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')` | 12,847 |
| unit | `Math.round(counter.value / 10000).toFixed(1) + '万'` | 1.3万 |
| percent | `counter.value.toFixed(1) + '%'` | 99.9% |

### Alias: data_dashboard

**差异点**：data_dashboard 是 number_count 的多指标组合别名（stagger cards + number count）。

| 参数 | number_count | data_dashboard |
|------|-------------|----------------|
| 指标数量 | 1 | 3-5（最多 5） |
| 卡片入场 | 无 | `.metric-card` stagger（Phase 1） |
| 计数启动 | label 出现后立即 | 每张卡片入场后启动（Phase 2） |
| 总 duration | 2.0-2.5s | 2.0-3.5s |
| easing (cards) | 无 | power2.out |
| easing (count) | power1.out | power1.out |

**data_dashboard 组合模式**：

Phase 1 — 卡片 stagger 入场（0.5s/卡片, stagger 0.15s）
Phase 2 — 每个数字在卡片入场后开始计数

**Required HTML**：
```html
<div class="scene" id="scene-N">
  <div class="metric-card">
    <div class="metric-label">月活用户</div>
    <div class="metric-number">12,847</div>
    <div class="metric-unit">人</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">可用率</div>
    <div class="metric-number">99.9</div>
    <div class="metric-unit">%</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">响应时间</div>
    <div class="metric-number">3.2</div>
    <div class="metric-unit">ms</div>
  </div>
</div>
```

- `.metric-card` — 卡片容器，每张卡片包含 `.metric-label` + `.metric-number` + `.metric-unit`
- 多张 `.metric-card` 使用 grid 或 flex 排列

**data_dashboard 代码模板**：
```javascript
// data_dashboard — 多指标仪表盘
const tl = gsap.timeline({ paused: true });

// Phase 1: cards stagger in
tl.from('.metric-card', {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: 0.15,
  ease: 'power2.out'
});

// Phase 2: each number starts counting after card entry
const numberEls = document.querySelectorAll('.metric-number');
const targets = [12847, 99.9, 3.2, 156]; // up to 5 targets

numberEls.forEach((el, i) => {
  if (i >= targets.length) return;
  const counter = { value: 0 };
  tl.to(counter, {
    value: targets[i],
    duration: 1.2,
    ease: 'power1.out',
    onUpdate: () => {
      el.textContent = formatMetric(counter.value, i);
    }
  }, i < 1 ? '-=0.3' : '-=0.9');
});

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

**formatMetric 辅助函数**：
```javascript
function formatMetric(value, index) {
  // 根据指标类型选择格式
  if (value >= 10000) return Math.round(value).toLocaleString();
  if (value < 100 && value !== Math.round(value)) return value.toFixed(1);
  return Math.round(value).toLocaleString();
}
```

**Combined duration 计算**：
- Phase 1: 0.5s * card_count + 0.15s * (card_count - 1)
- Phase 2: 每个计数 1.0-1.5s，overlap 约 0.9s
- 总 duration: 2.0-3.5s（3-5 个指标）

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改数字字号、强调色、间距
```css
:root {
  --mc-primary: #3b82f6;      /* override 数字强调色 */
  --mc-heading-size: 3.5rem;  /* override 数字字号 */
  --mc-font-secondary: 'JetBrains Mono', monospace; /* 保持 monospace */
}
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 添加 `.metric-unit` 单位标注（百分比、万人等）
- 添加 `.metric-trend` 趋势箭头（上升/下降指示）
- 添加 `.metric-card` 卡片布局实现 data_dashboard 别名
- 多指标 grid 布局（2x2 / 3x1 等排列方式）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 计数 duration < 0.8s | 总计数 duration ≥ 1.0s，让观众感知数字变化过程 |
| 数字没有格式化 | 大数字用 toLocaleString() 加千分位，或加单位（如 1.2万） |
| 只有数字没有标签 | 必须加 `.metric-label` 说明数字含义 |
| CSS 设置数字为 0 + GSAP .from({textContent: '0'}) | CSS 定义最终可见状态（显示格式化目标值），GSAP 用 counter {value: 0} + onUpdate 动画 |
| data_dashboard 中卡片和数字同时开始 | 先卡片入场（Phase 1），后数字计数（Phase 2） |
| data_dashboard 超过 5 个指标 | 最多 5 个指标，超过则分批或拆 scene |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
|----------------|-----------|------|
| animation_strategy: number_count | 使用 number_count block | 直接匹配 |
| animation_strategy: data_dashboard | 使用 number_count block + data_dashboard alias | 别名匹配 |
| content_type: data | --mc-primary, --mc-font-secondary | 数据型配色 |
| duration | duration_label + overlap + duration_count + hold | 总时长 = label + overlap + count + hold |
| visual 中的 target 值 | targetValue 参数 | 计数目标值 |
| visual 中的 format 类型 | format 参数 (locale/comma/unit/percent) | 数字格式化方式 |