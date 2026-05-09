---
name: define-brief
description: 把模糊视频创意变成可执行任务。使用 cuando 有一个视频主题或想法需要结构化
---

# Brief — 视频任务定义

> 领域: workflow | 宪法: 第 1（Promise First）、第 8（Source Material First）条

## 入口/出口
- **入口**: 模糊想法、视频主题、素材资料、用户"我想做一条关于 X 的视频"
- **出口**: `docs/video/<name>/01-brief.md` + 用户批准
- **指向**: 完成后调用 `design-title-cover`
- **假设已加载**: CANON.md

## 何时不使用
- 视频任务已经明确（有完整 brief、脚本或分镜）
- 只是修改已有视频的某个细节

## HARD GATE

<HARD-GATE>
**在用户批准 brief 之前，禁止调用任何后续技能、写任何代码、生成任何画面。**
Brief 是视频工程的源头，源头不清楚，后面每一步都会走偏。
</HARD-GATE>

## 流程

### Step 1：理解上下文

如果当前在项目中运行，先扫描相关上下文——已有视频、风格文件、品牌指南、素材目录。

**在问问题前先理解项目现状。**

### Step 2：逐一澄清

优先用宿主环境的结构化提问工具逐一询问：

1. **目标受众** — 这个视频给谁看？
2. **核心信息** — 看完要记住什么？一句话。
3. **解决问题** — 视频解决什么问题？
4. **平台** — B站 / YouTube / Twitter / 内部 / 其他？
5. **时长** — 30s / 60s / 3min / 5min？
6. **画幅** — 16:9 / 9:16 / 1:1？
7. **风格** — editorial-tech / minimal / bold / 数据可视化 / 手绘 / 其他？
8. **素材来源** — 文章、数据、设计稿、参考视频？

### Step 3：Goal Review

按 4 个维度评分，每项 0-2 分：

| Dimension | 0 | 1 | 2 |
|-----------|---|---|---|
| Audience | 不知道给谁看 | 有方向但太宽泛 | 具体人群 |
| Message | 没有核心信息 | 有方向但不聚焦 | 一句话核心信息 |
| Feasibility | 不清楚能否实现 | 可能可以做 | 素材+技术+时间都够 |
| Success | 无法判断完成 | 有模糊标准 | 可量化验收标准 |

Gate:
- `6-8`: accepted，可以进入 brief
- `3-5`: needs-refinement，先补齐弱项
- `0-2`: blocked，必须重新澄清

### Step 4：Brief Scout（brief-auditor）

分派 `agents/brief-auditor.md` 验证 brief 质量：

- 受众是否足够具体？
- 核心信息是否能在目标时长内传达？
- 风格与平台是否匹配？
- 素材是否足够支撑？

Scout 输出 Verdict / Evidence / Findings / Spec Impact 结构。
- **Blocking** → 必须解决
- **Important** → 强烈纳入
- **Suggestion** → 自主判断

### Step 5：产出 brief

输出到 `docs/video/<name>/01-brief.md`：

```markdown
# Brief: <视频名称>

## 基本信息
- topic:
- audience:
- core_message:
- platform:
- duration:
- aspect_ratio:
- style:

## 素材来源
- source_material:

## 成功标准
- success_criteria:

## Goal Review
- score: <score>/8
- status: accepted / needs-refinement / blocked

## Scout Review
- brief-auditor verdict:
- blocking resolved:
- important adopted:

## 不做清单
- [不做的事] — [理由]

## 待解决问题
- [实施前需要回答的问题]
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| 受众太宽泛 | 追问具体人群特征，缩小范围 |
| 核心信息不聚焦 | 追问"如果观众只记住一句话，是什么" |
| 时长与信息量不匹配 | 调整时长或拆分系列 |
| 素材不足 | 确认素材来源，标注"待补充" |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "给所有人看的" | 没有视频是给所有人看的。越具体越好。 |
| "看着做吧" | Brief 不清楚，后面每一步都会返工。 |
| "先做再想受众" | 不知道给谁看 = 不知道说什么。 |
| "越长越好" | 时长由信息密度决定，不是越长越好。30s 视频 5-7 scene，60s 视频 8-12 scene。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- 没有定义核心信息就开始写脚本
- 没有明确平台和时长就进入分镜
- 受众定义为"所有人"
- 在用户批准 brief 前进入下一步
</HARD-GATE>

## 验证清单

- [ ] audience 已定义且具体
- [ ] core_message 是一句话
- [ ] platform 和 duration 已明确
- [ ] style 已选定
- [ ] source_material 已列出
- [ ] success_criteria 可量化
- [ ] Goal Review 已完成
- [ ] brief-auditor 已审查
- [ ] 用户已批准 brief
