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
		height={stylingConstants.sizes.modalFullScreenWidth}
		width={stylingConstants.sizes.modalFullScreenWidth}
		subtitle={null}
		transparency="200"
		zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
	>
		<div class="media-gallery-content">
			<ImageAsyncFromUrl
				{repoOwner}
				repoName={dataRepoName}
				password={tempPw}
				imageUrl={$tempState?.imageEditContent?.url}
				{imagePlaceholderSrc}
				allowEdit={false}
			/>
			<MediaGroupHorizontal />
		</div>
	</Modal>
</div>

<style>
	.media-gallery-content {
		display: flex;
	}
</style>
