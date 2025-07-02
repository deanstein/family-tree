<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { hasUnsavedChanges } from '$lib/states/family-tree-state';
	import { imageEditContent, isNewImage } from '$lib/states/temp-state';

	import { repoOwner, dataRepoName, imagePlaceholderSrc } from '$lib/persistence-management';
	import { areObjectsEqual, instantiateObject, isUrlValid } from '$lib/utils';

	import Button from '$lib/components/Button.svelte';
	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';
	import InputContainer from '$lib/components/InputContainer.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import ModalActionsBar from '$lib/components/Modals/ModalActionsBar.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import stylingConstants from '$lib/components/styling-constants';
	import { showMediaGalleryModal, showTimelineEventImageDetailModal } from '$lib/states/ui-state';

	export let imageUploadPathNoExt;
	export let afterUploadFunction;
	export let afterDeleteFunction;

	// all possible input values
	let imageDescriptionInputValue;

	let isInEditMode = false;
	let isValidUrl; // if true, this image has a valid GitHub URL

	let cachedImageEditContent; // for comparison and setting unsaved changes flag

	onMount(() => {
		// insantiateObject required here to avoid shared reference
		cachedImageEditContent = instantiateObject(get(imageEditContent));
		imageDescriptionInputValue = cachedImageEditContent.description;
		// if this is a new event, set edit mode to true
		if (get(isNewImage)) {
			isInEditMode = true;
		}
	});

	const onClickEditButton = () => {
		isInEditMode = true;
		showMediaGalleryModal.set(false);
	};

	// cancel, but when used for editing an existing image
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		imageDescriptionInputValue = get(imageEditContent).description;
		isInEditMode = false;
	};
	// cancel, but when used for creating a new image
	const onClickCancelNewImageButton = () => {
		showTimelineEventImageDetailModal.set(false);
		isInEditMode = false;
	};

	const onClickDoneButton = () => {
		imageEditContent.update((currentValue) => {
			currentValue.description = imageDescriptionInputValue;
			return currentValue;
		});
		// set unsaved changes flag if image edit content has changed
		if (!areObjectsEqual(cachedImageEditContent, get(imageEditContent))) {
			hasUnsavedChanges.set(true);
		}
		isInEditMode = false;
	};

	const onClickCloseButton = () => {
		showTimelineEventImageDetailModal.set(false);
		imageEditContent.set(undefined);
	};

	$: {
		isValidUrl = isUrlValid($imageEditContent?.url);
	}
</script>

<Modal
	showModal={$showTimelineEventImageDetailModal}
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
			{#if !isInEditMode}
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
