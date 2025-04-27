<script>
</script>

<div class="cell-content">
	<h1>Manga Title</h1>
</div>

<style>
	.cell-content {
		background-image: url("/images/bg-layer-1.jpg");
		background-size: cover;
		background-position: center;
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		overflow: hidden;
	}

	/* Scrim / dark overlay */
	.cell-content::before {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4); /* darken the background slightly */
		z-index: 1;
	}

	/* Text styling */
	.cell-content h1 {
		position: relative;
		z-index: 2;
		color: #f0f0f0; /* off-white */
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
		font-size: 4rem;
		text-align: center;
		margin: 0;
	}
</style>
