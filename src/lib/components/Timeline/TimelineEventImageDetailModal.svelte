<script>
	import tempState from '$lib/stores/temp-state';

	import { getTimelineEventPhotoPathNoExt } from '$lib/persistence-management';
	import {
		deleteTimelineEventImageReference,
		setTimelineEventImageUrlFromTempState
	} from '$lib/person-management';

	import ImageDetailModal from '$lib/components/ImageDetailModal.svelte';

	let imageUploadPathNoExt; // folder path (no file name)

	// after upload function depends on what kind of image
	const afterUploadFunction = () => {
		setTimelineEventImageUrlFromTempState();
	};
	// after delete function depends on what kind of image
	const afterDeleteFunction = () => {
		deleteTimelineEventImageReference($tempState.imageEditContent.eventId, $tempState.imageEditId);
	};

	$: {
		// keep the upload path updated, based on the event and image id
		imageUploadPathNoExt = getTimelineEventPhotoPathNoExt(
			$tempState?.imageEditContent?.eventId,
			$tempState?.imageEditId
		);
	}
</script>

<ImageDetailModal {imageUploadPathNoExt} {afterUploadFunction} {afterDeleteFunction} />
