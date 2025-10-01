<script>
	import { onMount } from "svelte";

	let isVisible = false;

	onMount(() => {
		const timer = setTimeout(() => {
			isVisible = true;
		}, 300);
		return () => clearTimeout(timer);
	});
</script>

<section id="about-me" class="wrapper">
	<div class="section manga-chapter">
		<div class="chapter-header">
			<div class="chapter-number">Chapter 1</div>
			<h2 class="chapter-title">About Me</h2>
		</div>

		<div class="chapter-content {isVisible ? 'fade-in' : ''}">
			<div class="speech-bubble">
				Hello! I'm <span class="highlight">Anusiem John-Franklin</span> — a software
				engineer, builder of systems, and explorer at the edge of technology!
			</div>

			<div class="manga-panel">
				<p>
					I specialize in crafting powerful backend platforms with <strong
						>Go</strong
					>, <strong>Rust</strong> and <strong>Python</strong>, structuring data
					with <strong>PostgreSQL</strong>, <strong>MongoDB</strong> and
					<strong>Redis</strong>, and building creative, performant frontends
					using <strong>Svelte</strong>,
					<strong>Astro</strong>, and <strong>TypeScript</strong>.
				</p>
			</div>

			<div class="thought-bubble">
				My work spans system design, containerized deployments with
				Docker/Podman, caching layers, API-driven platforms, multi-tenant
				architectures, and even experimenting with LLMs, vector search, and
				storytelling engines.
			</div>

			<div class="manga-panel">
				<p>
					Beyond code, I'm drawn to <em>manga</em>, narrative design, embedded systems and
					robotics; dreaming of technology where art, engineering, and
					imagination merge into new forms of interactive experience.
				</p>
			</div>

			<div class="speech-bubble">
				<span class="sound-effect">POW!</span> Whether it's optimizing distributed
				systems, designing AI-driven storytelling platforms, or exploring new creative
				frontiers, I'm always chasing the next bold challenge!
			</div>
		</div>
	</div>
</section>

<style>
	.highlight {
		font-weight: bold;
		color: #e63946;
	}
</style>
