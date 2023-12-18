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

	export let personId;
	export let relationshipId;

	const onPersonNodeForSelectClickAction = () => {
		addOrUpdatePersonInActivePersonGroup(personId, relationshipId);
		addOrUpdateActivePersonInNewPersonGroup(personId, $tempState.nodeEditGroupId);
		removePersonFromActivePersonGroup($tempState.nodeActionsModalPersonId, relationshipId);
		removePersonFromPeopleArray(getPersonById($tempState.nodeActionsModalPersonId));
		hidePersonNodeActionsModal();
		checkPersonForUnsavedChanges(personId);
		// TODO: try to keep the actions modal open
		//showPersonNodeActionsModal(sPersonId, getPersonById(sPersonId).name, sRelationshipId, undefined);
	};

	const personNodeForSelectDynamicClass = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		background-color: ${stylingConstants.colors.personNodeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div
	id="person-node-for-select-{personId}"
	class="person-node {personNodeForSelectDynamicClass}"
	on:click|stopPropagation={onPersonNodeForSelectClickAction}
	on:keydown|stopPropagation
>
	<div id="person-node-content-area" class="person-node-content-area">
		<BioPhoto {personId} allowEdit={false} />
		<NameInput sInputValue={getPersonById(personId)?.name} />
	</div>
</div>

<style>
	.person-node {
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 2px solid transparent;
	}

	.person-node-content-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
