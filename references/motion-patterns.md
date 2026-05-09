# Motion Patterns — 基础动效模式

> 10 个基础 motion pattern，覆盖 Web 动画视频 80% 的常见场景

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
