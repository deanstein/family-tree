<script>
	import EmptyMediaSquare from '$lib/components/EmptyMediaSquare.svelte';

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
		gap: 8px;
	}
</style>
