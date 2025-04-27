<script lang="ts">
	export let rows = 6;
	export let columns = 6;
	export let cells: GridLayout[] = []; // An array of cell content (optional)
</script>

<div
	class="grid-overlay"
	style="--rows: {rows}; --columns: {columns}; gap: 4px;"
>
	{#each Array(rows * columns) as _, index}
		{#if cells[index]}
			<div
				class="cell"
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
</style>
