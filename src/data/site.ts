export const site = {
	url: "https://rhaqim.com",
	name: "Rhaqim",
	legalName: "John Franklin Anusiem",
	role: "Systems Engineer",
	email: "anusiemj@gmail.com",
	description:
		"Systems engineer. I build backend infrastructure: a Rust USSD engine, a Go media-storage library, a multi-agent runtime. I'm moving down the stack toward embedded systems and hardware.",
	/** One line. It is the first thing anyone reads. */
	thesis: "I build infrastructure other software runs on.",
} as const;

export const links = {
	github: "https://github.com/Rhaqim",
	linkedin: "https://www.linkedin.com/in/john-franklin-anusiem/",
	twitter: "https://twitter.com/ivxnio",
	email: `mailto:${site.email}`,
} as const;

export const nav: { label: string; href: string }[] = [
	{ label: "Systems", href: "/#systems" },
	{ label: "Products", href: "/#products" },
	{ label: "Experience", href: "/#experience" },
	{ label: "Research", href: "/#research" },
];

/** Terse capability strip. Facts, not adjectives. */
export const stack: { label: string; items: string[] }[] = [
	{ label: "Languages", items: ["Go", "Rust", "Python", "TypeScript", "C"] },
	{ label: "Data", items: ["PostgreSQL", "SQLite", "Redis", "S3"] },
	{ label: "Runtime", items: ["Docker", "Kubernetes", "Actix", "Gin"] },
	{ label: "Next", items: ["Embedded C", "RTOS", "embedded-hal", "RF"] },
];
