<script>
	import { scrollHorizontal } from '../../../logic/ui-management';
	import tempState from '../../../stores/temp-state';

	import PersonNodeForSelect from '../PersonNode/PersonNodeForSelect.svelte';

	export let sRelationshipId;
</script>

<div
	id="person-node-scrolling-window-outer-container"
	class="person-node-scrolling-window-outer-container"
>
	<div
		id="person-node-scrolling-window-inner-container"
		class="person-node-scrolling-window-inner-container"
		on:click|stopPropagation
		on:keypress|stopPropagation
		on:wheel={scrollHorizontal}
	>
		{#each $tempState.personIdsOffScreenFiltered as sPersonId}
			<PersonNodeForSelect {sPersonId} {sRelationshipId} />
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
