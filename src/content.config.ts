import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Company pages: one JSON file per application, written by the company-page
 * skill (.claude/skills/company-page) and reviewed in a pull request before it
 * goes live. The file name is the route: deliveroo-k7f3q.json →
 * /company/deliveroo-k7f3q. The name shows the company (so the link invites a
 * click); the random suffix keeps the page unguessable. These pages are
 * unlisted: noindex, out of the sitemap, linked only from an application.
 *
 * The agent writes data, never markup. The build rejects anything outside
 * this schema, and `npm run company:check` adds the checks Zod can't express
 * (resume references, invented numbers, contrast, file names).
 */

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "a six-digit hex colour like #00ccbc");

/** Free fonts only: brand typefaces are usually licensed and can't be served from here. */
export const fonts = [
	"IBM Plex Sans", "IBM Plex Mono", "IBM Plex Serif", "Inter", "DM Sans", "DM Serif Display", "Manrope",
	"Space Grotesk", "Work Sans", "Nunito Sans", "Source Sans 3", "Source Serif 4", "Fraunces", "Playfair Display",
	"Lora", "Libre Franklin", "Rubik", "Poppins", "Outfit", "Plus Jakarta Sans", "Sora", "JetBrains Mono",
	"Figtree", "Instrument Sans", "Archivo",
] as const;

/** Point-cloud shapes available on the site (src/scripts/cloud/shapes.js). */
export const cloudShapes = ["orb", "phone", "die", "bucket", "network", "mind", "host", "link", "window"] as const;

const link = z.object({
	label: z.string().min(1).max(60),
	href: z.string().regex(/^(https:\/\/|\/)/, "an https URL or a site path"),
});

const companies = defineCollection({
	loader: glob({ pattern: "*.json", base: "./src/content/companies" }),
	schema: z.object({
		company: z.string().min(1).max(60),
		role: z.string().min(1).max(100),
		roleUrl: z.string().url().optional(),
		location: z.string().max(80).optional(),
		prepared: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

		theme: z.object({
			bg: hex,
			surface: hex,
			fg: hex,
			muted: hex,
			line: hex,
			accent: hex,
			onAccent: hex,
			heading: z.enum(fonts),
			body: z.enum(fonts),
			radius: z.number().int().min(0).max(24).default(0),
			/** A shape from the site's library, a short word, or a simple SVG path (never a logo). */
			cloud: z.union([
				z.object({ shape: z.enum(cloudShapes) }),
				z.object({ text: z.string().min(1).max(6) }),
				z.object({ svg: z.string().min(5).max(2000), viewBox: z.number().positive().default(100) }),
			]),
		}),

		headline: z.string().min(10).max(110),
		pitch: z.string().min(40).max(700),

		/** What they asked for, and where on this site the evidence is. */
		matches: z.array(z.object({
			requirement: z.string().min(5).max(180),
			evidence: z.string().min(20).max(360),
			refs: z.array(z.string()).max(4).default([]),
			links: z.array(link).max(3).default([]),
		})).min(2).max(6),

		/** The tailored resume: a selection from src/data/resume.ts, never new claims. */
		resume: z.object({
			summary: z.string().min(80).max(800),
			jobs: z.array(z.object({
				id: z.string(),
				bullets: z.array(z.object({
					ref: z.string(),
					/** Optional rephrasing of the referenced bullet; same facts, same numbers. */
					text: z.string().max(400).optional(),
				})).min(1).max(12),
			})).min(1),
			skills: z.array(z.object({
				id: z.string(),
				items: z.array(z.string()).min(1),
			})).min(1),
		}),

		note: z.string().min(80).max(1600),

		/** What the agent read to write this, for your review. */
		sources: z.array(link).min(1).max(12),
	}),
});

export const collections = { companies };
