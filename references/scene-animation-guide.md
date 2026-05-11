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
  # --- GSAP strategies ---
  - title_reveal        #engine:gsap     # 标题/大字出现
  - text_highlight       #engine:gsap     # 关键词高亮
  - text_typewriter      #engine:gsap     # 代码/终端逐字出现（code_text 子类型）
  - text_ending          #engine:gsap     # 结尾 CTA/总结出现
  # --- anime.js strategies ---
  - blur_reveal          #engine:animejs  # 逐字模糊揭示（来自 React-Bits BlurText）
  - split_text_reveal    #engine:animejs  # 逐字拆分揭示（来自 React-Bits SplitText）
  - decrypt_reveal       #engine:animejs  # 逐字解码揭示（来自 React-Bits DecryptedText）
  - glitch_reveal        #engine:animejs  # 逐字错乱揭示（来自 React-Bits GlitchText）

data:
  # --- GSAP strategies ---
  - number_count         #engine:gsap     # 数字计数动画
  - data_dashboard       #engine:gsap     # 多指标仪表盘（stagger + count 组合）
  # --- anime.js strategies ---
  - count_up_anim        #engine:animejs  # 弹簧计数动画（来自 React-Bits CountUp）

concept:
  # --- GSAP strategies ---
  - diagram_build        #engine:gsap     # 架构图/层次图逐步构建
  - concept_layers        #engine:gsap     # 概念层层叠加展示
  - card_stack           #engine:gsap     # 卡片堆叠分类
  # --- anime.js strategies ---
  - morph_build          #engine:animejs  # SVG 形态变形构建（anime.js morphTo）
  - line_draw_anime      #engine:animejs  # SVG 路径精确绘制（anime.js createDrawable）

process:
  # --- GSAP strategies ---
  - line_draw            #engine:gsap     # 路径/线条绘制（CSS stroke-dashoffset）
  - flow_build           #engine:gsap     # 流程图/管道逐步构建
  - pipeline_sequence    #engine:gsap     # 步骤序列展示

comparison:
  # --- GSAP strategies ---
  - stagger_compare      #engine:gsap     # 卡片依次出现对比
  - grid_swap            #engine:gsap     # 网格切换（A/B 方案）
  - before_after         #engine:gsap     # 前后对比变形
  # --- anime.js strategies ---
  - morph_compare        #engine:animejs  # SVG 形态前后对比（anime.js morphTo）

mood:
  # --- GSAP strategies ---
  - camera_pan           #engine:gsap     # 视角平移（开场/聚焦）
  - ending_reveal        #engine:gsap     # 结尾揭示（品牌/CTA）
  - atmosphere_build     #engine:gsap     # 氛围构建（背景 + 环境动画）
  # --- anime.js strategies ---
  - spring_enter         #engine:animejs  # 弹簧物理入场（anime.js createSpring）
```

## 引擎选择规则（How-to Guide）

每个 scene 的动画引擎由以下规则决定。此节是 Guide（方向指引），与策略词表（Reference lookup）Diataxis 分离。

**决策流**:

1. **Step 1: content_type** — 不变，6 种类型之一
2. **Step 2: animation_strategy** — 不变，从策略词表选择（策略名自带 `#engine:xxx` 标签）
3. **Step 3: engine_preference** — 当策略词表已携带单一引擎标签时，Step 3 是**确认**而非新决策

**Step 3 规则**:
```
规则 1: 策略需要 SVG morph？ → animejs（唯一选择，GSAP MorphSVG 付费）
规则 2: 策略需要 spring physics？ → animejs（首选）
  妥协路径 gsap+back.out 仅在 anime.js 未注册于同一 composition 时可用
规则 3: visual_effect 引用了 React-Bits animejs 组件？ → animejs
规则 4: 否则 → gsap（默认）
```

**特殊情况**:
- `line_draw` 策略（`#engine:gsap`）使用 CSS stroke-dashoffset 覆盖 80%+ 场景。如需精确路径控制，选择 `line_draw_anime`（`#engine:animejs`）使用 createDrawable
- `atmosphere_build` 策略（`#engine:gsap`）用于 CSS/GSAP 氛围。Three.js（hf-seek）用于 WebGL shader 背景——独立设计迭代处理

**engine_preference 是 advisory per CANON §5**: Build 阶段仅在以下条件可变更：
1. 首选引擎 Duration Gate 验证失败
2. Spike 验证显示首选引擎无法正确 seek
3. animejs-video-guide.md 中记录的技术约束阻止首选方案

**effect_justification 适用所有引擎**: 当 `visual_effect` 字段存在时，无论引擎类型都必须填写 `effect_justification`（CANON §4: Motion Serves Understanding）。

**Feature Parity Matrix**:
| Capability | GSAP | anime.js | CSS/WAAPI |
|------------|------|----------|-----------|
| Timeline composition | Full | Partial | N/A |
| Text entrance | Standard (opacity/y) | Enhanced (per-char blur/split/decrypt/glitch) | Basic |
| Number counting | Smooth (power1.out) | Spring-based (createSpring) | N/A |
| SVG path morphing | MorphSVG (paid) | morphTo (free, basic shapes) | N/A |
| SVG line drawing | stroke-dashoffset (free) / DrawSVG (paid) | createDrawable (free) | stroke-dashoffset (free) |
| Spring physics | elastic.out (approximation) | spring() (true physics) | N/A |
| Stagger orchestration | Full (advanced options) | stagger() (basic) | N/A |
| HyperFrames seek | seconds | milliseconds (v3) / TBD (v4) | CSS animation play-state |

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

**Block Reference**: [title_reveal demo](../scene-blocks/text/title_reveal.html) | [Integration Guide](../scene-blocks/text/title_reveal.md) | aliases: text_ending

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

**Block Reference**: [text_highlight demo](../scene-blocks/text/text_highlight.html) | [Integration Guide](../scene-blocks/text/text_highlight.md)

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

**Block Reference**: [text_typewriter demo](../scene-blocks/text/text_typewriter.html) | [Integration Guide](../scene-blocks/text/text_typewriter.md)

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

**Block Reference**: title_reveal block (text_ending alias) — 见 [title_reveal Integration Guide](../scene-blocks/text/title_reveal.md) | [demo](../scene-blocks/text/title_reveal.html)

#### blur_reveal #engine:animejs

- **用途**: 逐字模糊揭示，用于强调关键词的转换过程。每个字符从模糊→清晰，强调"从不确定到确定"的语义
- **Primary Pattern**: P14 Blur Reveal
- **推荐 Easing**: easeOutExpo（anime.js）
- **参数范围**:
  - duration: 0.6-1.0s per character group
  - stagger: 0.05-0.1s per character
  - blur range: 8-12px → 0px
  - y offset: 15-25px → 0
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// blur_reveal example — anime.js
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
- **effect_justification 示例**: "逐字模糊揭示强调'新方法取代旧方法'的转换过程——模糊→清晰映射不确定→确定"
- **常见错误**:
  - 对所有文字都用 blur_reveal（只对关键词用，其余静态显示）
  - stagger 过快（< 0.03s/char 观众无法感知逐字过程）
  - blur 值过大（> 12px 字符完全不可辨识，失去揭示感）

**Block Reference**: Phase 2 待添加（anime.js blocks 等 dual-engine Spike 验证后创建）

#### split_text_reveal #engine:animejs

- **用途**: 逐字拆分揭示，字符从分散位置汇聚到正确位置。强调"从混乱到有序"的语义
- **Primary Pattern**: P15 Split Text Reveal
- **推荐 Easing**: easeOutExpo（anime.js）
- **参数范围**:
  - duration: 0.6-1.0s per character group
  - stagger: 0.04-0.08s per character
  - x/y scatter: ±30-50px → 0
  - rotation scatter: ±15-30deg → 0
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// split_text_reveal example — anime.js
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
- **effect_justification 示例**: "逐字拆分揭示强调'从碎片化信息到完整理解'的汇聚过程——散落→归位映射混乱→有序"
- **常见错误**:
  - scatter 距离过大（> 60px 字符脱离画面，观众无法跟踪）
  - 与 blur_reveal 混用（同一 scene 不要混用两种揭示策略）

**Block Reference**: Phase 2 待添加

#### decrypt_reveal #engine:animejs

- **用途**: 逐字解码揭示，字符从随机字符逐步替换为正确字符。强调"信息解锁/解密"的语义
- **Primary Pattern**: (React-Bits DecryptedText 提取)
- **推荐 Easing**: linear（解码是匀速过程，模拟真实解密节奏）
- **参数范围**:
  - duration: 0.5-1.5s per character group
  - stagger: 0.03-0.05s per character
  - iteration count: 2-4 次随机替换后定稿
  - random character set: alphanumeric + symbols
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// decrypt_reveal example — anime.js
// 字符替换逻辑需要手动实现（React-Bits 提取）
const tl = anime.createTimeline({ autoplay: false });
tl.add('.decrypt-char', {
  opacity: [0, 1],
  duration: 0.6,
  stagger: 0.04,
  ease: 'linear',
  // 字符替换在 onUpdate 中手动处理
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```
- **effect_justification 示例**: "逐字解码揭示强调'加密数据逐步解锁'的过程——乱码→正确映射隐藏→揭示"
- **常见错误**:
  - iteration 次数过多（> 5 次观众无法感知定稿字符的出现）
  - 解码速度与叙事不匹配（快节奏 → 0.5s，讲解节奏 → 1.5s）

**Block Reference**: Phase 2 待添加

#### glitch_reveal #engine:animejs

- **用途**: 逐字错乱揭示，字符短暂出现随机位移/颜色/透明度抖动后稳定。强调"不稳定、破坏、技术故障"的语义
- **Primary Pattern**: (React-Bits GlitchText 提取)
- **推荐 Easing**: easeOutExpo（抖动→稳定）
- **参数范围**:
  - duration: 0.4-0.8s per character
  - stagger: 0.03-0.06s per character
  - glitch amplitude: translate ±5-10px, rotate ±3-5deg, color shift ±20%
  - glitch iteration: 2-3 次抖动后稳定
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// glitch_reveal example — anime.js
const tl = anime.createTimeline({ autoplay: false });
tl.add('.glitch-char', {
  opacity: [0, 1],
  translateX: [8, 0],
  skewX: [5, 0],
  duration: 0.6,
  stagger: 0.04,
  ease: 'easeOutExpo'
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```
- **effect_justification 示例**: "逐字错乱揭示强调'系统不稳定/技术正在崩溃'——抖动→稳定映射混乱→恢复"
- **常见错误**:
  - glitch 幅度过大（> 15px 抖动变成不可阅读，失去揭示感）
  - 对温和内容使用 glitch（glitch 仅用于表达不稳定/故障/破坏语义）

**Block Reference**: Phase 2 待添加

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

**Block Reference**: [number_count demo](../scene-blocks/data/number_count.html) | [Integration Guide](../scene-blocks/data/number_count.md)

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

**Block Reference**: number_count block (data_dashboard alias) — 见 [number_count Integration Guide](../scene-blocks/data/number_count.md) | [demo](../scene-blocks/data/number_count.html)

#### count_up_anim #engine:animejs

- **用途**: 弹簧计数动画，数字以弹簧物理运动到目标值。弹簧效果让数字有"活力感"和"超调回弹"
- **Primary Pattern**: P19 Count Up Spring
- **推荐 Easing**: anime.js spring（stiffness: 200, damping: 15）
- **参数范围**:
  - spring_stiffness: 100-500, default 200
  - spring_damping: 5-30, default 15
  - 弹簧让数字短暂超过目标值后回弹——传达增长活力
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// count_up_anim example — anime.js spring
const tl = anime.createTimeline({ autoplay: false });
tl.add('.metric-value', {
  innerHTML: [0, 12847],
  round: true,
  spring: { stiffness: 200, damping: 15 },
  duration: 0, // spring auto-calculates duration
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```
- **effect_justification 示例**: "弹簧计数传达'增长活力'——数字超调后回弹映射快速增长势头"
- **常见错误**:
  - spring stiffness 过高（> 500 数字震荡剧烈，不可读）
  - spring damping 过低（< 5 回弹次数过多，观众困惑）
  - 未使用 stretch() 控制 duration（spring auto-calculates，需 stretch() 强制时长对齐 storyboard）

**Block Reference**: Phase 2 待添加

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

**Block Reference**: [diagram_build demo](../scene-blocks/concept/diagram_build.html) | [Integration Guide](../scene-blocks/concept/diagram_build.md) | aliases: concept_layers, card_stack

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

**Block Reference**: diagram_build block (concept_layers alias) — 见 [diagram_build Integration Guide](../scene-blocks/concept/diagram_build.md)

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

**Block Reference**: diagram_build block (card_stack alias) — 见 [diagram_build Integration Guide](../scene-blocks/concept/diagram_build.md)

#### morph_build #engine:animejs

- **用途**: SVG 形态变形构建，元素从一种形状变形到另一种形状。强调"概念转换/形态变化"的语义——形态变形比 fade 切换更能表达"转化关系"
- **Primary Pattern**: P16 Morph Build
- **推荐 Easing**: easeInOutQuad（anime.js）
- **参数范围**:
  - duration: 0.8-1.5s
  - morph_source: 自然语言形状描述（设计师意图，build 阶段翻译为 SVG）
  - morph_target: 自然语言形状描述（设计师意图，build 阶段翻译为 SVG）
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// morph_build example — anime.js SVG morphTo
const tl = anime.createTimeline({ autoplay: false });
tl.add('.morph-element', {
  morphTo: 'M50,5 L95,5 Q95,5 95,50 Q95,95 50,95 Q5,95 5,50 Q5,5 50,5 Z',
  duration: 1.0,
  ease: 'easeInOutQuad'
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```
- **effect_justification 示例**: "形态变形揭示'圆形组织 → 方形流程'的转换关系——形变映射概念转型"
- **常见错误**:
  - morph source 和 target 节点数不匹配（path morph 要求两条 path 的节点数相同或兼容，否则需要手动补点）
  - morph 过快（< 0.8s 观众无法感知形变过程）

**Block Reference**: Phase 2 待添加

#### line_draw_anime #engine:animejs

- **用途**: SVG 路径精确绘制，使用 anime.js createDrawable 实现比 CSS stroke-dashoffset 更精确的路径绘制控制
- **Primary Pattern**: P20 Path Draw
- **推荐 Easing**: easeInOutSine（anime.js）
- **参数范围**:
  - duration: 0.8-1.5s
  - path length: 与 SVG path 总长度匹配
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// line_draw_anime example — anime.js createDrawable
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
- **effect_justification 示例**: "路径精确绘制揭示'数据流向目标'的过程——逐步绘制映射方向指引"
- **常见错误**:
  - 未使用 createDrawable 初始化（anime.js SVG 绘制需要先 createDrawable 声明）
  - 与 GSAP line_draw 混用同一 SVG（同一 composition 中路径绘制应统一使用一种引擎）

**Block Reference**: Phase 2 待添加

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

**Block Reference**: [line_draw demo](../scene-blocks/process/line_draw.html) | [Integration Guide](../scene-blocks/process/line_draw.md) | aliases: flow_build, pipeline_sequence
**Note**: Block demos 使用 CSS stroke-dashoffset（免费），drawSVG 为付费可选升级路径

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

**Block Reference**: line_draw block (flow_build alias) — 见 [line_draw Integration Guide](../scene-blocks/process/line_draw.md)

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

**Block Reference**: line_draw block (pipeline_sequence alias) — 见 [line_draw Integration Guide](../scene-blocks/process/line_draw.md)

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

**Block Reference**: [stagger_compare demo](../scene-blocks/comparison/stagger_compare.html) | [Integration Guide](../scene-blocks/comparison/stagger_compare.md) | aliases: grid_swap, before_after

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

**Block Reference**: stagger_compare block (grid_swap alias) — 见 [stagger_compare Integration Guide](../scene-blocks/comparison/stagger_compare.md)

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

**Block Reference**: stagger_compare block (before_after alias) — 见 [stagger_compare Integration Guide](../scene-blocks/comparison/stagger_compare.md)

#### morph_compare #engine:animejs

- **用途**: SVG 形态前后对比，元素从"状态 A"的形状变形到"状态 B"的形状。比 before_after 的 scale+opacity 更能表达"本质性差异"
- **Primary Pattern**: P17 Morph Compare
- **推荐 Easing**: easeInOutQuad（anime.js）
- **参数范围**:
  - duration: 0.8-1.5s
  - morph_source: 自然语言形状描述（状态 A 形状）
  - morph_target: 自然语言形状描述（状态 B 形状）
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// morph_compare example — anime.js SVG morphTo
const tl = anime.createTimeline({ autoplay: false });
// 状态 A → 状态 B 形变
tl.add('.compare-element', {
  morphTo: 'M50,5 L95,5 Q95,5 95,50 Q95,95 50,95 Q5,95 5,50 Q5,5 50,5 Z',
  duration: 1.2,
  ease: 'easeInOutQuad'
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```
- **effect_justification 示例**: "形态变形对比揭示'旧架构圆形 → 新架构方形'的本质差异——形变映射结构性变化"
- **常见错误**:
  - morph source 和 target 形状过于相似（形变看不出差异 = 不适合用 morph_compare）
  - 未标注 morph_source 和 morph_target 的语义含义（animation_intent 中必须注明"什么→什么"）

**Block Reference**: Phase 2 待添加

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

**Block Reference**: [camera_pan demo](../scene-blocks/mood/camera_pan.html) | [Integration Guide](../scene-blocks/mood/camera_pan.md) | aliases: atmosphere_build

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

**Block Reference**: [ending_reveal demo](../scene-blocks/mood/ending_reveal.html) | [Integration Guide](../scene-blocks/mood/ending_reveal.md)

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

**Block Reference**: camera_pan block (atmosphere_build alias) — 见 [camera_pan Integration Guide](../scene-blocks/mood/camera_pan.md)

#### spring_enter #engine:animejs

- **用途**: 弹簧物理入场，元素以真实的弹簧物理运动（超调+回弹）入场。弹簧效果传达"活力、主动、新鲜"的语义——比 GSAP back.out 更自然
- **Primary Pattern**: P18 Spring Enter
- **推荐 Easing**: anime.js spring（stiffness: 200, damping: 15）
- **参数范围**:
  - spring_stiffness: 100-500, default 200（值越高弹簧越硬，回弹越快）
  - spring_damping: 5-30, default 15（值越高阻尼越大，回弹越少）
  - 高 stiffness + 低 damping = 活力弹性入场
  - 低 stiffness + 高 damping = 温和弹性入场
- **HyperFrames 集成**:
  - anime.js timeline 使用 `autoplay: false` 创建
  - 注册到 `window.__hfAnime`
  - storyboard `engine_preference: animejs`
- **代码模板**:
```javascript
// spring_enter example — anime.js spring physics
const tl = anime.createTimeline({ autoplay: false });
tl.add('.hero-element', {
  translateX: [50, 0],
  translateY: [30, 0],
  opacity: [0, 1],
  spring: { stiffness: 200, damping: 15 },
  duration: 0, // spring auto-calculates duration
});
window.__hfAnime = window.__hfAnime || {};
window.__hfAnime['<composition-id>'] = tl;
```
- **effect_justification 示例**: "弹簧入场传达'活力与主动性'——超调+回弹映射主动出击、充满能量"
- **常见错误**:
  - stiffness 过高（> 500 元素剧烈震荡，不可读）
  - damping 过低（< 5 回弹次数过多，观众困惑）
  - 未使用 stretch() 控制 duration（spring auto-calculates duration，必须用 stretch() 对齐 storyboard 时长）
  - 对所有元素都用弹簧入场（只对 hero/核心元素用弹簧，其余用标准入场）

**Block Reference**: Phase 2 待添加

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
