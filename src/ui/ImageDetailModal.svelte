<script>
	import uiState from '../stores/ui-state';
	import tempState from '../stores/temp-state';

	import {
		repoOwner,
		dataRepoName,
		tempPw,
		timelineEventImageFolderName
	} from '../logic/persistence-management';

	import {
		checkActivePersonForUnsavedChanges,
		unsetImageEditContent,
		unsetImageEditId
	} from '../logic/temp-management';

	import {
		setTimelineEventImageUrlFromTempState
	} from '../logic/person-management';

	import stylingConstants from './styling-constants';
	import { isUrlValid } from '../logic/utils';

	import Button from './Button.svelte';
	import ImageAsyncFromUrl from './ImageAsyncFromUrl.svelte';
	import InputContainer from './InputContainer.svelte';
	import Modal from './Modals/Modal.svelte';
	import ModalActionsBar from './Modals/ModalActionsBar.svelte';
	import TextArea from './TextArea.svelte';
	import TextInput from './TextInput.svelte';

	// all possible input values
	let imageTitleInputValue;
	let imageDescriptionInputValue;

	let isInEditMode;
	let imageUploadPathNoExt; // folder path (no file name)
	let isNewImage; // if true, this image is not already found in this timeline event
	let isValidUrl; // if true, this image has a valid GitHub URL

	const imagePlaceholderSrc = './img/image-placeholder.jpg';
	const onClickEditButton = () => {
		isInEditMode = true;
	};

	// cancel, but when used for editing an existing image
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		// TODO: match the store
		unsetImageEditId();
		unsetImageEditContent();
	};
	// cancel, but when used for creating a new image
	const onClickCancelNewImageButton = () => {
		unsetImageEditId();
		unsetImageEditContent();
	};

	const onClickDoneButton = () => {
		//addOrReplaceTimelineEventImage();
		checkActivePersonForUnsavedChanges();
		unsetImageEditId();
		unsetImageEditContent();
	};

	const onClickDeleteButton = () => {
		// TODO: implement delete
		checkActivePersonForUnsavedChanges();
		unsetImageEditId();
		unsetImageEditContent();
	};

	const onClickCloseButton = () => {
		unsetImageEditId();
		unsetImageEditContent();
	};

	const afterUploadFunction = () => {
		setTimelineEventImageUrlFromTempState();
	};

	$: {
		isInEditMode = $tempState?.imageEditContent;
		imageUploadPathNoExt = `${$uiState.activePerson.id}/${timelineEventImageFolderName}/${$tempState.timelineEditEventId}/${$tempState.imageEditId}`;
		isValidUrl = isUrlValid($tempState?.imageEditContent?.url);
		console.log(isValidUrl);
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
				<ImageAsyncFromUrl
					{repoOwner}
					repoName={dataRepoName}
					password={tempPw}
					imageUrl={$tempState.imageEditContent.url}
					{imageUploadPathNoExt}
					{imagePlaceholderSrc}
					allowEdit={isInEditMode}
					{afterUploadFunction}
				/>
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
