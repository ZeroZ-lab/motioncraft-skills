# stagger_compare — A/B 卡片依次出现对比

> engine: gsap | aliases: grid_swap, before_after | 用途: A/B 卡片依次出现对比

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| card duration | 0.4s | 0.6s | 0.5s | 每卡片出现时长 |
| stagger | 0.12s | 0.18s | 0.15s | 卡片间错开时间 |
| x offset (A-side) | -15px | -30px | -20px | A 侧卡片从左偏移 |
| x offset (B-side) | 15px | 30px | 20px | B 侧卡片从右偏移 |
| max items per side | 5 | 7 | 5 | 每侧最多卡片数 |
| overlap (A→B) | 0.4s | 0.8s | 0.6s | A/B 侧时间差 |
| easing | power2.out | power3.out | power2.out | 减速入场 |

## Integration Spec

### HTML 结构规范

```html
<div class="scene" id="scene-N">
  <div class="compare-row">
    <div class="compare-a">
      <div class="compare-label">方案 A</div>
      <div class="card">对比项 1</div>
      <div class="card">对比项 2</div>
      <!-- max 5-7 cards -->
    </div>
    <div class="compare-b">
      <div class="compare-label">方案 B</div>
      <div class="card">对比项 1</div>
      <div class="card">对比项 2</div>
      <!-- max 5-7 cards -->
    </div>
  </div>
</div>
```

- `.compare-a` — A 侧容器（左列），accent 使用 --mc-primary
- `.compare-b` — B 侧容器（右列），accent 使用 --mc-accent
- `.card` — 对比卡片，border-left 区分 A/B 侧
- `.compare-label` — 侧标签（方案 A / 方案 B）

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-primary | #00ff88 | A 侧 accent 颜色（标签 + border-left） |
| --mc-accent | #ff6b35 | B 侧 accent 颜色（标签 + border-left） |
| --mc-bg-alt | #1a1a2e | 卡片背景色 |
| --mc-border | #2a2a3a | 卡片边框色 |
| --mc-text | #e0e0e0 | 卡片文字颜色 |
| --mc-text-muted | #6b6b7b | 辅助文字颜色 |
| --mc-font-primary | 'Inter', sans-serif | 卡片字体 |
| --mc-font-secondary | 'JetBrains Mono', monospace | 标签字体 |
| --mc-body-size | 1rem | 卡片字号 |
| --mc-spacing-sm | 0.5rem | 卡片间间距 |
| --mc-spacing-md | 1rem | 标签下方间距 |
| --mc-spacing-lg | 2rem | 两列间距 + 容器 padding |
| --mc-duration-default | 0.5 | 卡片动画时长（秒） |
| --mc-easing-default | power2.out | 入场缓动 |

### GSAP 代码模板

```javascript
// stagger_compare — 标准用法
const tl = gsap.timeline({ paused: true });

// A-side cards stagger from left
tl.from('.compare-a .card', {
  opacity: 0,
  x: /* PARAM: x_offset_a, default -20 */,
  duration: /* PARAM: card_duration, default 0.5 */,
  stagger: /* PARAM: stagger, default 0.15 */,
  ease: /* PARAM: easing, default 'power2.out' */
})
// B-side cards stagger from right, overlapping with A
.from('.compare-b .card', {
  opacity: 0,
  x: /* PARAM: x_offset_b, default 20 */,
  duration: /* PARAM: card_duration, default 0.5 */,
  stagger: /* PARAM: stagger, default 0.15 */,
  ease: /* PARAM: easing, default 'power2.out' */
}, '-=/* PARAM: overlap, default 0.6 */');

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

### Alias: grid_swap

**差异点**：grid_swap 是 stagger_compare 在布局切换场景的别名——grid items 先退出 A 布局，再以 B 布局进入。

| 参数 | stagger_compare | grid_swap |
|------|----------------|-----------|
| 入场方式 | from x offset | **scale + opacity** |
| A-side 行为 | stagger in | **exit（opacity+scale down）** |
| B-side 行为 | stagger in | **enter after layout switch** |
| exit duration | 无 | 0.2-0.4s |
| enter duration | 0.4-0.6s | 0.3-0.5s |
| stagger | 0.15s | 0.03-0.08s（更密集） |
| easing (exit) | 无 | **power2.in**（加速退场） |
| easing (enter) | power2.out | power2.out |

**grid_swap 代码模板**：
```javascript
// grid_swap — 布局切换
const tl = gsap.timeline({ paused: true });

// Phase 1: A-side grid items exit (opacity+scale down)
tl.to('.compare-a .card', {
  opacity: 0,
  scale: 0.85,
  duration: /* PARAM: exit_duration, 0.2-0.4, default 0.3 */,
  stagger: /* PARAM: exit_stagger, 0.03-0.08, default 0.05 */,
  ease: 'power2.in'
})
// Phase 2: Layout switch (optional background shift)
.to('.compare-row', {
  duration: 0.1 // layout reflow gap
})
// Phase 3: B-side grid items enter (opacity+scale up)
.from('.compare-b .card', {
  opacity: 0,
  scale: 0.85,
  duration: /* PARAM: enter_duration, 0.3-0.5, default 0.4 */,
  stagger: /* PARAM: enter_stagger, 0.03-0.08, default 0.05 */,
  ease: 'power2.out'
});

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

### Alias: before_after

**差异点**：before_after 是 stagger_compare 在状态对比场景的别名——状态 A 整体变形为状态 B（不逐卡片 stagger，而是整组 opacity swap + scale）。

| 参数 | stagger_compare | before_after |
|------|----------------|-------------|
| 动画方式 | 逐卡片 stagger | **整组 opacity swap + scale morph** |
| A-side 行为 | stagger in | **整体淡出 + 缩小** |
| B-side 行为 | stagger in | **整体淡入 + 放大** |
| label 行为 | 静态显示 | **before label 消失 → after label 出现** |
| 总 duration | 2-4s | 0.6-1.0s（整体过渡更短） |
| easing | power2.out | power2.inOut（双向过渡） |

**before_after 代码模板**：
```javascript
// before_after — 状态 A 变形为状态 B
const tl = gsap.timeline({ paused: true });

// Phase 1: "before" label fades out
tl.to('.compare-a .compare-label', {
  opacity: 0,
  duration: /* PARAM: label_duration, default 0.3 */,
  ease: 'power2.in'
})
// Phase 2: A-side content fades + scales down
.to('.compare-a .card', {
  opacity: 0,
  scale: 0.9,
  duration: /* PARAM: morph_duration, 0.6-1.0, default 0.8 */,
  ease: 'power2.inOut'
})
// Phase 3: B-side content fades in + scales up
.from('.compare-b .card', {
  opacity: 0,
  scale: 0.9,
  duration: /* PARAM: morph_duration, 0.6-1.0, default 0.8 */,
  ease: 'power2.inOut'
}, '-=0.4')
// Phase 4: "after" label appears
.from('.compare-b .compare-label', {
  opacity: 0,
  duration: /* PARAM: label_duration, default 0.3 */,
  ease: 'power2.out'
}, '-=0.5');

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改 A/B 侧 accent 颜色、卡片间距、字号
```css
:root {
  --mc-primary: #3b82f6;   /* override A-side accent */
  --mc-accent: #ef4444;    /* override B-side accent */
  --mc-spacing-sm: 0.75rem; /* override 卡片间距 */
}
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 添加 `.compare-label` 前的图标元素（如勾/叉标记）
- 添加 `.card` 内的子指标（如数字、百分比）
- 添加底部 `.compare-summary` 汇总行
- 添加中轴分隔线 `.divider` 元素

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| A/B 两侧卡片同时出现（无错开） | A 侧先 stagger in，B 侧 overlap 0.4-0.8s 后 stagger in |
| 每侧超过 7 张卡片 | 控制每侧 5-7 张，超出则合并或分组 |
| CSS 设置 opacity:0 + GSAP .from({opacity:0}) | CSS 定义最终可见状态 (opacity:1, transform:none)，GSAP animate FROM hidden |
| grid_swap exit 和 enter 之间无间隔 | exit→enter 之间留 0.1s layout reflow gap |
| before_after label 和 content 同时消失 | 先 label 消失 (0.3s)，再 content morph (0.6-1.0s) |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
|----------------|-----------|------|
| animation_strategy: stagger_compare | 使用 stagger_compare block | 直接匹配 |
| animation_strategy: grid_swap | 使用 stagger_compare block + grid_swap alias | 别名匹配 |
| animation_strategy: before_after | 使用 stagger_compare block + before_after alias | 别名匹配 |
| content_type: comparison | --mc-primary (A) + --mc-accent (B) | 对比型配色 |
| duration | card_duration + stagger + overlap | A 侧总时长 ≈ card_duration * items + stagger * (items-1) |
| items_per_side | max 5-7 卡片 | storyboard 中对比项数量 |