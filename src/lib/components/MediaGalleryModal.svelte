<script>
	import { showMediaGalleryModal, mediaGalleryContent } from '$lib/states/ui-state';

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
	{onClickCloseButton}
	width={'90vw'}
	height={'90svh'}
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
