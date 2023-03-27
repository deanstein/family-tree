<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/uiState';
	import stylingConstants from '../../../stores/stylingConstants';

	import {
		getPersonById,
		removePersonFromPeopleArray,
	} from '../../../logic/personManagement';

	import {
		addOrUpdatePersonInActivePersonGroup,
		removePersonFromActivePersonGroup,
		addPersonIdToOnScreenPeopleIdsArray
	}  from '../../../logic/uiManagement';

	import Avatar from './Avatar.svelte';
	import NameInput from './NameInput.svelte';

	export let sPersonId;
	export let sRelationshipId;

	const onPersonNodeForSelectClickAction = () => {
		addOrUpdatePersonInActivePersonGroup(sPersonId, sRelationshipId);
		addPersonIdToOnScreenPeopleIdsArray(sPersonId);
		removePersonFromActivePersonGroup($uiState.sPersonIdForNodeEdit, sRelationshipId);
		removePersonFromPeopleArray(getPersonById($uiState.sPersonIdForNodeEdit));
		//unsetActiveNodeEditId();
		//setActiveNodeEditId(sPersonId)
	};

	const personNodeForSelectDynamicClass = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		background-color: ${stylingConstants.colors.sPersonNodeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.sHoverColor};
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
