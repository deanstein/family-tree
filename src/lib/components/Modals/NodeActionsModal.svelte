<script>
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { defaultName } from '$lib/schemas/person';
	import contexts from '$lib/schemas/contexts';

	import { activePerson } from '$lib/states/family-tree-state';
	import { nodeEditId, nodeEditName, nodeEditRelationshipId } from '$lib/states/temp-state';
	import { cachedPersonForUnsavedChanges, doShowPersonDetailView } from '$lib/states/ui-state';

	import {
		getPersonById,
		setPersonName,
		setPersonRelationship,
		removePersonFromPeopleArray,
		setActivePerson
	} from '$lib/person-management';
	import { removePersonFromActivePersonGroup } from '$lib/ui-management.js';
	import { checkPersonForUnsavedChanges, hidePersonNodeActionsModal } from '$lib/temp-management';

	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import ModalActionsBar from '$lib/components/Modals/ModalActionsBar.svelte';
	import PersonNodeForEdit from '$lib/components/NodeView/PersonNode/PersonNodeForEdit.svelte';

	export let personId;
	export let relationshipId;
	export let isNewPerson = false;

	let nameInputValue = get(nodeEditName);
	let nameInputValueOriginal = undefined;
	let relationshipInputValue = get(nodeEditRelationshipId);
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
		doShowPersonDetailView.set(true);
	};

	onMount(() => {
		captureAllOriginalInputValues();
		cachedPersonForUnsavedChanges.set(getPersonById(personId));
	});

	onDestroy(() => {
		cachedPersonForUnsavedChanges.set(undefined);
	});

	$: {
		if ($nodeEditName === 'Firstname Lastname') {
			isNewPerson = true;
		} else {
			isNewPerson = false;
		}
	}
</script>

<Modal
	showModal={$nodeEditId === personId}
	title={isNewPerson ? 'Add Relationship ' : 'Edit Relationship '}
	subtitle={'to ' + $activePerson.name}
	transparency={stylingConstants.colors.formBackgroundLegibleTransparency}
	zIndex={stylingConstants.zIndices.personNodeSettingsFlyoutZIndex}
>
	<div class="node-actions-modal-content" slot="modal-content-slot">
		<div class="node-actions-node-view">
			<PersonNodeForEdit
				bind:nameInputValue
				bind:relationshipInputValue
				nodeSize="15vh"
				context={contexts.nodeActionsModal}
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
