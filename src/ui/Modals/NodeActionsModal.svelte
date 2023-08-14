<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import Button from '../Button.svelte';

	import { defaultName } from '../../schemas/person';
	import tempState from '../../stores/temp-state';
	import uiState from '../../stores/ui-state';

	import stylingConstants from '../styling-constants';

	import {
		checkPersonForUnsavedChanges,
		hidePersonNodeActionsModal,
		setCachedPerson,
		unsetCachedPerson
	} from '../../logic/temp-management';
	import {
		removePersonFromActivePersonGroup,
		showPersonDetailView
	} from '../../logic/ui-management.js';
	import PersonNodeForEdit from '../NodeView/PersonNode/PersonNodeForEdit.svelte';
	import {
		getPersonById,
		setPersonName,
		setPersonRelationship,
		removePersonFromPeopleArray,
		setActivePerson
	} from '../../logic/person-management';
	import Modal from './Modal.svelte';
	import ModalActionsBar from './ModalActionsBar.svelte';

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

<Modal
	showModal={$tempState.nodeActionsModalPersonId}
	modalTitle={isNewPerson ? 'Add relationship ' : 'Edit relationship '}
	modalSubtitle={'to ' + $uiState.activePerson.name}
	zIndex={stylingConstants.zIndices.personNodeSettingsFlyoutZIndex}
>
	<div id="node-actions-modal-content" class="node-actions-modal-content" slot="modal-content-slot">
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
		<ModalActionsBar>
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
				isEnabled={nameInputValue?.length > 0 && nameInputValue !== defaultName}
				overrideBackgroundColor={stylingConstants.colors.buttonColorDone}
				onClickFunction={onDoneButtonClick}
			/>
		</ModalActionsBar>
	</div>
</Modal>

<style>
	.node-actions-modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1vh;
	}
</style>
