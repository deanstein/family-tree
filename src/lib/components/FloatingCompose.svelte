<script>
	import ButtonCompose from './ComposeButton.svelte';

	let onClickComposeFunction;
</script>

<div class="floating-anchor-wrapper">
	<div class="floating-anchor-outer">
		<div class="floating-compose-container">
			<ButtonCompose onClickFunction={onClickComposeFunction} />
		</div>
	</div>
</div>

<style>
	.floating-anchor-wrapper {
		position: static;
		inset: 0;
		pointer-events: none; /* allow clicks through around button */
	}

	.floating-anchor-outer {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.floating-compose-container {
		position: absolute;
		bottom: 15%;
		right: 15%;
		pointer-events: auto;
		z-index: 1000;
	}
</style>
