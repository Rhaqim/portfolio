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
//
// Observation. Like an electron, the cloud only takes a definite shape while
// someone is watching. Unwatched, each particle decoheres into a probability
// cloud (a hydrogen orbital, now and then something else) and keeps jumping
// to new places in it; watched again, it collapses back onto the shape.
// "Watching" is a guess from attention: recent input, the cursor near the
// cloud, the tab being in front. Coming back to the tab catches it
// mid-collapse. A camera-based gaze signal (hud) can take over with
// rhaqimCloud.observe(v), 0..1, and observe(null) hands control back.
// Each collapse dispatches a "cloud:collapse" event on window.

import { shapes, sample, fromSVGPath, fromText, fromImage, fromDensity, orbitals, blur } from "./shapes.js";

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

	// ---- observation ------------------------------------------------------

	const IDLE = 8000; // ms without input before attention is assumed to drift
	const POOL = N * 4; // positions a decohered particle can jump between
	const ox = new Float32Array(N), oy = new Float32Array(N); // each particle's spot in the cloud
	const th = new Float32Array(N); // collapse threshold: particles lock on in a cascade
	for (let i = 0; i < N; i++) th[i] = 0.05 + Math.random() * 0.9;
	let obs = 1; // smoothed observation, 0 = superposition, 1 = collapsed
	let external = null; // a gaze signal, when something provides one
	let lastInput = performance.now();
	let holdUntil = 0; // keep the superposition briefly so a returning visitor sees it
	let decohered = false, flash = 0, orbitalSince = 0;
	let pool = new Float32Array(POOL * 2);

	/** Pick what the cloud becomes while unobserved: an orbital, at a random
	 *  angle, or once in a while a smeared ψ. */
	function newOrbital(now = performance.now()) {
		orbitalSince = now;
		if (Math.random() < 1 / 7) {
			pool = blur(sample(fromText("ψ"), POOL), 0.025);
		} else {
			const names = Object.keys(orbitals);
			const [p, L] = orbitals[names[(Math.random() * names.length) | 0]];
			pool = fromDensity(p, POOL, L, Math.random() < 0.5 ? 0 : Math.random() * Math.PI);
		}
		for (let i = 0; i < N; i++) jump(i);
	}
	function jump(i) {
		const j = ((Math.random() * POOL) | 0) * 2;
		ox[i] = pool[j]; oy[i] = pool[j + 1];
	}

	/** Where attention seems to be, 0..1, before smoothing. */
	function attention(now) {
		if (now < holdUntil) return 0;
		if (external !== null) return external;
		const idle = now - lastInput;
		if (idle < IDLE) return 1;
		// A cursor resting on the cloud still counts, for a while.
		const near = mouse.active && idle < IDLE * 4 && Math.hypot(mouse.x - place.cx, mouse.y - place.cy) < place.size * 0.75;
		return near ? 1 : 0;
	}

	function updateObservation(now, dt) {
		const a = attention(now);
		// Collapse is quick; decoherence is slow (~4 s), so a glance away doesn't undo it.
		obs = a > obs ? obs + (a - obs) * (1 - Math.pow(0.93, dt)) : Math.max(a, obs - 0.004 * dt);
		if (obs < 0.9 && !decohered) { decohered = true; newOrbital(now); }
		if (decohered && obs < 0.1 && now - orbitalSince > 15000) newOrbital(now);
		if (decohered && obs > 0.97) {
			decohered = false;
			flash = 1;
			dispatchEvent(new CustomEvent("cloud:collapse"));
		}
		flash *= Math.pow(0.94, dt);
	}

	/** Start (or return to) a superposition and let it collapse in view. */
	function decohereNow(hold) {
		obs = 0;
		decohered = true;
		newOrbital();
		for (let i = 0; i < N; i++) {
			x[i] = place.cx + ox[i] * place.size; y[i] = place.cy + oy[i] * place.size;
			vx[i] = vy[i] = 0;
		}
		lastInput = performance.now();
		holdUntil = lastInput + hold;
	}

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

		updateObservation(now, dt);
		const R = Math.max(70, place.size * 0.28), R2 = R * R;
		const damp = Math.pow(0.86, dt);
		const leap = (1 - obs) * 0.03 * dt; // chance a decohered particle jumps this frame
		const shimmer = (1 - obs) * 0.6;
		for (let i = 0; i < N; i++) {
			let tx, ty, ki = k[i];
			if (obs > th[i]) {
				const breathe = Math.sin(t * 1.3 + phase[i]) * 1.6;
				tx = place.cx + target[i * 2] * place.size + breathe;
				ty = place.cy + target[i * 2 + 1] * place.size + Math.cos(t * 1.1 + phase[i]) * 1.6;
			} else {
				// Unobserved: no trajectory, just a new position in the cloud now and then.
				tx = place.cx + ox[i] * place.size;
				ty = place.cy + oy[i] * place.size;
				if (Math.random() < leap) {
					jump(i);
					x[i] = place.cx + ox[i] * place.size; y[i] = place.cy + oy[i] * place.size;
					vx[i] = vy[i] = 0;
					continue;
				}
				ki *= 0.6;
				vx[i] += (Math.random() - 0.5) * shimmer * dt;
				vy[i] += (Math.random() - 0.5) * shimmer * dt;
			}
			let ax = (tx - x[i]) * ki, ay = (ty - y[i]) * ki;
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
		// A collapse flares briefly: brighter, slightly larger points.
		const glow = 1 + flash * 0.5, grow = flash * 0.8;
		for (let l = 0; l < 3; l++) {
			const { size, alpha: a } = LAYERS[l];
			ctx.globalAlpha = Math.min(1, a * alpha * glow);
			for (const i of byLayer[l]) ctx.fillRect(x[i], y[i], size + grow, size + grow);
		}
		ctx.globalAlpha = 1;
	}

	// ---- wiring -----------------------------------------------------------

	let raf = 0;
	const run = () => { if (!raf && !reduced && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
	const stop = () => { cancelAnimationFrame(raf); raf = 0; };

	const seen = () => (lastInput = performance.now());
	for (const ev of ["scroll", "wheel", "keydown", "touchstart"]) addEventListener(ev, seen, { passive: true });
	addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; seen(); }, { passive: true });
	addEventListener("pointerdown", (e) => {
		seen();
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
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) return stop();
		// Nobody could see it while the tab was away: it's a cloud again, and
		// looking back collapses it.
		if (!reduced) decohereNow(450);
		run();
	});
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
			// First visit: start as a probability cloud, so the first look collapses it.
			Object.assign(place, want);
			if (!reduced) decohereNow(700);
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
		/** Say how observed the cloud is, 0..1 (e.g. from gaze tracking); null = guess from attention. */
		observe(v) { external = v === null || v === undefined ? null : Math.min(1, Math.max(0, +v || 0)); },
		/** How collapsed the cloud is right now, 0..1. */
		get observed() { return obs; },
	};
}
