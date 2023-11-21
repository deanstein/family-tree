<script>
	import { css } from '@emotion/css';

	import personNodeGroup from '../../../schemas/person-node-group';

	import uiState from '../../../stores/ui-state';
	import familyTreeData from '../../../stores/family-tree-data';

	import { instantiateObject } from '../../../logic/utils';
	import tempState from '../../../stores/temp-state';
	import stylingConstants from '../../styling-constants';

	import AddButtonCircular from '../../AddButtonCircular.svelte';
	import MediaGroupTitle from '../../MediaGroupTitle.svelte';
	import MediaGroupHorizontal from '../../MediaGroupHorizontal.svelte';
	import AddButtonSquare from '../../AddButtonSquare.svelte';

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
