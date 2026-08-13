export type Status = "stable" | "active" | "live" | "wip";

export type Project = {
	/** Route slug. Each maps 1:1 to a future subdomain (buckt.rhaqim.com ...). */
	slug: string;
	name: string;
	/** Four words at most. Says what it is, not how good it is. */
	summary: string;
	/** One sentence. The problem it removes. */
	detail: string;
	language: string;
	status: Status;
	year: string;
	/** Shown verbatim in mono. The fastest possible proof it's real. */
	install?: string;
	stars?: number;
	repo?: string;
	live?: string;
	tags: string[];
};

/** Libraries. Things other engineers install. */
export const systems: Project[] = [
	{
		slug: "buckt",
		name: "buckt",
		summary: "Media storage library",
		detail:
			"Application-layer media management for Go: folder trees, metadata, derivatives and dedup on top of any object store.",
		language: "Go",
		status: "stable",
		year: "2025",
		install: "go get github.com/Rhaqim/buckt",
		stars: 4,
		repo: "https://github.com/Rhaqim/buckt",
		tags: ["S3", "GCS", "Azure", "R2", "SQLite", "Postgres"],
	},
	{
		slug: "ussd",
		name: "ussdframework",
		summary: "USSD application engine",
		detail:
			"Declarative, JSON-driven USSD flows in Rust, with session management, validation, expression routing and a visual menu builder.",
		language: "Rust",
		status: "active",
		year: "2024",
		install: "cargo add ussdframework",
		stars: 12,
		repo: "https://github.com/Rhaqim/ussdframework",
		tags: ["Actix", "Diesel", "SQLite", "Postgres", "Docker"],
	},
	{
		slug: "loom",
		name: "loom",
		summary: "Multi-agent runtime",
		detail:
			"Modality-agnostic orchestration for LLM applications: versioned agents, session branching, budgets, judges and a test harness.",
		language: "Go",
		status: "active",
		year: "2026",
		install: "go get github.com/rhaqim/loom",
		repo: "https://github.com/rhaqim/loom",
		tags: ["OpenAI", "Anthropic", "Replicate", "Runway", "Postgres"],
	},
];

/** Products. Things people use without knowing what's underneath. */
export const products: Project[] = [
	{
		slug: "conexus",
		name: "CoNexus",
		summary: "AI storytelling engine",
		detail:
			"Interactive narrative platform. LLM orchestration, media pipelines and vector search behind a real-time story runtime.",
		language: "Go",
		status: "live",
		year: "2023-now",
		live: "https://conexus.ink",
		repo: "https://github.com/degenerousdao/conexus",
		tags: ["Go", "Postgres", "Redis", "Vector search", "Ethereum"],
	},
	{
		slug: "brisa",
		name: "Brisa Women's Foundation",
		summary: "Non-profit platform",
		detail:
			"Public site and programme directory for a women's foundation, built for editors rather than engineers.",
		language: "TypeScript",
		status: "live",
		year: "2026",
		live: "https://brisafoundation.org",
		tags: ["Next.js", "TypeScript"],
	},
	{
		slug: "eriife",
		name: "EriIfe",
		summary: "Artist release site",
		detail:
			"Discography and release site for a recording artist. Fast, quiet, built to get out of the music's way.",
		language: "TypeScript",
		status: "live",
		year: "2026",
		live: "https://eriifemusic.com",
		tags: ["Next.js", "TypeScript"],
	},
];

export const allProjects: Project[] = [...systems, ...products];

export const statusLabel: Record<Status, string> = {
	stable: "Stable",
	active: "Active",
	live: "Live",
	wip: "In progress",
};
