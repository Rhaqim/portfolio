/**
 * Live demos, in the order the pager walks them. `slug` matches both the
 * demo page (/demo/<slug>) and the project's docs page (/<slug>).
 */
export type Demo = {
	slug: string;
	name: string;
	/** What you do in the demo, in a few words. */
	title: string;
	language: string;
};

export const demos: Demo[] = [
	{ slug: "ussd", name: "ussdframework", title: "Dial a loan", language: "Rust" },
	{ slug: "buckt", name: "buckt", title: "A media sandbox", language: "Go" },
	{ slug: "loom", name: "loom", title: "Run a table with agents", language: "Go" },
];

/** The demos either side of `slug`, wrapping around. */
export function neighbours(slug: string) {
	const i = demos.findIndex((d) => d.slug === slug);
	if (i < 0) return { prev: undefined, next: undefined, current: undefined };
	return {
		current: demos[i],
		prev: demos[(i - 1 + demos.length) % demos.length],
		next: demos[(i + 1) % demos.length],
	};
}
