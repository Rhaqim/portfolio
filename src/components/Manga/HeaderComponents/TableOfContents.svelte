<script lang="ts">
	import { currentPage, flipping } from "$lib/stores/pageRouter";
	import { navigation } from "@/data/navigation";

	function goTo(sectionId: string) {
		flipping.set(true); // start flip animation
		setTimeout(() => {
			currentPage.set(sectionId);
			document
				.getElementById(sectionId)
				?.scrollIntoView({ behavior: "smooth" });
			flipping.set(false);
		}, 600); // match your flip animation timing
	}
</script>

<section class="section table-of-contents">
	{#each navigation as nav}
		{#if nav.id !== "cover"}
			<div class="panel-toc">
				<button on:click={() => goTo(nav.id)}>
					{nav.name}
				</button>
			</div>
		{/if}
	{/each}
</section>

<style>
	.table-of-contents {
		top: 0;
		left: 0;
		width: 90%;
		height: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.1);
		border: 4px solid white;
		box-shadow: 10px 10px 0px white;
		color: white;
		text-align: center;
		padding: 20px;
	}

	.panel-toc {
		border: 3px solid white;
		padding: 1rem;
		margin-bottom: 2rem;
		background-color: black;
		box-shadow: 5px 5px 0px white;
	}

	.panel-toc:hover {
		background-color: rgba(255, 255, 255, 0.2);
		box-shadow: 5px 5px 0px red;
		transform: scale(1.1);
		transition: transform 0.2s ease-in-out;
	}

	button {
		background-color: transparent;
		border: none;
		color: white;
		cursor: pointer;
		text-decoration: none;
	}
</style>
