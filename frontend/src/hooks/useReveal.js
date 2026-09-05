import { useEffect } from "react";

export default function useReveal(dependencies = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation =
              "tt-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".tt-reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, dependencies);
}
