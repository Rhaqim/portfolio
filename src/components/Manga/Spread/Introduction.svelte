<script>
	// No extra script needed for now unless you want animation later
</script>

<div class="cell-content">
	<div class="title-wrapper">
		<h1 class="english">Rhaqim</h1>
		<h1 class="japanese">ラキム</h1>
	</div>
	<!-- <p class="subtitle">Your adventure begins here!</p> -->
</div>

<style>
	.cell-content {
		background-image: url("/images/shinratensei.jpg");
		background-size: cover;
		background-position: center;
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		overflow: hidden;
	}

	.cell-content::before {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 1;
	}

	.title-wrapper {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		margin: 0;
		font-size: 6rem;
		font-weight: bold;
		text-align: center;
		position: relative;
	}

	.english {
		color: #f0f0f0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
		font-family: "Impact", "Arial Black", sans-serif;
		letter-spacing: 2px;
	}

	.japanese {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: red;
		font-family: "Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif;
		font-size: 5rem;
		pointer-events: none;
		opacity: 0.8;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}
</style>
