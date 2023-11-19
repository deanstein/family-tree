<script>
	import { css } from '@emotion/css';

	import personNodeGroup from '../../../schemas/person-node-group';

	import uiState from '../../../stores/ui-state';
	import familyTreeData from '../../../stores/family-tree-data';

	import { instantiateObject } from '../../../logic/utils';
	import tempState from '../../../stores/temp-state';
	import stylingConstants from '../../styling-constants';

	import PersonNodePlaceholder from '../../NodeView/PersonNode/PersonNodePlaceholder.svelte';
	import AddButtonCircular from '../../AddButtonCircular.svelte';

	const personNodeGroupData = instantiateObject(personNodeGroup);
	personNodeGroupData.groupName = 'Was with:';

	const personNodeGroupPlusButtonDynamicClass = css`
		background-color: ${stylingConstants.colors.nodeGroupColor};
		gap: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
	`;

	const personNodeGroupOuterContainerDynamicClass = css`
		height: ${stylingConstants.sizes.personNodeGroupHeight};
		gap: ${stylingConstants.sizes.padding};
	`;
	const personNodeGroupTitleDynamicClass = css`
		font-size: ${stylingConstants.sizes.personNodeGroupFontSize};
		height: ${stylingConstants.sizes.personNodeGroupTitleHeight};
		background-color: ${stylingConstants.colors.nodeGroupHeaderColor};
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

<div class="{personNodeGroupPlusButtonDynamicClass} person-node-group-plus-button">
	<div
		id="person-node-group-outer-container"
		class="{personNodeGroupOuterContainerDynamicClass} person-node-group-outer-container"
	>
		<div
			id="person-node-group-title"
			class="{personNodeGroupTitleDynamicClass} person-node-group-title"
		>
			With
		</div>
		<div id="person-node-group-interior-container" class="person-node-group-inner-container">
			{#if personNodeGroupData?.groupMembers?.length == 0}
				<PersonNodePlaceholder
					relationshipId={personNodeGroupData.groupId}
					compatibleGroups={personNodeGroupData.compatibleGroups}
				/>
			{/if}
			<!-- {#each personNodeGroupData.groupMembers as groupMember}
				<PersonNode

				/>
			{/each} -->
		</div>
	</div>
	{#if $tempState.buildMode && personNodeGroupData.groupMembers.length > 0}
		<AddButtonCircular />
	{/if}
</div>

<style>
	.person-node-group-plus-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}

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

	.person-node-group-title {
		align-items: center;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		color: white;
		border-radius: 5px;
	}
</style>
