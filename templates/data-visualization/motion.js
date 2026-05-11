/**
 * motion.js — Data Visualization Template
 *
 * 空 GSAP timeline 骨架 + HyperFrames 注册。
 * 使用时替换 PLACEHOLDER_COMPOSITION_ID 为实际 composition-id。
 */

/* ---- Timeline 骨架 ---- */

const tl = gsap.timeline({ paused: true });

// Scene 动画代码在此添加
// 每个 scene 使用 tl.add() 分段，参数从 storyboard.json 读取

// 示例结构（删除后替换为实际 scene 动画）:
// tl.from('#scene-01 .title', {
//   opacity: 0,
//   y: 30,
//   duration: 0.8,
//   ease: 'power2.out'
// });

/* ---- HyperFrames 注册 ---- */

window.__timelines = window.__timelines || {};
window.__timelines['PLACEHOLDER_COMPOSITION_ID'] = tl;