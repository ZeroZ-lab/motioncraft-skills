# text_typewriter — 代码/终端逐字出现

> engine: gsap | aliases: none | Pattern: P6 Text Highlight 变体（逐字动画, code_text 子类型）

## 参数范围

| 参数 | min | max | default | 说明 |
|------|-----|-----|---------|------|
| char speed | 30ms | 80ms | 50ms | 每字符出现间隔（低于 30ms 观众无法跟随） |
| cursor blink | 0.3s | 0.7s | 0.5s | 光标闪烁周期 |
| max chars per line | 60 | 80 | 70 | 单行最大显示字符数（超出换行） |
| line stagger | 0.3s | 0.5s | 0.4s | 多行场景中行与行的时间差 |
| syntax highlight duration | 0.2s | 0.3s | 0.25s | 语法高亮变色时长（二级动画） |
| syntax highlight stagger | 0.01s | 0.03s | 0.02s | 同类语法高亮元素间 stagger |
| hold after complete | 0.3s | 1.0s | 0.5s | 逐字完成后停留时间（代码行 hold >= 0.3s） |
| easing | none | none | none | 匀速逐字（模拟真实输入节奏，不使用缓动） |

## Integration Spec

### HTML 结构规范

```html
<div class="scene" id="scene-N">
  <div class="code-block">
    <div class="code-line">
      <!-- GSAP 动态生成的 .char 元素 -->
      <span class="char">c</span>
      <span class="char syntax-keyword">o</span>
      ...
      <span class="cursor"></span>
    </div>
    <!-- 多行场景 -->
    <div class="code-line">
      ...
      <span class="cursor"></span>
    </div>
  </div>
</div>
```

- `.code-block` — 代码容器，终端/编辑器背景 + border
- `.code-line` — 单行代码容器，min-height 保证行高一致
- `.char` — 每个字符的 span，由 GSAP 动态插入
- `.char.syntax-keyword` — 关键词字符（二级动画变色）
- `.char.syntax-string` — 字符串字符（二级动画变色）
- `.char.syntax-comment` — 注释字符（二级动画变色）
- `.cursor` — 光标元素，块状光标闪烁

### CSS 变量列表

| 变量名 | 默认值 | Override 方式 |
|--------|--------|--------------|
| --mc-font-secondary | 'JetBrains Mono', monospace | 代码字体（等宽字体，模板可 override 为其他 monospace） |
| --mc-primary | #00ff88 | 关键词高亮颜色 |
| --mc-accent | #00cc6a | 字符串高亮颜色 |
| --mc-text-muted | #6b6b7b | 注释高亮颜色 + 光标暗态颜色 |
| --mc-bg-alt | #1a1a2e | 代码容器背景色 |
| --mc-border | #2a2a3a | 代码容器边框色 |
| --mc-text | #e0e0e0 | 基础代码文字颜色（非语法高亮字符） |
| --mc-body-size | 1rem | 代码字号 |
| --mc-spacing-md | 1rem | 代码容器内边距 |
| --mc-spacing-lg | 2rem | 代码容器水平内边距 |

### GSAP 代码模板

```javascript
// text_typewriter — 单行代码逐字出现
const codeText = 'const app = express();';
const chars = codeText.split('');
const container = document.querySelector('.code-line');
const cursor = document.querySelector('.cursor');

// 清除 CSS 状态占位符（最终状态元素）
const existingChars = container.querySelectorAll('.char');
existingChars.forEach(el => el.remove());

const tl = gsap.timeline({ paused: true });

// 逐字出现：每 50ms 一个字符，无缓动
chars.forEach((char, i) => {
  tl.add(() => {
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add('char');
    // 语法分类将在二级动画中变色
    const syntaxClass = classifyChar(char, i, codeText);
    if (syntaxClass) span.dataset.syntax = syntaxClass;
    container.insertBefore(span, cursor);
  }, i * /* PARAM: char_speed, default 0.05 */);
});

// 二级动画：语法高亮变色
// keyword → --mc-primary (蓝/绿), string → --mc-accent (绿), comment → --mc-text-muted (灰)
const syntaxStart = chars.length * /* PARAM: char_speed, default 0.05 */ + 0.1;
document.querySelectorAll('.char[data-syntax="syntax-keyword"]').forEach((span, i) => {
  tl.to(span, {
    color: 'var(--mc-primary, #00ff88)',
    duration: /* PARAM: syntax_highlight_duration, default 0.25 */,
    ease: 'none'
  }, syntaxStart + i * /* PARAM: syntax_highlight_stagger, default 0.02 */);
});
document.querySelectorAll('.char[data-syntax="syntax-string"]').forEach((span, i) => {
  tl.to(span, {
    color: 'var(--mc-accent, #00cc6a)',
    duration: /* PARAM: syntax_highlight_duration, default 0.25 */,
    ease: 'none'
  }, syntaxStart + i * /* PARAM: syntax_highlight_stagger, default 0.02 */);
});
document.querySelectorAll('.char[data-syntax="syntax-comment"]').forEach((span, i) => {
  tl.to(span, {
    color: 'var(--mc-text-muted, #6b6b7b)',
    duration: /* PARAM: syntax_highlight_duration, default 0.25 */,
    ease: 'none'
  }, syntaxStart + i * /* PARAM: syntax_highlight_stagger, default 0.02 */);
});

// Hold >= 0.3s after complete (mandatory, code lines >= 0.3s dwell)
tl.to({}, { duration: /* PARAM: hold, default 0.5 */ });

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;

// 光标闪烁：0.5s 周期，无限循环
gsap.to(cursor, {
  opacity: 0,
  duration: /* PARAM: cursor_blink, default 0.5 */,
  repeat: -1,
  yoyo: true,
  ease: 'steps(1)'
});
```

### 语法高亮规则

| 语法类型 | CSS 类名 | 颜色变量 | 变色 duration | 说明 |
|---------|---------|---------|-------------|------|
| keyword | `.syntax-keyword` | --mc-primary (#00ff88) | 0.2-0.3s | const, let, var, function, return, if, else, for, while, class, import, export |
| string | `.syntax-string` | --mc-accent (#00cc6a) | 0.2-0.3s | 单引号/双引号/反引号内的内容 |
| comment | `.syntax-comment` | --mc-text-muted (#6b6b7b) | 0.2-0.3s | // 单行注释, /* */ 块注释 |

**规则**: 语法高亮是二级动画——文字先以统一颜色 (--mc-text) 出现，随后关键词变色。变色 stagger 0.02s，让观众感知"色彩涌现"而非瞬间切换。

### 多行代码模板

```javascript
// text_typewriter — 多行代码逐行逐字出现
const codeLines = [
  'const app = express();',
  'app.listen(3000);',
  '// server started'
];
const containers = document.querySelectorAll('.code-line');

const tl = gsap.timeline({ paused: true });

codeLines.forEach((lineText, lineIdx) => {
  const container = containers[lineIdx];
  const cursor = container.querySelector('.cursor');
  const chars = lineText.split('');

  chars.forEach((char, charIdx) => {
    tl.add(() => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('char');
      const syntaxClass = classifyChar(char, charIdx, lineText);
      if (syntaxClass) span.dataset.syntax = syntaxClass;
      container.insertBefore(span, cursor);
    }, lineIdx * /* line_stagger, default 0.4 */ + charIdx * /* char_speed, default 0.05 */);
  });
});

// 语法高亮二级动画（同上）
// ...

window.__timelines = window.__timelines || {};
window.__timelines['<composition-id>'] = tl;
```

## 快速路径 vs 扩展路径

**快速路径**：替换代码文本和语法配色
```javascript
// 1. 替换代码文本
const codeText = 'import React from "react";';  // 替换为 storyboard 代码

// 2. 替换语法配色（CSS 变量 override）
:root {
  --mc-primary: #3b82f6;    /* override 关键词颜色为蓝色 */
  --mc-accent: #10b981;     /* override 字符串颜色为绿色 */
  --mc-text-muted: #9ca3af; /* override 注释颜色 */
}
```

**扩展路径**：多行代码 + 语法高亮
- 多行场景：添加多个 `.code-line` 元素，行间 stagger 0.3-0.5s
- 语法高亮引擎：集成 Prism.js / highlight.js 替代手动 classifyChar
- 终端装饰：添加行号 (`.line-number`)、标签栏 (`.terminal-tab`)、窗口按钮
- 执行结果行：代码输入后显示输出行（不同样式，如绿色 `> output`）

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 逐字速度太快 (< 30ms/char) | 最低 30ms/char，观众需要时间跟随 |
| 一次性显示所有代码 | 逐行出现，行间 stagger 0.3-0.5s |
| 代码文字与语法高亮同时变色 | 文字先统一色出现，后变色（二级动画） |
| CSS 设置 opacity:0 + GSAP .from({opacity:0}) | CSS 定义最终可见状态（chars visible, cursor blinking），GSAP 动态重建 FROM hidden |
| 光标不闪烁 | cursor 必须 blink，0.5s yoyo 循环 |
| 超长行代码超出画面 | 单行最大 60-80 字符，超出换行 |
| hold 时间不足 | 代码行完成后 hold >= 0.3s，让观众阅读 |

## storyboard 字段映射

| storyboard 字段 | block 参数 | 说明 |
|----------------|-----------|------|
| animation_strategy: text_typewriter | 使用 text_typewriter block | 直接匹配 |
| content_type: text | --mc-text 系列变量 | 文字型配色 |
| content_type: code_text | --mc-font-secondary + 语法高亮变量 | 代码子类型配色 |
| duration | char_speed * char_count + syntax_duration + hold | 总时长 =逐字 + 高亮 + 停留 |
| visual 代码文本 | codeText 参数 | 逐字出现的代码字符串 |
| visual 终端/编辑器描述 | .code-block CSS | 容器样式 override |