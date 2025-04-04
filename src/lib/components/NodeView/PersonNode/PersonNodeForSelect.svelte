<script>
	import { css } from '@emotion/css';

	import tempState from '$lib/stores/temp-state';

	import {
		getPersonById,
		addOrUpdateActivePersonInNewPersonGroup,
		removePersonFromPeopleArray
	} from '$lib/person-management';

	import {
		addOrUpdatePersonInActivePersonGroup,
		removePersonFromActivePersonGroup
	} from '$lib/ui-management';

	import { checkPersonForUnsavedChanges, hidePersonNodeActionsModal } from '$lib/temp-management';

	import stylingConstants from '$lib/components/styling-constants';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import NameInput from '$lib/components/NodeView/PersonNode/NameLabel.svelte';
	import contexts from '$lib/schemas/contexts';

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

	const addAssociatedPersonToEvent = () => {};

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
