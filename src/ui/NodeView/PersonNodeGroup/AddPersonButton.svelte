<script>
	import { css } from '@emotion/css';

	import relationshipMap from '../../../schemas/relationship-map';
	import stylingConstants from '../../styling-constants';

	import {
		createNewPerson,
		addOrUpdateActivePersonInNewPersonGroup,
		addPersonToPeopleArray,
		getDefaultRelationshipType
	} from '../../../logic/person-management';
	import {
		startNodeEditingMode,
		addOrUpdatePersonInActivePersonGroup,
		showPersonNodeActionsModal
	} from '../../../logic/ui-management';

	export let groupId;
	export let compatibleGroups;

	const personNodeAddButtonDynamicStyle = css`
		width: ${stylingConstants.sizes.personNodeAddButtonSize};
		height: ${stylingConstants.sizes.personNodeAddButtonSize};
		-moz-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		-webkit-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		background: ${stylingConstants.colors.nodeGroupColor};
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
		<div id="person-add-button-label" class="person-add-button-label">+</div>
	</div>
</div>

<style>
	.person-add-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: darkgray;
	}

	.person-add-button-label {
		font-size: 3vh;
	}
</style>
