<script>
	import { repoOwner, dataRepoName, imagePlaceholderSrc } from '$lib/persistence-management';
	import { checkActivePersonForUnsavedChanges } from '$lib/temp-management';
	import { isUrlValid } from '$lib/utils';

	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';
	import InputContainer from '$lib/components/InputContainer.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import ModalActionsBar from '$lib/components/Modals/ModalActionsBar.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import { imageEditContent, imageEditId } from '$lib/states/temp-state';

	export let imageUploadPathNoExt;
	export let afterUploadFunction;
	export let afterDeleteFunction;

	// all possible input values
	let imageDescriptionInputValue;

	let isInEditMode;
	let isValidUrl; // if true, this image has a valid GitHub URL

	const onClickEditButton = () => {
		isInEditMode = true;
	};

	// cancel, but when used for editing an existing image
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		// TODO: match the store
		imageEditId.set(undefined);
		imageEditContent.set(undefined);
	};
	// cancel, but when used for creating a new image
	const onClickCancelNewImageButton = () => {
		imageEditId.set(undefined);
		imageEditContent.set(undefined);
	};

	const onClickDoneButton = () => {
		checkActivePersonForUnsavedChanges();
		imageEditId.set(undefined);
		imageEditContent.set(undefined);
	};

	const onClickCloseButton = () => {
		imageEditId.set(undefined);
		imageEditContent.set(undefined);
	};

	$: {
		isInEditMode = $imageEditContent;
		isValidUrl = isUrlValid($imageEditContent?.url);
	}
</script>

<Modal
	showModal={$imageEditId}
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
					imageUrl={$imageEditContent.url}
					{imageUploadPathNoExt}
					{imagePlaceholderSrc}
					allowEdit={isInEditMode}
					{afterUploadFunction}
					{afterDeleteFunction}
				/>
			</div>
		</InputContainer>
		<InputContainer label="Description">
			<TextArea isEnabled={isInEditMode} bind:inputValue={imageDescriptionInputValue} />
		</InputContainer>
	</div>
	<div slot="modal-toolbar-slot">
		<ModalActionsBar>
			{#if $imageEditId === undefined}
				<Button
					buttonText={'Edit'}
					onClickFunction={onClickEditButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button buttonText={'Close'} onClickFunction={onClickCloseButton} />
			{:else}
				<Button
					buttonText={'Cancel'}
					onClickFunction={isUrlValid ? onClickCancelEditButton : onClickCancelNewImageButton}
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
