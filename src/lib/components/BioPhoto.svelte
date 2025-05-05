<script>
	import {
		repoOwner,
		dataRepoName,
		bioPhotoPlaceholderSrc,
		getBioPhotoPathNoExt
	} from '$lib/persistence-management';
	import {
		deleteBioPhotoReference,
		getPersonById,
		setBioPhotoUrlFromTempState
	} from '$lib/person-management';

	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';

	export let personId;
	export let allowEdit;

	let person;
	let bioPhotoPathNoExt;

	const afterUploadFunction = () => {
		setBioPhotoUrlFromTempState();
	};

	const afterDeleteFunction = () => {
		deleteBioPhotoReference();
	};

	$: {
		person = getPersonById(personId);
		bioPhotoPathNoExt = getBioPhotoPathNoExt();
	}
</script>

<div class="bio-photo-container">
	<ImageAsyncFromUrl
		{repoOwner}
		repoName={dataRepoName}
		imageUrl={person?.bioPhotoUrl}
		imageUploadPathNoExt={bioPhotoPathNoExt}
		imagePlaceholderSrc={bioPhotoPlaceholderSrc}
		{allowEdit}
		{afterUploadFunction}
		{afterDeleteFunction}
	/>
</div>

<style>
	.bio-photo-container {
		position: relative;
		display: flex;
		flex-direction: column;
		display: flex;
		height: 100%;
		overflow: hidden;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: lightgray;
	}
</style>
