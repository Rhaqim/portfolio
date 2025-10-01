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
	effectDuration?: number; // in milliseconds
	effectDelay?: number; // in milliseconds
};

type WorkData = {
	company: string;
	companyUrl: string;
	role: string;
	description: string;
	companyLogo?: string;
	startDate?: string;
	endDate?: string;
	technologies: string[];
	highlights?: string[];
};

type ProjectData = {
	title: string;
	description: string;
	technologies: string[];
	url: string;
	repoUrl?: string;
	imageUrl?: string;
	featured?: boolean;
};

type NavigationLink = {
	id: string;
	name: string;
	href: string;
	icon: string;
	current: boolean;
};

type Thought = {
	title: string;
	content: string;
	type: "thought" | "speech";
	icon: string;
};

type Project = {
	title: string;
	description: string;
	technologies: string[];
	status: string;
	featured: boolean;
	year: string;
	url?: string;
};
