---
name: define-project
description: 项目初始化。使用 cuando 有一个视频想法需要初始化项目结构和选择模板
---

# Project — 项目初始化

> 领域: workflow | 宪法: 第 7（Scope Discipline）条

## 入口/出口
- **入口**: 用户提供了视频想法、主题描述或显式项目名（project/ 不存在时运行 /init）
- **出口**: `project/` 目录已初始化 + `.mc-project.json` 已创建 + 下一步引导已输出
- **指向**: 完成后建议调用 `define-brief`
- **假设已加载**: CANON.md

## 何时不使用
- project/ 目录已存在（/init 拒绝执行，不覆盖、不合并）
- 已有 .mc-project.json（项目已初始化，无需重复执行 /init）
- 只想修改已有项目（修改用 compose 或 render-qa，不是 init）

## Iron Law

<HARD-GATE>
**项目名和模板选择都必须人类确认。没有自动跳过确认的路径。**
项目名推断是辅助工具，不是决定。模板选择是不可逆决策 — 确认后更改需删除 project/ 重做。
</HARD-GATE>

## 流程

### Step 1：项目名推断 + 确认（门控 1）

从用户输入推断项目名（composition_id），格式约束 `^[a-z][a-z0-9-]{1,47}$`（2-48 字符）。

| 输入类型 | 推断策略 | 置信度 | 处理 |
|---------|---------|--------|------|
| 用户明确给出名称 | 直接 kebab-case 转换 | 高 | 推断结果 + 人类确认 |
| 用户给出主题描述 | 从 topic 关键词提取（1-3 词） | 中 | 推断结果 + 人工确认 |
| 用户仅说"做视频" | 无法推断 | 低 | 请用户显式提供项目名 |

**推断规则**:
- 从自然语言提取核心 topic 关键词（1-3 词）
- kebab-case 格式化
- 多个关键词时取最核心的 1-2 个
- **安全约束**: composition_id 必须匹配 `^[a-z][a-z0-9-]{1,47}$`（首字符字母，只允许小写字母+数字+连字符，2-48 字符）。不符合约束的项目名 → 拒绝，请用户重新提供

**所有路径均需人类确认项目名** — 无自动跳过。

### Step 2：模板选择（Checkpoint 0 — 人工确认）

从用户描述推断 brief 信号（style + topic），引用 `templates/TEMPLATE-GUIDE.md` 映射表（不重复映射逻辑）。

**⚠ 不可逆决策警告**: 模板选择不可逆。确认后如需更改模板，必须删除 project/ 并重新运行 /init，这将丢失所有下游产出（brief、script、storyboard、styleframes 等）。请确认您的选择。

**置信度分支**:

| 信号丰富度 | 置信度 | 推荐方式 |
|-----------|--------|---------|
| style + topic 双信号 | 高 | 推荐 1 个模板 + 理由 + 人类确认或 override |
| 仅 topic 或无信号 | 低 | 平等展示 4 个模板对比 + 简明适用场景，由人类选择 |

**--template override**: 用户可在确认阶段显式指定模板名（如"我要用 bold-editorial 模板"），指定值仍需通过白名单校验 `[dark-tech, minimal-clean, bold-editorial, data-visualization]`。

**模板名白名单校验**: `[dark-tech, minimal-clean, bold-editorial, data-visualization]`
- 推荐结果必须在白名单内
- 用户 override 的模板名也必须在白名单内
- 不在白名单 → 拒绝执行，提示可用模板列表

分派 `agents/project-initializer.md` 辅助推荐理由生成和低置信度场景处理。

### Step 3：项目初始化

**3.1 复制模板目录**

复制选定模板目录（如 `templates/dark-tech/`）到 `project/`，包含：
- index.html, styles.css, motion.js, storyboard.json, assets/

**3.2 替换 PLACEHOLDER_COMPOSITION_ID**

替换仅针对代码行中的 2 个位置（不替换注释中的 PLACEHOLDER 字面值）：

| 文件 | 替换位置 | 说明 |
|------|---------|------|
| index.html | `data-composition-id="PLACEHOLDER_COMPOSITION_ID"` | HTML 属性值 |
| motion.js | `window.__timelines['PLACEHOLDER_COMPOSITION_ID']` | JS 字符串 key |

**验证**: 替换后检查 index.html 和 motion.js 中无残留 `PLACEHOLDER_COMPOSITION_ID` 代码行（注释行中的可保留）。

**安全**: composition_id 已通过格式约束校验（`^[a-z][a-z0-9-]{1,47}$`），替换到 HTML 属性和 JS 字串不会产生注入风险。SRI integrity 属性不受替换影响（PLACEHOLDER 不出现在 SRI 相关行中）。

**3.3 创建 .mc-project.json**

```json
{
  "project_name": "<项目名>",
  "selected_template": "<模板名>",
  "composition_id": "<项目名>",
  "created_at": "<ISO 8601 UTC 时间戳>"
}
```

created_at 使用 ISO 8601 UTC 格式（如 `2026-05-11T14:30:00Z`），不使用本地时间。

**3.4 创建目录骨架**

- `docs/video/<project-name>/` — 仅创建目录，不创建空文件（各文档由后续斜杠命令生成）
- `assets/images/` — 图片素材目录
- `assets/audio/` — 音频素材目录

**3.5 目录冲突处理**

| project/ 状态 | 行为 |
|---------------|------|
| 不存在 | 正常初始化 |
| 存在（完整） | 拒绝执行，提示"项目已存在，如需重新初始化请先删除 project/ 目录" |
| 存在（半成品） | 拒绝执行，提示"project/ 目录已存在（可能不完整），请检查或删除后重试" |

| docs/video/<name>/ 状态 | 行为 |
|--------------------------|------|
| 不存在 | 创建目录骨架 |
| 存在（含已有文档） | 跳过目录创建，提示"文档目录已存在，后续斜杠命令将使用现有目录" |

### Step 4：输出 + 下一步引导

输出：
1. 项目名、选定模板
2. 创建的文件和目录清单
3. 下一步引导："接下来运行 `/brief` 定义视频内容"

## 验证失败处理

| 失败场景 | 处理方式 |
|---------|---------|
| composition_id 不符合格式约束 `^[a-z][a-z0-9-]{1,47}$`（2-48 字符）。 | 拒绝，请用户重新提供项目名（给出格式要求） |
| 模板名不在白名单 `[dark-tech, minimal-clean, bold-editorial, data-visualization]` 中 | 拒绝，列出可用模板清单 |
| project/ 目录已存在 | 拒绝执行，提示删除 project/ 或检查现有状态 |
| docs/video/<name>/ 已存在 | 跳过目录创建，提示后续命令将使用现有目录 |
| PLACEHOLDER 替换后残留代码行 | 重新替换，确认 2 个位置均已完成 |
| 低置信度（无 style 信号） | 平等展示 4 模板，不默认推 dark-tech |

## 常见说辞

| 说辞 | 现实 |
|------|------|
| "随便选一个模板吧" | 模板选择不可逆。确认后需删除 project/ 才能更改。 |
| "项目名不重要，随便起" | composition_id 是 HTML/JS 中的标识符，格式错误会导致注入风险或渲染失败。 |
| "project/ 已经有了，覆盖一下" | 不覆盖。已有 project/ → 拒绝执行。保护用户工作。 |
| "先不选模板，后面再决定" | 模板选择是 Checkpoint 0，必须确认才能继续。没有跳过路径。 |
| "直接用 dark-tech 吧" | 低置信度时不默认推荐任何模板。平等展示 4 个选项。 |

## 红旗

<HARD-GATE>
以下任何一个出现，立即停止：
- project/ 已存在时继续执行（不覆盖、不合并）
- 跳过项目名确认门控（项目名必须人类确认）
- 跳过模板选择 Checkpoint 0（模板必须人类确认）
- composition_id 包含非 kebab-case 字符（不符合 `^[a-z][a-z0-9-]{1,47}$`）
- 模板名不在白名单 `[dark-tech, minimal-clean, bold-editorial, data-visualization]` 中
- 低置信度时默认推荐 dark-tech（低置信度必须平等展示 4 模板）
- PLACEHOLDER 替换影响 SRI integrity 属性（SRI 行不可修改）
</HARD-GATE>

## 验证清单

- [ ] 项目名已确认 + composition_id 格式校验通过（`^[a-z][a-z0-9-]{1,47}$`）
- [ ] 模板已确认 + 模板名在白名单 `[dark-tech, minimal-clean, bold-editorial, data-visualization]` 中
- [ ] Checkpoint 0 不可逆决策警告已展示
- [ ] project/ 目录已初始化
- [ ] PLACEHOLDER_COMPOSITION_ID 在 index.html 和 motion.js 两个位置已替换（代码行，非注释行）
- [ ] .mc-project.json 已创建（composition_id + selected_template + created_at UTC）
- [ ] SRI integrity 属性未受替换影响
- [ ] docs/video/<name>/ 目录骨架已创建（仅目录，无空文件）
- [ ] 下一步引导已输出："接下来运行 /brief"