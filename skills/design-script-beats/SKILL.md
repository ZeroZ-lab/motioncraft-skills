---
name: design-script-beats
description: 拆解叙事节奏点。使用 cuando 标题封面已批准需要设计脚本节奏
---

# Script Beats — 叙事节奏设计

> 领域: workflow | 宪法: 第 4（Motion Serves Understanding）条

## 入口/出口
- **入口**: 已批准 title-cover（`docs/video/<name>/02-title-cover.md`）
- **出口**: `docs/video/<name>/03-script-beats.md`
- **指向**: 完成后调用 `design-storyboard`
- **假设已加载**: CANON.md + `define-brief`

## 何时不使用
- 视频已有完整脚本或分镜
- 纯视觉动画视频（无旁白/字幕）

## 核心原则

> **不是写文章，而是设计观众的理解路径。**
> Web 动画视频每个画面只能承载一个主要信息，所以必须先拆节奏，再写内容。

## Iron Law

<HARD-GATE>
**不是写文章，而是设计观众的理解路径。**
每个 beat 只传达一个意思。Beats 之间必须有逻辑递进。
没有经过理解路径检查的 beats，不进入 storyboard 阶段。
</HARD-GATE>

## 流程

### Step 1：读取上下文

读取 brief 和 title-cover，理解：
- 视频承诺了什么
- 目标时长是多少
- 受众的理解起点是什么

### Step 2：选择叙事结构

根据视频类型选择结构：

| 结构 | 适用场景 | beats 数量 |
|------|---------|-----------|
| 问题→洞察→方案 | 解释型视频 | 4-6 |
| Hook→Problem→Insight→Model→Example→Conclusion | 教学/科普 | 6-8 |
| 现象→原因→影响→方法 | 分析型 | 4-6 |
| 对比→结论 | 评测型 | 3-5 |
| 起点→转折→终点 | 故事型 | 5-7 |

### Step 3：拆解 beats

每个 beat 包含：

```yaml
script_beats:
  - id: beat_01
    role: hook           # 功能角色
    message:              # 这一幕要传达的核心信息（一句话）
    narration:            # 旁白/字幕方向（不是逐字稿）
    duration:             # 建议时长（秒）
    visual_intent:        # 画面意图（关键词）
```

**Beat 角色定义：**

| 角色 | 职责 | 时长占比 |
|------|------|---------|
| hook | 抓住注意力，制造好奇心 | 10-15% |
| problem | 描述问题或痛点 | 15-20% |
| insight | 给出关键洞察或转折 | 10-15% |
| model | 展示模型/框架/方法 | 20-30% |
| example | 具体案例或演示 | 15-20% |
| conclusion | 总结 + 行动号召 | 10-15% |

### Step 4：时长分配

基于视频总时长和 beats 数量分配时间：

```
30s 视频 → 5-7 beats → 每个 beat 4-6s
60s 视频 → 8-12 beats → 每个 beat 5-8s
180s 视频 → 12-20 beats → 每个 beat 8-15s
```

**规则：**
- 总时长必须匹配 brief 的 duration
- 单个 beat 不超过总时长的 30%
- hook beat 不超过总时长的 15%
- 留 1-2s 的开头缓冲和结尾收束

### Step 5：理解路径检查

检查整个 beats 序列是否构成清晰的理解路径：

```
观众看完 hook 后会想继续看吗？
看完 problem 后能感同身受吗？
看完 insight 后有"原来如此"的感觉吗？
看完 model 后能用吗？
看完 example 后有信心吗？
看完 conclusion 后知道下一步做什么吗？
```

### Step 6：产出

输出到 `docs/video/<name>/03-script-beats.md`：

```markdown
# Script Beats: <视频名称>

## 叙事结构
- type:
- total_beats:
- total_duration:

## Beats

### beat_01: <标题>
- role: hook
- message:
- narration:
- duration: Xs
- visual_intent:

### beat_02: <标题>
...

## 理解路径
- hook → problem → insight → model → example → conclusion
- 关键转折点:

## 时长分配
- total: Xs
- each beat: Xs
- buffer: Xs

## 与 brief 对齐检查
- [ ] 核心信息在 beats 中完整传达
- [ ] 标题承诺可兑现
- [ ] 时长匹配 brief
- [ ] 受众理解起点匹配
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| 信息量超过时长承载 | 删减次要信息或增加时长 |
| beats 之间逻辑断裂 | 增加 transition beat |
| hook 不够强 | 重新思考最有张力的切入点 |
| 缺少 conclusion | 补充总结和行动号召 |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "直接写逐字稿" | 逐字稿是最后一步。先拆节奏，再写内容。 |
| "信息越多越好" | 观众只能记住 3 个要点。少即是多。 |
| "不需要 hook" | 没有 hook，观众 3 秒就走。 |
| "每个 beat 多塞点信息" | 一幕一意。多信息 = 多 beats。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- 没有 hook 直接进入正文
- 单个 beat 超过总时长的 30%
- beats 之间没有逻辑递进
- 总信息量明显超过时长承载能力
- 跳过时长分配直接进入分镜
</HARD-GATE>

## 验证清单

- [ ] 叙事结构已选择且合理
- [ ] 每个 beat 有 role、message、duration
- [ ] 时长分配匹配 brief 的 total duration
- [ ] 理解路径连贯
- [ ] 标题承诺可在 beats 中兑现
- [ ] 每个 beat 的信息量可在一个画面中传达
