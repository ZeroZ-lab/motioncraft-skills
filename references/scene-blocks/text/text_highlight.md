# text_highlight — 关键词高亮

> engine: gsap | aliases: none | Pattern: P6 Text Highlight

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| duration (text fade in) | 0.4s | 0.6s | 0.5s | 文字内容淡入时长 |
| duration (keyword highlight) | 0.3s | 0.5s | 0.4s | 每个关键词高亮时长 |
| y offset (text fade in) | 10px | 20px | 15px | 文字内容上移偏移 |
| stagger (keyword→keyword) | 0.15s | 0.2s | 0.2s | 关键词高亮间隔 |
| overlap (fade in→highlight) | 0.1s | 0.2s | 0.1s | 文字淡入与高亮时间差 |
| hold after highlight | 0.5s | 1.0s | 0.5s | 高亮完成后停留时间（强制 >= 0.5s） |
| easing (text fade in) | power2.out | power3.out | power2.out | 文字入场减速 |
| easing (highlight) | power2.inOut | power3.inOut | power2.inOut | 关键词高亮平滑过渡 |
| highlight color contrast | >= 3:1 | - | >= 3:1 | 高亮色与背景对比度（WCAG） |

## Integration Spec

### HTML 结构规范

```html
<div class="scene" id="scene-N">
  <div class="text-content">
    段落文字<span class="keyword">关键词1</span>，
    其他文字<span class="keyword">关键词2</span>。
  </div>
</div>
```

- `.text-content` — 文字内容容器，line-height: 1.8, text-align: center
- `.keyword` — 关键词元素，inline display, padding 0.1em 0.3em, font-weight: 600

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-primary | #00ff88 | 关键词高亮背景色，模板可 override 为品牌强调色 |
| --mc-bg-alt | #1a1a2e | 关键词高亮文字色（深色底保证对比度） |
| --mc-text | #e0e0e0 | 段落常规文字颜色 |
| --mc-text-muted | #6b6b7b | 非关键词文字颜色（动画起始态） |
| --mc-body-size | 1rem | 段落文字字号 |
| --mc-spacing-lg | 2rem | 场景内边距 |
| --mc-duration-default | 0.8 | 动画时长参考值（秒） |
| --mc-easing-default | power2.inOut | 关键词高亮缓动 |

### GSAP 代码模板

```javascript
// text_highlight — 标准用法
const tl = gsap.timeline({ paused: true });

// Reset keywords to un-highlighted state
gsap.set('.keyword', {
  backgroundColor: 'transparent',
  color: /* PARAM: text_muted_color, default '#6b6b7b' */
});

// Phase 1: Text content fades in
tl.from('.text-content', {
  opacity: 0,
  y: /* PARAM: y_offset, default 15 */,
  duration: /* PARAM: duration_fade, default 0.5 */,
  ease: /* PARAM: easing_fade, default 'power2.out' */
})
// Phase 2: Keywords highlight one by one with stagger
.to('.keyword', {
  backgroundColor: /* PARAM: highlight_bg, default '#00ff88' */,
  color: /* PARAM: highlight_text, default '#1a1a2e' */,
  duration: /* PARAM: duration_highlight, default 0.4 */,
  ease: /* PARAM: easing_highlight, default 'power2.inOut' */,
  stagger: /* PARAM: stagger, default 0.2 */
}, '-=/* PARAM: overlap, default 0.1 */')
// Hold >= 0.5s after all highlights (mandatory)
.to({}, { duration: /* PARAM: hold, default 0.5 */ });

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改高亮颜色、文字颜色
```css
:root {
  --mc-primary: #ffd700;   /* override 高亮背景色为金色 */
  --mc-bg-alt: #1a1a2e;    /* 高亮文字色保持深色底 */
}
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 添加多行段落（每个 `.text-content` 内可包含多行 `<br>` 分隔的文字）
- 添加多组关键词样式（如 `.keyword-alt` 使用不同高亮颜色表示不同类别）
- 添加高亮样式变体（圆角加大、下划线高亮而非背景色高亮）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 一次高亮所有关键词 | stagger 逐个高亮，间隔 0.15-0.2s |
| 高亮颜色与主题不协调 | 高亮色来自调色板（--mc-primary），不随意取色 |
| 文字和高亮同时出现 | 先文字淡入，再关键词高亮，错开 0.1-0.2s |
| 高亮完成后立即开始下一个动画 | hold >= 0.5s 让观众阅读 |
| CSS 设置 opacity:0 + GSAP .from({opacity:0}) | CSS 定义最终可见状态，GSAP animate FROM hidden |
| 高亮色对比度不足 | highlight color 与 background 对比度 >= 3:1（WCAG） |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
|----------------|-----------|------|
| animation_strategy: text_highlight | 使用 text_highlight block | 直接匹配 |
| content_type: text | --mc-text 系列变量 | 文字型配色 |
| duration | duration_* 参数 + hold | 总时长 = fade duration + overlap + highlights * (stagger + duration) + hold |
| visual_effect | highlight_bg / highlight_text | 高亮颜色规范 |