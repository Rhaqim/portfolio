export type Track = {
	id: string;
	title: string;
	/** What is actually being worked on. No aspiration verbs. */
	body: string;
	state: "current" | "open";
};

export const research: Track[] = [
	{
		id: "01",
		title: "Bare-metal & RTOS",
		body: "C and Rust on microcontrollers: interrupt latency, memory budgets, and scheduling under hard real-time constraints.",
		state: "open",
	},
	{
		id: "02",
		title: "Edge & sensing",
		body: "Constrained-network protocols and on-device processing where bandwidth, power and physics set the limits.",
		state: "open",
	},
	{
		id: "03",
		title: "Systems programming",
		body: "OS internals, network stacks, and storage engines. The layer the libraries above already live in.",
		state: "current",
	},
];

/** The one paragraph that explains the direction of everything above. */
export const researchThesis =
	"Every system on this page eventually hits a physical boundary: a radio, a disk, a telecom link, a power budget. I've spent six years on the software side of that boundary. I'm now working my way to the other side of it.";
