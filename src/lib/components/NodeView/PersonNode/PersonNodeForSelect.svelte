<script>
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import timelineEventReference from '$lib/schemas/timeline-event-reference';

	import tempState from '$lib/stores/temp-state';
	import { isPersonNodeEditActive } from '$lib/states/temp-state';
	import uiState from '$lib/stores/ui-state';
	import contexts from '$lib/schemas/contexts';

	import {
		getPersonById,
		addOrUpdateActivePersonInNewPersonGroup,
		removePersonFromPeopleArray,
		addTimelineEventReference,
		upgradePersonById
	} from '$lib/person-management';

	import {
		addOrUpdatePersonInActivePersonGroup,
		removePersonFromActivePersonGroup
	} from '$lib/ui-management';

	import { addAssociatedPersonToTimelineEvent as addAssociatedPersonToActiveTimelineEvent } from '$lib/temp-management';
	import { checkPersonForUnsavedChanges, hidePersonNodeActionsModal } from '$lib/temp-management';
	import { instantiateObject } from '$lib/utils';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import NameInput from '$lib/components/NodeView/PersonNode/NameLabel.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let personId;
	export let relationshipId;
	export let context; // context determines what action should be taken on click

	// various actions that can occur when the node is clicked

	// adds a relationship to the person being viewed in the person detail modal
	const addRelationshipToPerson = () => {
		addOrUpdatePersonInActivePersonGroup(personId, relationshipId);
		addOrUpdateActivePersonInNewPersonGroup(personId, $tempState.nodeEditGroupId);
		removePersonFromActivePersonGroup($tempState.nodeActionsModalPersonId, relationshipId);
		removePersonFromPeopleArray(getPersonById($tempState.nodeActionsModalPersonId));
		hidePersonNodeActionsModal();
		checkPersonForUnsavedChanges(personId);
		// TODO: try to keep the actions modal open
		//showPersonNodeActionsModal(sPersonId, getPersonById(sPersonId).name, sRelationshipId, undefined);
	};

	const addAssociatedPersonToEvent = () => {
		// add the associated person to this timeline event
		addAssociatedPersonToActiveTimelineEvent(personId);
		// add the event reference to the other person
		upgradePersonById(personId);
		const eventReference = instantiateObject(timelineEventReference);
		eventReference.personId = get(uiState).activePerson.id;
		eventReference.eventId = get(tempState).timelineEditEventId;
		addTimelineEventReference(personId, eventReference);
		// show the unsaved changes flag and stop editing
		checkPersonForUnsavedChanges(personId);
		isPersonNodeEditActive.set(false);
	};

	// the onClickAction will differ depending on the context
	const onClickAction = () => {
		switch (context) {
			case contexts.nodeActionsModal:
				addRelationshipToPerson();
				break;
			case contexts.eventDetailsModal:
				addAssociatedPersonToEvent();
				break;
			default:
				console.error('PersonNodeForSelect: No function matching the given context.');
				break;
		}
	};

	const personNodeForSelectCss = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		background-color: ${stylingConstants.colors.personNodeColor};
		border: 2px solid transparent;
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div
	class="person-node-for-select {personNodeForSelectCss}"
	role="button"
	tabindex="0"
	on:click|stopPropagation={onClickAction}
	on:keydown|stopPropagation
>
	<div class="person-node-content-area">
		<BioPhoto {personId} allowEdit={false} />
		<NameInput sInputValue={getPersonById(personId)?.name} />
	</div>
</div>

<style>
	.person-node-for-select {
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.person-node-content-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
