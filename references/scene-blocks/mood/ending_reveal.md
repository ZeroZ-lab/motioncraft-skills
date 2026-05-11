# ending_reveal — 结尾揭示

> engine: gsap | aliases: none | Pattern: P10 Ending Reveal

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| duration (fade out) | 0.4s | 0.6s | 0.5s | 旧内容淡出时长 |
| duration (title) | 0.6s | 1.0s | 0.8s | 结尾标题出现时长 |
| duration (subtitle) | 0.4s | 0.6s | 0.5s | 副标题出现时长 |
| duration (CTA) | 0.4s | 0.6s | 0.5s | CTA 按钮出现时长 |
| easing (title/subtitle) | power2.out | power3.out | power2.out | 标题与副标题缓动 |
| easing (CTA) | — | — | back.out(1.5) | CTA 弹性缓动（固定） |
| overlap (fade→title) | 0.0s | 0.2s | 0.1s | 淡出与标题时间差 |
| overlap (title→subtitle) | 0.2s | 0.4s | 0.3s | 标题与副标题时间差 |
| overlap (subtitle→CTA) | 0.1s | 0.3s | 0.2s | 副标题与 CTA 时间差 |

## Integration Spec

### HTML 结构规范

```html
<div class="scene" id="scene-N">
  <div class="scene-content">
    <!-- 旧内容：将在结尾开始时淡出 -->
  </div>
  <div class="ending-title">结尾标题</div>
  <div class="ending-subtitle">副标题/说明文字</div>
  <div class="cta">CTA 按钮文字</div>
</div>
```

- `.scene-content` — 旧内容容器，结尾场景开始时淡出
- `.ending-title` — 结尾主标题，font-weight: 700
- `.ending-subtitle` — 副标题，可选
- `.cta` — 行动号召按钮，必须有 back.out 弹性效果

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-primary | #00ff88 | 结尾标题颜色，模板可 override 为品牌色 |
| --mc-accent | #00cc6a | CTA 按钮背景色 |
| --mc-text-muted | #6b6b7b | 副标题颜色 |
| --mc-heading-size | 2.5rem | 标题字号 |
| --mc-body-size | 1rem | 副标题字号 |
| --mc-duration-default | 0.5 | 动画时长（秒） |
| --mc-easing-default | power2.out | 标题/副标题缓动 |
| --mc-spacing-lg | 2rem | 副标题与 CTA 间距 |

### GSAP 代码模板

```javascript
// ending_reveal — 标准用法
const tl = gsap.timeline({ paused: true });

// Step 1: fade out old content
tl.to('.scene-content', {
  opacity: 0,
  duration: /* PARAM: duration_fade_out, default 0.5 */,
  ease: 'power2.out'
})
// Step 2: ending title appears
.from('.ending-title', {
  opacity: 0,
  y: 20,
  duration: /* PARAM: duration_title, default 0.8 */,
  ease: /* PARAM: easing, default 'power2.out' */
}, '-=/* PARAM: overlap_fade_title, default 0.1 */')
// Step 3: subtitle appears
.from('.ending-subtitle', {
  opacity: 0,
  y: 10,
  duration: /* PARAM: duration_subtitle, default 0.5 */,
  ease: /* PARAM: easing, default 'power2.out' */
}, '-=/* PARAM: overlap_title_subtitle, default 0.3 */')
// Step 4: CTA with back.out bounce
.from('.cta', {
  opacity: 0,
  scale: 0.9,
  duration: /* PARAM: duration_cta, default 0.5 */,
  ease: 'back.out(1.5)'
}, '-=/* PARAM: overlap_subtitle_cta, default 0.2 */');

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改标题颜色、CTA 颜色、文字内容
```css
:root {
  --mc-primary: #3b82f6;   /* override 标题颜色为品牌色 */
  --mc-accent: #2563eb;    /* override CTA 背景色 */
}
```

```html
<!-- override CTA 文字 -->
<div class="cta">立即订阅</div>
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 添加 logo 元素（品牌结尾场景，logo 在标题上方或旁边）
- 添加品牌背景装饰（渐变光晕、品牌色粒子）
- 添加社交链接行（多个小 icon 链接）
- 将 `.scene-content` 替换为前一个场景的实际内容

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 所有结尾元素同时出现 | 按顺序：淡出旧内容 → 标题 → 副标题 → CTA，各错开 0.1-0.3s |
| CTA 使用普通 easing（如 power2.out） | CTA 必须使用 back.out(1.5)，提供弹性反馈感 |
| 旧内容未淡出直接消失 | 使用 opacity: 0 渐变淡出，duration 0.4-0.6s |
| CSS 设置 ending 元素 opacity:0 + GSAP .from({opacity:0}) | CSS 定义最终可见状态 (opacity:1)，GSAP animate FROM hidden |
| CTA 缺少 scale 变化 | CTA 必须从 scale: 0.9 → 1.0 配合 back.out(1.5) 弹性 |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
| |-----------|------|
| animation_strategy: ending_reveal | 使用 ending_reveal block | 直接匹配 |
| pattern: P10 | ending_reveal block | Pattern P10 对应 |
| content_type: mood | --mc-primary / --mc-accent 变量 | 情绪型配色 |
| duration | duration_* 参数 + overlap | 总时长 = fade_out + overlap + title + overlap + subtitle + overlap + CTA |
| cta_text | `.cta` 文字内容 | 直接映射到 CTA 按钮文字 |