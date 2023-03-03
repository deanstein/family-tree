<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../stores/stylingConstants';

	import PersonNodeAddButton from './AddPersonButton.svelte';
	import PersonNodePlaceholder from '../PersonNode/PersonNodePlaceholder.svelte';
	import PersonNode from '../PersonNode/PersonNode.svelte';

	export let personNodeGroupData;

	const personNodeGroupPlusButtonDynamicClass = css`
		background-color: ${stylingConstants.colors.sNodeGroupColor};
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
	`;
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
			{personNodeGroupData.groupName}
		</div>
		<div id="person-node-group-interior-container" class="person-node-group-inner-container">
			{#if personNodeGroupData.groupMembers.length == 0}
				<PersonNodePlaceholder relationshipId={personNodeGroupData.groupId} />
			{/if}
			{#each personNodeGroupData.groupMembers as { }, i}
				<PersonNode
					sPersonId={personNodeGroupData.groupMembers[i].id}
					sRelationshipId={personNodeGroupData.groupMembers[i].relationshipId}
					compatibleGroups={personNodeGroupData.compatibleGroups}
				/>
			{/each}
		</div>
	</div>
	{#if personNodeGroupData.groupMembers.length > 0}
		<PersonNodeAddButton groupId={personNodeGroupData.groupId} />
	{/if}
</div>

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
		background-color: darkgray;
	}
</style>
