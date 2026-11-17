export type Role = {
	company: string;
	companyUrl?: string;
	role: string;
	period: string;
	/** One line. What changed because you were there. */
	impact: string;
	stack: string[];
	current?: boolean;
};

export const experience: Role[] = [
	{
		company: "DGRS Labs",
		companyUrl: "https://www.dgrslabs.ink",
		role: "Lead Software Engineer",
		period: "2024-present",
		impact:
			"Built CoNexus from first commit to production, and the storage and orchestration layers it runs on.",
		stack: ["Go", "Postgres", "Redis", "Docker", "Ethereum", "Svelte"],
		current: true,
	},
	{
		company: "Equity Group Holdings",
		companyUrl: "https://equitygroupholdings.com",
		role: "Senior Backend Developer",
		period: "2021-2024",
		impact:
			"Led delivery of a USSD loan service across six countries, on a platform serving 16 million customers and over 1 million loan requests a month.",
		stack: ["Python", "FastAPI", "Postgres", "Redis", "Kubernetes", "Azure"],
	},
	{
		company: "Nirvana Labs",
		companyUrl: "https://nirvanalabs.io",
		role: "Full Stack Developer",
		period: "2023-2024",
		impact:
			"Built ChainQuery, a Rust indexer for Ethereum transactions (mostly ERC-20), and worked across the React and Node.js stack.",
		stack: ["Rust", "PostgreSQL", "Ethereum", "React", "Node.js"],
	},
];

export type Study = {
	school: string;
	schoolUrl?: string;
	degree: string;
	period: string;
	current?: boolean;
};

export const education: Study[] = [
	{
		school: "University of Sunderland",
		schoolUrl: "https://www.sunderland.ac.uk",
		degree: "Master's, Computer Science",
		period: "2026-present",
		current: true,
	},
	{
		school: "University of Calabar",
		degree: "Bachelor's, Computer Science",
		period: "2019-2023",
	},
];
