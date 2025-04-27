<script>
	import { fade } from "svelte/transition";

	export let delay = 0;
	export let duration = 400;
</script>

<div
	in:fade={{ delay, duration }}
	out:fade={{ delay, duration }}
	style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle, #ff00ff 0%, #000000 100%);
      opacity: 0.8;
      z-index: 9999;
      pointer-events: none;"
></div>
