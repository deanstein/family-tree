<script>
	import { css } from '@emotion/css';

	import tempState from '../../../stores/temp-state';
	import stylingConstants from '../../styling-constants';

	import {
		getPersonById,
		addOrUpdateActivePersonInNewPersonGroup,
		removePersonFromPeopleArray
	} from '../../../logic/person-management';

	import {
		addOrUpdatePersonInActivePersonGroup,
		removePersonFromActivePersonGroup
	} from '../../../logic/ui-management';

	import { hidePersonNodeActionsModal } from '../../../logic/temp-management';

	import Avatar from './Avatar.svelte';
	import NameInput from './NameInput.svelte';

	export let sPersonId;
	export let sRelationshipId;

	const onPersonNodeForSelectClickAction = () => {
		addOrUpdatePersonInActivePersonGroup(sPersonId, sRelationshipId);
		addOrUpdateActivePersonInNewPersonGroup(sPersonId, $tempState.nodeEditGroupId);
		removePersonFromActivePersonGroup($tempState.nodeActionsModalPersonId, sRelationshipId);
		removePersonFromPeopleArray(getPersonById($tempState.nodeActionsModalPersonId));
		hidePersonNodeActionsModal();
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
	id="person-node-for-select-{sPersonId}"
	class="person-node {personNodeForSelectDynamicClass}"
	on:click|stopPropagation={onPersonNodeForSelectClickAction}
	on:keydown|stopPropagation
>
	<div id="person-node-content-area" class="person-node-content-area">
		<Avatar />
		<NameInput sInputValue={getPersonById(sPersonId)?.name} />
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
