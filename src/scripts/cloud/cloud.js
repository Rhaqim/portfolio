// The red point cloud. One fixed canvas behind the page; particles spring
// towards a silhouette placed beside whichever [data-cloud] element is
// nearest the middle of the screen. The cursor pushes them; they re-form.
//
// Markup:   <section data-cloud="phone" data-cloud-place="right" data-cloud-size="0.8">
//           (data-cloud-x="0.64" sets the horizontal position as a fraction of the element)
// Script:   window.rhaqimCloud.morph("die") | .morph({ svg: "M10 10 L90 50 Z" })
//           | .morph({ text: "404" }) | .morph({ image: url }) ; .release()
//
// The script API is the seam for agents later: anything that can return an SVG
// path, a word or an image can drive the cloud.

import { shapes, sample, fromSVGPath, fromText, fromImage } from "./shapes.js";

const STORE = "rhaqim-cloud";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = () => innerWidth < 760;

const canvas = document.querySelector("canvas.cloud");
if (canvas && canvas.getContext) start(canvas);

function start(canvas) {
	const ctx = canvas.getContext("2d");
	const N = small() ? 650 : 1500;
	const x = new Float32Array(N), y = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
	const k = new Float32Array(N), phase = new Float32Array(N), layer = new Uint8Array(N);
	let target = new Float32Array(N * 2); // normalised shape points
	let dpr = 1, W = 0, H = 0;

	for (let i = 0; i < N; i++) {
		k[i] = 0.035 + Math.random() * 0.045;
		phase[i] = Math.random() * Math.PI * 2;
		layer[i] = Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2;
	}
	const LAYERS = [
		{ size: 1.2, alpha: 0.32 },
		{ size: 1.7, alpha: 0.6 },
		{ size: 2.3, alpha: 0.92 },
	];
	const byLayer = [0, 1, 2].map((l) => [...Array(N).keys()].filter((i) => layer[i] === l));

	// Placement: where the shape sits (centre + size, in CSS pixels).
	const place = { cx: 0, cy: 0, size: 0 };
	const want = { cx: 0, cy: 0, size: 0, alpha: 1 };
	let alpha = 0;

	const mouse = { x: -1e4, y: -1e4, active: false };
	let pinned = null; // a script-requested shape overrides the page's
	let current = ""; // key of the shape currently formed
	const cache = new Map();

	function resize() {
		dpr = Math.min(devicePixelRatio || 1, 2);
		W = innerWidth; H = innerHeight;
		canvas.width = W * dpr; canvas.height = H * dpr;
		canvas.style.width = W + "px"; canvas.style.height = H + "px";
	}
	resize();

	// ---- shapes -----------------------------------------------------------

	async function resolve(spec) {
		if (typeof spec === "string" && spec.startsWith("text:")) return { key: spec, draw: fromText(spec.slice(5)) };
		if (typeof spec === "string") return { key: spec, draw: shapes[spec] || shapes.orb };
		if (spec.svg) return { key: "svg:" + spec.svg.slice(0, 64), draw: fromSVGPath(spec.svg, spec.viewBox) };
		if (spec.text) return { key: "text:" + spec.text, draw: fromText(spec.text) };
		if (spec.image) return { key: "img:" + spec.image, draw: await fromImage(spec.image) };
		if (spec.draw) return { key: "fn:" + (spec.name || Math.random()), draw: spec.draw };
		return { key: "orb", draw: shapes.orb };
	}

	async function morph(spec) {
		const { key, draw } = await resolve(spec);
		if (key === current) return;
		current = key;
		let pts = cache.get(key);
		if (!pts) {
			pts = sample(draw, N);
			if (cache.size > 12) cache.delete(cache.keys().next().value);
			cache.set(key, pts);
		}
		// Shuffle the assignment so particles cross the screen when re-forming.
		const order = [...Array(N).keys()].sort(() => Math.random() - 0.5);
		const next = new Float32Array(N * 2);
		for (let i = 0; i < N; i++) {
			next[i * 2] = pts[order[i] * 2];
			next[i * 2 + 1] = pts[order[i] * 2 + 1];
		}
		target = next;
		if (reduced) snap();
	}

	// ---- choosing what to show --------------------------------------------

	const anchors = new Set();
	const io = "IntersectionObserver" in window
		? new IntersectionObserver((entries) => {
			for (const e of entries) e.isIntersecting ? anchors.add(e.target) : anchors.delete(e.target);
			choose();
		}, { threshold: [0, 0.1, 0.4, 0.8] })
		: null;
	const observe = () => document.querySelectorAll("[data-cloud]").forEach((el) => io?.observe(el));

	let active = null;
	function choose() {
		const focus = H * 0.42;
		let best = null, bestScore = Infinity;
		for (const el of anchors) {
			const r = el.getBoundingClientRect();
			if (!r.width || !r.height) continue;
			const top = Math.max(r.top, 0), bot = Math.min(r.bottom, H);
			if (bot - top < 40) continue;
			const score = Math.abs((top + bot) / 2 - focus) + (r.height > H * 1.4 ? H * 0.25 : 0);
			if (score < bestScore) { bestScore = score; best = el; }
		}
		active = best;
		if (!pinned) morph(best ? best.dataset.cloud : current || "orb");
		aim();
	}

	/** Work out where the shape should sit for the active anchor. */
	function aim() {
		if (!active) {
			// Nothing claims the cloud: shrink into the corner, dim.
			Object.assign(want, { cx: W - 70, cy: H - 70, size: small() ? 70 : 96, alpha: 0.35 });
			return;
		}
		const r = active.getBoundingClientRect();
		const top = Math.max(r.top, 64), bot = Math.min(r.bottom, H);
		const visH = Math.max(bot - top, 80);
		const sizeK = parseFloat(active.dataset.cloudSize || "0.82");
		const where = active.dataset.cloudPlace || "right";
		if (small()) {
			Object.assign(want, { cx: W / 2, cy: (top + bot) / 2, size: Math.min(W * 0.75, visH * 0.7) * sizeK, alpha: 0.3 });
			return;
		}
		const size = Math.min(visH * sizeK, r.width * 0.36, 440);
		const fx = parseFloat(active.dataset.cloudX || (where === "left" ? "0.18" : where === "center" ? "0.5" : "0.8"));
		const cx = r.left + r.width * fx;
		Object.assign(want, { cx, cy: (top + bot) / 2, size, alpha: 1 });
	}

	// ---- physics + drawing ------------------------------------------------

	function snap() {
		Object.assign(place, want);
		alpha = want.alpha;
		for (let i = 0; i < N; i++) {
			x[i] = place.cx + target[i * 2] * place.size;
			y[i] = place.cy + target[i * 2 + 1] * place.size;
		}
		draw(0);
	}

	let last = performance.now(), t = 0;
	function frame(now) {
		const dt = Math.min((now - last) / 16.67, 3);
		last = now;
		t += dt * 0.016;
		// The placement itself glides, so the whole cloud travels with scrolling.
		const ease = 1 - Math.pow(0.88, dt);
		place.cx += (want.cx - place.cx) * ease;
		place.cy += (want.cy - place.cy) * ease;
		place.size += (want.size - place.size) * ease;
		alpha += (want.alpha - alpha) * ease * 0.6;

		const R = Math.max(70, place.size * 0.28), R2 = R * R;
		const damp = Math.pow(0.86, dt);
		for (let i = 0; i < N; i++) {
			const breathe = Math.sin(t * 1.3 + phase[i]) * 1.6;
			const tx = place.cx + target[i * 2] * place.size + breathe;
			const ty = place.cy + target[i * 2 + 1] * place.size + Math.cos(t * 1.1 + phase[i]) * 1.6;
			let ax = (tx - x[i]) * k[i], ay = (ty - y[i]) * k[i];
			if (mouse.active) {
				const dx = x[i] - mouse.x, dy = y[i] - mouse.y, d2 = dx * dx + dy * dy;
				if (d2 < R2 && d2 > 0.01) {
					const d = Math.sqrt(d2), f = (1 - d / R) ** 2 * 7;
					ax += (dx / d) * f; ay += (dy / d) * f;
				}
			}
			vx[i] = (vx[i] + ax * dt) * damp;
			vy[i] = (vy[i] + ay * dt) * damp;
			x[i] += vx[i] * dt; y[i] += vy[i] * dt;
		}
		draw();
		raf = requestAnimationFrame(frame);
	}

	function draw() {
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = "rgb(224, 27, 24)";
		for (let l = 0; l < 3; l++) {
			const { size, alpha: a } = LAYERS[l];
			ctx.globalAlpha = a * alpha;
			for (const i of byLayer[l]) ctx.fillRect(x[i], y[i], size, size);
		}
		ctx.globalAlpha = 1;
	}

	// ---- wiring -----------------------------------------------------------

	let raf = 0;
	const run = () => { if (!raf && !reduced && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
	const stop = () => { cancelAnimationFrame(raf); raf = 0; };

	addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; }, { passive: true });
	addEventListener("pointerdown", (e) => {
		// A click scatters the cloud harder.
		for (let i = 0; i < N; i++) {
			const dx = x[i] - e.clientX, dy = y[i] - e.clientY, d = Math.hypot(dx, dy) || 1;
			if (d < 220) { const f = (1 - d / 220) * 18; vx[i] += (dx / d) * f; vy[i] += (dy / d) * f; }
		}
	}, { passive: true });
	document.documentElement.addEventListener("pointerleave", () => (mouse.active = false));
	addEventListener("scroll", () => { choose(); }, { passive: true });
	addEventListener("resize", () => { resize(); choose(); if (reduced) snap(); });
	addEventListener("cloud:refresh", () => choose());
	document.addEventListener("visibilitychange", () => (document.hidden ? stop() : run()));
	addEventListener("pagehide", () => {
		try { sessionStorage.setItem(STORE, JSON.stringify({ key: current, cx: place.cx, cy: place.cy, size: place.size })); } catch {}
	});

	// Arrive from the previous page's shape and position, then move on.
	(async () => {
		let prev = null;
		try { prev = JSON.parse(sessionStorage.getItem(STORE) || "null"); } catch {}
		observe();
		if (prev && shapes[prev.key] && !reduced) {
			await morph(prev.key);
			Object.assign(want, { cx: prev.cx, cy: prev.cy, size: prev.size, alpha: 0.9 });
			snap();
			alpha = 0.9;
		} else {
			await morph("orb");
			aim();
			// First visit: start scattered, so the cloud visibly assembles.
			Object.assign(place, want);
			for (let i = 0; i < N; i++) { x[i] = Math.random() * W; y[i] = Math.random() * H; }
		}
		requestAnimationFrame(() => { choose(); reduced ? snap() : run(); });
	})();

	window.rhaqimCloud = {
		/** Form a shape: a name, { svg, viewBox }, { text }, { image } or { draw }. Holds until release(). */
		async morph(spec) { pinned = spec; await morph(spec); },
		/** Hand control back to the page's [data-cloud] elements. */
		release() { pinned = null; current = ""; choose(); },
		/** Add a named shape: draw(ctx, S) on an S×S canvas, white = filled. */
		register(name, drawFn) { shapes[name] = drawFn; },
		get shapes() { return Object.keys(shapes); },
		/** Re-scan the page for [data-cloud] elements (after rendering new ones). */
		refresh() { observe(); choose(); },
	};
}
