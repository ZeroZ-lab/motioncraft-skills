# Motion Patterns — 基础动效模式

> 20 个基础 motion pattern，覆盖 Web 动画视频的常见场景
> P1-P13: GSAP patterns | P14-P20: anime.js patterns

## Pattern 1: Title Reveal（标题出现）

**用途：** 视频标题、章节标题、关键概念

```javascript
// GSAP 实现
gsap.from('.title', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out'
});
```

**参数：**
- duration: 0.6-1.0s
- easing: power2.out / power3.out
- y offset: 20-40px
- 适用：scene 开头、概念引入

## Pattern 2: Stagger Cards（卡片依次出现）

**用途：** 列表展示、特性对比、步骤说明

```javascript
gsap.from('.card', {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: 0.15,
  ease: 'power2.out'
});
```

**参数：**
- duration: 0.4-0.6s per card
- stagger: 0.1-0.2s
- max cards: 5-7（超过则分批）
- 适用：特性列表、步骤说明

## Pattern 3: Line Draw（线条绘制）

**用途：** 架构图、流程图、连接线

```javascript
gsap.from('.path', {
  drawSVG: 0,
  duration: 1.0,
  ease: 'power1.inOut'
});
```

**参数：**
- duration: 0.8-1.5s
- easing: power1.inOut
- 需要 GSAP DrawSVGPlugin 或 SVG stroke-dasharray
- 适用：架构图、连接线、路径动画

## Pattern 4: Number Count（数字计数）

**用途：** 数据展示、关键指标

```javascript
const counter = { value: 0 };
gsap.to(counter, {
  value: 100,
  duration: 1.5,
  ease: 'power1.out',
  onUpdate: () => {
    element.textContent = Math.round(counter.value);
  }
});
```

**参数：**
- duration: 1.0-2.0s
- easing: power1.out
- 适用：数据指标、统计数字

## Pattern 5: Diagram Build（图表构建）

**用途：** 架构图逐步构建、系统图分层展示

```javascript
const tl = gsap.timeline();
tl.from('.layer-1', { opacity: 0, y: 20, duration: 0.5 })
  .from('.layer-2', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
  .from('.connection', { drawSVG: 0, duration: 0.8 }, '-=0.3');
```

**参数：**
- 每层: 0.4-0.6s
- 连接线: 0.6-1.0s
- 层间 overlap: 0.2-0.3s
- 适用：架构图、系统图、层次图

## Pattern 6: Text Highlight（文字高亮）

**用途：** 关键词强调、代码高亮

```javascript
gsap.from('.highlight', {
  backgroundColor: 'transparent',
  duration: 0.4,
  ease: 'power2.inOut'
});
```

**参数：**
- duration: 0.3-0.5s
- easing: power2.inOut
- 适用：关键词、重要文字、代码标记

## Pattern 7: Camera Pan（视角平移）

**用途：** 从全局到细节、从细节到全局

```javascript
gsap.to('.viewport', {
  x: -200,
  scale: 1.5,
  duration: 1.2,
  ease: 'power1.inOut'
});
```

**参数：**
- duration: 1.0-1.5s
- easing: power1.inOut
- scale 范围: 1.0 - 2.0
- 适用：大图聚焦、全景扫描

## Pattern 8: Card Stack（卡片堆叠）

**用途：** 方案对比、版本迭代、概念叠加

```javascript
const cards = document.querySelectorAll('.card');
cards.forEach((card, i) => {
  gsap.to(card, {
    y: i * 10,
    rotation: (i - 1) * 2,
    duration: 0.6,
    ease: 'power2.out'
  });
});
```

**参数：**
- duration: 0.5-0.8s
- max cards: 3-4（太多看不清）
- offset y: 8-15px
- rotation: 1-3deg
- 适用：对比、迭代、叠加概念

## Pattern 9: Grid Swap（网格切换）

**用途：** 视图切换、布局变化

```javascript
const tl = gsap.timeline();
tl.to('.grid-item', { opacity: 0, scale: 0.8, duration: 0.3, stagger: 0.05 })
  .set('.grid', { gridTemplateColumns: '1fr 1fr' })
  .to('.grid-item', { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05 });
```

**参数：**
- exit: 0.2-0.4s
- enter: 0.3-0.5s
- stagger: 0.03-0.08s
- 适用：布局切换、视图模式切换

## Pattern 10: Ending Reveal（结尾揭示）

**用途：** 总结、CTA、品牌展示

```javascript
const tl = gsap.timeline();
tl.to('.scene-content', { opacity: 0, scale: 0.95, duration: 0.5 })
  .from('.ending-title', { opacity: 0, y: 20, duration: 0.8 }, '-=0.2')
  .from('.ending-subtitle', { opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.cta', { opacity: 0, scale: 0.9, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.3');
```

**参数：**
- 淡出前幕: 0.4-0.6s
- 标题出现: 0.6-1.0s
- CTA 出现: 0.4-0.6s + back.out
- 适用：结尾总结、CTA、品牌展示

## Pattern 11: HyperFrames Timeline Registration

**用途：** 所有 Web 动画工程的 timeline 注册，使 HyperFrames 能发现和控制播放

```javascript
// 1. 创建 paused timeline（HyperFrames 控制播放）
const tl = gsap.timeline({ paused: true });

// ... 所有 scene 动画代码 ...

// 2. 注册到 window.__timelines
window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

**参数/规则：**
- `{ paused: true }` 必填 — 省略后 HyperFrames 无法控制播放
- `window.__timelines` 是 HyperFrames 发现机制 — 不使用 `window.__hf` 或其他变量名
- `<composition-id>` 必须与 HTML `data-composition-id` 一致
- 注册代码放在 `motion.js` 文件末尾
- 每个工程只注册一个 timeline

**HTML 配合：**
```html
<div data-composition-id="<composition-id>"
     data-start="0"
     data-width="1920"
     data-height="1080">
  <!-- scenes -->
</div>
```

- 适用：所有需要渲染导出的 Web 动画工程

## Pattern 12: Background Music (BGM)

**用途：** 为视频添加背景音乐，贯穿全片

```html
<audio id="bg-music"
       data-start="0"
       data-duration="<total-duration>"
       data-track-index="3"
       data-volume="0.15"
       src="assets/audio/bg-music.mp3"></audio>
```

**参数/规则：**
- `data-track-index` 固定为 3（BGM 专用层）
- `data-volume` 建议 0.1-0.2，不超过 0.3
- `data-start` 通常为 0（从头播放）
- `data-duration` 等于视频总时长
- 推荐格式：.mp3（文件小）
- 音频文件放入 `assets/audio/`
- 适用：所有需要氛围烘托的视频

## Pattern 13: Sound Effect (SFX)

**用途：** 在特定时间点触发音效（转场、强调、反馈）

```html
<!-- 转场音效 -->
<audio id="sfx-transition"
       data-start="5"
       data-duration="0.8"
       data-track-index="2"
       data-volume="0.7"
       src="assets/audio/whoosh.wav"></audio>

<!-- 强调音效 -->
<audio id="sfx-highlight"
       data-start="18"
       data-duration="0.5"
       data-track-index="2"
       data-volume="0.6"
       src="assets/audio/click.wav"></audio>
```

**参数/规则：**
- `data-track-index` 固定为 2（SFX 专用层）
- `data-volume` 建议 0.5-0.8
- `data-start` 必须与 storyboard scene 起始时间对齐
- `data-duration` 等于音效实际长度
- 推荐格式：.wav（低延迟，精确同步）
- 每个视频不超过 5-8 个音效点
- 可同时存在多个 SFX（不同 `data-start`）
- 适用：转场、强调、反馈、里程碑

## Pattern 14: Blur Reveal #engine:animejs

**用途：** 逐字/逐词模糊揭示，用于强调关键词的转换过程

```javascript
// anime.js 实现
const tl = anime.createTimeline({ autoplay: false });
tl.add('.title-char', {
  opacity: [0, 1],
  filter: ['blur(10px)', 'blur(0px)'],
  translateY: [20, 0],
  duration: 0.8,
  stagger: 0.05,
  ease: 'easeOutExpo'
});
// HyperFrames hfAnime registration
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```

**参数：**
- duration: 0.6-1.0s per character group
- stagger: 0.05-0.1s per character
- blur range: 8-12px → 0px
- y offset: 15-25px → 0
- 适用：关键词揭示、转换强调、React-Bits BlurText 提取

**anime.js vs GSAP 对照：**
- anime.js 使用 `filter: ['blur(10px)', 'blur(0px)']` 实现逐字模糊
- GSAP 无内置逐字模糊策略（需逐字符手动 tween）
- HyperFrames 注册：anime.js → `window.__hfAnime`，GSAP → `window.__timelines`

## Pattern 15: Split Text Reveal #engine:animejs

**用途：** 逐字拆分揭示，字符从散落位置汇聚到正确位置

```javascript
// anime.js 实现
const tl = anime.createTimeline({ autoplay: false });
tl.add('.title-char', {
  opacity: [0, 1],
  translateX: [30, 0],
  translateY: [-15, 0],
  rotate: [15, 0],
  duration: 0.8,
  stagger: 0.05,
  ease: 'easeOutExpo'
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```

**参数：**
- duration: 0.6-1.0s per character group
- stagger: 0.04-0.08s per character
- x/y scatter: ±30-50px → 0
- rotation scatter: ±15-30deg → 0
- 适用：关键词汇聚、React-Bits SplitText 提取

## Pattern 16: Morph Build #engine:animejs

**用途：** SVG 形态变形构建，元素从一种形状变形到另一种形状

```javascript
// anime.js 实现 — SVG morphTo
const tl = anime.createTimeline({ autoplay: false });
tl.add('.morph-element', {
  morphTo: 'M50,5 L95,5 Q95,5 95,50 Q95,95 50,95 Q5,95 5,50 Q5,5 50,5 Z',
  duration: 1.0,
  ease: 'easeInOutQuad'
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```

**参数：**
- duration: 0.8-1.5s
- easing: easeInOutQuad
- morph source/target path 节点数必须匹配
- 适用：概念转换、形态变形、React-Bits SVG morph 效果

**anime.js vs GSAP 对照：**
- anime.js `morphTo` 免费（GSAP MorphSVG 付费 $25/mo Business License）
- anime.js morphTo 适用于基本形状变形，复杂多段路径 morph 可能需要 flubber/polymorph-js 辅助
- CSS 无原生 SVG path morph capability

## Pattern 17: Morph Compare #engine:animejs

**用途：** SVG 形态前后对比，从"状态 A"形状变形到"状态 B"形状

```javascript
// anime.js 实现 — SVG morphTo before→after
const tl = anime.createTimeline({ autoplay: false });
// 标签切换 + 形变
tl.add('.state-label', {
  opacity: [1, 0],
  duration: 0.3
})
.add('.compare-element', {
  morphTo: '<state-b-path>',
  duration: 1.2,
  ease: 'easeInOutQuad'
}, '-=100');
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```

**参数：**
- duration: 0.8-1.5s
- 形变前后两个 path 节点数必须匹配
- 适用：前后对比、状态对比、架构变化可视化

**anime.js vs GSAP 对照：**
- GSAP `before_after` 策略使用 scale+opacity（视觉变形感较弱）
- anime.js `morph_compare` 使用 SVG path morph（真正的形变，更表达本质差异）
- 两者不是等价替代：morph_compare 适合"结构性变化"，before_after 适合"状态性变化"

## Pattern 18: Spring Enter #engine:animejs

**用途：** 弹簧物理入场，元素以真实弹簧物理运动入场

```javascript
// anime.js 实现 — spring physics
const tl = anime.createTimeline({ autoplay: false });
tl.add('.hero-element', {
  translateX: [50, 0],
  translateY: [30, 0],
  opacity: [0, 1],
  spring: { stiffness: 200, damping: 15 },
  duration: 0  // spring auto-calculates duration
});
// stretch() to align with storyboard timing if needed
tl.stretch(<storyboard-duration>);
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```

**参数：**
- stiffness: 100-500, default 200（弹簧硬度）
- damping: 5-30, default 15（阻尼系数）
- spring auto-calculates duration — 使用 `stretch()` 强制对齐 storyboard 时长
- 适用：活力入场、hero 元素、品牌展示

**anime.js vs GSAP 对照：**
- anime.js `spring()` 是真正的弹簧物理（超调+自然回弹+衰减）
- GSAP `elastic.out` 是曲线近似（没有真实的超调衰减过程）
- GSAP `back.out(1.5)` 是更弱的近似（单次超调，无衰减）
- anime.js spring 不可被 GSAP 精确复制——GSAP fallback 是近似替代

## Pattern 19: Count Up Spring #engine:animejs

**用途：** 弹簧计数动画，数字以弹簧物理增长到目标值

```javascript
// anime.js 实现 — spring count
const tl = anime.createTimeline({ autoplay: false });
tl.add('.metric-value', {
  innerHTML: [0, 12847],
  round: true,
  spring: { stiffness: 200, damping: 15 },
  duration: 0  // spring auto-calculates
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```

**参数：**
- spring_stiffness: 100-500, default 200
- spring_damping: 5-30, default 15
- 数字短暂超过目标值后回弹——传达"增长活力"
- 适用：数据展示、增长指标、React-Bits CountUp 提取

**anime.js vs GSAP 对照：**
- GSAP `number_count` (P4) 使用 `power1.out`（平滑增长，无超调）
- anime.js `count_up_anim` 使用 spring（超调+回弹，更有活力感）
- 弹簧计数更适合"增长势头"语义，平滑计数更适合"精确到达"语义

## Pattern 20: Path Draw #engine:animejs

**用途：** SVG 路径精确绘制，使用 anime.js createDrawable

```javascript
// anime.js 实现 — SVG createDrawable
const drawable = anime.svg.createDrawable('.flow-path');
const tl = anime.createTimeline({ autoplay: false });
tl.add(drawable, {
  drawProgress: [0, 1],
  duration: 1.0,
  ease: 'easeInOutSine'
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```

**参数：**
- duration: 0.8-1.5s
- easing: easeInOutSine
- 需先使用 `anime.svg.createDrawable()` 初始化路径元素
- 适用：流程绘制、路径动画、需要比 CSS stroke-dashoffset 更精确控制的场景

**anime.js vs GSAP 对照：**
- GSAP `line_draw` (P3) 使用 DrawSVGPlugin（付费）或 CSS stroke-dashoffset（免费）
- CSS stroke-dashoffset 覆盖 80%+ line_draw 场景
- anime.js `createDrawable` 提供更精确的绘制进度控制（drawProgress 0→1）
- 同一 composition 中应统一使用一种引擎的路径绘制，避免混用
