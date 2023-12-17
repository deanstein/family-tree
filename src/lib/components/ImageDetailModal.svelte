<script>
	import tempState from '$lib/stores/temp-state';

	import { repoOwner, dataRepoName, tempPw } from '$lib/persistence-management';
	import {
		checkActivePersonForUnsavedChanges,
		unsetImageEditContent,
		unsetImageEditId
	} from '$lib/temp-management';
	import { isUrlValid } from '$lib/utils';

	
	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';
	import InputContainer from '$lib/components/InputContainer.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import ModalActionsBar from '$lib/components/Modals/ModalActionsBar.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	export let isNewImage;
	export let afterUploadFunction;
	export let afterDeleteFunction;

	// all possible input values
	let imageTitleInputValue;
	let imageDescriptionInputValue;

	let isInEditMode;
	let imageUploadPathNoExt; // folder path (no file name)
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

	$: {
		isInEditMode = $tempState?.imageEditContent;
		isValidUrl = isUrlValid($tempState?.imageEditContent?.url);
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
					{afterDeleteFunction}
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
			{#if $tempState.imageEditId === undefined}
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