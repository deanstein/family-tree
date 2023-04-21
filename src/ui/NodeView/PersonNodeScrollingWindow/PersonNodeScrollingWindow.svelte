<script>
	import { scrollHorizontal } from '../../../logic/uiManagement';
	import uiState from '../../../stores/uiState';

	import PersonNodeForSelect from '../PersonNode/PersonNodeForSelect.svelte';

	export let sRelationshipId;
</script>

<div
	id="person-node-scrolling-window-container"
	class="person-node-scrolling-window-container"
	on:click|stopPropagation
	on:keypress|stopPropagation
	on:wheel={scrollHorizontal}
>
	{#each $uiState.personIdsOffScreenFiltered as sPersonId}
		<PersonNodeForSelect {sPersonId} {sRelationshipId} />
	{/each}
</div>

<style>
	.person-node-scrolling-window-container {
		display: flex;
		position: absolute;
		justify-content: center;
		overflow: auto;
		max-width: 500%; /* 5x the width of the node */
		top: 100%;
		gap: 10px;
		z-index: 1;
		padding: 10px;
		background-color: gray;
	}
</style>
