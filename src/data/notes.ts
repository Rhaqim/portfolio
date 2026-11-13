/** Engineering notes: write-ups of problems solved in client work. */
export type Note = {
	slug: string;
	title: string;
	/** One sentence. The claim the note defends. */
	summary: string;
	date: string; // YYYY-MM
	tags: string[];
};

export const notes: Note[] = [
	{
		slug: "linking-records",
		title: "Linking records you can't fully trust",
		summary:
			"Merging one person's accounts across independent systems, where a wrong merge costs more than a missed one: exact joins, human-confirmed links, and decisions that survive the next import.",
		date: "2026-10",
		tags: ["Identity resolution", "SQLite", "Go", "Audit trails"],
	},
];
