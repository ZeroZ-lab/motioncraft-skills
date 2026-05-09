# Motion Principles — 动效设计原则

> 来源：Apple HIG Motion、Material Design Motion、Disney 动画十二原则
> 用途：所有技能的动效设计参考

## 1. Motion Must Be Purposeful（动画必须有目的）

> 来源：Apple HIG Motion

每个动效必须回答："这帮观众理解了什么？"

**规则：**
- 入场动画引导注意力到新内容
- 退场动画帮助理解内容消失
- 变形动画帮助理解状态变化
- 移动动画帮助理解空间关系
- **不做无目的的装饰动画**

## 2. Easing Creates Natural Feel（缓动创造自然感）

> 来源：Material Design Motion

**标准缓动：**

| 类型 | CSS Easing | GSAP Easing | 适用场景 |
|------|-----------|-------------|---------|
| 标准 | cubic-bezier(0.4, 0.0, 0.2, 1) | power2.inOut | 通用 |
| 减速 | cubic-bezier(0.0, 0.0, 0.2, 1) | power2.out | 入场 |
| 加速 | cubic-bezier(0.4, 0.0, 1, 1) | power2.in | 退场 |
| 急停 | cubic-bezier(0.4, 0.0, 0.6, 1) | power3.inOut | 快速切换 |

## 3. Duration Creates Rhythm（时长创造节奏）

> 来源：Material Design Motion

| 动画类型 | 推荐时长 | 说明 |
|---------|---------|------|
| 微交互 | 100-200ms | hover、tap 反馈 |
| 小型过渡 | 200-400ms | 按钮状态变化、图标切换 |
| 中型过渡 | 400-600ms | 卡片展开、面板切换 |
| 大型过渡 | 500-800ms | 页面转场、场景切换 |
| 复杂动画 | 800-1200ms | 多元素序列、数据可视化 |

## 4. Staging（视觉焦点）

> 来源：Disney 12 Principles

**规则：**
- 每个时刻只有一个视觉焦点
- 通过大小、颜色、位置引导视线
- 背景/配角不能抢主角注意力
- 留白引导视线到焦点

## 5. Timing（节奏）

> 来源：Disney 12 Principles

**规则：**
- 快速 = 有活力、轻量
- 慢速 = 重量、重要性
- 变速 = 自然、有吸引力
- 匀速 = 机械、无生命力

## 6. Anticipation（动作预备）

> 来源：Disney 12 Principles

**规则：**
- 重要动作前有预备动作
- 预备方向通常与主方向相反
- 预备帮助观众预期即将发生的事
- 例子：元素向左移前先微微向右

## 7. Slow In / Slow Out（缓入缓出）

> 来源：Disney 12 Principles

**规则：**
- 元素从静止开始逐渐加速
- 元素到达目标后逐渐减速
- 避免突然开始或突然停止
- 自然界没有匀速运动

## 8. Follow Through（惯性与余韵）

> 来源：Disney 12 Principles

**规则：**
- 主要动作结束后，附属元素继续运动
- 创造自然的物理感
- 例子：卡片停止后，内部元素微微晃动
