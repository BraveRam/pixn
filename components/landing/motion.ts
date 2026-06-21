// Shared Framer Motion variants for the landing page.
// Components pair these with `useReducedMotion()` and render to the resting
// state when motion is disabled, so we only animate compositor-friendly
// properties (opacity / transform).

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: EASE_OUT_EXPO,
    },
  }),
};
