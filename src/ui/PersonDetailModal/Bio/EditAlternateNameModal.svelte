<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import { alternateName, alternateNameTypes } from '../../../schemas/alternate-name';
	import tempState from '../../../stores/temp-state';

	import stylingConstants from '../../styling-constants';

	import Button from '../../Button.svelte';
	import FieldContainer from './FieldContainer.svelte';
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

	let nameInputValue = $tempState.editAltName.name;
	let nameInputValueOriginal = undefined;
	let typeInputValue = $tempState.editAltName.type;

	const onDoneButtonAction = () => {
		// create a new name from the inputs
		const newOrUpdatedName = instantiateObject(alternateName);
		newOrUpdatedName.name = nameInputValue;
		newOrUpdatedName.type = typeInputValue;
		addOrEditAlternateNameInTempState(newOrUpdatedName);
		// this could have been an editing session where the name was changed
		// if so, attempt to find the original and delete it
		if (nameInputValue !== nameInputValueOriginal) {
			console.log(nameInputValue, nameInputValueOriginal);
			removeAlternateNameFromTempState(nameInputValueOriginal);
		}
		unsetEditAltName();
	};

	const onCancelButtonAction = () => {
		unsetEditAltName();
	};

	const alternateNameTypeOptions = {
		label: 'Name Type:',
		alternateNameTypes
	};

	let addAlternateNameModalDynamicClass = css`
		z-index: ${stylingConstants.zIndices.addEditAltNameZIndex};
	`;

	onMount(() => {
		initializeAltNamesTempState();
		nameInputValueOriginal = nameInputValue;
	});
</script>

<div
	id="add-alternate-name-modal-container"
	class="{addAlternateNameModalDynamicClass} add-alternate-name-modal-container"
>
	<div id="add-alternate-name-modal-content" class="add-alternate-name-modal-content">
		<div id="add-alternate-name-modal-title" class="add-alternate-name-modal-title">
			Add an alternate name:
		</div>
		<FieldContainer label="Name">
			<TextInput bind:inputValue={nameInputValue} />
		</FieldContainer>
		<FieldContainer label="Name Type (optional)">
			<Select
				bind:inputValue={typeInputValue}
				optionsGroupObject={alternateNameTypeOptions}
				optionValueKey="id"
			/>
		</FieldContainer>
		<div id="add-alternate-name-button-container" class="add-alernate-name-button-container">
			<Button
				buttonText="Done"
				isEnabled={nameInputValue.length > 0}
				onClickFunction={onDoneButtonAction}
			/>
			<Button
				buttonText="Cancel"
				onClickFunction={onCancelButtonAction}
				overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
			/>
		</div>
	</div>
	<Overlay zIndexOverride={-1} />
</div>

<style>
	.add-alternate-name-modal-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.add-alternate-name-modal-content {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		padding: 1vw;
		width: 10vw;
		background-color: lightGray;
	}

	.add-alternate-name-modal-title {
		font-size: 2vh;
	}

	.add-alternate-name-button-container {
		display: flex;
		gap: 1vw;
	}
</style>
