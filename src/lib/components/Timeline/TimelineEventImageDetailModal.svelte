<script>
	import tempState from '$lib/stores/temp-state';

	import { getTimelineEventPhotoPathNoExt } from '$lib/persistence-management';
	import {
		deleteTimelineEventImageReference,
		setTimelineEventImageUrlFromTempState
	} from '$lib/person-management';
	import { getObjectByKeyValueInArray } from '$lib/utils';

	import ImageDetailModal from '$lib/components/ImageDetailModal.svelte';

	let imageUploadPathNoExt; // folder path (no file name)
	let isNewImage;

	// after upload function depends on what kind of image
	const afterUploadFunction = () => {
		setTimelineEventImageUrlFromTempState();
	};
	// after delete function depends on what kind of image
	const afterDeleteFunction = () => {
		deleteTimelineEventImageReference($tempState.timelineEditEventId, $tempState.imageEditId);
	};

	$: {
		// if this image id is not found in the active person's timeline events, it's a new image
		isNewImage = !getObjectByKeyValueInArray(
			$tempState?.timelineEditEvent?.eventContent?.images,
			'id',
			$tempState.imageEditId
		);
		// keep the upload path updated, based on the event and image id
		imageUploadPathNoExt = getTimelineEventPhotoPathNoExt(
			$tempState?.imageEditContent?.eventId,
			$tempState?.imageEditId
		);
	}
</script>

<ImageDetailModal {imageUploadPathNoExt} {isNewImage} {afterUploadFunction} {afterDeleteFunction} />
