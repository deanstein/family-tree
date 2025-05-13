<script>
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import contexts from '$lib/schemas/contexts';

	import { activePerson } from '$lib/states/family-tree-state';
	import { isNodeEditActive, timelineEditEvent, timelineEditEventId } from '$lib/states/temp-state';

	import {
		checkPersonForUnsavedChanges,
		removeAssociatedPersonFromActiveTimelineEvent
	} from '$lib/temp-management';
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
		const eventId = get(timelineEditEventId);
		removeAssociatedPersonFromActiveTimelineEvent(associatedPersonId);
		removeTimelineEventReference(associatedPersonId, eventId);
		checkPersonForUnsavedChanges(get(activePerson).id);
	};
</script>

<div class="associated-node-group-outer-container {personNodeGroupOuterContainerCss}">
	{#if associatedPeopleIds.length === 0 && showEmptyState && !showAddButton}
		<EmptyMediaSquare />
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
	{#if $timelineEditEvent?.eventContent?.associatedPeopleIds}
		{#each $timelineEditEvent?.eventContent?.associatedPeopleIds as personId}
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
		gap: 1vh;
	}
</style>
