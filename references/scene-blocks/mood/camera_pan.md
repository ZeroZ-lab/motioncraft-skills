# camera_pan — 视角平移

> engine: gsap | aliases: atmosphere_build | Strategy: 视角平移

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| duration | 1.0s | 1.5s | 1.2s | 平移总时长 |
| x offset (start) | -100px | -300px | -200px | 起始水平偏移 |
| scale (start) | 1.0 | 2.0 | 1.5 | 起始缩放 |
| easing | power1.inOut | — | power1.inOut | 平滑入出缓动 |

## Integration Spec

### HTML 结构规范

```html
<div class="viewport" id="viewport-N">
  <div class="viewport-background">
    <!-- 背景内容：渐变、图片、粒子等 -->
    <div class="focal-content">
      <div class="focal-title">焦点内容</div>
      <div class="focal-subtitle">说明文字</div>
    </div>
  </div>
</div>
```

- `.viewport` — 视口容器，必须设置 `overflow: hidden`
- `.viewport-background` — 背景区域，尺寸需大于视口以支持平移
- `.focal-content` — 焦点内容，位于背景内

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-bg | #0a0a1a | 背景色，用于 viewport-background 渐变起始 |
| --mc-bg-alt | #1a1a2e | 背景辅助色，渐变过渡 |
| --mc-primary | #00ff88 | 焦点内容标题颜色 |
| --mc-text-muted | #6b6b7b | 焦点内容副标题颜色 |
| --mc-heading-size | 2.5rem | 焦点标题字号 |
| --mc-body-size | 1rem | 焦点副标题字号 |
| --mc-duration-default | 1.2 | 动画时长（秒） |
| --mc-easing-default | power1.inOut | 平移缓动 |

### GSAP 代码模板

```javascript
// camera_pan — 标准用法
const tl = gsap.timeline({ paused: true });

tl.from('.viewport', {
  x: /* PARAM: x_offset, default -200 */,
  scale: /* PARAM: scale_start, default 1.5 */,
  duration: /* PARAM: duration, default 1.2 */,
  ease: /* PARAM: easing, default 'power1.inOut' */
});

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

### Alias: atmosphere_build

**差异点**：atmosphere_build 使用背景渐变动画 + 微粒子漂浮，而非视口平移。

| 参数 | camera_pan | atmosphere_build |
|------|-----------|-----------------|
| 动画类型 | 视口平移 (transform x/scale) | **背景渐变 shift + 粒子浮动** |
| easing | power1.inOut | power1.inOut (渐变) / none (粒子循环) |
| duration | 1.0-1.5s | **渐变 1.5-3.0s** / **粒子 2.0-5.0s 循环** |
| scale | 1.0-2.0 | 无 scale 变化 |

**atmosphere_build 代码模板**：
```javascript
// atmosphere_build — 背景渐变动画 + 粒子漂浮
const tl = gsap.timeline({ paused: true });

// 背景渐变 shift
tl.to('.background', {
  backgroundPosition: '100% 100%',
  duration: /* PARAM: gradient_duration, default 2.0 */,
  ease: 'power1.inOut'
});

// 粒子微浮动（独立循环，不纳入主 timeline）
gsap.to('.particle', {
  y: -20,
  opacity: 0.6,
  duration: /* PARAM: particle_duration, default 3.0 */,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true
});

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

## 快速路径 vs 扩展路径

**快速路径**：CSS 变量 override — 改背景色、焦点内容颜色、时长
```css
:root {
  --mc-bg: #1e3a5f;       /* override 背景色为深海蓝 */
  --mc-bg-alt: #2a4a6b;   /* override 辅助色 */
  --mc-primary: #4fc3f7;  /* override 焦点内容颜色 */
  --mc-duration-default: 1.5; /* override 平移时长 */
}
```

**扩展路径**：HTML 结构修改匹配 storyboard
- 添加多层背景（如渐变 + 网格 + 粒子三层叠加）
- 添加前景装饰元素（如光晕、线条）
- 将 camera_pan 与 atmosphere_build 组合使用（视口先平移到焦点，再触发背景渐变）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 平移偏移过大（x > 300px） | 保持 x 在 -100~-300px 范围内，避免画面偏移过多 |
| 缩放与平移速度不一致 | 使用 power1.inOut 同时控制 x 和 scale，保证同步 |
| 背景尺寸与视口相同 | 背景必须大于视口（至少 1.3x），否则平移时露出空白 |
| CSS 设置 transform 做初始偏移 + GSAP .from({x:-200}) | CSS 定义最终状态 (transform: none)，GSAP animate FROM offset |
| viewport 未设置 overflow:hidden | 必须设置 overflow:hidden，否则背景超出视口可见 |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
| |-----------|------|
| animation_strategy: camera_pan | 使用 camera_pan block | 直接匹配 |
| animation_strategy: atmosphere_build | 使用 camera_pan block + atmosphere_build alias | 别名匹配 |
| content_type: mood | --mc-bg 系列变量 | 情绪型配色（暗色基调） |
| duration | duration 参数 | 平移总时长 1.0-1.5s |