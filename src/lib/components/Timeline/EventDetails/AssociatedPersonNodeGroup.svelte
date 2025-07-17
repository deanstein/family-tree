<script>
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import contexts from '$lib/schemas/contexts';

	import { hasUnsavedChanges } from '$lib/states/family-tree-state';
	import { isNodeEditActive, timelineEditEvent } from '$lib/states/temp-state';

	import { removeAssociatedPersonFromActiveTimelineEvent } from '$lib/temp-management';
	import { removeTimelineEventReference } from '$lib/person-management';

	import ButtonCircularInSquare from '$lib/components/ButtonCircularInSquare.svelte';
	import MediaGroupTitle from '$lib/components/MediaGroupTitle.svelte';
	import PersonNode from '$lib/components/NodeView/PersonNode/PersonNode.svelte';
	import PersonNodeForEdit from '$lib/components/NodeView/PersonNode/PersonNodeForEdit.svelte';
	import EmptyMediaSquare from '$lib/components/EmptyMediaSquare.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let enabled;
	export let associatedPeopleIds = [];
	export let showEmptyState = true;
	export let showGroupTitle = true;
	export let showAddButton = true;

	const personNodeGroupOuterContainerCss = css`
		gap: ${stylingConstants.sizes.padding};
	`;

	const removeAssociatedPersonFromActiveEvent = (associatedPersonId) => {
		removeAssociatedPersonFromActiveTimelineEvent(associatedPersonId);
		removeTimelineEventReference(associatedPersonId, get(timelineEditEvent).eventId);
		hasUnsavedChanges.set(true);
	};
</script>

<div class="associated-node-group-outer-container {personNodeGroupOuterContainerCss}">
	{#if associatedPeopleIds && associatedPeopleIds.length === 0 && showEmptyState && !showAddButton}
		<EmptyMediaSquare
			faIcon="fa-people-group"
			message={'No people found'}
			tooltip="Edit this event to add people"
		/>
	{/if}
	{#if showGroupTitle}
		<MediaGroupTitle groupTitle={'With'} />
	{/if}

	{#if showAddButton}
		<ButtonCircularInSquare
			onClickFunction={() => {
				isNodeEditActive.set(true);
			}}
			{enabled}
		/>
	{/if}
	{#if $isNodeEditActive}
		<PersonNodeForEdit nameInputValue="" context={contexts.associatedPersonSelect} showHideButton />
	{/if}
	<!-- show all associated people in the tempState timelineEditEvent-->
	{#if associatedPeopleIds}
		{#each associatedPeopleIds as personId}
			<PersonNode
				{personId}
				onClickActionButton={enabled
					? () => {
							removeAssociatedPersonFromActiveEvent(personId);
						}
					: undefined}
				actionButtonFaIcon="fa-trash"
				actionButtonFaIconFontSize="0.5rem"
				actionButtonIconColor="white"
				actionButtonBackgroundColor="red"
				actionButtonTooltip={'Remove person from event'}
				context={contexts.associatedPerson}
			/>
		{/each}
	{/if}
</div>

<style>
	.associated-node-group-outer-container {
		display: flex;
	}

	.associated-node-group-inner-container {
		display: flex;
		flex-direction: row;
		gap: 1svh;
	}
</style>
