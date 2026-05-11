/**
 * Minimal Clean — GSAP Timeline Registration
 * Registers to window.__timelines for HyperFrames seeking
 */

// Create paused timeline — HyperFrames controls playback
const gsapTimeline = gsap.timeline({ paused: true });

// Scene placeholder: add your animations below
// Example:
// gsapTimeline.addLabel('scene_01')
//   .set('#scene-01', { opacity: 1 })
//   .from('#scene-01 .mc-heading', {
//     opacity: 0,
//     y: 20,
//     duration: 0.6,
//     ease: 'power2.out'
//   });

// Register GSAP timeline to HyperFrames
window.__timelines = window.__timelines || {};
window.__timelines['PLACEHOLDER_COMPOSITION_ID'] = gsapTimeline;

console.log('Minimal Clean timeline registered. Duration:', gsapTimeline.duration());