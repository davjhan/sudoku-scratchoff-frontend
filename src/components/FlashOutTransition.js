import { quadOut } from 'svelte/easing';
export function flashOut(node, {
    delay = 0,
    duration = 400
}) {
    const o = +getComputedStyle(node).opacity;

    return {
        delay,
        duration,
        css: t => {
            const eased = quadOut(t);
            return `
            opacity: ${1-eased}
            `
        }
    };
}