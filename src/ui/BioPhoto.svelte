<script>
	import {
		dataRepoName,
		repoOwner,
		bioPhotoFileName,
		tempPw
	} from '../logic/persistence-management';
	import { getPersonById, setBioPhotoUrlFromTempState } from '../logic/person-management';
	import { getExtensionFromUrl } from '../logic/utils';

	import ImageAsyncFromUrl from './ImageAsyncFromUrl.svelte';

	export let personId;
	export let allowEdit;

	let person;
	let bioPhotoFilePath;

	const bioPhotoPlaceholderSrc = './img/avatar-placeholder.jpg';
	const afterUploadFunction = () => {
		setBioPhotoUrlFromTempState();
	};

	$: {
		person = getPersonById(personId);
		bioPhotoFilePath = `${personId}/${bioPhotoFileName}${getExtensionFromUrl(person?.bioPhotoUrl)}`;
	}
</script>

<div id="bio-photo-container" class="bio-photo-container">
	<ImageAsyncFromUrl
		{repoOwner}
		repoName={dataRepoName}
		password={tempPw}
		imageUrl={person?.bioPhotoUrl}
		imageUploadPathNoExt={bioPhotoFilePath}
		imagePlaceholderSrc={bioPhotoPlaceholderSrc}
		{allowEdit}
		{afterUploadFunction}
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
