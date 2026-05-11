---
name: verify-render-qa
description: 渲染、检查、修复、导出。使用 cuando Web 动画工程已完成需要质检导出
---

# Render QA — 渲染质检

> 领域: workflow | 宪法: 第 6（Verify Don't Assume）条

## 入口/出口
- **入口**: 完成的 Web 动画工程（`project/`）
- **出口**: `docs/video/<name>/06-qa-report.md` + 最终导出文件
- **指向**: 完成后归档
- **假设已加载**: CANON.md + `build-web-motion`

## 何时不使用
- 工程还未完成 preview 验证
- 只需要调试某个 scene（回到 build-web-motion）

## Iron Law

<HARD-GATE>
**让 Agent 的产物从"看起来写完了"变成"真的能交付"。**
没有已运行的 render 证据不能声称完成。
Blocking issues 必须修复才能交付。
</HARD-GATE>

## 流程

### Phase A：Preview 检查

在 render 之前，先确认 preview 完全正常：

```text
能否正常加载？
能否正常播放？
能否从头播到尾？
播放速度是否正常？
所有 scene 是否按序出现？
```

### Phase A.5：HyperFrames Render 配置检查

在执行渲染之前，确认 HyperFrames 集成正确：

**检查清单：**
- [ ] HTML 根容器有 `data-composition-id`
- [ ] `data-composition-id` 与 `motion.js` 中的 `__timelines` key 一致
- [ ] GSAP timeline 使用 `{ paused: true }` 创建
- [ ] `window.__timelines` 已注册

**预检查验证（浏览器控制台）：**

```javascript
const compositionId = document.querySelector('[data-composition-id]')?.dataset.compositionId;
const hasTimeline = !!window.__timelines?.[compositionId];
console.log(`Composition: ${compositionId}, Timeline registered: ${hasTimeline}`);
if (hasTimeline) {
  console.log(`Duration: ${window.__timelines[compositionId].duration().toFixed(2)}s`);
}
```

如果任何检查失败，回到 `build-web-motion` 修复 HyperFrames 集成。

### Phase B：执行 Render

**渲染前提：** Phase A preview 正常 + Phase A.5 HyperFrames 配置正确。

**渲染步骤：**

1. 确认 `project/` 目录包含完整的 HyperFrames 兼容工程
2. 确认 `index.html` 可在浏览器中正常加载并播放完整 timeline
3. 使用 HyperFrames 执行渲染：`npx hyperframes render <project-dir> -o <output.mp4>`
4. 检查渲染输出文件

**渲染检查清单：**
- [ ] 正常 render（无报错完成）
- [ ] render 时间合理（60s 视频 < 5 分钟）
- [ ] 输出文件格式正确（.mp4）
- [ ] 输出分辨率匹配 brief（如 1920x1080）
- [ ] 输出帧率匹配 brief（如 30fps）
- [ ] 文件大小合理（60s 1080p 通常 10-50MB）
- [ ] 音频轨道正常混合（如有音频）

**渲染失败处理：**

| 失败现象 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 超时 | 动画过于复杂 | 简化动画，减少同时运动元素 |
| 黑屏 | `__timelines` 未注册 | 检查 motion.js 末尾注册代码 |
| 半截停止 | Timeline paused 状态异常 | 确认 `{ paused: true }` 设置 |
| 字体缺失 | Google Fonts CDN 不可达 | 嵌入本地字体文件 |
| 分辨率不对 | data-width/data-height 错误 | 修正 HTML 属性值 |

### Phase C：逐项质检

#### C.1 技术检查

- [ ] 无 JS error
- [ ] 无缺资源（404）
- [ ] 无黑屏/白屏帧
- [ ] 无闪烁/抖动
- [ ] scene 时间无重叠
- [ ] 音频同步（如有）
- [ ] 音频正常播放（如有）
- [ ] render 输出完整

#### C.2 视觉检查

- [ ] 首帧干净（不是空白）
- [ ] 尾帧干净（不是突然消失）
- [ ] 文字不超出安全区
- [ ] 文字可读性 OK（大小、对比度）
- [ ] 颜色一致性
- [ ] 字体加载正确
- [ ] 图形/图表正确

#### C.3 内容检查

- [ ] 所有 storyboard scene 都已实现
- [ ] 旁白/字幕内容正确
- [ ] 时长匹配 brief
- [ ] 标题承诺已兑现
- [ ] 核心信息已传达

#### C.4 动效检查

- [ ] 动画服务理解（不是装饰）
- [ ] easing 自然
- [ ] timing 合理（不太快/太慢）
- [ ] 转场流畅
- [ ] 无卡顿/掉帧

### Phase D：Render QA Scout（render-qa-auditor）

分派 `agents/render-qa-auditor.md` 验证：

- 技术质量
- 视觉质量
- 内容完整性
- 与 storyboard 一致性
- 导出规格

### Phase E：用户确认

<HARD-GATE>
**Checkpoint 3：Render QA 确认**
必须获得用户明确批准。这是第 3 个人工确认点。
Blocking issues 必须修复后重新 render。
</HARD-GATE>

### Phase F：导出

最终导出：

```
output/
  video.mp4
  thumbnail.png
  storyboard.json
  script.md
```

### Phase G：产出 QA 报告

输出到 `docs/video/<name>/06-qa-report.md`：

```markdown
# Render QA Report: <视频名称>

## Preview Status
- [ ] 正常加载
- [ ] 正常播放
- [ ] 完整播放

## Render Status
- [ ] 正常 render
- [ ] 格式正确
- [ ] 分辨率正确
- [ ] 帧率正确

## Duration Check
- brief 要求: Xs
- 实际: Xs
- 匹配: ✅ / ❌

## Scene Check
| scene | 存在 | 视觉正确 | 动效正确 | 时长正确 |
|-------|------|---------|---------|---------|
| 01    | ✅   | ✅      | ✅      | ✅      |

## Visual Check
- 首帧: ✅
- 尾帧: ✅
- 文字安全区: ✅
- 颜色一致: ✅

## Motion Check
- 动画服务理解: ✅
- easing 自然: ✅
- 无卡顿: ✅

## Subtitle Check
- 文字可读: ✅
- 不超出安全区: ✅
- 内容正确: ✅

## Blocking Issues
- [无 / 列出]

## Warnings
- [无 / 列出]

## Scout Review
- render-qa-auditor verdict:
- blocking resolved:
- important adopted:

## Final Output
- video: output/video.mp4
- thumbnail: output/thumbnail.png
- storyboard: output/storyboard.json

## 用户确认
- [ ] 可以发布
```

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| Preview 失败 | 回到 build-web-motion 修复，重新 preview |
| Render 失败 | 检查 render 配置和资源，修复后重试 |
| 黑屏帧 | 检查 scene 转场和 timeline |
| 文字超出安全区 | 调整 CSS 文字位置和大小 |
| 时长不匹配 | 调整 GSAP timeline duration |
| 动画不服务理解 | 回到 storyboard 检查动效意图 |
| Blocking issue | 修复后重新走 Phase A-D |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "应该没问题" | "应该" ≠ 证据。跑 preview 和 render。 |
| "小问题不影响" | Blocking 就是 Blocking。不交付有问题的视频。 |
| "渲染一次就够了" | 修复后必须重新渲染。旧 render 不是证据。 |
| "视觉效果见仁见智" | 有客观标准：安全区、可读性、时长、一致性。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- 不跑 preview 直接 render
- render 失败后跳过修复直接导出
- Blocking issue 未修复就交付
- 不做逐项质检
- 跳过用户确认直接归档
- "看起来差不多" 作为质量标准
</HARD-GATE>

## 验证清单

- [ ] Preview 完全正常
- [ ] Render 成功输出
- [ ] 时长匹配 brief
- [ ] 所有 scene 已实现且正确
- [ ] 首尾帧干净
- [ ] 文字在安全区内
- [ ] 动画服务理解
- [ ] 无 JS error / 缺资源 / 黑屏
- [ ] render-qa-auditor 已审查
- [ ] Blocking issues 全部解决
- [ ] 用户已确认可以发布
- [ ] 最终导出文件完整
