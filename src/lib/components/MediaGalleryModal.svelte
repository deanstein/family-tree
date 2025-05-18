<script>
	import { mediaGalleryContent } from '$lib/states/temp-state';
	import { showMediaGalleryModal } from '$lib/states/ui-state';

	import stylingConstants from '$lib/components/styling-constants';

	import MediaGallery from './MediaGallery.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';

	const onClickCloseButton = () => {
		showMediaGalleryModal.set(false);
		mediaGalleryContent.set(undefined);
	};
</script>

<Modal
	showModal={$showMediaGalleryModal}
	showCloseButton={true}
	{onClickCloseButton}
	width={stylingConstants.sizes.modalFullScreenWidth}
	height={stylingConstants.sizes.modalFullScreenHeight}
	title={'Gallery'}
	subtitle={null}
	zIndex={stylingConstants.zIndices.mediaGalleryZIndex}
>
	<div class="media-content-slot" slot="modal-content-slot">
		<MediaGallery />
	</div>
</Modal>

<style>
	.media-content-slot {
		display: flex;
		flex-direction: column;
		width: -webkit-fill-available;
		width: -moz-available;
		height: -webkit-fill-available;
		height: -moz-available;
	}
</style>
