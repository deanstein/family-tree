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
	import MediaGroupHorizontal from '$lib/components/MediaGroupHorizontal.svelte';
	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';
	import { unsetMediaGalleryActiveContent, unsetMediaGalleryActiveId } from '$lib/temp-management';

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
			<ImageAsyncFromUrl
				{repoOwner}
				repoName={dataRepoName}
				password={tempPw}
				imageUrl={$tempState?.mediaGalleryActiveContent?.url}
				{imagePlaceholderSrc}
				allowEdit={false}
			/>
			<div class="media-gallery-thumbnail-container">
				<MediaGroupHorizontal />
			</div>
		</div>
	</Modal>
</div>

<style>
	.media-gallery-content {
		display: flex;
		flex-direction: column;
	}

	.media-gallery-thumbnail-container {
		padding: 10px;
		margin-top: 10px;
		background-color: white;
	}
</style>
