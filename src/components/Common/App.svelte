<script>
	let left = 50;
	let top = 50;
	let size = 100;
	let hue = 180;

	const startViewTransition =
		typeof document?.startViewTransition === "undefined"
			? fn => fn()
			: fn => document.startViewTransition(fn);

	function update() {
		startViewTransition(() => {
			left = Math.random() * 100;
			top = Math.random() * 100;
			size = Math.random() * 100 + 50;
			hue = Math.floor(Math.random() * 360);
		});
	}
</script>

<svelte:window on:click={update} />

<p>click anywhere</p>

<div
	style:top="{top}%"
	style:left="{left}%"
	style:width="{size}px"
	style:height="{size}px"
	style:background-color="hsl({hue}, 100%, 50%)"
></div>

<style>
	p {
		user-select: none;
	}

	div {
		position: absolute;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		view-transition-name: move;
		view-transition-duration: 2000;
	}
</style>
