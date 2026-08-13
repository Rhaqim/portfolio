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
		company: "Degenerous DAO",
		companyUrl: "https://www.degenerousdao.com",
		role: "Lead Developer",
		period: "2023-present",
		impact:
			"Built CoNexus from first commit to production, and the storage and orchestration layers it runs on.",
		stack: ["Go", "Postgres", "Redis", "Docker", "Ethereum", "Svelte"],
		current: true,
	},
	{
		company: "Equity Group Holdings",
		companyUrl: "https://equitygroupholdings.com",
		role: "Senior Backend Engineer",
		period: "2022-2023",
		impact:
			"Led the USSD loan service rollout across five African markets, serving millions of sessions daily on feature phones.",
		stack: ["Python", "FastAPI", "Postgres", "Redis", "Kubernetes", "Azure"],
	},
	{
		company: "Nirvana Labs",
		companyUrl: "https://nirvanalabs.io",
		role: "Full Stack Developer",
		period: "2021-2022",
		impact:
			"Shipped product surfaces and the REST APIs behind them at early-startup cadence.",
		stack: ["Next.js", "Node.js", "MongoDB", "Express"],
	},
];
