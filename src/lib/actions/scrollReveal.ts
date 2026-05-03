import type { Action } from "svelte/action";

export type RevealDirection = "left" | "right" | "up" | "ink" | "slam" | "fade";

export interface RevealOptions {
        direction?: RevealDirection;
        delay?: number;
        threshold?: number;
        once?: boolean;
}

/**
 * Svelte action: triggers a CSS reveal animation when element enters viewport.
 * Usage: <div use:reveal={{ direction: 'left', delay: 0.2 }}>
 */
export const reveal: Action<HTMLElement, RevealOptions> = (node, options = {}) => {
        const {
                direction = "up",
                delay = 0,
                threshold = 0.12,
                once = true,
        } = options;

        node.setAttribute("data-reveal", direction);
        if (delay > 0) {
                node.style.transitionDelay = `${delay}s`;
        }

        const observer = new IntersectionObserver(
                (entries) => {
                        entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                        entry.target.classList.add("revealed");
                                        if (once) observer.unobserve(entry.target);
                                } else if (!once) {
                                        entry.target.classList.remove("revealed");
                                }
                        });
                },
                { threshold }
        );

        observer.observe(node);

        return {
                update(newOptions: RevealOptions) {
                        const dir = newOptions.direction ?? direction;
                        node.setAttribute("data-reveal", dir);
                },
                destroy() {
                        observer.disconnect();
                },
        };
};
