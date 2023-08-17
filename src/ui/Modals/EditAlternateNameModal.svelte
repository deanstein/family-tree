<script>
	import { onMount } from 'svelte';

	import alternateName from '../../schemas/alternate-name';
	import alternateNameTypes from '../../schemas/alternate-name-types';
	import tempState from '../../stores/temp-state';

	import stylingConstants from '../styling-constants';

	import Button from '../Button.svelte';
	import FieldContainer from '../FieldContainer.svelte';
	import Select from '../Select.svelte';
	import TextInput from '../TextInput.svelte';

	import {
		addOrEditAlternateNameInTempState,
		initializeAltNamesTempState,
		removeAlternateNameFromTempState,
		unsetEditAltName
	} from '../../logic/temp-management';
	import { instantiateObject } from '../../logic/utils';
	import TextArea from '../TextArea.svelte';
	import Modal from './Modal.svelte';
	import ModalActionsBar from './ModalActionsBar.svelte';

	let isEnabled = undefined;
	let nameInputValue = $tempState.bioEditAltName.name;
	let nameInputValueOriginal = undefined;
	let typeInputValue = $tempState.bioEditAltName.type;
	let typeInputValueOriginal = undefined;
	let contextInputValue = $tempState.bioEditAltName.context;
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
		unsetEditAltName();
	};

	const onCancelButtonAction = () => {
		unsetEditAltName();
	};

	const onDeleteButtonAction = () => {
		removeAlternateNameFromTempState(nameInputValue);
		unsetEditAltName();
	};

	const alternateNameTypeOptions = {
		label: 'Name Type:',
		alternateNameTypes
	};

	$: {
		isEnabled = $tempState.bioEditPersonId !== undefined;
	}

	onMount(() => {
		initializeAltNamesTempState();
		nameInputValueOriginal = nameInputValue;
		typeInputValueOriginal = typeInputValue;
		contextInputValueOriginal = contextInputValue;
	});
</script>

<Modal
	showModal={$tempState.bioEditAltName}
	title={isEnabled ? 'Set alternate name:' : 'Alternate name details:'}
	width={stylingConstants.sizes.modalFormWidth}
	subtitle={null}
	transparency={stylingConstants.colors.formBackgroundLegibleTransparency}
	zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
>
	<div
		id="edit-alt-name-modal-content"
		class="edit-alt-name-modal-content"
		slot="modal-content-slot"
	>
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
		<FieldContainer label="Context (optional)">
			<TextArea {isEnabled} bind:inputValue={contextInputValue} />
		</FieldContainer>
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
	</div></Modal
>

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
