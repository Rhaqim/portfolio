// The favicon is a probability cloud (public/favicon.svg: a 3d_xz orbital).
// While the tab is in the background nobody is observing it, so it stays in
// flux: every second, about a third of its dots jump to new places in the
// orbital. When the tab comes back to the front it collapses to the fixed icon.
//
// Background tabs get timers at most once a second (and less often after a
// while), so this costs next to nothing. Browsers that ignore favicon changes
// (Safari) just keep showing the static icon.

import { fromDensity, orbitals } from "./shapes.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const link = document.querySelector('link[rel="icon"]');

if (link && !reduced) {
	// Match the static icon: 110 dots of radius 1.05 on a 32-unit square, at 2x.
	const N = 110, R = 1.05, SCALE = 40, PX = 64, K = PX / 32;
	const OPACITY = [0.55, 0.8, 1];
	const STATIC = link.href;
	const [density, L] = orbitals["3dxz"];

	let pool = null, dots = null, timer = 0, ctx = null;

	const inside = (x, y) => x >= R && y >= R && x <= 32 - R && y <= 32 - R;
	function pick() {
		for (;;) {
			const j = ((Math.random() * pool.length) / 2 | 0) * 2;
			const x = 16 + pool[j] * SCALE, y = 16 + pool[j + 1] * SCALE;
			if (inside(x, y)) return [x, y];
		}
	}

	function setup() {
		pool = fromDensity(density, 3000, L, 0);
		dots = Array.from({ length: N }, pick);
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = PX;
		ctx = canvas.getContext("2d");
	}

	function tick() {
		for (let i = 0; i < N; i++) if (Math.random() < 0.35) dots[i] = pick();
		ctx.clearRect(0, 0, PX, PX);
		ctx.fillStyle = "#e01b18";
		dots.forEach(([x, y], i) => {
			ctx.globalAlpha = OPACITY[i % 3];
			ctx.beginPath();
			ctx.arc(x * K, y * K, R * K, 0, Math.PI * 2);
			ctx.fill();
		});
		link.href = ctx.canvas.toDataURL("image/png");
	}

	document.addEventListener("visibilitychange", () => {
		if (document.hidden) {
			if (!pool) setup();
			tick();
			timer ||= setInterval(tick, 1000);
		} else {
			clearInterval(timer);
			timer = 0;
			link.href = STATIC;
		}
	});
}
