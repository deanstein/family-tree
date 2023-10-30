<script>
	import { onMount } from 'svelte';
	import {
		dataRepoName,
		repoOwner,
		uploadFileToRepo,
		bioPhotoFileName,
		readFileFromRepo
	} from '../../../../logic/persistence-management';
	import { getPersonById, setPersonBioPhotoUrl } from '../../../../logic/person-management';

	export let personId;
	export let allowEdit;

	let imageUrl;
	let file;
	let bioPhotoContent;
	let fileReader;

	let person = getPersonById(personId);

	const getAndShowBioPhoto = async () => {
		// only try fetching the photo from the repo
		// if the person has a bioPhotoUrl field
		if (person?.bioPhotoUrl !== '' && person?.bioPhotoUrl !== undefined) {
			try {
				bioPhotoContent = await readFileFromRepo(
					repoOwner,
					dataRepoName,
					'8890',
					person.id + '/' + bioPhotoFileName + '.jpg'
				);
			} catch (error) {}
		}
	};

	const uploadBioPhotoFromFileReader = async () => {
		const base64String = fileReader.result.replace('data:', '').replace(/^.+,/, '');
		try {
			imageUrl = await uploadFileToRepo(
				repoOwner,
				dataRepoName,
				'8890',
				person.id + '/' + bioPhotoFileName + '.jpg',
				base64String,
				'Upload image test'
			);

			setPersonBioPhotoUrl(imageUrl);
			bioPhotoContent = base64String;
			imageUrl = btoa(bioPhotoContent);
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const handleFileUpload = async (event) => {
		file = event.target.files[0];
		fileReader = new FileReader();

		fileReader.onloadend = async function () {
			uploadBioPhotoFromFileReader();
		};

		fileReader.readAsDataURL(file);
	};

	onMount(async () => {
		getAndShowBioPhoto();
	});

	$: {
		imageUrl = bioPhotoContent
			? 'data:image/jpeg;base64,' + btoa(bioPhotoContent)
			: './img/avatar-placeholder.jpg';
	}
</script>

<div id="avatar-container" class="avatar-container">
	<img src={imageUrl} id="avatar-image" class="avatar-image" alt="avatar of this person" />
</div>
<div id="avatar-edit-button-overlay" class="avatar-edit-button-overlay">
	{#if allowEdit}
		<input type="file" on:change={handleFileUpload} />
	{/if}
</div>

<style>
	.avatar-container {
		position: relative;
		display: flex;
		flex-direction: column;
		display: flex;
		height: 100%;
		overflow: hidden;
		justify-content: center;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: lightgray;
	}

	.avatar-image {
		object-fit: cover;
		height: 100%;
	}

	.avatar-edit-button-overlay {
		position: absolute;
		top: 50%;
		display: flex;
		align-items: center;
	}
</style>
