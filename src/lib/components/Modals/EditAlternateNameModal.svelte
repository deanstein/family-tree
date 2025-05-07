<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import alternateName from '$lib/schemas/alternate-name';
	import alternateNameTypes from '$lib/schemas/alternate-name-types';
	
	import { bioEditAltName, bioEditId } from '$lib/states/temp-state';
	import tempState from '$lib/stores/temp-state';

	import {
		addOrEditAlternateNameInTempState,
		initializeAltNamesTempState,
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

	let isEnabled = undefined;
	let nameInputValue = get(bioEditAltName).name;
	let nameInputValueOriginal = undefined;
	let typeInputValue = get(bioEditAltName).type;
	let typeInputValueOriginal = undefined;
	let contextInputValue = get(bioEditAltName).context;
	let contextInputValueOriginal = undefined;

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
		bioEditAltName.set(undefined);
	};

	const onCancelButtonAction = () => {
		bioEditAltName.set(undefined);
	};

	const onDeleteButtonAction = () => {
		removeAlternateNameFromTempState(nameInputValue);
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
		initializeAltNamesTempState();
		nameInputValueOriginal = nameInputValue;
		typeInputValueOriginal = typeInputValue;
		contextInputValueOriginal = contextInputValue;
	});
</script>

<Modal
	showModal={$bioEditAltName}
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
					isEnabled={nameInputValue.length > 0}
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
