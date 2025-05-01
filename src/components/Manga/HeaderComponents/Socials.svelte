<script>
	export let socials = [
		{
			name: "Twitter",
			url: "https://twitter.com/ivxnio",
			jp: "ツイッター",
		},
		{
			name: "LinkedIn",
			url: "https://www.linkedin.com/in/john-franklin-anusiem/",
			jp: "リンクトイン",
		},
		{ name: "GitHub", url: "https://github.com/Rhaqim", jp: "ギットハブ" },
	];
</script>

<div class="socials-container">
	{#each socials as social}
		<a
			class="social-link"
			href={social.url}
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="english">{social.name}</span>
			<span class="japanese">{social.jp}</span>
		</a>
	{/each}
</div>

<style>
	.socials-container {
		display: flex;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
		position: relative;
		z-index: 2;
		flex-wrap: wrap;
	}

	.social-link {
		position: relative;
		color: #f0f0f0;
		text-decoration: none;
		font-size: 2rem;
		font-weight: bold;
		font-family: "Impact", "Arial Black", sans-serif;
		letter-spacing: 1px;
		padding: 10px 20px;
		overflow: hidden;
		transition:
			transform 0.3s ease,
			color 0.3s ease;
	}

	.social-link:hover {
		transform: scale(1.1);
		color: red;
	}

	.english {
		position: relative;
		z-index: 2;
		transition: opacity 0.3s ease;
	}

	.japanese {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-5deg);
		font-family: "Noto Sans JP", sans-serif;
		color: red;
		font-size: 1.5rem;
		opacity: 0.7;
		z-index: 1;
		transition: all 0.3s ease;
		pointer-events: none;
		text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
	}

	/* Hover effect: Japanese comes to the front */
	.social-link:hover .japanese {
		z-index: 3;
		opacity: 1;
		transform: translate(-50%, -50%) rotate(0deg) scale(1.1);
	}

	/* And English fades slightly */
	.social-link:hover .english {
		opacity: 0.5;
	}
</style>
