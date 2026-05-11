---
name: design-styleframes
description: 设计静态关键帧。使用 cuando storyboard 已批准需要设计每一幕的静态画面
---

# Styleframes — 静态关键帧设计

> 领域: workflow | 宪法: 第 3（Static Before Motion）条

## 入口/出口
- **入口**: 已批准 storyboard（`docs/video/<name>/04-storyboard.md`）
- **出口**: `docs/video/<name>/05-styleframes.md`
- **指向**: 完成后调用 `build-web-motion`
- **假设已加载**: CANON.md + `design-storyboard`

## 何时不使用
- 视频是纯代码生成的数据可视化
- 已有完整的视觉设计系统

## Iron Law

<HARD-GATE>
**先让画面成立，再让画面动起来。**
很多动画失败不是动效问题，而是静态构图本来就不成立。
每个 scene 的静态关键帧必须通过视觉质量检查后，才能进入 composition。
</HARD-GATE>

## 流程

### Step 1：定义视觉系统

在为每一幕设计之前，先确定整体视觉系统：

```yaml
visual_system:
  typography:
    primary_font:
    primary_font_fallback:   # 至少 1 个 fallback + 通用族名
    secondary_font:
    secondary_font_fallback: # 至少 1 个 fallback + 通用族名
    heading_size:
    body_size:
  font_loading:
    method: "cdn"            # "cdn" 或 "local"
    cdn_link:                # Google Fonts URL（如使用 CDN）
    local_path:              # assets/fonts/（如使用本地字体）
  color:
    primary:
    secondary:
    accent:
    background:
    text:
  spacing:
    margin:
    padding:
    grid:
  motion:
    default_easing:
    default_duration:
    enter_type:
    exit_type:
```

### Step 1.5：字体可用性检查

在确定视觉系统的字体后，验证字体可用性：

**检查清单：**
- [ ] 主字体有 fallback 字体（如 `'JetBrains Mono', 'Fira Code', monospace`）
- [ ] 次要字体有 fallback 字体（如 `'Inter', 'SF Pro', sans-serif`）
- [ ] Google Fonts CDN 链接正确（`<link href="https://fonts.googleapis.com/css2?family=...">`）
- [ ] 无效字体名不出现（拼写错误、不存在的字体）

**字体加载验证（浏览器控制台）：**

```javascript
document.fonts.ready.then(() => {
  const fonts = ['JetBrains Mono', 'Inter']; // 替换为实际使用的字体
  fonts.forEach(font => {
    const loaded = document.fonts.check('16px "' + font + '"');
    console.log(`${font}: ${loaded ? '已加载' : '未加载'}`);
  });
});
```

**生产环境建议：**
- 需要渲染导出的项目，建议将字体文件下载到 `assets/fonts/` 目录
- 使用 `@font-face` 本地引用替代 CDN
- 确保所有 fallback 字体在同一条 `font-family` 声明中

### Step 2：逐幕设计

为每个 scene 设计静态关键帧：

```yaml
styleframes:
  - scene_id: scene_01
    content_type: text              # 新增：来自 storyboard
    animation_strategy: title_reveal  # 新增：来自 storyboard
    frame_description:        # 画面整体描述
    layout:                   # 布局方式
    typography:               # 文字排版
    color:                    # 色彩方案
    main_visual:              # 主要视觉元素
    text_position:            # 文字位置
    object_position:          # 主要对象位置
    motion_potential:          # 动效潜力评估
```

### Step 3：构图检查

对每个 keyframe 检查：

```
这一幕有没有视觉焦点？
文字是否太多（超过 2 行）？
画面层级是否清楚（主 > 次 > 背景）？
留白是否足够？
视觉元素是否服务理解？
```

**构图层级：**

| 层级 | 职责 | 占比 |
|------|------|------|
| 主角 | 核心信息/核心视觉 | 60-70% |
| 配角 | 支撑信息/辅助视觉 | 20-30% |
| 背景 | 氛围/环境 | 10-20% |

### Step 4：动效潜力评估

根据 `content_type` 差异化评估动效潜力。

#### 按 content_type 的评估问题

**text 型**:
- 文字展示后是否有足够停留时间（≥ 0.5s）让阅读？
- 文字层级是否引导视线（标题 → 副标题 → 正文）？
- 关键词是否有高亮/强调动效？

**data 型**:
- 数量感是否通过动画建立（数字计数而非静态显示）？
- 数据是否有上下文标注（单位、基准值）？
- 多个指标是否有时序展开（stagger）？

**concept 型**:
- 概念是否逐层递进展示？
- 抽象概念是否通过动画具象化？
- 层次关系是否通过动效表达？

**process 型**:
- 流程方向是否清晰可见（箭头/路径）？
- 步骤连接是否通过动画表达？
- 整体流向是否引导视线？

**comparison 型**:
- 差异是否通过动效突出（而非静态并排）？
- A/B 侧是否有视觉分隔？
- 参照物是否先建立再展示差异？

**mood 型**:
- 氛围是否通过背景动画建立？
- 转场是否与情绪匹配？
- 是否有足够的视觉冲击力？

#### animation_strategy 可行性检查

评估给定的 `animation_strategy`（来自 storyboard）在当前 visual layout 下是否可实现：
- 布局是否有足够空间执行策略对应的动效？
- 元素层级是否支持策略要求的动画序列？
- 如果不可行，建议调整 strategy 或 visual layout

### Step 5：Styleframe Scout（styleframe-reviewer）

分派 `agents/styleframe-reviewer.md` 验证：

- 视觉焦点是否清晰？
- 排版层级是否清楚？
- 构图是否平衡？
- 色彩是否一致？
- 动效潜力是否合理？
- 文字量是否适当？

### Step 6：产出

输出到 `docs/video/<name>/05-styleframes.md`：

```markdown
# Styleframes: <视频名称>

## 视觉系统
- typography:
- color:
- spacing:
- motion:

## Keyframes

### scene_01
- frame_description:
- layout:
- main_visual:
- text_position:
- 构图检查:
- 动效潜力:

### scene_02
...

## 一致性检查
- [ ] 所有 scene 风格一致
- [ ] 排版系统统一
- [ ] 色彩方案统一
- [ ] 动效风格统一

## Scout Review
- styleframe-reviewer verdict:
- blocking resolved:
- important adopted:
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| 没有视觉焦点 | 简化元素，突出核心 |
| 文字太多 | 删减文字，用视觉替代 |
| 层级不清 | 调整大小、颜色、位置对比 |
| 构图不平衡 | 调整元素位置和留白 |
| 动效潜力低 | 增加可动元素或简化静态元素 |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "动画阶段再调构图" | 构图问题在动画阶段只会放大。 |
| "多放点文字信息" | 观众来不及读。2 行以内。 |
| "这个场景很好看了，不需要动画" | 不需要动画 = 不需要这个场景。 |
| "每个场景风格可以不同" | 风格一致性是视频的基本质量。 |

## 红旗

- 没有视觉焦点的 keyframe
- 文字超过 2 行的 scene
- 层级不分的构图
- 场景间风格不一致
- 没有通过构图检查就进入 composition

## 验证清单

- [ ] 视觉系统已定义（字体、颜色、间距）
- [ ] 每个 scene 有 styleframe
- [ ] 每个 keyframe 通过构图检查
- [ ] 所有 keyframe 风格一致
- [ ] 动效潜力已评估
- [ ] styleframe-reviewer 已审查
