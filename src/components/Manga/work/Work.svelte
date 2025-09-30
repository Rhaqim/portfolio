<script lang="ts">
	import { onMount } from "svelte";

	import { workHistory } from "@/data/work";

	let currentPage = 0;

	const nextPage = () => {
		if (currentPage < workHistory.length) {
			currentPage += 1;
		}
	};

	const prevPage = () => {
		if (currentPage > 0) {
			currentPage -= 1;
		}
	};

	let isFirstMount = true;
	onMount(() => {
		// Reset after mount
		setTimeout(() => (isFirstMount = false), 500);
	});
</script>

<section id="work" class="wrapper">
	<div class="section manga-chapter">
		<div class="page-container">
			{#if currentPage === 0}
				<!-- <Page> -->
				<div
					role="button"
					tabindex="0"
					class="chapter-content"
					on:click={nextPage}
					on:keydown={e => {
						if (e.key === "Enter" || e.key === " ") nextPage();
					}}
				>
					<div class="chapter-header">
						<h2>Chapter 2: Work</h2>
					</div>
					<div class="chapter-content">
						<p>
							I thrive on building efficient, scalable systems — from low-level
							server optimization to high-performance frontends.
						</p>
						<p>
							My work spans creative tech projects: building backends, exploring
							game development, AI deployments, crafting bots, managing VPS
							deployments, and even engineering NFT-gated systems.
						</p>
						<p>
							Every project I approach focuses on clean architecture, system
							performance, and user experience — blending engineering precision
							with creative expression.
						</p>
						<!-- <div class="page-hint">⇩ Tap or Click to Flip ⇩</div> -->
					</div>
				</div>
				<!-- </Page> -->
			{:else}
				<!-- <Page> -->
				<div
					role="button"
					tabindex="0"
					class="chapter-content"
					on:click={nextPage}
					on:keydown={e => {
						if (e.key === "Enter" || e.key === " ") nextPage();
					}}
				>
					<div class="chapter-header">
						<h2>{workHistory[currentPage - 1].company}</h2>
					</div>
					<div class="chapter-content">
						<h3>{workHistory[currentPage - 1].role}</h3>
						<p>{workHistory[currentPage - 1].description}</p>
					</div>
				</div>
				<!-- </Page> -->
			{/if}

			{#if currentPage > 0}
				<button class="prev-button" on:click|stopPropagation={prevPage}>
					⇦ Previous
				</button>
			{/if}

			<div class="page-hint">⇩ Tap or Click to Flip ⇩</div>
		</div>
	</div>
</section>

<style>
	.page-container {
		position: relative;
		cursor: pointer;
		overflow: hidden;
		height: auto;
	}

	.prev-button {
		position: absolute;
		top: 10px;
		left: 10px;
		background: black;
		color: white;
		border: 2px solid white;
		padding: 5px 10px;
		cursor: pointer;
		font-family: "Bangers", cursive;
		font-size: 1rem;
		z-index: 5;
		border-radius: 4px;
	}

	.page-hint {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1rem;
		color: #555;
		font-family: "Bangers", cursive;
		opacity: 0.7;
		pointer-events: none;
	}

	/* Optional: A curved "page" at the bottom */
	.page-container::after {
		content: "";
		position: absolute;
		bottom: -20px;
		left: 50%;
		transform: translateX(-50%);
		width: 60%;
		height: 40px;
		background: radial-gradient(
			circle at center,
			rgba(0, 0, 0, 0.1) 0%,
			transparent 70%
		);
		border-radius: 50%;
		pointer-events: none;
	}
</style>
