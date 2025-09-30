<script>
</script>

<div class="container">
	<div class="character">
		<div class="speech-bubble intro">
			<p>
				Hello! I'm <span class="highlight">Anusiem John-Franklin </span>
				and this is <span class="highlight">Rhaqim</span>!
			</p>
		</div>
		<div class="speech-bubble outro">
			<p>He'll be your guide through this manga! I hope you enjoy it!</p>
		</div>
		<img class="character-image" src="/images/character/character.png" alt="Hero" />
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url("/images/background/bg-layer-2.png");
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
		left: 50%;
		transform: translateX(-50%);
		background: white;
		color: black;
		border: 2px solid black;
		border-radius: 10px;
		padding: 5px;
		max-width: 500px;
		text-align: center;
		font-family: Arial, sans-serif;
		font-size: 14px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		width: fit-content;
		white-space: nowrap;
		overflow: hidden;
	}

	.speech-bubble p {
		margin: 0;
		padding: 10px;
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
	.intro {
		top: -50px;
	}
	.outro {
		bottom: -50px;
	}

	.highlight {
		font-weight: bold;
	}

	.character-image {
		width: 100%;
		height: auto;
		max-width: 200px;
	}

	.character-image:hover {
		content: url("/images/character/character-hi.png");
	}

	.character-image:focus {
		content: url("/images/character/character-hi.png");
	}
</style>
