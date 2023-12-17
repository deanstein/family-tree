<script>
	import { css } from '@emotion/css';

	import personNodeGroup from '$lib/schemas/person-node-group';

	import familyTreeData from '$lib/stores/family-tree-data';
	import uiState from '$lib/stores/ui-state';
	import tempState from '$lib/stores/temp-state';

	import { instantiateObject } from '$lib/utils';

	import stylingConstants from '$lib/components/styling-constants';

	import AddButtonCircular from '$lib/components/AddButtonCircular.svelte';
	import AddButtonSquare from '$lib/components/AddButtonSquare.svelte';
	import MediaGroupTitle from '$lib/components/MediaGroupTitle.svelte';
	import MediaGroupHorizontal from '$lib/components/MediaGroupHorizontal.svelte';

	export let showGroupTitle = true;
	export let showAddButton = true;

	const personNodeGroupData = instantiateObject(personNodeGroup);
	personNodeGroupData.groupName = 'Was with:';

	const personNodeGroupOuterContainerDynamicClass = css`
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

<div
	id="person-node-group-outer-container"
	class="{personNodeGroupOuterContainerDynamicClass} person-node-group-outer-container"
>
	<MediaGroupHorizontal
		showEmptyState={personNodeGroupData?.groupMembers?.length === 0 && !showAddButton}
	>
		{#if showGroupTitle}
			<MediaGroupTitle groupTitle={'With'} />
		{/if}

		{#if showAddButton}
			<AddButtonSquare />
		{/if}
		<!-- {#each personNodeGroupData.groupMembers as groupMember}
				<PersonNode

				/>
			{/each} -->
	</MediaGroupHorizontal>
</div>
{#if $tempState.buildMode && personNodeGroupData.groupMembers.length > 0}
	<AddButtonCircular />
{/if}

<style>
	.person-node-group-outer-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.person-node-group-inner-container {
		display: flex;
		flex-direction: row;
		gap: 1vh;
	}
</style>
