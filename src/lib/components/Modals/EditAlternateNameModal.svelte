<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import alternateName from '$lib/schemas/alternate-name';
	import alternateNameTypes from '$lib/schemas/alternate-name-types';

	import { bioEditAltName, bioEditId } from '$lib/states/temp-state';
	import { showEditAlternateNameModal } from '$lib/states/ui-state';

	import {
		addOrEditAlternateNameInTempState,
		setTempStateAltNamesFromUIState,
		removeAlternateNameFromTempState
	} from '$lib/temp-management';
	import { instantiateObject } from '$lib/utils';

	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import FieldContainer from '$lib/components/InputContainer.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import ModalActionsBar from '$lib/components/Modals/ModalActionsBar.svelte';
	import Select from '$lib/components//Select.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let isEnabled;
	let nameInputValue;
	let nameInputValueOriginal;
	let typeInputValue;
	let typeInputValueOriginal;
	let contextInputValue;
	let contextInputValueOriginal;

	const focusNameInput = (element) => {
		element.focus();
	};

	const onDoneButtonAction = () => {
		// create a new name from the inputs
		const newOrUpdatedName = instantiateObject(alternateName);
		newOrUpdatedName.name = nameInputValue;
		newOrUpdatedName.type = typeInputValue;
		newOrUpdatedName.context = contextInputValue;
		addOrEditAlternateNameInTempState(newOrUpdatedName);
		// this could have been an editing session where the name was changed
		// if so, attempt to find the original and delete it
		if (nameInputValue !== nameInputValueOriginal) {
			removeAlternateNameFromTempState(nameInputValueOriginal);
		}
		showEditAlternateNameModal.set(false);
		bioEditAltName.set(undefined);
	};

	const onCancelButtonAction = () => {
		showEditAlternateNameModal.set(false);
		bioEditAltName.set(undefined);
	};

	const onDeleteButtonAction = () => {
		removeAlternateNameFromTempState(nameInputValue);
		showEditAlternateNameModal.set(false);
		bioEditAltName.set(undefined);
	};

	const alternateNameTypeOptions = {
		label: 'Name Type:',
		alternateNameTypes
	};

	$: {
		isEnabled = $bioEditId !== undefined;
	}

	onMount(() => {
		nameInputValue = get(bioEditAltName).name;
		typeInputValue = get(bioEditAltName).type;
		contextInputValue = get(bioEditAltName).context;
		console.log('MOUNTED');
		setTempStateAltNamesFromUIState();
		nameInputValueOriginal = nameInputValue;
		typeInputValueOriginal = typeInputValue;
		contextInputValueOriginal = contextInputValue;
	});
</script>

<Modal
	showModal={$showEditAlternateNameModal}
	title={isEnabled ? 'Set Alternate Name' : 'Alternate Name Details'}
	height={stylingConstants.sizes.modalFormHeight}
	width={stylingConstants.sizes.modalFormWidth}
	subtitle={null}
	transparency={stylingConstants.colors.formBackgroundLegibleTransparency}
	zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
>
	<div class="edit-alt-name-modal-content" slot="modal-content-slot">
		<FieldContainer label="Name">
			<TextInput {isEnabled} bind:inputValue={nameInputValue} useFunction={focusNameInput} />
		</FieldContainer>
		<FieldContainer label="Type (optional)">
			<Select
				{isEnabled}
				bind:inputValue={typeInputValue}
				optionsGroupObject={alternateNameTypeOptions}
				optionValueKey="id"
			/>
		</FieldContainer>
		<FieldContainer label="Context (optional)" grow={true}>
			<TextArea {isEnabled} bind:inputValue={contextInputValue} />
		</FieldContainer>
	</div>
	<div slot="modal-toolbar-slot">
		<ModalActionsBar>
			{#if isEnabled && nameInputValueOriginal !== ''}
				<Button
					buttonText="Delete"
					onClickFunction={onDeleteButtonAction}
					overrideColor={stylingConstants.colors.buttonColorDelete}
					overrideBackgroundColor="transparent"
					overrideBackgroundColorHover="{stylingConstants.colors.buttonColorDelete};"
				/>
			{/if}
			<Button
				buttonText={isEnabled ? 'Cancel' : 'Close'}
				onClickFunction={onCancelButtonAction}
				overrideBackgroundColor={isEnabled
					? stylingConstants.colors.buttonColorSecondary
					: stylingConstants.colors.activeColor}
			/>
			{#if isEnabled}
				<Button
					buttonText="Done"
					isEnabled={nameInputValue?.length > 0}
					onClickFunction={onDoneButtonAction}
				/>
			{/if}
		</ModalActionsBar>
	</div>
</Modal>

<style>
	.edit-alt-name-modal-content {
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
