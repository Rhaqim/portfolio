/**
 * The resume as data: the single source of truth for every resume the site
 * renders, including tailored company pages (src/content/companies).
 *
 * Every bullet has a stable id. A company page may select, reorder and lightly
 * rephrase bullets, but each one must point at an id here, so nothing on a
 * tailored page can be invented. `npm run company:check` enforces that.
 *
 * Transcribed from public/john-franklin-anusiem-resume.pdf. Edit here, and keep
 * the PDF in step until it's generated from this file.
 */

export type Bullet = { id: string; text: string };

export type Job = {
	id: string;
	title: string;
	company: string;
	companyNote?: string;
	companyUrl?: string;
	start: string; // YYYY-MM, or YYYY when the month isn't known
	end?: string; // same; absent = present
	/** Optional sub-headings, in order; bullets name the group they sit under. */
	groups?: { id: string; label: string }[];
	/** Left off tailored pages unless John asks for it in review. */
	optIn?: boolean;
	bullets: (Bullet & { group?: string })[];
};

export type Education = {
	id: string;
	field: string;
	school: string;
	degree: string;
	start: string;
	end?: string;
	note?: string;
};

export const contact = {
	name: "John-Franklin Anusiem",
	title: "Lead Software Engineer",
	email: "anusiemjohn@gmail.com",
	linkedin: "https://www.linkedin.com/in/john-franklin-anusiem/",
	site: "https://rhaqim.com",
	location: "Lagos, Nigeria",
};

export const summary =
	"Lead software engineer with 5+ years of experience building and running production systems in fintech and AI. Currently leads engineering on a suite of AI products, including an agent orchestration platform that lets non-technical staff deploy AI agents without writing code, and single-handedly runs the company's DevOps and infrastructure. Previously led delivery of a USSD loan service on a financial platform serving 16 million customers in six countries. Specializes in Golang, Rust and Python backends, multi-agent systems, Linux infrastructure and CI/CD.";

export const jobs: Job[] = [
	{
		id: "dgrs",
		title: "Lead Software Engineer",
		company: "DGRS Labs",
		companyNote: "AI studio behind CoNexus",
		companyUrl: "https://www.dgrslabs.ink",
		start: "2024-03",
		groups: [
			{ id: "ai", label: "AI products & engineering" },
			{ id: "infra", label: "DevOps & infrastructure (sole owner since 2024)" },
		],
		bullets: [
			{ id: "dgrs-lead", group: "ai", text: "Lead a team of three engineers across DGRS Labs' AI product suite (CoNexus, loom, buckt and an in-house AI model service), owning architecture, technical direction and production delivery." },
			{ id: "dgrs-loom", group: "ai", text: "Architected and built loom, the agent orchestration platform that powers CoNexus. It coordinates six specialized AI agents that generate stories and reader choices, then turn each scene into prompts for visuals, atmosphere, VFX and sound effects." },
			{ id: "dgrs-plugins", group: "ai", text: "Designed loom's plugin architecture to connect agents to external generation tools such as Meshy for 3D assets, and built a no-code admin interface so non-technical staff can create, configure and deploy new agents without engineering support." },
			{ id: "dgrs-models", group: "ai", text: "Built CoNexus's in-house AI model service on open-source models, cutting operating costs by 30% by reducing reliance on third-party AI providers." },
			{ id: "dgrs-buckt", group: "ai", text: "Created buckt, a Go media management service built on GORM over PostgreSQL or SQLite, that organizes the platform's asset library and lowers storage and operational costs." },
			{ id: "dgrs-assets", group: "ai", text: "Moved 15,000 media assets out of the frontend bundle into dedicated NGINX-served storage, cutting average page load time from 4.5s to 1.1s." },
			{ id: "dgrs-frontend", group: "ai", text: "Designed and built the platform's frontend in TypeScript with Astro and Svelte, before moving mainly to backend and DevOps." },
			{ id: "dgrs-images", group: "ai", text: "Moved AI image generation off the backend, where it was throttling the server, into a TypeScript service on the frontend: the backend sends a prompt drawn from the story, and the frontend requests the image from the AI servers." },
			{ id: "dgrs-queues", group: "ai", text: "Built queues and asynchronous media pipelines that take image and video generation off the request path." },
			{ id: "dgrs-async-agents", group: "ai", text: "Designed loom so connected agents can run asynchronously and stream events to the client, instead of leaving it waiting on a long response." },
			{ id: "dgrs-workers", group: "ai", text: "Ran background workers for scheduled jobs, such as cleaning up stories users abandoned for a month and refreshing credits for customers on higher tiers." },
			{ id: "dgrs-email", group: "ai", text: "Used Resend for the platform's email: password resets and changes, one-time codes for email login, and newsletters." },
			{ id: "dgrs-python-agents", group: "ai", text: "Implemented open-source AI agents for Degenerous AI in Python." },
			{ id: "dgrs-pgvector", group: "ai", text: "Stored story embeddings in PostgreSQL with pgvector so the AI could retrieve the context it needed to drive each story forward." },
			{ id: "dgrs-postgres", group: "ai", text: "Optimized PostgreSQL queries and added caching, reducing database reads by 40% and API response times from 1.2s to 600ms." },
			{ id: "dgrs-infra", group: "infra", text: "Built and run the company's entire infrastructure single-handedly: provisioning and configuring Linux servers, deploying the platform and routing traffic through Cloudflare." },
			{ id: "dgrs-envs", group: "infra", text: "Set up separate development, staging and production environments, and defined the deployment rules and release process the whole team follows." },
			{ id: "dgrs-cicd", group: "infra", text: "Built GitHub Actions CI/CD pipelines across five repositories, cutting deployment time by 80% and ending manual SSH deployments." },
			{ id: "dgrs-dr", group: "infra", text: "Designed a backup and disaster-recovery system with scripts that pull the latest code and backups and restore the full stack automatically, keeping downtime to a minimum." },
			{ id: "dgrs-monitoring", group: "infra", text: "Built a founder's dashboard that ingests the platform's errors and logs and sends alerts to Telegram." },
			{ id: "dgrs-grafana", group: "infra", text: "Before that, connected Grafana to the backend services and kept it private behind a Tailscale VPN." },
			{ id: "dgrs-ai-review", group: "infra", text: "Introduced an AI-assisted generator–reviewer workflow (Claude + Codex) with production-like Docker test environments, catching defects before deployment." },
		],
	},
	{
		id: "equity",
		title: "Senior Backend Developer",
		company: "Equity Group Holdings",
		companyUrl: "https://equitygroupholdings.com",
		start: "2021-08",
		end: "2024-04",
		bullets: [
			{ id: "equity-lead", text: "Led a team of four engineers delivering a USSD loan service from development to production on a financial services platform serving 16 million customers and handling over 1 million loan requests per month." },
			{ id: "equity-rollout", text: "Owned delivery, testing, deployment and production support through international rollouts across six countries, including Rwanda." },
			{ id: "equity-otel", text: "Instrumented the Django loan service with OpenTelemetry to trace where errors occurred, my first project at Equity." },
			{ id: "equity-mpesa", text: "Worked on the loan service's mobile money integrations, including M-Pesa." },
			{ id: "equity-drf", text: "Built the service's APIs mainly with Django REST Framework." },
			{ id: "equity-framework", text: "Built reusable USSD framework components in Python and Rust, and guided engineers on service integration and business logic." },
			{ id: "equity-orm", text: "Worked with the Django ORM daily: it was how the USSD service stored and served its menus." },
			{ id: "equity-fastapi", text: "Led a FastAPI proof of concept that showed it was a viable alternative to Django for the loan service." },
			{ id: "equity-k8s", text: "Containerized services with Docker, deployed them via Azure Pipelines and Kubernetes, and used Redis to support performance and reliability in production." },
		],
	},
	{
		id: "upwork",
		title: "Freelance Python Developer",
		company: "Upwork",
		start: "2021-02",
		end: "2021-07",
		optIn: true,
		bullets: [
			{ id: "upwork-stocks", text: "Built a stock trend analysis tool and dashboard in Python and Django REST Framework, collecting market data from APIs and implementing the client's analysis calculations." },
		],
	},
	{
		id: "nirvana",
		title: "Full Stack Developer",
		company: "Nirvana Labs",
		companyUrl: "https://nirvanalabs.io",
		start: "2023",
		end: "2024",
		optIn: true,
		bullets: [
			{ id: "nirvana-indexer", text: "Built a Rust-based NFT indexer for ERC-721 and ERC-1155 tokens." },
			{ id: "nirvana-go", text: "Wrote ChainQuery, the Ethereum indexer, in Go before moving it to Rust." },
			{ id: "nirvana-schema", text: "Designed the PostgreSQL schema for indexed blockchain data." },
			{ id: "nirvana-dashboard", text: "Led development of a user-metrics dashboard and its API integrations, deployed on Oracle Cloud." },
		],
	},
];

export const education: Education[] = [
	{ id: "sunderland", field: "Computer Science", school: "University of Sunderland", degree: "Master's Degree", start: "2026-06", note: "Research interest: AI for accessibility, with a particular focus on supporting people with keratoconus." },
	{ id: "calabar", field: "Computer Science", school: "University of Calabar", degree: "Bachelor's Degree", start: "2019-12", end: "2023-12" },
];

export const skills: { id: string; label: string; items: string[] }[] = [
	{ id: "languages", label: "Languages", items: ["Golang", "Python", "Rust", "JavaScript/TypeScript"] },
	{ id: "backend", label: "Backend and Data", items: ["FastAPI", "Django", "Django REST Framework", "Django ORM", "GORM", "Node.js", "PostgreSQL", "Redis", "API Design", "Query Optimisation"] },
	{ id: "frontend", label: "Frontend", items: ["Astro", "Svelte", "React"] },
	{ id: "devops", label: "DevOps & Infrastructure", items: ["Linux server administration", "Docker", "Cloudflare", "GitHub Actions", "NGINX", "Kubernetes", "Azure Pipelines", "Backup & Disaster recovery", "Grafana", "Tailscale", "Monitoring & alerting", "OpenTelemetry", "AWS S3"] },
	{ id: "ai", label: "AI Systems", items: ["Agent Orchestration", "Open-source model deployment", "Multi-agent Pipelines", "Open-source LLM Deployment", "AI-assisted Development (Claude, Codex)", "Claude Code skills", "pgvector"] },
	{ id: "leadership", label: "Engineering Leadership", items: ["Technical Direction", "System Architecture", "Team Leadership", "Code Review", "Production Delivery"] },
];

export const languages = [
	{ name: "English", level: "Native" },
	{ name: "Igbo", level: "Fluent" },
	{ name: "Chinese", level: "Basic" },
];

/** Every bullet by id, for tailored pages and the checker. */
export const bulletsById = new Map(jobs.flatMap((j) => j.bullets.map((b) => [b.id, { ...b, job: j.id }] as const)));

export function formatPeriod(start: string, end?: string) {
	const f = (s: string) => {
		const [y, m] = s.split("-").map(Number);
		return m ? `${String(m).padStart(2, "0")}/${y}` : String(y);
	};
	return `${f(start)} - ${end ? f(end) : "Present"}`;
}
