// Shape library for the point cloud. A shape is a draw function on a square
// canvas of side S: fill white where the silhouette is, punch holes with
// `hole()`. The sampler turns any of these (or an SVG path, text or an image)
// into normalised points, weighted towards edges so silhouettes read clearly.

const TAU = Math.PI * 2;

/** Punch a hole: everything drawn inside fn is erased. */
function hole(ctx, fn) {
	ctx.save();
	ctx.globalCompositeOperation = "destination-out";
	fn();
	ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, r);
}

function dot(ctx, x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, TAU);
	ctx.fill();
}

function line(ctx, pts, width) {
	ctx.lineWidth = width;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
	ctx.stroke();
}

export const shapes = {
	/** Home: a wireframe globe. Systems that other things run on. */
	orb(ctx, S) {
		const c = S / 2, r = S * 0.44, w = S * 0.035;
		ctx.lineWidth = w;
		ctx.beginPath(); ctx.arc(c, c, r, 0, TAU); ctx.stroke();
		for (const k of [0.33, 0.7]) {
			ctx.beginPath(); ctx.ellipse(c, c, r * k, r, 0, 0, TAU); ctx.stroke();
		}
		for (const y of [-0.5, 0, 0.5]) {
			const ry = y * r, rx = Math.sqrt(r * r - ry * ry);
			ctx.beginPath(); ctx.ellipse(c, c + ry, rx, r * 0.12, 0, 0, TAU); ctx.stroke();
		}
	},

	/** USSD: a feature phone. */
	phone(ctx, S) {
		roundRect(ctx, S * 0.3, S * 0.04, S * 0.4, S * 0.92, S * 0.07);
		ctx.fill();
		ctx.fillRect(S * 0.6, 0, S * 0.04, S * 0.08); // antenna
		hole(ctx, () => {
			roundRect(ctx, S * 0.36, S * 0.13, S * 0.28, S * 0.27, S * 0.02);
			ctx.fill();
			for (let row = 0; row < 4; row++) {
				for (let col = 0; col < 3; col++) {
					dot(ctx, S * (0.4 + col * 0.1), S * (0.53 + row * 0.095), S * 0.028);
				}
			}
		});
	},

	/** Tabletop: an isometric d6, as a wireframe with solid pips (points read
	 *  edges and dots far better than a filled block with thin cut-outs). */
	die(ctx, S) {
		const P = (x, y) => [S * x, S * y];
		const top = P(0.5, 0.06), ur = P(0.9, 0.28), lr = P(0.9, 0.72), bot = P(0.5, 0.94), ll = P(0.1, 0.72), ul = P(0.1, 0.28), mid = P(0.5, 0.5);
		const w = S * 0.04;
		line(ctx, [top, ur, lr, bot, ll, ul, top], w);
		line(ctx, [ul, mid, ur], w);
		line(ctx, [mid, bot], w);
		const face = (A, B, D) => (u, v) => [A[0] + u * (B[0] - A[0]) + v * (D[0] - A[0]), A[1] + u * (B[1] - A[1]) + v * (D[1] - A[1])];
		const r = S * 0.05;
		const topF = face(ul, top, mid), leftF = face(ul, mid, ll), rightF = face(mid, ur, bot);
		dot(ctx, ...topF(0.5, 0.5), r);
		dot(ctx, ...leftF(0.3, 0.3), r); dot(ctx, ...leftF(0.7, 0.7), r);
		dot(ctx, ...rightF(0.25, 0.25), r); dot(ctx, ...rightF(0.5, 0.5), r); dot(ctx, ...rightF(0.75, 0.75), r);
	},

	/** buckt: a bucket with a handle. */
	bucket(ctx, S) {
		ctx.beginPath();
		ctx.moveTo(S * 0.18, S * 0.38); ctx.lineTo(S * 0.82, S * 0.38);
		ctx.lineTo(S * 0.72, S * 0.92); ctx.lineTo(S * 0.28, S * 0.92);
		ctx.closePath(); ctx.fill();
		ctx.beginPath(); ctx.ellipse(S * 0.5, S * 0.38, S * 0.32, S * 0.07, 0, 0, TAU); ctx.fill();
		ctx.lineWidth = S * 0.035;
		ctx.beginPath(); ctx.arc(S * 0.5, S * 0.4, S * 0.3, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
		hole(ctx, () => {
			ctx.beginPath(); ctx.ellipse(S * 0.5, S * 0.38, S * 0.27, S * 0.045, 0, 0, TAU); ctx.fill();
			ctx.fillRect(S * 0.27, S * 0.58, S * 0.46, S * 0.025);
		});
	},

	/** loom: agents as a layered graph, lead on the left. */
	network(ctx, S) {
		const n = [[0.12, 0.5], [0.4, 0.25], [0.4, 0.75], [0.66, 0.2], [0.66, 0.55], [0.9, 0.42]].map(([x, y]) => [S * x, S * y]);
		const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5]];
		for (const [a, b] of edges) line(ctx, [n[a], n[b]], S * 0.022);
		n.forEach(([x, y], i) => dot(ctx, x, y, S * (i === 0 ? 0.085 : 0.065)));
		hole(ctx, () => n.forEach(([x, y], i) => dot(ctx, x, y, S * (i === 0 ? 0.045 : 0.03))));
	},

	/** Forecast desk: the host behind the desk, a board of odds behind them. */
	host(ctx, S) {
		roundRect(ctx, S * 0.1, S * 0.04, S * 0.8, S * 0.2, S * 0.02); ctx.fill(); // odds board
		hole(ctx, () => {
			for (let i = 0; i < 3; i++) roundRect(ctx, S * (0.15 + i * 0.25), S * 0.08, S * 0.2, S * 0.12, S * 0.01), ctx.fill();
		});
		dot(ctx, S * 0.5, S * 0.37, S * 0.105); // head
		ctx.beginPath(); // shoulders and torso, with a gap at the neck
		ctx.moveTo(S * 0.22, S * 0.68);
		ctx.quadraticCurveTo(S * 0.22, S * 0.52, S * 0.5, S * 0.51);
		ctx.quadraticCurveTo(S * 0.78, S * 0.52, S * 0.78, S * 0.68);
		ctx.closePath(); ctx.fill();
		ctx.fillRect(S * 0.05, S * 0.66, S * 0.9, S * 0.06); // desktop
		ctx.beginPath(); // desk front
		ctx.moveTo(S * 0.1, S * 0.72); ctx.lineTo(S * 0.9, S * 0.72); ctx.lineTo(S * 0.84, S * 0.96); ctx.lineTo(S * 0.16, S * 0.96);
		ctx.closePath(); ctx.fill();
		hole(ctx, () => ctx.fillRect(S * 0.16, S * 0.8, S * 0.68, S * 0.02));
	},

	/** Notes on identity: two linked rings. */
	link(ctx, S) {
		ctx.lineWidth = S * 0.06;
		ctx.beginPath(); ctx.arc(S * 0.37, S * 0.5, S * 0.24, 0, TAU); ctx.stroke();
		ctx.beginPath(); ctx.arc(S * 0.63, S * 0.5, S * 0.24, 0, TAU); ctx.stroke();
	},

	/** Product case studies: an application window. */
	window(ctx, S) {
		roundRect(ctx, S * 0.06, S * 0.16, S * 0.88, S * 0.68, S * 0.04); ctx.fill();
		hole(ctx, () => {
			roundRect(ctx, S * 0.1, S * 0.28, S * 0.8, S * 0.52, S * 0.02); ctx.fill();
			[0.13, 0.19, 0.25].forEach((x) => dot(ctx, S * x, S * 0.22, S * 0.018));
		});
		ctx.fillRect(S * 0.16, S * 0.38, S * 0.42, S * 0.05);
		ctx.fillRect(S * 0.16, S * 0.5, S * 0.62, S * 0.025);
		ctx.fillRect(S * 0.16, S * 0.57, S * 0.55, S * 0.025);
		ctx.fillRect(S * 0.16, S * 0.64, S * 0.6, S * 0.025);
	},
};

// ---------------------------------------------------------------------------
// Sampling
// ---------------------------------------------------------------------------

const SIZE = 220;

/** Render a draw function and sample `n` points from it, normalised so the
 *  longest side spans 1 and the shape is centred on 0,0. */
export function sample(draw, n) {
	const cv = document.createElement("canvas");
	cv.width = cv.height = SIZE;
	const ctx = cv.getContext("2d", { willReadFrequently: true });
	ctx.fillStyle = ctx.strokeStyle = "#fff";
	draw(ctx, SIZE);
	return samplePixels(ctx.getImageData(0, 0, SIZE, SIZE).data, SIZE, n);
}

function samplePixels(px, size, n, test = (i) => px[i + 3] > 128) {
	const fill = [], edge = [];
	const on = (x, y) => x >= 0 && y >= 0 && x < size && y < size && test((y * size + x) * 4);
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			if (!on(x, y)) continue;
			const p = y * size + x;
			if (!on(x - 1, y) || !on(x + 1, y) || !on(x, y - 1) || !on(x, y + 1)) edge.push(p);
			else fill.push(p);
		}
	}
	if (!fill.length && !edge.length) return new Float32Array(n * 2);
	let minX = size, minY = size, maxX = 0, maxY = 0;
	for (const p of edge.length ? edge : fill) {
		const x = p % size, y = (p / size) | 0;
		if (x < minX) minX = x; if (x > maxX) maxX = x;
		if (y < minY) minY = y; if (y > maxY) maxY = y;
	}
	const span = Math.max(maxX - minX, maxY - minY, 1), cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
	const out = new Float32Array(n * 2);
	const nEdge = edge.length ? Math.round(n * (fill.length ? 0.42 : 1)) : 0;
	for (let i = 0; i < n; i++) {
		const pool = i < nEdge ? edge : fill.length ? fill : edge;
		const p = pool[(Math.random() * pool.length) | 0];
		out[i * 2] = ((p % size) + Math.random() - 0.5 - cx) / span;
		out[i * 2 + 1] = (((p / size) | 0) + Math.random() - 0.5 - cy) / span;
	}
	return out;
}

/** An SVG path's `d` attribute, in any coordinate space (e.g. an agent's output). */
export function fromSVGPath(d, viewBox = 100) {
	const path = new Path2D(d);
	return (ctx, S) => {
		ctx.save();
		ctx.scale(S / viewBox, S / viewBox);
		ctx.fill(path, "evenodd");
		ctx.restore();
	};
}

/** A word or a few characters. */
export function fromText(text) {
	return (ctx, S) => {
		const len = Math.max(1, [...text].length);
		ctx.font = `600 ${Math.min(S * 0.8, (S * 1.6) / len)}px "IBM Plex Mono", ui-monospace, monospace`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, S / 2, S / 2);
	};
}

/** A silhouette from an image: opaque or dark pixels become points. Resolves
 *  to a draw function once the image loads. */
export function fromImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve((ctx, S) => {
			const k = Math.min(S / img.width, S / img.height);
			const w = img.width * k, h = img.height * k;
			const tmp = document.createElement("canvas");
			tmp.width = tmp.height = S;
			const t = tmp.getContext("2d", { willReadFrequently: true });
			t.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
			const d = t.getImageData(0, 0, S, S);
			const hasAlpha = d.data.some((v, i) => i % 4 === 3 && v < 250);
			for (let i = 0; i < d.data.length; i += 4) {
				const lum = 0.2126 * d.data[i] + 0.7152 * d.data[i + 1] + 0.0722 * d.data[i + 2];
				const solid = hasAlpha ? d.data[i + 3] > 128 : lum < 128;
				d.data[i] = d.data[i + 1] = d.data[i + 2] = 255;
				d.data[i + 3] = solid ? 255 : 0;
			}
			ctx.putImageData(d, 0, 0);
		});
		img.onerror = reject;
		img.src = url;
	});
}
