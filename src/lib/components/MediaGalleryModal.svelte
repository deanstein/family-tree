<script>
	import {
		repoOwner,
		dataRepoName,
		tempPw,
		imagePlaceholderSrc
	} from '$lib/persistence-management';
	import tempState from '$lib/stores/temp-state';

	import stylingConstants from '$lib/components/styling-constants';

	import Modal from '$lib/components/Modals/Modal.svelte';
	import ImageThumbnailGroup from '$lib/components/ImageThumbnailGroup.svelte';
	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';
	import { setImageEditContent, setImageEditId, unsetMediaGalleryActiveContent, unsetMediaGalleryActiveId } from '$lib/temp-management';
	import Button from './Button.svelte';

	const onClickEditButton = () => {
		setImageEditId($tempState.mediaGalleryActiveId);
		setImageEditContent($tempState.mediaGalleryActiveContent);
		unsetMediaGalleryActiveId();
		unsetMediaGalleryActiveContent();
	}

	const onClickCloseButton = () => {
		unsetMediaGalleryActiveId();
		unsetMediaGalleryActiveContent();
	};
</script>

<div class="media-gallery-container">
	<Modal
		showModal={$tempState.mediaGalleryActiveId}
		showCloseButton={true}
		{onClickCloseButton}
		width={stylingConstants.sizes.modalFullScreenWidth}
		height={stylingConstants.sizes.modalFullScreenHeight}
		title={'Gallery'}
		subtitle={null}
		zIndex={stylingConstants.zIndices.mediaGalleryZIndex}
	>
		<div class="media-gallery-content" slot="modal-content-slot">
			<div class="image-actions-bar">
				<Button buttonText={"Edit Image"} onClickFunction={onClickEditButton}/>
			</div>
			<div class="image-container">
				<ImageAsyncFromUrl
					{repoOwner}
					repoName={dataRepoName}
					password={tempPw}
					imageUrl={$tempState?.mediaGalleryActiveContent?.url}
					{imagePlaceholderSrc}
					allowEdit={false}
					imageFit="contain"
				/>
			</div>
			<div class="media-gallery-thumbnail-container">
				<ImageThumbnailGroup
					showGroupTitle={false}
					showAddButton={false}
					imageArray={$tempState.mediaGalleryActiveContentArray}
				/>
			</div>
		</div>
	</Modal>
</div>

<style>
	.media-gallery-content {
		display: flex;
		flex-direction: column;
		width: -webkit-fill-available;
		width: -moz-available;
		height: -webkit-fill-available;
		height: -moz-available;
	}

	.image-actions-bar {
		position: absolute;
		width: -webkit-fill-available;
		padding: 0px 10px 0px 10px;
		display: flex;
		align-items: center;
		justify-content: right;
		z-index: 1;
	}

	.image-container {
		flex-shrink: 1;
		min-height: 0;
	}

	.media-gallery-thumbnail-container {
		padding: 10px;
		margin-top: 10px;
		background-color: white;
	}
</style>
