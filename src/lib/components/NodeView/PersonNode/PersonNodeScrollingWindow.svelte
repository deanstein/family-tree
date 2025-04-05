<script>
	import { onMount } from 'svelte';

	import contexts from '$lib/schemas/contexts';
	import uiState from '$lib/stores/ui-state';
	import { scrollHorizontal } from '$lib/ui-management';
	import { filterPeopleIds, getAllPeopleIds, getPersonById } from '$lib/person-management';
	import { getAllVisibleNodeViewPeople } from '$lib/temp-management';

	import PersonNodeForSelect from '$lib/components/NodeView/PersonNode/PersonNodeForSelect.svelte';

	// show these people in the scrolling window
	// if not supplied, will use the context
	export let idsToDisplay = undefined;
	// filter by this input
	export let filterInputValue = '';
	// the context will define what happens when a PersonNode is clicked
	export let context;
	// for NodeDetailsModal, the relationshipId will be used when clicking a PersonNode
	export let relationshipId;

	let filteredIds;
	const filterIdsByInput = (idsToDisplay, filter) => {
		const filterUppercase = filter.toUpperCase();
		return idsToDisplay.filter((personId) => {
			const personName = getPersonById(personId).name.toUpperCase();
			return personName.includes(filterUppercase);
		});
	};

	onMount(() => {
		// use the context to determine idsToDisplay if it's not already provided
		if (!idsToDisplay) {
			switch (context) {
				case contexts.nodeActionsModal:
					idsToDisplay = filterPeopleIds(getAllPeopleIds(), getAllVisibleNodeViewPeople());
					break;
				case contexts.eventDetailsModal:
					idsToDisplay = filterPeopleIds(getAllPeopleIds(), $uiState.activePerson.id);
					console.log(getAllPeopleIds(), $uiState.activePerson.id, idsToDisplay);
					break;
			}
		}
	});

	$: {
		if (idsToDisplay && idsToDisplay.length > 0) {
			filteredIds = filterIdsByInput(idsToDisplay, filterInputValue);
		}
	}
</script>

{#if idsToDisplay && idsToDisplay.length > 0}
	<div class="person-node-scrolling-window-outer-container">
		<div
			class="person-node-scrolling-window-inner-container"
			role="button"
			tabindex="0"
			on:click|stopPropagation
			on:keypress|stopPropagation
			on:wheel={scrollHorizontal}
		>
			{#each filteredIds as personId (personId)}
				<PersonNodeForSelect {personId} {relationshipId} {context} />
			{/each}
		</div>
	</div>
{/if}

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
