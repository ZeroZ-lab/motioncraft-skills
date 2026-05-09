---
name: design-title-cover
description: 定义视频的点击理由与承诺。使用 cuando brief 已批准需要确定标题和封面
---

# Title / Cover — 点击理由与视频承诺

> 领域: workflow | 宪法: 第 1（Promise First）条

## 入口/出口
- **入口**: 已批准 brief（`docs/video/<name>/01-brief.md`）
- **出口**: `docs/video/<name>/02-title-cover.md` + 用户批准
- **指向**: 完成后调用 `design-script-beats`
- **假设已加载**: CANON.md

## 何时不使用
- 标题和封面已经确定
- 只是修改已有视频

## Iron Law

<HARD-GATE>
**标题和封面不是包装，而是视频的产品定义。**
标题决定观众是否点进来，封面决定观众的预期。视频必须兑现标题和封面的承诺。
没有经过用户确认的标题封面，不进入脚本阶段。
</HARD-GATE>

## 流程

### Step 1：读取 brief

理解视频的目标受众、核心信息、平台和风格。

### Step 2：生成标题选项

基于 brief 的核心信息，生成 3-5 个标题选项。每个标题必须：

1. **有钩子** — 制造认知张力或好奇心
2. **有承诺** — 观众点进来能得到什么
3. **可兑现** — 视频内容能兑现标题承诺
4. **平台适配** — 符合目标平台的标题风格

**标题类型参考：**

| 类型 | 结构 | 例子 |
|------|------|------|
| 反常识 | "为什么 X 反而 Y" | "为什么 Skills 越多，Agent 反而越不稳定" |
| 缺失型 | "X 不缺 Y，缺的是 Z" | "Agent 不缺工具，缺的是工作流" |
| 对比型 | "X vs Y: 谁更适合 Z" | "Remotion vs HyperFrames: 谁更适合代码化视频" |
| 数字型 | "N 个 X 的 Y" | "7 步把想法变成 Web 动画视频" |
| 揭秘型 | "X 的真相" | "AI 视频生产线的真相" |

**反模式：**

```
✗ "AI Agent Skills Workflow 介绍" — 没有钩子，没有承诺
✗ "你必须知道的事" — 空洞，不可兑现
✗ "震惊！X 居然 Y" — 标题党，损害信任
```

### Step 3：封面概念设计

为推荐的标题设计封面概念：

```yaml
cover_concept:
  headline:
  main_visual:
  layout:
  contrast:
  emotional_trigger:
```

### Step 4：Title-Cover Scout（title-cover-scout）

分派 `agents/title-cover-scout.md` 验证：

- 标题是否值得点击？
- 封面一眼能看懂吗？
- 视频承诺是否清楚？
- 标题和封面是否一致？

### Step 5：Promise 检查

对每个标题选项做承诺检查：

```
标题承诺了什么？
视频能兑现吗？
兑现需要什么素材/内容？
兑现的难度如何？
```

### Step 6：用户确认

<HARD-GATE>
**Checkpoint 1：标题封面确认**
必须获得用户明确批准。这是第 1 个人工确认点。
</HARD-GATE>

### Step 7：产出

输出到 `docs/video/<name>/02-title-cover.md`：

```markdown
# Title / Cover: <视频名称>

## 选定标题
- title:
- hook_type:
- promise:

## 备选标题
- [其他选项及理由]

## 封面概念
- headline:
- main_visual:
- layout:
- contrast:
- emotional_trigger:

## Promise 检查
- 标题承诺:
- 兑现方式:
- 兑现难度:

## Scout Review
- title-cover-scout verdict:
- blocking resolved:
- important adopted:

## 用户确认
- [ ] 标题已确认
- [ ] 封面概念已确认
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| 标题没有钩子 | 回到核心信息，找认知张力 |
| 标题不可兑现 | 降低承诺或调整标题 |
| 封面概念模糊 | 简化视觉元素，聚焦核心信息 |
| 标题与封面不一致 | 统一视觉和文字的叙事 |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "标题最后再想" | 标题是最重要的产品定义。前置。 |
| "随便写个标题就行" | 标题决定 80% 的点击率。 |
| "封面不重要" | 封面是视频的第一帧。观众先看封面再看标题。 |
| "用工具自动生成标题" | 工具不理解你的视频承诺。人工定义。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- 标题没有钩子，只是描述性标题
- 标题承诺了视频无法兑现的内容
- 跳过用户确认直接进入脚本
- 标题与 brief 的核心信息不匹配
</HARD-GATE>

## 验证清单

- [ ] 3-5 个标题选项已生成
- [ ] 每个标题有钩子和承诺
- [ ] 封面概念已设计
- [ ] Promise 检查已通过
- [ ] title-cover-scout 已审查
- [ ] 用户已确认标题和封面
