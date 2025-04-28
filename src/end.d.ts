/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type GridLayout = {
	content: string | SvelteComponent;
	rowSpan: number;
	colSpan: number;
	rowStart?: number;
	colStart?: number;
	rowEnd?: number;
	colEnd?: number;
	skewX?: number; // degrees to skew horizontally
	skewY?: number; // degrees to skew vertically
	clipPath?: string; // optional manual clip-path for crazy shapes
	backgroundColor?: string; // in case you want some backgrounds
	effect?: "hover-zoom" | "appear" | "none"; // Add your effects here
};
