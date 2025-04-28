<script>
	import { typewriter } from "@/lib/actions/typewriter";

	let speechText = "Hello there! I'm your friendly character.";

	export let messages = [
		"Hello, world!",
		"Hola, mundo!",
		"Bonjour, le monde!",
		"こんにちは、世界！",
	];
</script>

<div class="container">
	<div class="character">
		<div
			class="speech-bubble"
			use:typewriter={{ messages: messages, typingSpeed: 50, pauseTime: 1000 }}
		>
			{speechText}
		</div>
		<img class="character-image" src="/images/character.png" alt="Hero" />
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url("/images/bg-layer-2.png");
		background-size: cover;
		background-position: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.character {
		position: relative;
	}

	.speech-bubble {
		position: absolute;
		top: -50px;
		left: 50%;
		transform: translateX(-50%);
		background: white;
		color: black;
		border: 2px solid black;
		border-radius: 10px;
		padding: 10px;
		max-width: 300px;
		text-align: center;
		font-family: Arial, sans-serif;
		font-size: 14px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		width: fit-content;
		white-space: nowrap;
		overflow: hidden;
	}

	.speech-bubble::after {
		content: "";
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border: 10px solid transparent;
		border-top-color: white;
	}

	.character-image {
		width: 100%;
		height: auto;
		max-width: 200px;
	}
</style>
