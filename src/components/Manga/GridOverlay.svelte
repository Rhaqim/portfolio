<script lang="ts">
	import { onMount } from "svelte";

	export let rows = 6;
	export let columns = 6;
	export let cells: GridLayout[] = []; // An array of cell content (optional)

	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
					}
				});
			},
			{ threshold: 0.2 }
		);

		document.querySelectorAll(".cell.appear").forEach(el => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<div
	class="grid-overlay"
	style="--rows: {rows}; --columns: {columns}; gap: 4px;"
>
	{#each Array(rows * columns) as _, index}
		{#if cells[index]}
			<div
				class="cell {cells[index].effect || ''}"
				style="
					grid-row: span {cells[index].rowSpan || 1};
					grid-column: span {cells[index].colSpan || 1};
					transform: skew(
						{cells[index].skewX || 0}deg,
						{cells[index].skewY || 0}deg
					);
					{cells[index].clipPath ? `clip-path: ${cells[index].clipPath};` : ''}
					background-color: {cells[index].backgroundColor || 'rgba(255,255,255,0.02)'};
				"
			>
				{#if typeof cells[index].content === "string"}
					{@html cells[index].content}
				{:else}
					<svelte:component this={cells[index].content} />
				{/if}
			</div>
		{:else}
			<div class="cell"></div>
		{/if}
	{/each}
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
		gap: 4px;
		background: black; /* Fill dark gaps */
	}

	.cell {
		position: relative;
		pointer-events: auto;
		overflow: hidden;
		padding: 8px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		text-align: center;
		font-family: sans-serif;
	}

	/* Hover Zoom */
	.cell.hover-zoom:hover {
		transform: scale(1.05) skew(var(--skew-x, 0deg), var(--skew-y, 0deg));
		z-index: 10;
	}

	/* Appear on Intersection */
	.cell.appear {
		opacity: 0;
		transform: translateY(20px) skew(var(--skew-x, 0deg), var(--skew-y, 0deg));
	}

	.cell.appear.visible {
		opacity: 1;
		transform: translateY(0) skew(var(--skew-x, 0deg), var(--skew-y, 0deg));
		transition:
			opacity 3.0s ease,
			transform 3.0s ease;
	}
</style>
