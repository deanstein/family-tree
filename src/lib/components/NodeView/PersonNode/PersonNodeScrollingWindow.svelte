<script>
	import { scrollHorizontal } from '$lib/ui-management';

	import tempState from '$lib/stores/temp-state';

	import PersonNodeForSelect from '$lib/components/NodeView/PersonNode/PersonNodeForSelect.svelte';

	export let relationshipId;
</script>

<div class="person-node-scrolling-window-outer-container">
	<div
		class="person-node-scrolling-window-inner-container"
		role="button"
		tabindex="0"
		on:click|stopPropagation
		on:keypress|stopPropagation
		on:wheel={scrollHorizontal}
	>
		{#each $tempState.personIdsOffScreenFiltered as personId (personId)}
			<PersonNodeForSelect {personId} {relationshipId} />
		{/each}
	</div>
</div>

<style>
	.person-node-scrolling-window-outer-container {
		position: absolute;
		top: 100%;
		max-width: 500%; /* 5x the width of the node */
		z-index: 1;
		padding: 10px;
		background-color: gray;
	}

	.person-node-scrolling-window-inner-container {
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		gap: 10px;
	}
</style>
