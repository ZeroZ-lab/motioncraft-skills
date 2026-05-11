# title_reveal — 标题/大字出现

> engine: gsap | aliases: text_ending | Pattern: P1 Title Reveal

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| duration (title) | 0.6s | 1.0s | 0.8s | 标题出现时长 |
| duration (subtitle) | 0.4s | 0.6s | 0.5s | 副标题出现时长 |
| y offset (title) | 20px | 40px | 30px | 标题上移偏移 |
| y offset (subtitle) | 10px | 20px | 15px | 副标题上移偏移 |
| overlap (title→subtitle) | 0.2s | 0.4s | 0.3s | 标题与副标题时间差 |
| hold after reveal | 0.5s | 1.0s | 0.5s | 出现后停留时间（强制 ≥ 0.5s） |
| easing | power2.out | power3.out | power2.out | 减速入场 |

## Integration Spec

### HTML 结构规范

```html
<div class="scene" id="scene-N">
  <div class="title">标题文字</div>
  <div class="subtitle">副标题/说明文字</div>
</div>
```

- `.title` — 主标题元素，font-weight: 700
- `.subtitle` — 副标题元素，可选

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-primary | #00ff88 | 标题颜色，模板可 override 为品牌色 |
| --mc-text-muted | #6b6b7b | 副标题颜色 |
| --mc-heading-size | 2.5rem | 标题字号 |
| --mc-body-size | 1rem | 副标题字号 |
| --mc-duration-default | 0.8 | 动画时长（秒） |
| --mc-easing-default | power2.out | 入场缓动 |
| --mc-spacing-md | 1rem | 标题与副标题间距 |

### GSAP 代码模板

```javascript
// title_reveal — 标准用法
const tl = gsap.timeline({ paused: true });

tl.from('.title', {
  opacity: 0,
  y: /* PARAM: y_offset_title, default 30 */,
  duration: /* PARAM: duration_title, default 0.8 */,
  ease: /* PARAM: easing, default 'power2.out' */
})
.from('.subtitle', {
  opacity: 0,
  y: /* PARAM: y_offset_subtitle, default 15 */,
  duration: /* PARAM: duration_subtitle, default 0.5 */,
  ease: /* PARAM: easing, default 'power2.out' */
}, '-=/* PARAM: overlap, default 0.3 */')
// Hold ≥ 0.5s after reveal (mandatory)
.to({}, { duration: /* PARAM: hold, default 0.5 */ });

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

### Alias: text_ending

**差异点**：text_ending 是 title_reveal 在结尾场景的别名。

| 参数 | title_reveal | text_ending |
|------|-------------|------------|
| easing | power2.out | **back.out(1.5)**（CTA 弹性出场） |
| scale (CTA) | 无 | **0.9 → 1.0**（CTA 按钮弹性） |
| hold | 0.5s | **1.0s**（结尾停留更久） |
| CTA 元素 | 无 | `.cta-button`（额外弹性元素） |

**text_ending 代码模板**：
```javascript
tl.from('.ending-title', {
  opacity: 0, y: 20, duration: 0.7, ease: 'power2.out'
})
.from('.cta-button', {
  opacity: 0, scale: 0.9, duration: 0.5, ease: 'back.out(1.5)'
}, '-=0.2')
.to({}, { duration: 1.0 });
```

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改颜色、字号、间距、时长
```css
:root {
  --mc-primary: #3b82f6;   /* override 标题颜色 */
  --mc-heading-size: 3rem; /* override 标题字号 */
}
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 添加第三行文字（如日期/作者）
- 添加背景装饰元素（如渐变光晕）
- 添加 logo 元素（品牌结尾场景）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 标题和副标题同时出现 | 先标题后副标题，错开 0.2-0.3s |
| 出现后立即开始下一个动画 | hold ≥ 0.5s 让观众阅读 |
| CSS 设置 opacity:0 + GSAP .from({opacity:0}) | CSS 定义最终可见状态，GSAP animate FROM hidden |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
|----------------|-----------|------|
| animation_strategy: title_reveal | 使用 title_reveal block | 直接匹配 |
| animation_strategy: text_ending | 使用 title_reveal block + text_ending alias | 别名匹配 |
| content_type: text | --mc-text 系列变量 | 文字型配色 |
| duration | duration_* 参数 + hold | 总时长 = title duration + overlap + hold |