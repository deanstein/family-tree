<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	import PersonNodeAddButton from './AddPersonButton.svelte';
	import PersonNodePlaceholder from '../PersonNode/PersonNodePlaceholder.svelte';
	import PersonNode from '../PersonNode/PersonNode.svelte';

	export let personNodeGroupData;
	export let bHideIfEmpty = false;

	let hide = false;

	$: {
		hide = personNodeGroupData.groupMembers.length === 0 && bHideIfEmpty;
		console.log(bHideIfEmpty);
	}

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
</script>

{#if !hide}
	<div class="{personNodeGroupPlusButtonDynamicClass} person-node-group-plus-button">
		<div
			id="person-node-group-outer-container"
			class="{personNodeGroupOuterContainerDynamicClass} person-node-group-outer-container"
		>
			<div
				id="person-node-group-title"
				class="{personNodeGroupTitleDynamicClass} person-node-group-title"
			>
				{personNodeGroupData.groupName}
			</div>
			<div id="person-node-group-interior-container" class="person-node-group-inner-container">
				{#if personNodeGroupData.groupMembers.length == 0}
					<PersonNodePlaceholder
						relationshipId={personNodeGroupData.groupId}
						compatibleGroups={personNodeGroupData.compatibleGroups}
					/>
				{/if}
				{#each personNodeGroupData.groupMembers as { }, i (personNodeGroupData.groupMembers[i])}
					<PersonNode
						sPersonId={personNodeGroupData.groupMembers[i].id}
						sRelationshipId={personNodeGroupData.groupMembers[i].relationshipId}
						groupId={personNodeGroupData.groupId}
						compatibleGroups={personNodeGroupData.compatibleGroups}
					/>
				{/each}
			</div>
		</div>
		{#if personNodeGroupData.groupMembers.length > 0}
			<PersonNodeAddButton
				groupId={personNodeGroupData.groupId}
				compatibleGroups={personNodeGroupData.compatibleGroups}
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
	}
</style>
