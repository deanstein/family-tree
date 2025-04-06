<script>
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import { person } from '$lib/schemas/person';
	import contexts from '$lib/schemas/contexts';

	import stylingConstants from '$lib/components/styling-constants';

	import ButtonCircularInSquare from '$lib/components/ButtonCircularInSquare.svelte';
	import MediaGroupTitle from '$lib/components/MediaGroupTitle.svelte';
	import PersonNode from '$lib/components/NodeView/PersonNode/PersonNode.svelte';
	import PersonNodeForEdit from '$lib/components/NodeView/PersonNode/PersonNodeForEdit.svelte';
	import EmptyMediaSquare from '$lib/components/EmptyMediaSquare.svelte';
	import tempState from '$lib/stores/temp-state';
	import { isPersonNodeEditActive } from '$lib/states/temp-state';

	export let enabled;
	export let associatedPeopleIds = [];
	export let showEmptyState = true;
	export let showGroupTitle = true;
	export let showAddButton = true;

	const personNodeGroupOuterContainerCss = css`
		gap: ${stylingConstants.sizes.padding};
	`;
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
				isPersonNodeEditActive.set(true);
			}}
			{enabled}
		/>
	{/if}
	{#if $isPersonNodeEditActive}
		<PersonNodeForEdit nameInputValue="" context={contexts.eventDetailsModal} />
	{/if}
	<!-- show all associated people in the tempState timelineEditEvent-->
	{#if $tempState.timelineEditEvent?.eventContent?.associatedPeopleIds}
		{#each $tempState.timelineEditEvent?.eventContent?.associatedPeopleIds as personId}
			<PersonNode sPersonId={personId} />
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
