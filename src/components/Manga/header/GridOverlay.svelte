<script lang="ts">
	import { onMount } from "svelte";

	const browser = typeof window !== "undefined";

	export let rows = 6;
	export let columns = 6;
	export let cells: GridLayout[] = [];

	let observer: IntersectionObserver;
	let gridElement: HTMLElement;
	let isMobile = false;

	onMount(() => {
		if (!browser) return;

		// Check if mobile
		isMobile = window.innerWidth <= 768;

		// Handle resize
		const handleResize = () => {
			isMobile = window.innerWidth <= 768;
		};

		window.addEventListener("resize", handleResize);

		observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
						// Add staggered animation delay
						const index = Array.from(
							entry.target.parentElement?.children || []
						).indexOf(entry.target);
						(entry.target as HTMLElement).style.transitionDelay =
							`${index * 0.1}s`;
					}
				});
			},
			{ threshold: 0.1, rootMargin: "20px" }
		);

		// Use setTimeout to ensure DOM is ready
		setTimeout(() => {
			document.querySelectorAll(".cell.appear").forEach(el => {
				observer.observe(el);
			});
		}, 100);

		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", handleResize);
		};
	});
</script>

<div
	bind:this={gridElement}
	class="grid-overlay"
	class:mobile={isMobile}
	style="--rows: {isMobile ? cells.length : rows}; --columns: {isMobile
		? 1
		: columns};"
>
	{#if isMobile}
		<!-- Mobile: Stack all cells vertically -->
		{#each cells as cell, index}
			<div
				class="cell {cell.effect || ''} manga-panel-cell mobile-cell"
				style="
                    background-color: {cell.backgroundColor ||
					'rgba(255,255,255,0.08)'};
                    {cell.effectDuration
					? `--effect-duration: ${cell.effectDuration}s;`
					: ''};
                    {cell.effectDelay
					? `--effect-delay: ${cell.effectDelay + index * 0.2}s;`
					: ''}
                "
			>
				{#if typeof cell.content === "string"}
					{@html cell.content}
				{:else}
					<svelte:component this={cell.content} />
				{/if}
			</div>
		{/each}
	{:else}
		<!-- Desktop: Original grid layout -->
		{#each Array(rows * columns) as _, index}
			{#if cells[index]}
				<div
					class="cell {cells[index].effect || ''} manga-panel-cell"
					style="
                        grid-row: span {cells[index].rowSpan || 1};
                        grid-column: span {cells[index].colSpan || 1};
                        transform: skew({cells[index].skewX || 0}deg, {cells[
						index
					].skewY || 0}deg);
                        {cells[index].clipPath
						? `clip-path: ${cells[index].clipPath};`
						: ''}
                        background-color: {cells[index].backgroundColor ||
						'rgba(255,255,255,0.05)'};
                        {cells[index].effectDuration
						? `--effect-duration: ${cells[index].effectDuration}s;`
						: ''};
                        {cells[index].effectDelay
						? `--effect-delay: ${cells[index].effectDelay}s;`
						: ''}
                    "
				>
					{#if typeof cells[index].content === "string"}
						{@html cells[index].content}
					{:else}
						<svelte:component this={cells[index].content} />
					{/if}
				</div>
			{:else}
				<div class="cell empty-cell"></div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.grid-overlay {
		display: grid;
		grid-template-rows: repeat(var(--rows), 1fr);
		grid-template-columns: repeat(var(--columns), 1fr);
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 4;
		gap: 6px;
		background: var(--manga-black);
		padding: var(--space-2);
	}

	.grid-overlay.mobile {
		position: relative;
		height: auto;
		min-height: 100vh;
		padding: var(--space-4);
		gap: var(--space-6);
		display: flex;
		flex-direction: column;
		background: var(--manga-black);
	}

	.cell {
		position: relative;
		pointer-events: auto;
		overflow: hidden;
		padding: var(--space-3);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--manga-white);
		text-align: center;
		border-radius: var(--panel-radius);
		transition: all 0.3s ease;
	}

	.manga-panel-cell {
		border: 3px solid var(--manga-white);
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	}

	.mobile-cell {
		min-height: 250px;
		width: 100%;
		border: var(--panel-border);
		box-shadow: var(--panel-shadow);
		background: rgba(255, 255, 255, 0.12);
		margin-bottom: var(--space-4);
	}

	.manga-panel-cell::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			45deg,
			transparent 48%,
			rgba(255, 255, 255, 0.1) 49%,
			rgba(255, 255, 255, 0.1) 51%,
			transparent 52%
		);
		background-size: 15px 15px;
		pointer-events: none;
		opacity: 0.3;
		border-radius: inherit;
	}

	.empty-cell {
		background: rgba(0, 0, 0, 0.3);
		border: 1px dashed rgba(255, 255, 255, 0.2);
	}

	/* Hover Effects */
	.cell.hover-zoom:hover {
		transform: scale(1.02) !important;
		z-index: 10;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}

	/* Appear Animation */
	.cell.appear {
		opacity: 0;
		transform: translateY(30px) scale(0.9);
	}

	.cell.appear.visible {
		opacity: 1;
		transform: translateY(0) scale(1);
		transition:
			opacity var(--effect-duration, 0.8s) ease var(--effect-delay, 0s),
			transform var(--effect-duration, 0.8s) ease var(--effect-delay, 0s);
	}

	/* Mobile specific styles */
	@media (max-width: 768px) {
		.grid-overlay {
			position: static;
			height: auto;
			display: flex;
			flex-direction: column;
			gap: var(--space-6);
			padding: var(--space-4);
			background: var(--manga-black);
		}

		.cell {
			width: 100%;
			min-height: 300px;
			transform: none !important;
			clip-path: none !important;
			padding: var(--space-4);
		}

		.manga-panel-cell {
			border: var(--panel-border);
			box-shadow: var(--panel-shadow);
			background: rgba(255, 255, 255, 0.15);
		}

		.mobile-cell {
			min-height: 300px;
		}
	}

	/* Tablet styles */
	@media (max-width: 1024px) and (min-width: 769px) {
		.grid-overlay {
			gap: var(--space-3);
			padding: var(--space-3);
		}

		.cell {
			padding: var(--space-4);
		}
	}

	/* Very small mobile screens */
	@media (max-width: 480px) {
		.grid-overlay.mobile {
			padding: var(--space-3);
			gap: var(--space-4);
		}

		.mobile-cell {
			min-height: 250px;
			padding: var(--space-3);
		}
	}
</style>
