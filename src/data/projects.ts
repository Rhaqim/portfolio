export const projects: Project[] = [
	{
		title: "CoNexus — Storytelling Game Platform",
		description:
			"Go-based storytelling platform with multiple engines. Modular text/image/tts pipelines, unified media task engine, multi-tenant design and ongoing vector-search experimentation.",
		technologies: [
			"Golang",
			"Gin",
			"sqlx",
			"Redis",
			"PostgreSQL",
			"Docker",
			"Podman",
			"Nginx",
			"GitHub Actions",
			"LLM integrations",
			"Image / TTS pipelines",
		],
		status: "In Progress",
		featured: true,
		year: "2025",
	},
	{
		title: "Buckt - File Upload & Storage Management Service",
		description:
			"File upload & storage microservice used at Degenerous DAO. Refactored for performance: reduced DB reads, improved caching, containerized deployments and CI/CD.",
		technologies: [
			"Golang",
			"Gin",
			"PostgreSQL",
			"Redis",
			"S3-compatible storage",
		],
		status: "Live",
		featured: true,
		year: "2025",
	},

	{
		title: "USSD Gateway & Services",
		description:
			"Unstructured Supplementary Service Data (USSD) gateway and services for telecom applications. Features include session management, menu builder, shortcode handling, and integration with external APIs.",
		technologies: ["Rust", "Next.js", "TypeScript", "Node.js"],
		status: "In Progress",
		featured: false,
		year: "2024",
	},
	{
		title: "Manga Portfolio Site",
		description:
			"Personal manga-inspired portfolio built with Astro + Svelte and TypeScript, optimized for performance and deployed to modern CDN (Cloudflare/Pages).",
		technologies: ["Astro", "Svelte", "TypeScript", "Vite", "Cloudflare"],
		status: "Live",
		featured: false,
		year: "2025",
	},
];
