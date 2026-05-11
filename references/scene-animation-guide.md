---
name: scene-animation-guide
description: 按内容类型组织的 scene 动画策略设计指南
---

# Scene Animation Guide — 场景动画设计指南

> 用途：所有 pipeline 阶段的动画设计决策参考
> 原则：参考 motion-principles.md | 代码模式：参考 motion-patterns.md

## Iron Law

<HARD-GATE>
**动画设计不是随机的。每个 scene 的动画方案必须来自内容类型策略。**
AI 从策略词表选择，不自创策略。不使用"我觉得这个动画好看"作为决策依据。
</HARD-GATE>

## 策略词表

以下是预定义的策略词表。AI 从此词表选择，不自创。新增策略需更新此表后才能使用。

```
text:
  - title_reveal        # 标题/大字出现
  - text_highlight       # 关键词高亮
  - text_typewriter      # 代码/终端逐字出现（code_text 子类型）
  - text_ending          # 结尾 CTA/总结出现

data:
  - number_count         # 数字计数动画
  - data_dashboard       # 多指标仪表盘（stagger + count 组合）

concept:
  - diagram_build        # 架构图/层次图逐步构建
  - concept_layers        # 概念层层叠加展示
  - card_stack           # 卡片堆叠分类

process:
  - line_draw            # 路径/线条绘制
  - flow_build           # 流程图/管道逐步构建
  - pipeline_sequence    # 步骤序列展示

comparison:
  - stagger_compare      # 卡片依次出现对比
  - grid_swap            # 网格切换（A/B 方案）
  - before_after         # 前后对比变形

mood:
  - camera_pan           # 视角平移（开场/聚焦）
  - ending_reveal        # 结尾揭示（品牌/CTA）
  - atmosphere_build     # 氛围构建（背景 + 环境动画）
```

## 多类型场景分类规则

当 scene 跨越多种内容类型时，按以下规则决策：

1. **purpose 优先于 content**：如果 purpose 是 mood（hook/ending），即使内容是 text，content_type 取 mood
2. **视觉主导内容**：如果 visual 描述的核心元素是数据/流程/对比，以视觉元素定类型
3. **拆分优先**：如果一个 scene 的视觉和信息可以清晰拆为两部分 → 拆为两个 scene
4. **不拆分时取 primary**：如果无法拆分，取承载核心信息的类型为 content_type

## 内容类型判断

| purpose | visual 描述关键词 | → content_type |
|---------|------------------|----------------|
| hook | 标题、大字、引言 | text (title_reveal) |
| hook | 冲击画面、全景 | mood (camera_pan) |
| problem | 文字要点、列表 | text (text_highlight) |
| problem | 数据、统计、图表 | data (number_count) |
| insight | 原理、定义、分类 | concept (diagram_build) |
| example | 代码、终端、编辑器 | text (text_typewriter) |
| model | 架构、系统、流程 | process (flow_build) |
| comparison | A vs B、前后对比 | comparison (stagger_compare) |
| conclusion | 总结、CTA、品牌 | mood (ending_reveal) |
| conclusion | 文字总结 | text (text_ending) |

## 1 文字型 (text)

### 动画目标

让观众在合适的时间看到关键文字信息。通过入场方式引导阅读顺序，通过高亮强调关键词，通过停留保证理解。

### 典型场景

- 视频开场标题出现
- 列表要点逐条展示
- 代码/终端逐字出现
- 结尾 CTA 或总结文字

### 策略详情

#### title_reveal

- **用途**: 标题/大字出现，用于 scene 开头或概念引入
- **Primary Pattern**: P1 Title Reveal
- **推荐 Easing**: power2.out（减速入场）
- **参数范围**:
  - duration: 0.6-1.0s
  - y offset: 20-40px
  - hold ≥ 0.5s after reveal
- **代码模板**:
```javascript
// title_reveal example
const tl = gsap.timeline();
tl.from('.title', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out'
}).from('.subtitle', {
  opacity: 0,
  y: 15,
  duration: 0.5,
  ease: 'power2.out'
}, '-=0.3');
// 强制：标题出现后 hold ≥ 0.5s
tl.to({}, { duration: 0.5 });
```
- **常见错误**:
  - 标题和副标题同时出现（应先标题后副标题，错开 0.2-0.3s）
  - 出现后立即开始下一个动画（必须 hold ≥ 0.5s 让观众阅读）

#### text_highlight

- **用途**: 关键词高亮，强调已有文字中的重点
- **Primary Pattern**: P6 Text Highlight
- **推荐 Easing**: power2.inOut（平滑过渡）
- **参数范围**:
  - duration: 0.3-0.5s
  - highlight 颜色与背景对比度 ≥ 3:1
- **代码模板**:
```javascript
// text_highlight example
const tl = gsap.timeline();
tl.from('.text-content', {
  opacity: 0,
  y: 15,
  duration: 0.5,
  ease: 'power2.out'
}).to('.keyword', {
  backgroundColor: '#FFD700',
  color: '#1a1a2e',
  duration: 0.4,
  ease: 'power2.inOut',
  stagger: 0.2
}, '-=0.1');
```
- **常见错误**:
  - 一次高亮所有关键词（应 stagger 逐个高亮，间隔 0.15-0.2s）
  - 高亮颜色与主题不协调（高亮色应来自调色板，不随意取色）

#### text_typewriter（code_text 子类型）

- **用途**: 代码、终端、编辑器场景的逐字出现效果
- **Primary Pattern**: P6 Text Highlight 的变体（逐字动画）
- **推荐 Easing**: 无缓动（匀速逐字，模拟真实输入节奏）
- **参数范围**:
  - duration 基于 character count：~50ms per char
  - cursor blink: 0.5s 间隔
  - 单行最大显示字符数：60-80（超出换行）
- **代码模板**:
```javascript
// text_typewriter example — 代码/终端逐字出现
const codeText = 'const app = express();';
const chars = codeText.split('');
const container = document.querySelector('.code-line');
const cursor = document.querySelector('.cursor');

const tl = gsap.timeline();
chars.forEach((char, i) => {
  tl.add(() => {
    const span = document.createElement('span');
    span.textContent = char;
    // 语法高亮在已存在文字上变色
    applySyntaxHighlight(span, char, i);
    container.insertBefore(span, cursor);
  }, i * 0.05);
});
// cursor blink loop
gsap.to(cursor, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true });
```
- **语法高亮规则**: 语法高亮作为二级动画——文字先以统一颜色出现，随后关键词变色（keyword → 蓝色，string → 绿色，comment → 灰色），变色 duration 0.2-0.3s。
- **常见错误**:
  - 逐字速度太快（< 30ms/char 观众无法跟随）
  - 一次性显示所有代码（应逐行出现，行间 stagger 0.3-0.5s）

#### text_ending

- **用途**: 结尾 CTA 或总结文字出现
- **Primary Pattern**: P10 Ending Reveal（部分）——仅使用 CTA 出现阶段
- **推荐 Easing**: back.out(1.5)（弹性出场，用于 CTA 按钮/文字）
- **参数范围**:
  - duration: 0.5-0.8s
  - scale: 0.9 → 1.0
- **代码模板**:
```javascript
// text_ending example
const tl = gsap.timeline();
tl.from('.ending-title', {
  opacity: 0,
  y: 20,
  duration: 0.7,
  ease: 'power2.out'
}).from('.cta-button', {
  opacity: 0,
  scale: 0.9,
  duration: 0.5,
  ease: 'back.out(1.5)'
}, '-=0.2');
```
- **常见错误**:
  - CTA 按钮与总结文字同时出现（总结文字先行，CTA 延后 0.2-0.3s）
  - 使用线性缓动（CTA 应使用弹性缓动吸引注意力）

### 强制规则：文字停留

**文字展示后必须停留 ≥ 0.5s 让观众阅读。这是强制规则，不是建议。**

判断停留时长的经验公式：
- 标题/大字：hold ≥ 1.0s
- 段落/列表：每个可读单元 hold ≥ 0.5s
- 代码行：每行 hold ≥ 0.3s

### 常见错误汇总

- **一次展示过多文字**：单 scene 文字不超过 3-5 个要点，超出则拆分为多个 scene
- **每个词都做动画**：只对关键词做动画，非关键词静态显示
- **没有停留时间**：所有文字策略都必须包含 hold 时间

## 2 数据型 (data)

### 动画目标

让观众感知数字的变化和大小。通过计数动画展示数据变化过程，通过仪表盘布局同时展示多个指标。

### 典型场景

- 关键指标数字增长
- 多指标仪表盘展示
- 统计数据对比

### 策略详情

#### number_count

- **用途**: 数字从起始值增长到目标值的计数动画
- **Primary Pattern**: P4 Number Count
- **推荐 Easing**: power1.out（先快后慢，符合"越来越接近目标"的心理预期）
- **参数范围**:
  - duration: 1.0-2.0s
  - 计数速度匹配叙事节奏（快节奏场景 → 1.0s，讲解场景 → 2.0s）
- **代码模板**:
```javascript
// number_count example
const counter = { value: 0 };
const targetValue = 12847;
const element = document.querySelector('.metric-number');

const tl = gsap.timeline();
tl.from('.metric-label', {
  opacity: 0, y: 10, duration: 0.4, ease: 'power2.out'
}).to(counter, {
  value: targetValue,
  duration: 1.5,
  ease: 'power1.out',
  onUpdate: () => {
    element.textContent = Math.round(counter.value).toLocaleString();
  }
}, '-=0.1');
```
- **常见错误**:
  - 计数太快（< 0.8s 观众无法感知数字变化过程）
  - 数字没有格式化（大数字应加千分位逗号或单位，如 12,847 / 1.2M）

#### data_dashboard

- **用途**: 多指标仪表盘，同时展示 3-5 个数据指标
- **Primary Pattern**: P2 Stagger Cards + P4 Number Count（组合模式）
- **推荐 Easing**: power2.out（卡片入场）+ power1.out（数字计数）
- **参数范围**:
  - 总 duration: 2.0-3.5s（3-5 个指标）
  - 卡片 stagger 间隔: 0.15s
  - 每个卡片 duration: 0.4-0.6s
  - 数字计数在卡片入场后开始，duration: 1.0-1.5s
- **代码模板**:
```javascript
// data_dashboard example — 多指标仪表盘
const tl = gsap.timeline();
// 阶段 1: 卡片依次入场
tl.from('.metric-card', {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: 0.15,
  ease: 'power2.out'
});
// 阶段 2: 每个数字开始计数
const counters = document.querySelectorAll('.metric-number');
const targets = [12847, 99.9, 3.2, 156];
counters.forEach((el, i) => {
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
```
- **常见错误**:
  - 超过 5 个指标同时展示（超过则分批或拆 scene）
  - 卡片和数字同时开始（应先卡片入场，后数字计数）

### 常见错误汇总

- **计数太快**：观众来不及注册数字变化（总计数 duration ≥ 1.0s）
- **没有数字上下文**：只显示数字不显示标签/单位（必须加标签说明数字含义）
- **一次展示过多指标**：单 scene 最多 5 个指标

## 3 概念型 (concept)

### 动画目标

让观众理解概念的层次结构和分类关系。通过逐步构建展示概念的组成，通过叠加展示概念的层次，通过卡片堆叠展示分类。

### 典型场景

- 架构图/系统图逐步展示
- 概念的层次叠加说明
- 分类卡片堆叠

### 策略详情

#### diagram_build

- **用途**: 架构图、层次图、系统图逐步构建，让观众跟随构建过程理解结构
- **Primary Pattern**: P5 Diagram Build
- **推荐 Easing**: power1.inOut（平滑过渡）
- **参数范围**:
  - 每层 duration: 0.4-0.6s
  - 连接线 duration: 0.6-1.0s
  - 层间 overlap: 0.2-0.3s
- **代码模板**:
```javascript
// diagram_build example
const tl = gsap.timeline();
tl.from('.layer-1', {
  opacity: 0, y: 20, duration: 0.5, ease: 'power1.inOut'
}).from('.layer-2', {
  opacity: 0, y: 20, duration: 0.5, ease: 'power1.inOut'
}, '-=0.2')
.from('.connection-1', {
  drawSVG: 0, duration: 0.8, ease: 'power1.inOut'
}, '-=0.3')
.from('.layer-3', {
  opacity: 0, y: 20, duration: 0.5, ease: 'power1.inOut'
}, '-=0.2')
.from('.connection-2', {
  drawSVG: 0, duration: 0.8, ease: 'power1.inOut'
}, '-=0.3');
```
- **常见错误**:
  - 一次性展示所有层（应逐层构建，每层有 hold 时间）
  - 层间没有 overlap（层间应有 0.2-0.3s overlap 保持节奏流畅）

#### concept_layers

- **用途**: 概念层层叠加展示，说明概念的深度或递进关系
- **Primary Pattern**: P8 Card Stack 的变体（叠加而非堆叠）
- **推荐 Easing**: power2.out（每层叠加时减速）
- **参数范围**:
  - 每层 duration: 0.4-0.6s
  - opacity: 0 → 0.85-1.0
  - y offset: 每层 10-20px 偏移
  - 最大层数: 3-4 层
- **代码模板**:
```javascript
// concept_layers example
const tl = gsap.timeline();
const layers = document.querySelectorAll('.concept-layer');
layers.forEach((layer, i) => {
  tl.from(layer, {
    opacity: 0,
    y: 20 + i * 5,
    duration: 0.5,
    ease: 'power2.out'
  }, i > 0 ? '-=0.2' : 0);
});
```
- **常见错误**:
  - 所有层同时出现（应逐层叠加，每层间隔 0.2-0.3s）
  - 层间无视觉区分（每层应有不同的透明度或色彩区分）

#### card_stack

- **用途**: 卡片堆叠分类，展示方案对比、版本迭代或概念分组
- **Primary Pattern**: P8 Card Stack
- **推荐 Easing**: power2.out
- **参数范围**:
  - max cards: 3-4（太多看不清）
  - y offset: 8-15px
  - rotation: 1-3deg
  - duration: 0.5-0.8s
- **代码模板**:
```javascript
// card_stack example
const cards = document.querySelectorAll('.stack-card');
const tl = gsap.timeline();
cards.forEach((card, i) => {
  tl.to(card, {
    y: i * 12,
    rotation: (i - 1) * 2,
    duration: 0.6,
    ease: 'power2.out'
  }, i > 0 ? '-=0.3' : 0);
});
```
- **常见错误**:
  - 卡片数量超过 4（堆叠超过 4 张会遮挡内容，减少或分组）
  - rotation 过大（> 3deg 会显得杂乱）

### 常见错误汇总

- **一次性构建所有内容**：概念型必须逐步构建，让观众跟上思路
- **层间无停顿**：每层构建后 pause ≥ 0.3s 再开始下一层

## 4 流程型 (process)

### 动画目标

让观众理解流程的方向性和步骤顺序。通过线条绘制展示路径，通过逐步构建展示流程结构，通过步骤序列展示执行顺序。

### 典型场景

- 流程图/管道图绘制
- 步骤序列展示
- 路径/线条动画

### 策略详情

#### line_draw

- **用途**: 路径/线条绘制，展示流程的方向和连接
- **Primary Pattern**: P3 Line Draw
- **推荐 Easing**: power1.inOut（均匀绘制感）
- **参数范围**:
  - duration: 0.8-1.5s
  - 使用 SVG stroke-dasharray 或 GSAP DrawSVGPlugin
- **代码模板**:
```javascript
// line_draw example
const tl = gsap.timeline();
tl.from('.flow-path', {
  drawSVG: 0,
  duration: 1.0,
  ease: 'power1.inOut'
});
```
- **常见错误**:
  - 线条绘制速度不一致（同一条路径应匀速绘制）
  - 没有方向指示（线条应有箭头或渐变表示方向）

#### flow_build

- **用途**: 流程图/管道逐步构建，先出节点再画连接
- **Primary Pattern**: P5 Diagram Build + P3 Line Draw（组合模式）
- **推荐 Easing**: power1.inOut（节点和线条统一缓动）
- **参数范围**:
  - 节点出现: 0.3-0.5s each
  - 连接线绘制: 0.6-1.0s each
  - 节点间 stagger: 0.2-0.3s
- **代码模板**:
```javascript
// flow_build example — 先节点后连线
const tl = gsap.timeline();
// 节点依次出现
tl.from('.flow-node', {
  opacity: 0, scale: 0.8, duration: 0.4, stagger: 0.25, ease: 'power1.inOut'
});
// 连接线依次绘制
tl.from('.flow-connector', {
  drawSVG: 0, duration: 0.8, stagger: 0.2, ease: 'power1.inOut'
}, '-=0.4');
```
- **常见错误**:
  - 节点和连线同时出现（应先节点后连线，保持因果逻辑）
  - 没有流程方向（箭头或连线方向必须明确）

#### pipeline_sequence

- **用途**: 步骤序列展示，每个步骤按顺序出现
- **Primary Pattern**: P2 Stagger Cards 的序列变体
- **推荐 Easing**: power2.out（每步出现）
- **参数范围**:
  - 每步 duration: 0.3-0.5s
  - 步骤间 stagger: 0.2-0.4s
  - 箭头绘制: 0.3-0.5s
- **代码模板**:
```javascript
// pipeline_sequence example
const steps = document.querySelectorAll('.pipeline-step');
const arrows = document.querySelectorAll('.step-arrow');
const tl = gsap.timeline();

steps.forEach((step, i) => {
  // 步骤框出现
  tl.from(step, {
    opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.out'
  }, i * 0.6);
  // 标签淡入
  tl.from(step.querySelector('.step-label'), {
    opacity: 0, duration: 0.3, ease: 'power2.out'
  }, i * 0.6 + 0.2);
  // 箭头绘制到下一步
  if (arrows[i]) {
    tl.from(arrows[i], {
      drawSVG: 0, duration: 0.4, ease: 'power1.inOut'
    }, i * 0.6 + 0.4);
  }
});
```
- **常见错误**:
  - 所有步骤同时出现（必须序列展示，每步间隔 ≥ 0.3s）
  - 没有方向性元素（步骤间必须有箭头/连线表示流程方向）

### 常见错误汇总

- **没有方向性流**：流程型必须有箭头或线条表示方向
- **所有步骤同时出现**：必须按顺序逐步展示

## 5 对比型 (comparison)

### 动画目标

让观众清晰感知 A 和 B 的差异。通过交错出现展示对比，通过网格切换展示方案差异，通过前后变形展示状态变化。

### 典型场景

- A/B 方案对比
- 前后效果对比
- 特性/参数对比列表

### 策略详情

#### stagger_compare

- **用途**: 卡片依次出现对比，A/B 两组交错出现
- **Primary Pattern**: P2 Stagger Cards
- **推荐 Easing**: power2.out
- **参数范围**:
  - 每卡片 duration: 0.4-0.6s
  - stagger 间隔: 0.15s
  - 单侧最大项数: 5-7
- **代码模板**:
```javascript
// stagger_compare example
const tl = gsap.timeline();
// A 侧卡片
tl.from('.compare-a .card', {
  opacity: 0, x: -20, duration: 0.5,
  stagger: 0.15, ease: 'power2.out'
});
// B 侧卡片（延迟出场，与 A 交错）
tl.from('.compare-b .card', {
  opacity: 0, x: 20, duration: 0.5,
  stagger: 0.15, ease: 'power2.out'
}, '-=0.4');
```
- **常见错误**:
  - A/B 两侧同时出现（应先 A 后 B 或交错，间隔 ≥ 0.3s）
  - 对比项超过 7 个（单侧超过 5-7 项应分组或拆 scene）

#### grid_swap

- **用途**: 网格切换，从 A 方案视图切换到 B 方案视图
- **Primary Pattern**: P9 Grid Swap
- **推荐 Easing**: power1.inOut（切换感）
- **参数范围**:
  - exit duration: 0.2-0.4s
  - enter duration: 0.3-0.5s
  - stagger: 0.03-0.08s
- **代码模板**:
```javascript
// grid_swap example — A/B 方案切换
const tl = gsap.timeline();
// 退出 A 方案
tl.to('.grid-a .grid-item', {
  opacity: 0, scale: 0.8, duration: 0.3, stagger: 0.05, ease: 'power1.inOut'
})
// 切换布局
.set('.grid-container', { gridTemplateColumns: '1fr 1fr' })
// 进入 B 方案
.to('.grid-b .grid-item', {
  opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out'
});
```
- **常见错误**:
  - 退出和进入同时发生（必须先完全退出再进入，间隔 ≥ 0.1s）
  - 切换速度太慢（总切换 duration ≤ 1.0s，避免观众等待）

#### before_after

- **用途**: 前后对比变形，从状态 A 变形到状态 B
- **Primary Pattern**: GSAP to() 变形（scale + opacity 组合）
- **推荐 Easing**: power2.inOut（平滑变形感）
- **参数范围**:
  - duration: 0.6-1.0s
  - 变形过程中 scale 可短暂到 1.05（弹性变形效果）
- **代码模板**:
```javascript
// before_after example — 前后对比变形
const tl = gsap.timeline();
// 标签切换
tl.to('.label-before', { opacity: 0, duration: 0.3, ease: 'power2.inOut' })
.to('.label-after', { opacity: 1, duration: 0.3, ease: 'power2.inOut' }, '-=0.1');
// 内容变形
tl.to('.state-a', {
  opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.inOut'
}, 0)
.from('.state-b', {
  opacity: 0, scale: 1.05, duration: 0.5, ease: 'power2.out'
}, 0.3);
```
- **常见错误**:
  - A 和 B 同时显示（变形应有明确的 A → B 过渡，不同时显示）
  - 变形过程无中间态（应有一个短暂的混合态让过渡自然）

### 常见错误汇总

- **没有视觉分隔**：A/B 两侧必须有明确的视觉分隔线或区域
- **两侧同时出现**：对比型应交错出场，制造节奏

## 6 情绪型 (mood)

### 动画目标

营造氛围和情绪，而非传递具体信息。通过视角平移制造空间感，通过结尾揭示制造仪式感，通过环境动画制造氛围。

### 典型场景

- 视频开场全景/冲击画面
- 结尾品牌/CTA 揭示
- 环境氛围构建

### 与转场的重叠说明

**mood 型 scene 的策略主要是转场选择 + 环境动画，而非幕内元素动画。** 参考 motion-principles.md Section 11 的 content-type × transition 交叉矩阵。mood 型 scene 的核心是情绪传递，不依赖复杂的幕内动画。

### 策略详情

#### camera_pan

- **用途**: 视角平移，用于开场聚焦或场景转换
- **Primary Pattern**: P7 Camera Pan
- **推荐 Easing**: power1.inOut（平滑移动）
- **参数范围**:
  - duration: 1.0-1.5s
  - scale 范围: 1.0 → 2.0
  - x/y offset: 根据画面内容决定
- **代码模板**:
```javascript
// camera_pan example
const tl = gsap.timeline();
tl.to('.viewport', {
  x: -200,
  scale: 1.5,
  duration: 1.2,
  ease: 'power1.inOut'
});
```
- **常见错误**:
  - 平移距离过大（画面内容不应移出可视区域）
  - 平移速度不均匀（使用缓动保持流畅）

#### ending_reveal

- **用途**: 结尾揭示，品牌/CTA 的仪式感展示
- **Primary Pattern**: P10 Ending Reveal
- **推荐 Easing**: back.out(1.5)（CTA 弹性出场）
- **参数范围**:
  - 淡出前幕: 0.4-0.6s
  - 标题出现: 0.6-1.0s
  - CTA 出现: 0.4-0.6s + back.out
- **代码模板**:
```javascript
// ending_reveal example
const tl = gsap.timeline();
// 淡出当前内容
tl.to('.scene-content', {
  opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.inOut'
})
// 标题出现
.from('.ending-title', {
  opacity: 0, y: 20, duration: 0.8, ease: 'power2.out'
}, '-=0.2')
// 副标题
.from('.ending-subtitle', {
  opacity: 0, duration: 0.6, ease: 'power2.out'
}, '-=0.4')
// CTA 弹性出场
.from('.cta', {
  opacity: 0, scale: 0.9, duration: 0.5, ease: 'back.out(1.5)'
}, '-=0.3');
```
- **常见错误**:
  - 所有元素同时出现（必须分层：先淡出旧内容 → 标题 → 副标题 → CTA）
  - CTA 没有弹性效果（CTA 必须使用 back.out 弹性缓动吸引点击）

#### atmosphere_build

- **用途**: 氛围构建，通过背景渐变和微弱的环境动画营造情绪
- **Primary Pattern**: 无直接对应——使用自定义 CSS 动画或简单 GSAP opacity/position 循环
- **推荐 Easing**: 线性（循环动画）或 power1.inOut（一次性渐变）
- **参数范围**:
  - 背景渐变 duration: 1.5-3.0s
  - 微粒/形状运动: 无限循环，duration 2.0-5.0s
  - 整体 opacity 变化: 0.3-0.6 的微妙范围
- **代码模板**:
```javascript
// atmosphere_build example
const tl = gsap.timeline();
// 背景渐变
tl.to('.background', {
  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  duration: 2.0,
  ease: 'power1.inOut'
});
// 微粒缓慢浮动（循环）
gsap.to('.particle', {
  y: -20, opacity: 0.4, duration: 3.0,
  repeat: -1, yoyo: true, ease: 'sine.inOut',
  stagger: { each: 0.5, from: 'random' }
});
```
- **常见错误**:
  - 过度动画（mood 是氛围，不是奇观——动画幅度要克制）
  - 环境动画过于抢眼（微粒/形状应低 opacity、慢速度，不抢焦点）

### 常见错误汇总

- **过度动画**：mood 型的核心是氛围，动画幅度要克制（小幅度、慢速度、低 opacity）
- **与相邻 scene 无连接**：mood 型应与前后 scene 的情绪衔接，不能孤立

## 术语映射表

本文件为术语映射的规范来源。其他文件引用此表。

| Guide 术语 | 现有 Storyboard 术语 | 说明 |
|-----------|---------------------|------|
| fade | cross-dissolve, fade-to-black | cross-dissolve = 元素间淡入淡出；fade-to-black = 淡入/淡出黑屏 |
| slide | （新术语） | 方向性滑动，替代无方向性的通用 transition |
| scale | zoom-in, zoom-out | zoom-in = 放大聚焦；zoom-out = 拉远全局 |
| wipe | （新术语） | 强擦除切换，用于章节分隔 |
| morph | （新术语） | 形态变形，用于概念关联的 scene 间 |
| cut | hard-cut | 硬切，同主题连续 scene 间 |

## 转场策略

转场动画策略参见 `references/motion-principles.md` Section 11（Scene Transition Strategy）。

本 Guide 的 content-type 判断与 motion-principles.md 的转场选择配合使用。
