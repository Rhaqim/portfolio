<script>
	import Page from "@components/Manga/Page.svelte";
</script>

<section id="about-me" class="section manga-chapter page-flip">
	<Page>
		<div class="chapter-header">
			<h2>Chapter 1: About Me</h2>
		</div>
		<div class="chapter-content">
			<p>
				Hello! I'm <span class="highlight">Anusiem John-Franklin</span> — a passionate
				software engineer, lifelong learner, and adventurer in technology!
			</p>
			<p>
				I love building innovative things, from crafting powerful backend
				systems with Go and Rust, to experimenting with game development,
				graphics programming, and even deploying AI on CUDA servers.
			</p>
			<p>
				My journey has taken me across a wide spectrum of tech: server
				management, Docker, Redis caching, creating Telegram bots, working with
				NFTs, and building creative frontends with Svelte, Astro, and
				TypeScript.
			</p>
			<p>
				Beyond coding, I'm a huge fan of manga, storytelling, video games, and
				robotics — dreaming of revolutionary technology that fuses art,
				engineering, and imagination.
			</p>
			<p>
				Whether it's building efficient systems, exploring new worlds through
				manga, or designing the future of gaming and AI, I'm always chasing the
				next exciting challenge.
			</p>
		</div>
	</Page>
</section>

<style>
	.highlight {
		font-weight: bold;
		color: #e63946;
	}
</style>
