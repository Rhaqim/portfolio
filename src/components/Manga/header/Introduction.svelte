<script>
	import { onMount } from "svelte";

	let isLoaded = false;

	onMount(() => {
		const timer = setTimeout(() => {
			isLoaded = true;
		}, 100);
		return () => clearTimeout(timer);
	});
</script>

<div class="cell-content {isLoaded ? 'loaded' : ''}">
	<div class="title-wrapper">
		<h1 class="english">Rhaqim</h1>
		<h1 class="japanese">ラキム</h1>
	</div>
</div>

<style>
	.cell-content {
		background-image: url("/images/background/shinratensei.jpg");
		background-size: cover;
		background-position: center;
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		overflow: hidden;
		opacity: 0;
		transform: scale(1.1);
		transition: all 1s ease-out;
	}

	.cell-content.loaded {
		opacity: 1;
		transform: scale(1);
	}

	.cell-content::before {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1;
	}

	.title-wrapper {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	h1 {
		margin: 0;
		font-size: clamp(3rem, 8vw, 6rem);
		font-weight: bold;
		text-align: center;
		position: relative;
	}

	.english {
		color: #f0f0f0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-shadow:
			0 2px 4px rgba(0, 0, 0, 0.7),
			0 0 20px rgba(255, 255, 255, 0.3);
		font-family: "Impact", "Arial Black", sans-serif;
		letter-spacing: 2px;
		animation: glow 3s ease-in-out infinite alternate;
	}

	.japanese {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: var(--manga-red);
		font-family: "Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif;
		font-size: clamp(4.5rem, 6vw, 5rem);
		pointer-events: none;
		opacity: 0.8;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes glow {
		from {
			text-shadow:
				0 2px 4px rgba(0, 0, 0, 0.7),
				0 0 20px rgba(255, 255, 255, 0.3);
		}
		to {
			text-shadow:
				0 2px 4px rgba(0, 0, 0, 0.7),
				0 0 30px rgba(255, 255, 255, 0.5),
				0 0 40px rgba(255, 255, 255, 0.3);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.8;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(1.05);
		}
	}

	@media (max-width: 768px) {
		.cell-content {
			padding: var(--space-2);
		}
	}
</style>
