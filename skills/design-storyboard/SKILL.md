---
name: design-storyboard
description: 把脚本节奏转成可执行场景。使用 cuando script-beats 已批准需要拆分场景
---

# Storyboard — 场景设计

> 领域: workflow | 宪法: 第 2（One Scene One Message）、第 5（Storyboard Is Contract）条

## 入口/出口
- **入口**: 已批准 script-beats（`docs/video/<name>/03-script-beats.md`）
- **出口**: `docs/video/<name>/04-storyboard.md` + `storyboard.json` + 用户批准
- **指向**: 完成后调用 `design-styleframes`
- **假设已加载**: CANON.md + `define-brief` + `design-script-beats`

## 何时不使用
- 已有完整分镜
- 纯文字视频（不需要画面设计）

## Iron Law

<HARD-GATE>
**Storyboard 是视频工程的合同。**
所有 scene、时间、动效意图必须来自 storyboard。
后续 composition 阶段不得重新发明场景，只能执行。
没有经过用户确认的 storyboard，不进入 styleframes 阶段。
</HARD-GATE>

## 流程

### Step 1：Beat → Scene 映射

将每个 beat 转化为 1 个或多个 scene：

```text
beat → scene（1:1 最常见）
beat → 2+ scenes（信息量大时拆分）
2 beats → 1 scene（关联信息合并）
```

**核心规则：**
- 一个 scene 只表达一个意思
- 30s 视频 5-7 个 scene
- 60s 视频 8-12 个 scene
- 每一幕必须有视觉动作
- 动画不能只是装饰

### Step 2：Scene 定义

每个 scene 包含：

```yaml
scenes:
  - id: scene_01
    beat_id: beat_01          # 来源 beat
    start_time: 0             # 开始时间（秒）
    duration: 4               # 持续时长（秒）
    purpose: hook             # 功能目的
    narration:                # 旁白/字幕文本
    on_screen_text:           # 屏幕文字
    visual:                   # 画面描述
    motion:                   # 动效意图
    transition:               # 转场方式
    assets:                   # 所需素材
```

### Step 3：时间轴验证

检查所有 scene 的时间分配：

```
总时长是否匹配 brief？
scene 时间是否重叠？
首尾是否干净（0s 开始，Xs 结束）？
每个 scene 的时长是否足够传达信息？
转场时间是否计入？
```

### Step 4：动效意图标注

每个 scene 标注动效意图（不是具体实现）：

| 动效意图 | 说明 | 适用场景 |
|---------|------|---------|
| reveal | 元素从无到有 | 标题、关键信息 |
| transform | 元素形态变化 | 概念转化 |
| move | 元素位置移动 | 视线引导 |
| highlight | 元素高亮/强调 | 关键数据、重点文字 |
| build | 逐步构建 | 架构图、流程图 |
| compare | 对比展示 | 方案对比、前后对比 |
| data-flow | 数据流动 | 数据处理、系统交互 |
| zoom | 聚焦/拉远 | 细节到全局、全局到细节 |

### Step 5：Storyboard Scout（storyboard-reviewer）

分派 `agents/storyboard-reviewer.md` 验证：

- 节奏是否合理？
- 信息密度是否过高？
- 视觉意图是否可行？
- 时长分配是否合理？
- 每个 scene 是否只有一个核心信息？

### Step 6：用户确认

<HARD-GATE>
**Checkpoint 2：Storyboard 确认**
必须获得用户明确批准。这是第 2 个人工确认点。
用户确认后 storyboard 成为不可变合同。
</HARD-GATE>

### Step 7：产出

输出到 `docs/video/<name>/04-storyboard.md` 和 `storyboard.json`：

**storyboard.json 必须包含 `total_duration` 字段**，供 Duration Gate 验证使用：

```json
{
  "video": {
    "name": "<视频名称>",
    "total_duration": 60,
    "duration": 60,
    ...
  },
  "scenes": [...]
}
```

```markdown
# Storyboard: <视频名称>

## 概览
- total_scenes:
- total_duration:
- beat_coverage:

## Scenes

### scene_01
- beat_id: beat_01
- time: 0s - 4s
- purpose: hook
- narration:
- on_screen_text:
- visual:
- motion:
- transition:
- assets:

### scene_02
...

## 时间轴
| scene | start | duration | purpose | key visual |
|-------|-------|----------|---------|------------|
| 01    | 0s    | 4s       | hook    | ...        |

## Scout Review
- storyboard-reviewer verdict:
- blocking resolved:
- important adopted:

## 用户确认
- [ ] 场景数量合理
- [ ] 每幕有必要
- [ ] 画面能承载信息
- [ ] 节奏合理
- [ ] 用户已批准
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| scene 信息过载 | 拆分为多个 scene |
| 时间重叠 | 重新分配时间轴 |
| 动效意图不可行 | 简化动效或调整视觉描述 |
| 与 brief 不匹配 | 回到 brief 检查核心信息传达 |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "直接写代码" | Storyboard 是合同。跳过 = 重新发明。 |
| "动画可以弥补画面不足" | 不能。静态构图不成立，动效也救不回来。 |
| "每个 scene 多放点内容" | 一幕一意。多内容 = 多 scene。 |
| "转场不重要" | 转场决定节奏感。硬切 ≠ 随意切。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- 一个 scene 包含多个核心信息
- 跳过时间轴验证
- 动画只是装饰，不服务理解
- 跳过用户确认直接进入 styleframes
- storyboard 未覆盖所有 beats
</HARD-GATE>

## 验证清单

- [ ] 每个 beat 已映射到 scene
- [ ] 每个 scene 只有一个核心信息
- [ ] 时间轴无重叠，总时长匹配
- [ ] 每个 scene 有动效意图
- [ ] 每个 scene 有转场设计
- [ ] storyboard-reviewer 已审查
- [ ] 用户已批准 storyboard
