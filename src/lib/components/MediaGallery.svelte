<script>
	import {
		repoOwner,
		dataRepoName,
		tempPw,
		imagePlaceholderSrc
	} from '$lib/persistence-management';
	import tempState from '$lib/stores/temp-state';

	import stylingConstants from './styling-constants';

	import Modal from '$lib/components/Modals/Modal.svelte';
	import MediaGroupHorizontal from './MediaGroupHorizontal.svelte';
	import ImageAsyncFromUrl from './ImageAsyncFromUrl.svelte';
</script>

<div class="media-gallery-container">
	<Modal
		showModal={$tempState.imageGalleryId}
		width={stylingConstants.sizes.modalFullScreenWidth}
		height={stylingConstants.sizes.modalFullScreenHeight}
		subtitle={null}
		transparency="200"
		zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
	>
		<div class="media-gallery-content" slot="modal-content-slot">
			<ImageAsyncFromUrl
				{repoOwner}
				repoName={dataRepoName}
				password={tempPw}
				imageUrl={$tempState?.imageEditContent?.url}
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
