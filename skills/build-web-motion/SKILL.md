---
name: build-web-motion
description: 生成 Web 动画工程。使用 cuando storyboard + styleframes 已批准需要生成可渲染工程
---

# Web Motion Composition — Web 动画工程生成

> 领域: workflow | 宪法: 第 5（Storyboard Is Contract）、第 6（Verify Don't Assume）条

## 入口/出口
- **入口**: 已批准 storyboard + styleframes
- **出口**: `project/` 工程目录 + preview 验证证据
- **指向**: 完成后调用 `verify-render-qa`
- **假设已加载**: CANON.md + `design-storyboard` + `design-styleframes`

## 何时不使用
- 视频不需要 Web 动画（实拍、3D 渲染等）
- 已有可用的动画工程

## Iron Law

<HARD-GATE>
**把分镜翻译成可渲染的 Web 工程。**
所有 scene 必须来自 storyboard。所有动画必须进入 timeline。
不做一边想创意一边写代码的事。
不重新发明场景——composition 只执行 storyboard 的合同。
</HARD-GATE>

## 技术栈

默认推荐：

```
HyperFrames         — HTML → Preview → Render
HTML / CSS / SVG    — 画面结构
GSAP                — 时间轴动画
PixiJS / Three.js   — 仅在需要特效时调用
```

## 流程

### Step 1：读取合同

读取 storyboard 和 styleframes，理解每个 scene 的完整定义。不猜测，不发明。

### Step 2：初始化工程

创建工程目录结构：

```
project/
  index.html          — 主入口
  styles.css          — 全局样式
  motion.js           — GSAP timeline
  storyboard.json     — 分镜数据
  assets/             — 素材目录
```

### Step 3：逐 scene 实现

按 storyboard 的顺序，逐个 scene 实现：

**3.1 HTML 结构**
- 每个 scene 一个容器 `<div class="scene" id="scene-01">`
- 结构与 styleframe 一致
- 不添加 storyboard 之外的元素

**3.2 CSS 样式**
- 使用 styleframes 定义的视觉系统
- 颜色、字体、间距统一
- 响应式适配目标画幅

**3.3 GSAP Timeline**
- 所有动画进入主 timeline
- 使用 `gsap.timeline()` 管理序列
- 每个 scene 的动画时长匹配 storyboard
- 使用 `references/motion-principles.md` 中的动效标准

```javascript
const tl = gsap.timeline();

// scene_01: hook (0s - 4s)
tl.from('#scene-01 .title', { opacity: 0, y: 30, duration: 1, ease: 'power2.out' })
  .from('#scene-01 .subtitle', { opacity: 0, duration: 0.8 }, '-=0.5')
  // ...

// scene_02: problem (4s - 10s)
tl.to('#scene-01', { opacity: 0, duration: 0.5 })
  .from('#scene-02 .problem-text', { opacity: 0, scale: 0.8, duration: 0.8 })
  // ...
```

### Step 4：技术指导（motion-engineer）

分派 `agents/motion-engineer.md` 指导：

- scene block 选型建议
- GSAP easing 和 duration 优化
- 性能优化（will-change, transform vs top/left）
- SVG vs Canvas 选型
- 何时使用 PixiJS

### Step 5：Preview 验证

<HARD-GATE>
**每个 scene 实现后必须 preview 验证。**
不累积 5 个 scene 后再一起看。每个 scene 独立验证。
</HARD-GATE>

验证项：
- [ ] scene 结构与 storyboard 一致
- [ ] 视觉效果与 styleframe 一致
- [ ] 动画时长匹配 storyboard
- [ ] 无 JS 错误
- [ ] 无缺资源

### Step 6：Timeline 集成

所有 scene 通过后，组装完整 timeline：

- 检查 scene 间转场
- 检查总时长匹配 brief
- 检查整体节奏感
- Preview 完整视频

### Step 7：产出

```markdown
# Web Motion Composition: <视频名称>

## 工程结构
- project/index.html
- project/styles.css
- project/motion.js
- project/storyboard.json
- project/assets/

## Scene 实现清单
- [ ] scene_01: ✅ preview 通过
- [ ] scene_02: ✅ preview 通过
- ...

## Timeline 验证
- total_duration: Xs
- scene_count: X
- 与 storyboard 对齐: ✅

## Motion Engineer 指导采纳
- [具体指导及采纳情况]
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| 视觉效果与 styleframe 不一致 | 调整 CSS/GSAP 参数 |
| 动画时长不匹配 | 调整 GSAP duration |
| JS 错误 | 修复代码，重新 preview |
| 缺资源 | 标注缺失，创建占位或获取资源 |
| 性能问题 | 简化动画，减少同时运动元素 |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "先写完所有 scene 再调" | 一个 scene 的 bug 会让后续全部出错。逐个验证。 |
| "这里可以加点 storyboard 之外的效果" | Storyboard 是合同。不重新发明。 |
| "setTimeout 更简单" | 所有动画必须进入 GSAP timeline。散落 setTimeout = 无法管理。 |
| "用 GSAP 插件解决" | 先用基础 API。插件只在必要时引入。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- 添加 storyboard 之外的 scene
- 动画不进入 GSAP timeline
- 多个 scene 累积后才做 preview
- 一边想创意一边写代码
- 每个 scene 从零发明（不使用 scene block registry）
</HARD-GATE>

## 验证清单

- [ ] 每个 scene 结构来自 storyboard
- [ ] 视觉效果来自 styleframes
- [ ] 所有动画在 GSAP timeline 中
- [ ] 每个 scene 独立 preview 通过
- [ ] 完整 timeline preview 通过
- [ ] 总时长匹配 brief
- [ ] 无 JS 错误
- [ ] 无缺资源
