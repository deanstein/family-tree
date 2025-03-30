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
	on:click|stopPropagation={onPersonNodeForSelectClickAction}
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
