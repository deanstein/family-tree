<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import alternateName from '../../../schemas/alternate-name';
	import alternateNameTypes from '../../../schemas/alternate-name-types';
	import tempState from '../../../stores/temp-state';

	import stylingConstants from '../../styling-constants';

	import Button from '../../Button.svelte';
	import FieldContainer from '../../FieldContainer.svelte';
	import Overlay from '../../NodeView/Overlay.svelte';
	import Select from '../../Select.svelte';
	import TextInput from '../../TextInput.svelte';

	import {
		addOrEditAlternateNameInTempState,
		initializeAltNamesTempState,
		removeAlternateNameFromTempState,
		unsetEditAltName
	} from '../../../logic/temp-management';
	import { instantiateObject } from '../../../logic/utils';
	import TextArea from '../../TextArea.svelte';

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

	let addAlternateNameModalDynamicClass = css`
		z-index: ${stylingConstants.zIndices.addEditAltNameZIndex};
	`;

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

<div
	id="edit-alternate-name-modal-container"
	class="{addAlternateNameModalDynamicClass} edit-alternate-name-modal-container"
>
	<div id="edit-alternate-name-modal-content" class="edit-alternate-name-modal-content">
		<div id="edit-alternate-name-modal-title" class="edit-alternate-name-modal-title">
			{isEnabled ? 'Set alternate name:' : 'Alternate name details:'}
		</div>
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
		<div id="edit-alternate-name-button-container" class="edit-alternate-name-button-container">
			<!-- show a delete button if the original value is not empty (editing existing name) -->
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
		</div>
	</div>
	<Overlay zIndexOverride={-1} />
</div>

<style>
	.edit-alternate-name-modal-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.edit-alternate-name-modal-content {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		padding: 1vw;
		background-color: lightGray;
	}

	.edit-alternate-name-modal-title {
		font-size: 2vh;
	}

	.edit-alternate-name-button-container {
		display: flex;
		justify-content: right;
		gap: 0.5vw;
	}
</style>
