<script>
	import { onMount } from "svelte";

	import { thoughts } from "@/data/thoughts";

	let currentThought = 0;
	let isVisible = false;

	const nextThought = () => {
		if (currentThought < thoughts.length - 1) {
			currentThought += 1;
		} else {
			currentThought = 0;
		}
	};

	const prevThought = () => {
		if (currentThought > 0) {
			currentThought -= 1;
		} else {
			currentThought = thoughts.length - 1;
		}
	};

	onMount(() => {
		const timer = setTimeout(() => {
			isVisible = true;
		}, 700);
		return () => clearTimeout(timer);
	});
</script>

<section id="thoughts" class="wrapper">
	<div class="section manga-chapter">
		<div class="chapter-header">
			<div class="chapter-number">Chapter 4</div>
			<h2 class="chapter-title">Thoughts & Musings</h2>
		</div>

		<div class="chapter-content {isVisible ? 'fade-in' : ''}">
			<div class="thoughts-showcase">
				<div class="thought-panel">
					<div class="thought-header">
						<span class="thought-icon">{thoughts[currentThought].icon}</span>
						<h3>{thoughts[currentThought].title}</h3>
					</div>

					{#if thoughts[currentThought].type === "speech"}
						<div class="speech-bubble">
							{thoughts[currentThought].content}
						</div>
					{:else}
						<div class="thought-bubble">
							{thoughts[currentThought].content}
						</div>
					{/if}
				</div>

				<div class="thought-navigation">
					<button class="nav-btn prev-button" on:click={prevThought}>
						← Previous
					</button>

					<div class="thought-dots">
						{#each thoughts as _, index}
							<button
								class="dot {index === currentThought ? 'active' : ''}"
								on:click={() => (currentThought = index)}
								aria-label={`Show thought ${index + 1}: ${thoughts[index].title}`}
							></button>
						{/each}
					</div>

					<button class="nav-btn next-button" on:click={nextThought}>
						Next →
					</button>
				</div>
			</div>

			<div class="blog-preview">
				<div class="speech-bubble">
					<span class="sound-effect">COMING SOON!</span>
					Full blog entries about life, anime, games, tech philosophy, and more adventures
					in the digital realm!
				</div>
			</div>
		</div>

		<div class="page-hint">⇩ More thoughts brewing... ⇩</div>
	</div>
</section>

<style>
	.thoughts-showcase {
		width: 100%;
		max-width: 700px;
		margin: 0 auto var(--space-8) auto;
	}

	.thought-panel {
		background: var(--manga-white);
		border: var(--panel-border);
		border-radius: var(--panel-radius);
		padding: var(--space-6);
		margin-bottom: var(--space-6);
		position: relative;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.thought-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.thought-icon {
		font-size: var(--text-3xl);
		background: var(--manga-yellow);
		padding: var(--space-2);
		border-radius: 50%;
		border: 2px solid var(--manga-black);
	}

	.thought-navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-4);
	}

	.thought-dots {
		display: flex;
		gap: var(--space-2);
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid var(--manga-black);
		background: var(--manga-white);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.dot.active {
		background: var(--manga-red);
		transform: scale(1.2);
	}

	.dot:hover {
		background: var(--manga-blue);
	}

	.nav-btn {
		background: var(--manga-black);
		color: var(--manga-white);
		border: 2px solid var(--manga-white);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--panel-radius);
		font-family: "Bangers", sans-serif;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.nav-btn:hover {
		background: var(--manga-red);
		transform: scale(1.05);
	}

	.blog-preview {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
	}

	@media (max-width: 768px) {
		.thought-navigation {
			flex-direction: column;
			gap: var(--space-3);
		}

		.nav-btn {
			width: 100%;
			text-align: center;
		}

		.thought-dots {
			order: -1;
		}
	}
</style>
