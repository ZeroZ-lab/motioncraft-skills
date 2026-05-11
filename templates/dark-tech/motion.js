/* motion.js — Dark Tech template GSAP timeline skeleton */

const tl = gsap.timeline({ paused: true });

// Scenes will be added later via storyboard-driven composition.
// Each scene entry follows the pattern:
//   tl.fromTo('#scene-01 .element', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '<position>');

// Replace PLACEHOLDER_COMPOSITION_ID with actual composition-id
window.__timelines = window.__timelines || {};
window.__timelines['PLACEHOLDER_COMPOSITION_ID'] = tl;