<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/uiState';
	import stylingConstants from '../../../stores/stylingConstants';

	import {
		getPersonById,
		addOrUpdatePersonInActivePersonGroup,
		removePersonFromActivePersonGroup,
		removePersonFromPeopleArray
	} from '../../../logic/personManagement';

	import Avatar from './Avatar.svelte';
	import NameInput from './NameInput.svelte';

	export let sPersonId;
	export let sRelationshipId;

	const onPersonNodeClickAction = () => {
		addOrUpdatePersonInActivePersonGroup(sPersonId, sRelationshipId);
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
	on:click|stopPropagation={onPersonNodeClickAction}
	on:keydown|stopPropagation
>
	<div id="person-node-content-area" class="person-node-content-area">
		<Avatar />
		<NameInput sInputValue={getPersonById(sPersonId)?.name} {sPersonId} />
	</div>
</div>

<style>
</style>
