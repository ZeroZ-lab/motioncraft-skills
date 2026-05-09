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
    secondary_font:
    heading_size:
    body_size:
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

### Step 2：逐幕设计

为每个 scene 设计静态关键帧：

```yaml
styleframes:
  - scene_id: scene_01
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

评估每个 keyframe 适合的动效类型：

```
这个场景适合什么类型的动画？
动画能帮助理解吗？
动画是否太多/太少？
关键元素的入场/退场方式？
```

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
