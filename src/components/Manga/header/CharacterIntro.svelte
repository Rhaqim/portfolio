<script>
	import { onMount } from "svelte";

	let characterState = "default";
	let isHovered = false;
	let speechIndex = 0;
	let interactionCount = 0;

	// Enhanced character states with more variety
	const characterStates = [
		{
			state: "default",
			image: "",
			speech: "Hello! I'm Anusiem John-Franklin and this is Rhaqim!",
			soundEffect: "HEY!",
		},
		{
			state: "peace",
			image: "-peace",
			speech: "He'll be your guide through this manga adventure!",
			soundEffect: "PEACE!",
		},
		{
			state: "see",
			image: "-see",
			speech: "I hope you enjoy exploring my portfolio!",
			soundEffect: "LOOK!",
		},
		{
			state: "hi",
			image: "-hi",
			speech: "Click around to discover more about my journey!",
			soundEffect: "YO!",
		},
		{
			state: "thinking",
			image: "-thinking",
			speech: "Let me think of something cool to show you...",
			soundEffect: "HMMMM...",
		},
		{
			state: "ok",
			image: "-ok",
			speech: "Everything looks good to me!",
			soundEffect: "OK!",
		},
		{
			state: "smash",
			image: "-smash",
			speech: "Ready to smash through some code!",
			soundEffect: "SMASH!",
		},
		{
			state: "fu",
			image: "-fu",
			speech: "Sometimes debugging makes me feel like this...",
			soundEffect: "ARGH!",
		},
		{
			state: "devil",
			image: "-devil",
			speech: "When the code finally works after hours of debugging...",
			soundEffect: "MUAHAHAHA!",
		},
	];

	let currentCharacter = characterStates[0];

	const handleCharacterClick = () => {
		interactionCount++;
		speechIndex = (speechIndex + 1) % characterStates.length;
		currentCharacter = characterStates[speechIndex];

		// Add some randomness for special interactions
		if (interactionCount % 5 === 0) {
			// Every 5th click, show a random special state
			const specialStates = characterStates.slice(4); // Get special states
			currentCharacter =
				specialStates[Math.floor(Math.random() * specialStates.length)];
		}
	};

	const handleDoubleClick = () => {
		// Double click triggers random state
		const randomIndex = Math.floor(Math.random() * characterStates.length);
		currentCharacter = characterStates[randomIndex];
	};

	onMount(() => {
		const interval = setInterval(() => {
			if (!isHovered) {
				speechIndex = (speechIndex + 1) % 4; // Only cycle through first 4 states automatically
				currentCharacter = characterStates[speechIndex];
			}
		}, 6000);

		return () => clearInterval(interval);
	});
</script>

<div class="container">
	<!-- Enhanced Name Tag - moved to left side -->
	<div class="name-tag" class:special={currentCharacter.state === "devil"}>
		<span class="name-english">Rhaqim</span>
		<span class="name-japanese">ラキム</span>
		<div class="interaction-counter">
			Interactions: {interactionCount}
		</div>
	</div>

	<div class="character">
		<!-- Main Speech Bubble -->
		<div class="speech-bubble main">
			<p>{currentCharacter.speech}</p>
			<div class="speech-tail"></div>
		</div>

		<!-- Sound Effect Display -->
		<div class="sound-effect-display" class:visible={isHovered}>
			<span class="sound-text">{currentCharacter.soundEffect}</span>
		</div>

		<!-- Thought Bubble for thinking state -->
		{#if currentCharacter.state === "thinking"}
			<div class="thought-bubble">
				<p>What should I show you next?</p>
				<div class="thought-circles">
					<div class="circle small"></div>
					<div class="circle medium"></div>
					<div class="circle large"></div>
				</div>
			</div>
		{/if}

		<!-- Special Effects for certain states -->
		{#if currentCharacter.state === "smash"}
			<div class="impact-effect">
				<div class="impact-line impact-1"></div>
				<div class="impact-line impact-2"></div>
				<div class="impact-line impact-3"></div>
				<div class="impact-line impact-4"></div>
			</div>
		{/if}

		{#if currentCharacter.state === "devil"}
			<div class="devil-aura">
				<div class="flame flame-1"></div>
				<div class="flame flame-2"></div>
				<div class="flame flame-3"></div>
			</div>
		{/if}

		<!-- Character Image with Multiple States -->
		<div
			class="character-wrapper"
			class:special-state={currentCharacter.state !== "default"}
			on:mouseenter={() => (isHovered = true)}
			on:mouseleave={() => (isHovered = false)}
			on:click={handleCharacterClick}
			on:dblclick={handleDoubleClick}
			role="button"
			tabindex="0"
			on:keydown={e => e.key === "Enter" && handleCharacterClick()}
		>
			<img
				class="character-image"
				class:thinking={currentCharacter.state === "thinking"}
				class:excited={currentCharacter.state === "smash" ||
					currentCharacter.state === "hi"}
				src="/images/character/character{currentCharacter.image}.png"
				alt="Rhaqim - Your manga guide"
			/>

			<!-- Action lines for emphasis -->
			<div
				class="action-lines"
				class:visible={isHovered || currentCharacter.state === "smash"}
			>
				<div class="line line-1"></div>
				<div class="line line-2"></div>
				<div class="line line-3"></div>
				<div class="line line-4"></div>
				<div class="line line-5"></div>
			</div>

			<!-- Interaction indicator -->
			<div class="interaction-hint" class:show={!isHovered}>
				<span>Click me!</span>
			</div>
		</div>
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
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-4);
		align-items: center;
		justify-items: center;
		padding: var(--space-4);
		overflow: hidden;
	}

	.container::before {
		content: "";
		position: absolute;
		inset: 0;
		background: radial-gradient(
				circle at 30% 30%,
				rgba(255, 255, 255, 0.1) 0%,
				transparent 40%
			),
			radial-gradient(
				circle at 70% 70%,
				rgba(220, 38, 38, 0.1) 0%,
				transparent 40%
			);
		z-index: 1;
	}

	.character {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		transform: translateY(20px); /* Move character content lower */
	}

	.speech-bubble {
		position: absolute;
		top: -80px; /* Reduced from -100px to prevent clipping */
		left: 50%;
		transform: translateX(-50%);
		background: var(--manga-white);
		color: var(--manga-black);
		border: 3px solid var(--manga-black);
		border-radius: 25px;
		padding: var(--space-4) var(--space-6);
		max-width: 320px;
		min-width: 240px;
		text-align: center;
		font-family: "Bebas Neue", sans-serif;
		font-size: var(--text-lg);
		font-weight: bold;
		box-shadow: 8px 8px 0px var(--manga-black);
		opacity: 1;
		transition: all 0.3s ease;
		z-index: 10;
	}

	.speech-bubble p {
		margin: 0;
		line-height: 1.4;
	}

	.speech-tail {
		position: absolute;
		bottom: -18px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 18px solid transparent;
		border-right: 18px solid transparent;
		border-top: 18px solid var(--manga-white);
	}

	.speech-tail::before {
		content: "";
		position: absolute;
		bottom: 3px;
		left: -21px;
		width: 0;
		height: 0;
		border-left: 21px solid transparent;
		border-right: 21px solid transparent;
		border-top: 21px solid var(--manga-black);
		z-index: -1;
	}

	.sound-effect-display {
		position: absolute;
		top: -50px;
		right: -80px;
		background: var(--manga-yellow);
		color: var(--manga-black);
		border: 2px solid var(--manga-black);
		border-radius: 15px;
		padding: var(--space-2) var(--space-3);
		font-family: "Bangers", sans-serif;
		font-size: var(--text-lg);
		font-weight: bold;
		transform: rotate(-15deg);
		opacity: 0;
		transition: all 0.3s ease;
		z-index: 15;
	}

	.sound-effect-display.visible {
		opacity: 1;
		transform: rotate(-15deg) scale(1.1);
	}

	.thought-bubble {
		position: absolute;
		top: -140px;
		right: -80px;
		background: var(--manga-light-gray);
		border: 2px dashed var(--manga-gray);
		border-radius: 30px;
		padding: var(--space-4);
		max-width: 200px;
		font-style: italic;
		font-size: var(--text-base);
		animation: thoughtFloat 3s ease-in-out infinite;
		z-index: 12;
	}

	.thought-circles {
		position: absolute;
		bottom: -25px;
		left: 25px;
		display: flex;
		gap: 8px;
		align-items: end;
	}

	.circle {
		background: var(--manga-light-gray);
		border: 2px solid var(--manga-gray);
		border-radius: 50%;
		animation: thoughtBubble 1.5s ease-in-out infinite;
	}

	.circle.small {
		width: 10px;
		height: 10px;
		animation-delay: 0s;
	}

	.circle.medium {
		width: 15px;
		height: 15px;
		animation-delay: 0.2s;
	}

	.circle.large {
		width: 20px;
		height: 20px;
		animation-delay: 0.4s;
	}

	/* Special Effects */
	.impact-effect {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 5;
	}

	.impact-line {
		position: absolute;
		background: var(--manga-yellow);
		transform-origin: center;
		animation: impactBlast 0.8s ease-out;
	}

	.impact-1 {
		width: 4px;
		height: 60px;
		transform: rotate(0deg);
	}

	.impact-2 {
		width: 4px;
		height: 50px;
		transform: rotate(45deg);
	}

	.impact-3 {
		width: 4px;
		height: 55px;
		transform: rotate(90deg);
	}

	.impact-4 {
		width: 4px;
		height: 45px;
		transform: rotate(135deg);
	}

	.devil-aura {
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		pointer-events: none;
		z-index: 1;
	}

	.flame {
		position: absolute;
		width: 15px;
		height: 40px;
		background: linear-gradient(to top, var(--manga-red), var(--manga-yellow));
		border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
		animation: flicker 1s ease-in-out infinite alternate;
	}

	.flame-1 {
		left: -30px;
		animation-delay: 0s;
	}

	.flame-2 {
		left: 0px;
		animation-delay: 0.3s;
	}

	.flame-3 {
		left: 30px;
		animation-delay: 0.6s;
	}

	.character-wrapper {
		position: relative;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.character-wrapper:hover {
		transform: scale(1.08);
	}

	.character-wrapper.special-state {
		filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
	}

	.character-image {
		width: 240px; /* Made bigger */
		height: auto;
		filter: drop-shadow(8px 8px 15px rgba(0, 0, 0, 0.4));
		transition: all 0.3s ease;
	}

	.character-image.thinking {
		animation: thinking 2s ease-in-out infinite;
	}

	.character-image.excited {
		animation: excited 0.5s ease-in-out infinite alternate;
	}

	.action-lines {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 280px;
		height: 280px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.action-lines.visible {
		opacity: 1;
	}

	.line {
		position: absolute;
		background: var(--manga-white);
		transform-origin: center;
	}

	.line-1 {
		width: 4px;
		height: 50px;
		top: 5%;
		left: 15%;
		transform: rotate(45deg);
		animation: actionLine 0.6s ease-out;
	}

	.line-2 {
		width: 4px;
		height: 60px;
		top: 15%;
		right: 10%;
		transform: rotate(-30deg);
		animation: actionLine 0.6s ease-out 0.1s;
	}

	.line-3 {
		width: 4px;
		height: 45px;
		bottom: 20%;
		left: 10%;
		transform: rotate(60deg);
		animation: actionLine 0.6s ease-out 0.2s;
	}

	.line-4 {
		width: 4px;
		height: 40px;
		top: 30%;
		left: 80%;
		transform: rotate(120deg);
		animation: actionLine 0.6s ease-out 0.3s;
	}

	.line-5 {
		width: 4px;
		height: 35px;
		bottom: 35%;
		right: 20%;
		transform: rotate(-45deg);
		animation: actionLine 0.6s ease-out 0.4s;
	}

	.interaction-hint {
		position: absolute;
		bottom: -40px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--manga-blue);
		color: var(--manga-white);
		padding: var(--space-1) var(--space-2);
		border-radius: 15px;
		font-family: "Bebas Neue", sans-serif;
		font-size: var(--text-xs);
		opacity: 0;
		transition: all 0.3s ease;
		animation: pulse 2s ease-in-out infinite;
	}

	.interaction-hint.show {
		opacity: 0.8;
	}

	.name-tag {
		background: var(--manga-red);
		color: var(--manga-white);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--panel-radius);
		border: 3px solid var(--manga-black);
		text-align: center;
		position: relative;
		box-shadow: 5px 5px 0px var(--manga-black);
		transition: all 0.3s ease;
		justify-self: start; /* Align to left side of grid */
		align-self: center;
		max-width: 150px;
		margin-left: var(--space-2);
	}

	.name-tag.special {
		background: linear-gradient(45deg, var(--manga-red), #8b0000);
		animation: glow 1s ease-in-out infinite alternate;
	}

	.name-english {
		font-family: "Bangers", sans-serif;
		font-size: var(--text-xl);
		display: block;
		margin-bottom: var(--space-1);
	}

	.name-japanese {
		font-family: "Noto Sans JP", sans-serif;
		font-size: var(--text-base);
		opacity: 0.9;
		display: block;
		margin-bottom: var(--space-1);
	}

	.interaction-counter {
		font-family: "Bebas Neue", sans-serif;
		font-size: var(--text-xs);
		opacity: 0.7;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* Animations */
	@keyframes thoughtFloat {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-15px);
		}
	}

	@keyframes thoughtBubble {
		0%,
		100% {
			opacity: 0.7;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.3);
		}
	}

	@keyframes actionLine {
		from {
			opacity: 0;
			transform: scale(0) rotate(var(--rotation, 0deg));
		}
		to {
			opacity: 1;
			transform: scale(1) rotate(var(--rotation, 0deg));
		}
	}

	@keyframes impactBlast {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
		100% {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes flicker {
		0% {
			transform: scale(1) rotate(-2deg);
		}
		100% {
			transform: scale(1.1) rotate(2deg);
		}
	}

	@keyframes thinking {
		0%,
		100% {
			transform: rotate(-1deg);
		}
		50% {
			transform: rotate(1deg);
		}
	}

	@keyframes excited {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.05);
		}
	}

	@keyframes glow {
		0% {
			box-shadow: 5px 5px 0px var(--manga-black);
		}
		100% {
			box-shadow:
				5px 5px 0px var(--manga-black),
				0 0 20px var(--manga-red);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.8;
			transform: translateX(-50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translateX(-50%) scale(1.05);
		}
	}

	/* Mobile Responsiveness */
	@media (max-width: 768px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
			gap: var(--space-2);
			padding: var(--space-2);
		}

		.name-tag {
			justify-self: center;
			margin-left: 0;
			max-width: none;
			order: -1; /* Move to top on mobile */
		}

		.character {
			transform: translateY(10px); /* Less offset on mobile */
		}

		.speech-bubble {
			max-width: 260px;
			min-width: 200px;
			font-size: var(--text-base);
			padding: var(--space-3) var(--space-4);
			top: -60px; /* Further reduced for mobile */
		}

		.character-image {
			width: 180px;
		}

		.thought-bubble {
			max-width: 160px;
			font-size: var(--text-sm);
			top: -120px;
			right: -60px;
		}

		.action-lines {
			width: 200px;
			height: 200px;
		}

		.name-tag {
			padding: var(--space-2) var(--space-3);
		}

		.name-english {
			font-size: var(--text-lg);
		}

		.sound-effect-display {
			font-size: var(--text-base);
			right: -60px;
		}
	}

	@media (max-width: 480px) {
		.character-image {
			width: 160px;
		}

		.speech-bubble {
			max-width: 220px;
			font-size: var(--text-sm);
			top: -50px; /* Even more reduced for small mobile */
		}

		.name-tag {
			padding: var(--space-2) var(--space-3);
		}
	}
</style>
