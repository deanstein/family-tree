import { writable } from 'svelte/store';

const tempState = {
	// if set, the edit timeline event modal is displayed
	timelineEditEventId: undefined,
	// if set, the timeline event modal inputs are enabled
	timelineEditEvent: undefined,

	// if set, the media gallery displays this media id
	mediaGalleryActiveId: undefined,
	// if set, the media gallery displays this media content
	mediaGalleryActiveContent: undefined,
	// if set, the media gallery displays these media items in the thumbnail group
	mediaGalleryActiveContentArray: undefined,

	// if set, the image editing modal is displayed
	imageEditId: undefined,
	// if set, the image editing modal inputs are enabled
	imageEditContent: undefined,

	// if set, media was just uploaded and this is the url to it
	uploadedMediaUrl: undefined
};

export default writable(tempState);
