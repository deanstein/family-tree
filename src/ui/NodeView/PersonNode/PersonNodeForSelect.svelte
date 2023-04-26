<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/ui-state';
	import stylingConstants from '../../stylingConstants';

	import { getPersonById, removePersonFromPeopleArray } from '../../../logic/person-management';

	import {
		addOrUpdatePersonInActivePersonGroup,
		removePersonFromActivePersonGroup,
		unsetActiveNodeEditId
	} from '../../../logic/ui-management';

	import Avatar from './Avatar.svelte';
	import NameInput from './NameInput.svelte';

	export let sPersonId;
	export let sRelationshipId;

	const onPersonNodeForSelectClickAction = () => {
		addOrUpdatePersonInActivePersonGroup(sPersonId, sRelationshipId);
		removePersonFromActivePersonGroup($uiState.personIdForNodeEdit, sRelationshipId);
		removePersonFromPeopleArray(getPersonById($uiState.personIdForNodeEdit));
		unsetActiveNodeEditId();
		//setActiveNodeEditId(sPersonId)
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
		<NameInput sInputValue={getPersonById(sPersonId)?.name} {sPersonId} {sRelationshipId} />
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
