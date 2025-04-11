<script>
	import { css } from '@emotion/css';

	import relationshipMap from '$lib/schemas/relationship-map';

	import tempState from '$lib/stores/temp-state';

	import {
		addOrUpdateActivePersonInNewPersonGroup,
		addPersonToPeopleArray,
		createNewPerson,
		getDefaultRelationshipType,
		getPersonById
	} from '$lib/person-management';
	import { addOrUpdatePersonInActivePersonGroup } from '$lib/ui-management';
	import { showPersonNodeActionsModal } from '$lib/temp-management';

	import stylingConstants from '$lib/components/styling-constants';

	import ButtonCircular from '$lib/components/ButtonCircular.svelte';
	import ButtonCircularInSquare from '$lib/components/ButtonCircularInSquare.svelte';
	import PersonNode from '$lib/components/NodeView/PersonNode/PersonNode.svelte';
	import contexts from '$lib/schemas/contexts';

	export let personNodeGroupData;
	export let personNodeColor;

	const onClickAddPersonButton = () => {
		let newPerson = createNewPerson();
		addPersonToPeopleArray(newPerson);
		let defaultRelationshipType = getDefaultRelationshipType(
			relationshipMap[personNodeGroupData.groupId]
		).id;
		addOrUpdatePersonInActivePersonGroup(newPerson.id, defaultRelationshipType);
		addOrUpdateActivePersonInNewPersonGroup(newPerson.id, personNodeGroupData.groupId);
		showPersonNodeActionsModal(
			newPerson.id,
			newPerson.name,
			defaultRelationshipType,
			personNodeGroupData.groupId,
			personNodeGroupData.compatibleGroups
		);
	};

	const personNodeGroupPlusButtonCss = css`
		background-color: ${stylingConstants.colors.nodeGroupColor};
		gap: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
	`;

	const personNodeGroupOuterContainerCss = css`
		height: ${stylingConstants.sizes.personNodeGroupHeight};
		gap: ${stylingConstants.sizes.padding};
	`;
	const personNodeGroupTitleCss = css`
		font-size: ${stylingConstants.sizes.personNodeGroupFontSize};
		height: ${stylingConstants.sizes.personNodeGroupTitleHeight};
		background-color: ${stylingConstants.colors.nodeGroupHeaderColor};
	`;
</script>

{#if $tempState.buildMode || personNodeGroupData.groupMembers.length > 0}
	<div class="person-node-group-plus-button {personNodeGroupPlusButtonCss}">
		<div class="person-node-group-outer-container {personNodeGroupOuterContainerCss}">
			<div class="person-node-group-title {personNodeGroupTitleCss}">
				{personNodeGroupData.groupName}
			</div>
			<div class="person-node-group-inner-container">
				{#if personNodeGroupData.groupMembers.length == 0}
					<ButtonCircularInSquare onClickFunction={onClickAddPersonButton} />
				{/if}
				{#each personNodeGroupData.groupMembers as { }, i (personNodeGroupData.groupMembers[i])}
					<PersonNode
						personId={personNodeGroupData.groupMembers[i].id}
						relationshipId={personNodeGroupData.groupMembers[i].relationshipId}
						compatibleGroups={personNodeGroupData.compatibleGroups}
						color={personNodeColor}
						context={contexts.treeView}
						onClickActionsFunction={() => {
							const person = getPersonById(personNodeGroupData.groupMembers[i].id);
							showPersonNodeActionsModal(
								personNodeGroupData.groupMembers[i].id,
								person.name,
								personNodeGroupData.groupMembers[i].relationshipId,
								personNodeGroupData.groupId,
								personNodeGroupData.compatibleGroups
							);
						}}
					/>
				{/each}
			</div>
		</div>
		{#if $tempState.buildMode && personNodeGroupData.groupMembers.length > 0}
			<ButtonCircular
				onClickFunction={onClickAddPersonButton}
				colorOverride={stylingConstants.colors.activeColor}
			/>
		{/if}
	</div>
{/if}

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
