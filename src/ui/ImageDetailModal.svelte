<script>
	import { css } from '@emotion/css';

	import uiState from '../stores/ui-state';
	import tempState from '../stores/temp-state';

	import {
		checkPersonForUnsavedChanges,
		setImageEditId,
		unsetImageEditContent,
		unsetImageEditId
	} from '../logic/temp-management';

	import { addOrReplaceTimelineEventImage } from '../logic/person-management';
	import { writeUIStateValueAtPath } from '../logic/ui-management';
	import { getObjectByKeyValue, instantiateObject } from '../logic/utils';

	import stylingConstants from './styling-constants';

	import AddButtonSquare from './AddButtonSquare.svelte';
	import Button from './Button.svelte';
	import InputContainer from './InputContainer.svelte';
	import Modal from './Modals/Modal.svelte';
	import ModalActionsBar from './Modals/ModalActionsBar.svelte';
	import TextArea from './TextArea.svelte';
	import TextInput from './TextInput.svelte';

	let isInEditMode;

	// all possible input values
	let imageTitleInputValue;
	let imageDescriptionInputValue;

	let isNewImage; // if true, this image is not already found in this timeline event
	let isValidUrl; // if true, this image has a valid GitHub URL

	const onClickEditButton = () => {
		setImageEditId('some id');
	};

	// cancel, but when used for editing an existing image
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		unsetImageEditId();
		unsetImageEditContent();
	};
	// cancel, but when used for creating a new image
	const onClickCancelNewImageButton = () => {
		unsetImageEditId();
		unsetImageEditContent();
	};

	const onClickDoneButton = () => {
		addOrReplaceTimelineEventImage();
		checkPersonForUnsavedChanges($uiState.activePerson.id);
		unsetImageEditId();
		unsetImageEditContent();
	};

	const onClickDeleteButton = () => {
		// TODO: implement delete
		checkPersonForUnsavedChanges($uiState.activePerson.id);
		unsetImageEditId();
		unsetImageEditContent();
	};

	const onClickCloseButton = () => {
		unsetImageEditId();
		unsetImageEditContent();
	};

	$: {
		isInEditMode = $tempState.imageEditContent;
		isValidUrl = $tempState?.imageEditContent?.url;
	}
</script>

<Modal
	showModal={$tempState.imageEditId}
	title="Image details"
	height={stylingConstants.sizes.modalFormHeight}
	width={stylingConstants.sizes.modalFormWidth}
	subtitle={null}
	transparency="255"
	zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
>
	<div class="image-modal-content" slot="modal-content-slot">
		<InputContainer label="Image">
			<div class="image-container">
				<AddButtonSquare />
			</div>
		</InputContainer>
		<InputContainer label="Title">
			<TextInput isEnabled={isInEditMode} bind:inputValue={imageTitleInputValue} />
		</InputContainer>
		<InputContainer label="Description">
			<TextArea isEnabled={isInEditMode} bind:inputValue={imageDescriptionInputValue} />
		</InputContainer>
	</div>
	<div slot="modal-toolbar-slot">
		<ModalActionsBar>
			{#if $tempState.timelineEditEventId === undefined}
				<Button
					buttonText={'Edit'}
					onClickFunction={onClickEditButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button buttonText={'Close'} onClickFunction={onClickCloseButton} />
			{:else}
				{#if !isNewImage}
					<Button
						buttonText="Delete"
						onClickFunction={onClickDeleteButton}
						overrideColor={stylingConstants.colors.buttonColorDelete}
						overrideBackgroundColor="transparent"
						overrideBackgroundColorHover="{stylingConstants.colors.buttonColorDelete};"
					/>
				{/if}
				<Button
					buttonText={'Cancel'}
					onClickFunction={isNewImage ? onClickCancelNewImageButton : onClickCancelEditButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button
					buttonText="Done"
					isEnabled={isValidUrl}
					onClickFunction={onClickDoneButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorDone}
				/>
			{/if}
		</ModalActionsBar>
	</div>
</Modal>

<style>
	.image-modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1vh;
	}

	.image-container {
		background-color: white;
		display: flex;
		padding: 10px;
		align-items: center;
		justify-content: center;
	}
</style>
