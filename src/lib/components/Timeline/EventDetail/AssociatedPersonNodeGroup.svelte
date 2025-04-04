<script>
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import { person } from '$lib/schemas/person';
	import personNodeGroup from '$lib/schemas/person-node-group';
	import contexts from '$lib/schemas/contexts';

	import familyTreeData from '$lib/stores/family-tree-data';
	import uiState from '$lib/stores/ui-state';
	import tempState from '$lib/stores/temp-state';

	import { instantiateObject } from '$lib/utils';

	import stylingConstants from '$lib/components/styling-constants';

	import ButtonCircularInSquare from '$lib/components/ButtonCircularInSquare.svelte';
	import MediaGroupTitle from '$lib/components/MediaGroupTitle.svelte';
	import PersonNode from '$lib/components/NodeView/PersonNode/PersonNode.svelte';
	import PersonNodeForEdit from '$lib/components/NodeView/PersonNode/PersonNodeForEdit.svelte';
	import EmptyMediaSquare from '$lib/components/EmptyMediaSquare.svelte';

	export let associatedPeopleIds = [];
	export let showEmptyState = true;
	export let showGroupTitle = true;
	export let showAddButton = true;

	let tempPerson = instantiateObject(person);
	tempPerson.id = new uuidv4();

	const onClickAddAssociatedPersonButton = () => {
		associatedPeopleIds = [...associatedPeopleIds, tempPerson];
	};

	const personNodeGroupData = instantiateObject(personNodeGroup);
	personNodeGroupData.groupName = 'Was with:';

	const personNodeGroupOuterContainerCss = css`
		gap: ${stylingConstants.sizes.padding};
	`;

	$: {
		personNodeGroupData.groupMembers =
			$tempState?.timelineEditEvent?.eventContent?.associatedPeople;
		// remove the active person from the person node group data
		const activePersonIndex = $familyTreeData.allPeople.indexOf($uiState.activePerson.id);
		// remove the active person from the list of candidates to show
		if (activePersonIndex > -1) {
			personNodeGroupData.groupmembers.splice(activePersonIndex, 1);
		}
	}
</script>

<div class="associated-node-group-outer-container {personNodeGroupOuterContainerCss}">
	{#if associatedPeopleIds.length === 0 && showEmptyState && !showAddButton}
		<EmptyMediaSquare />
	{/if}
	{#if showGroupTitle}
		<MediaGroupTitle groupTitle={'With'} />
	{/if}

	{#if showAddButton}
		<ButtonCircularInSquare onClickFunction={onClickAddAssociatedPersonButton} />
	{/if}
	{#each associatedPeopleIds as personId}
		<PersonNodeForEdit nameInputValue="" isNewPerson={false} context={contexts.eventDetailsModal} />
	{/each}
</div>

<style>
	.associated-node-group-outer-container {
		display: flex;
	}

	.associated-node-group-inner-container {
		display: flex;
		flex-direction: row;
		gap: 1vh;
	}
</style>
