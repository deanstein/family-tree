<script>
	import { get } from 'svelte/store';

	import { imageEditContent } from '$lib/states/temp-state';

	import { getTimelineEventPhotoPathNoExt } from '$lib/persistence-management';
	import {
		deleteTimelineEventImageReference,
		setTimelineEventImageUrlFromTempState
	} from '$lib/person-management';

	import ImageDetailModal from '$lib/components/ImageDetailModal.svelte';

	let imageUploadPathNoExt; // folder path (no file name)

	// after upload function depends on what kind of image
	const afterUploadFunction = () => {
		// timeline event image
		setTimelineEventImageUrlFromTempState();
	};
	// after delete function depends on what kind of image
	const afterDeleteFunction = () => {
		// timeline event image
		deleteTimelineEventImageReference(get(imageEditContent).eventId, get(imageEditContent).id);
	};

	$: {
		// keep the upload path updated, based on the event and image id
		if ($imageEditContent) {
			imageUploadPathNoExt = getTimelineEventPhotoPathNoExt(
				$imageEditContent?.eventId,
				$imageEditContent.id
			);
		}
	}
</script>

<ImageDetailModal {imageUploadPathNoExt} {afterUploadFunction} {afterDeleteFunction} />
