<script>
	import { css } from '@emotion/css';

	import relationshipMap from '$lib/schemas/relationship-map';

	import {
		createNewPerson,
		addOrUpdateActivePersonInNewPersonGroup,
		addPersonToPeopleArray,
		getDefaultRelationshipType
	} from '$lib/person-management';
	import { addOrUpdatePersonInActivePersonGroup } from '$lib/ui-management';
	import { showPersonNodeActionsModal } from '$lib/temp-management';

	import stylingConstants from '$lib/components/styling-constants';

	export let groupId;
	export let compatibleGroups;

	const personNodeAddButtonDynamicStyle = css`
		width: ${stylingConstants.sizes.personNodeAddButtonSize};
		height: ${stylingConstants.sizes.personNodeAddButtonSize};
		color: white;
		background: ${stylingConstants.colors.activePersonNodeColor};
		:hover {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;

	const addButtonOnClick = () => {
		let newPerson = createNewPerson();
		addPersonToPeopleArray(newPerson);
		let defaultRelationshipType = getDefaultRelationshipType(relationshipMap[groupId]).id;
		addOrUpdatePersonInActivePersonGroup(newPerson.id, defaultRelationshipType);
		addOrUpdateActivePersonInNewPersonGroup(newPerson.id, groupId);
		showPersonNodeActionsModal(
			newPerson.id,
			newPerson.name,
			defaultRelationshipType,
			groupId,
			compatibleGroups
		);
	};
</script>

<div id="person-add-button-container" class="person-add-button-container">
	<div
		id="person-add-button"
		class="{personNodeAddButtonDynamicStyle} person-add-button"
		on:click={addButtonOnClick}
		on:keydown={addButtonOnClick}
	>
		<span id="person-add-button-label" class="person-add-button-label">+</span>
	</div>
</div>

<style>
	.person-add-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.person-add-button-label {
		font-size: 3vh;
		line-height: normal;
	}
</style>
