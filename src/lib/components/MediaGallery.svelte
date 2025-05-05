<script>
	import tempState from '$lib/stores/temp-state';

	import { repoOwner, dataRepoName, imagePlaceholderSrc } from '$lib/persistence-management';
	import {
		setImageEditContent,
		setImageEditId,
		unsetMediaGalleryActiveContent,
		unsetMediaGalleryActiveId
	} from '$lib/temp-management';

	import Button from './Button.svelte';
	import ImageThumbnailGroup from '$lib/components/ImageThumbnailGroup.svelte';
	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';

	const onClickEditImageButton = () => {
		setImageEditId($tempState.mediaGalleryActiveId);
		setImageEditContent($tempState.mediaGalleryActiveContent);
		unsetMediaGalleryActiveId();
		unsetMediaGalleryActiveContent();
	};
</script>

<div class="media-gallery-content">
	<div class="image-actions-bar">
		<Button buttonText={'Edit Image'} onClickFunction={onClickEditImageButton} />
	</div>
	<div class="image-container">
		<ImageAsyncFromUrl
			{repoOwner}
			repoName={dataRepoName}
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
