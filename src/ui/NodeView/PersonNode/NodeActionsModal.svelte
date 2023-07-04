<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import Button from '../../Button.svelte';
	import Overlay from '../Overlay.svelte';

	import { defaultName } from '../../../schemas/person';
	import tempState from '../../../stores/temp-state';
	import uiState from '../../../stores/ui-state';

	import stylingConstants from '../../styling-constants';

	import {
		checkPersonForUnsavedChanges,
		hidePersonNodeActionsModal,
		setCachedPerson,
		unsetCachedPerson
	} from '../../../logic/temp-management';
	import {
		removePersonFromActivePersonGroup,
		showPersonDetailView
	} from '../../../logic/ui-management.js';
	import PersonNodeForEdit from './PersonNodeForEdit.svelte';
	import {
		getPersonById,
		setPersonName,
		setPersonRelationship,
		removePersonFromPeopleArray,
		setActivePerson
	} from '../../../logic/person-management';

	export let personId;
	export let relationshipId;
	export let isNewPerson = false;

	let nameInputValue = $tempState.nodeEditName;
	let nameInputValueOriginal = undefined;
	let relationshipInputValue = $tempState.nodeEditRelationshipId;
	let relationshipInputValueOriginal = undefined;

	const captureAllOriginalInputValues = () => {
		nameInputValueOriginal = nameInputValue;
		relationshipInputValueOriginal = relationshipInputValue;
	};

	const saveAllInputs = () => {
		setPersonName(personId, nameInputValue);
		setPersonRelationship(personId, relationshipInputValueOriginal, relationshipInputValue);
		checkPersonForUnsavedChanges(personId);
	};

	export const onDoneButtonClick = () => {
		saveAllInputs();
		hidePersonNodeActionsModal();
	};

	const onCancelButtonClick = () => {
		if (isNewPerson) {
			removePersonFromActivePersonGroup(personId, relationshipId);
			removePersonFromPeopleArray(getPersonById(personId));
			hidePersonNodeActionsModal();
		} else {
			hidePersonNodeActionsModal();
		}
	};

	const onRemoveButtonClick = () => {
		removePersonFromActivePersonGroup(personId, relationshipId);
		hidePersonNodeActionsModal();
	};

	const onViewDetailsButtonClick = () => {
		saveAllInputs();
		hidePersonNodeActionsModal();
		setActivePerson(getPersonById(personId));
		showPersonDetailView();
	};

	const nodeActionsModalDynamicClass = css`
		z-index: ${stylingConstants.zIndices.personNodeSettingsFlyoutZIndex};
		ul {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
		a {
			background-color: ${stylingConstants.colors.menuBackgroundColor};
			:hover {
				background-color: ${stylingConstants.colors.hoverColor};
		}
	`;

	const nodeActionsModalTitleDynamicClass = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const personNodeRelationshipSubtextDynamicClass = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
		color: ${stylingConstants.colors.textColor};
	`;

	onMount(() => {
		captureAllOriginalInputValues();
		setCachedPerson(getPersonById(personId));
	});

	onDestroy(() => {
		unsetCachedPerson();
	});

	$: {
		if ($tempState.nodeEditName === 'Firstname Lastname') {
			isNewPerson = true;
		} else {
			isNewPerson = false;
		}
	}
</script>

<div
	id="node-actions-modal-container"
	class="{nodeActionsModalDynamicClass} node-actions-modal-container"
>
	<div id="node-actions-modal-content" class="node-actions-modal-content">
		<div
			id="node-actions-modal-title"
			class="{nodeActionsModalTitleDynamicClass} node-actions-modal-title"
		>
			{isNewPerson ? 'Add relationship ' : 'Edit relationship '}
			<div
				id="relationship-subtext-label"
				class="{personNodeRelationshipSubtextDynamicClass} relationship-subtext-label"
			>
				to {$uiState.activePerson.name}
			</div>
		</div>
		<div id="node-actions-node-view" class="node-actions-node-view">
			<PersonNodeForEdit
				bind:nameInputValue
				bind:relationshipInputValue
				{isNewPerson}
				nodeSize="15vh"
			/>
		</div>
		{#if !isNewPerson}
			<Button
				buttonText="View Details"
				onClickFunction={onViewDetailsButtonClick}
				overrideColor={stylingConstants.colors.activeColor}
				overrideColorHover={'white'}
				overrideBackgroundColor={'transparent'}
				overrideBackgroundColorHover={stylingConstants.colors.hoverColor}
			/>
		{/if}
		<div id="node-actions-button-bottom-container" class="node-actions-button-bottom-container">
			{#if !isNewPerson}
				<Button
					buttonText="Remove"
					onClickFunction={onRemoveButtonClick}
					overrideColor={stylingConstants.colors.buttonColorDelete}
					overrideColorHover={'white'}
					overrideBackgroundColor={'transparent'}
					overrideBackgroundColorHover={stylingConstants.colors.buttonColorDelete}
				/>
			{/if}
			<Button
				buttonText={'Cancel'}
				onClickFunction={onCancelButtonClick}
				overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
			/>
			<Button
				buttonText="Done"
				isEnabled={nameInputValue.length > 0 && nameInputValue !== defaultName}
				overrideBackgroundColor={stylingConstants.colors.buttonColorDone}
				onClickFunction={onDoneButtonClick}
			/>
		</div>
	</div>
</div>
<Portal target="#app-container">
	<Overlay />
</Portal>

<style>
	.node-actions-modal-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.node-actions-modal-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1vh;
		padding: 1vw;
		background-color: lightGray;
	}

	.node-actions-modal-title {
		font-size: 2vh;
		padding-bottom: 1vh;
	}

	.node-actions-button-container {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		padding: 0.5vh 0 1vh 0;
	}

	.relationship-subtext-label {
		text-align: center;
	}

	.node-actions-button-bottom-container {
		width: 100%;
		display: flex;
		gap: 0.5vw;
		margin-top: 1.5vh;
		justify-content: right;
	}
</style>
