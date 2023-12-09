<script>
	import EmptyMediaSquare from './EmptyMediaSquare.svelte';

	export let showEmptyState = true;
</script>

<div class="media-group-container">
	{#if showEmptyState}
		<EmptyMediaSquare />
	{/if}
	<slot />
</div>

<style>
	.media-group-container {
		display: flex;
		gap: 0.5vw;
	}
</style>
