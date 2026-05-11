# MotionCraft Skills

读 `./AGENTS.md`，那里是完整入口配置。

## 版本 bump 规则

每次 bump version 时，必须同步更新以下 3 个文件的版本号和 description：

1. `package.json` — version + description
2. `.claude-plugin/plugin.json` — version + description
3. `.claude-plugin/marketplace.json` — description 中的版本号

遗漏任何一个 = 版本不一致 = 发布事故。
