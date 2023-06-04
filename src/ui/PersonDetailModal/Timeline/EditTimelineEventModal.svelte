<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import alternateNameTypes from '../../../schemas/alternate-name-types';

	import stylingConstants from '../../styling-constants';

	import Button from '../../Button.svelte';
	import DatePicker from '../Bio/DatePicker.svelte';
	import FieldContainer from '../../FieldContainer.svelte';
	import Overlay from '../../NodeView/Overlay.svelte';
	import Select from '../../Select.svelte';
	import TextArea from '../../TextArea.svelte';

	import { instantiateObject } from '../../../logic/utils';
	import { hideTimelineEventEditModal } from '../../../logic/temp-management';

	let nameInputValue = undefined;
	let nameInputValueOriginal = undefined;
	let typeInputValue = undefined;
	let typeInputValueOriginal = undefined;
	let contextInputValue = undefined;
	let contextInputValueOriginal = undefined;

	const focusNameInput = (element) => {
		element.focus();
	};

	const onDoneButtonAction = () => {
		hideTimelineEventEditModal();
	};

	const onCancelButtonAction = () => {
		hideTimelineEventEditModal();
	};

	const alternateNameTypeOptions = {
		label: 'Name Type:',
		alternateNameTypes
	};

	let addAlternateNameModalDynamicClass = css`
		z-index: ${stylingConstants.zIndices.addEditAltNameZIndex};
	`;

	onMount(() => {
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
			{'Event details'}
		</div>
		<FieldContainer label="Event Date">
			<DatePicker bind:inputValue={nameInputValue} />
		</FieldContainer>
		<FieldContainer label="Event Type">
			<Select
				bind:inputValue={typeInputValue}
				optionsGroupObject={alternateNameTypeOptions}
				optionValueKey="id"
			/>
		</FieldContainer>
		<FieldContainer label="Event Content">
			<TextArea bind:inputValue={contextInputValue} />
		</FieldContainer>
		<div id="edit-alternate-name-button-container" class="edit-alternate-name-button-container">
			<Button
				buttonText={'Cancel'}
				onClickFunction={onCancelButtonAction}
				overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
			/>
			<Button buttonText="Done" isEnabled={nameInputValue} onClickFunction={onDoneButtonAction} />
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
		width: 10vw;
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
