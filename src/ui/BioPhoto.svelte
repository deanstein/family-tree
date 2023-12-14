<script>
	import {
		dataRepoName,
		repoOwner,
		bioPhotoFileName,
		tempPw
	} from '../logic/persistence-management';
	import {
		deleteBioPhotoReference,
		getPersonById,
		setBioPhotoUrlFromTempState
	} from '../logic/person-management';
	import { getExtensionFromUrl } from '../logic/utils';

	import ImageAsyncFromUrl from './ImageAsyncFromUrl.svelte';

	export let personId;
	export let allowEdit;

	let person;
	let bioPhotoPathNoExt;

	const bioPhotoPlaceholderSrc = './img/avatar-placeholder.jpg';
	const afterUploadFunction = () => {
		setBioPhotoUrlFromTempState();
	};

	const afterDeleteFunction = () => {
		deleteBioPhotoReference();
	};

	$: {
		person = getPersonById(personId);
		bioPhotoPathNoExt = `${personId}/${bioPhotoFileName}`;
	}
</script>

<div id="bio-photo-container" class="bio-photo-container">
	<ImageAsyncFromUrl
		{repoOwner}
		repoName={dataRepoName}
		password={tempPw}
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
