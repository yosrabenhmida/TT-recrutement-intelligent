import { useEffect, useRef, useState } from "react";

export default function useCountUp(
  target = 100,
  duration = 1500,
  easing = "easeOutQuad",
) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const startTime = Date.now();
    const easingFn = {
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    }[easing];

    const frame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * easingFn(progress));
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [target, duration, easing]);

  return [ref, value];
}
