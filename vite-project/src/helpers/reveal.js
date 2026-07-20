/**
 * IntersectionObserver scroll reveal — respects prefers-reduced-motion.
 */

let observer = null;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const initReveal = (root = document) => {
  if (prefersReducedMotion()) {
    root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
};
