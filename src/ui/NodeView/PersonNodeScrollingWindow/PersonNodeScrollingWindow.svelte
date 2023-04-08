<script>
	import { onMount } from 'svelte';
	import uiState from '../../../stores/uiState';

	import PersonNodeForSelect from '../PersonNode/PersonNodeForSelect.svelte';

	export let sRelationshipId;

	onMount(() => {
		//console.log($uiState.personIdsOffScreen, $uiState.personIdsOffScreenFiltered);
	});
</script>

<div
	id="person-node-scrolling-window-container"
	class="person-node-scrolling-window-container"
	on:click|stopPropagation
	on:keypress|stopPropagation
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
		top: 100%;
		gap: 10px;
		z-index: 1;
		padding: 10px;
		background-color: gray;
	}
</style>
