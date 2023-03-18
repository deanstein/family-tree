<script>
	import { css } from '@emotion/css';

	import relationshipMap from '../../../stores/relationshipMap';
	import uiState from '../../../stores/uiState';
	import stylingConstants from '../../../stores/stylingConstants';

	import {
		createNewPerson,
		addOrUpdatePersonInActivePersonGroup,
		addOrUpdateActivePersonInNewPersonGroup,
		addPersonToPeopleArray,
		getDefaultRelationshipType
	} from '../../../logic/personManagement';
	import { startNodeEditingMode } from '../../../logic/uiManagement';

	export let groupId;

	const personNodeAddButtonDynamicStyle = css`
		width: ${stylingConstants.sizes.personNodeAddButtonSize};
		height: ${stylingConstants.sizes.personNodeAddButtonSize};
		-moz-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		-webkit-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		background: ${stylingConstants.colors.sNodeGroupColor};
		:hover {
			background-color: ${stylingConstants.colors.sHoverColor};
		}
	`;

	const addButtonOnClick = () => {
		let newPerson = createNewPerson();
		addPersonToPeopleArray(newPerson);
		let defaultRelationshipType = getDefaultRelationshipType(relationshipMap[groupId]).id;
		addOrUpdatePersonInActivePersonGroup(newPerson.id, defaultRelationshipType);
		addOrUpdateActivePersonInNewPersonGroup(newPerson.id, groupId);

		startNodeEditingMode(newPerson.id);
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
	.person-add-button-container {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.person-add-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: darkgray;
	}

	.person-add-button-label {
		font-size: 2em;
	}
</style>
