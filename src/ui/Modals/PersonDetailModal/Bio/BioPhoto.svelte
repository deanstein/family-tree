<script>
	import { onMount } from 'svelte';
	import {
		dataRepoName,
		repoOwner,
		uploadFileToRepo,
		bioPhotoFileName,
		readFileFromRepo
	} from '../../../../logic/persistence-management';
	import { setPersonBioPhotoUrl } from '../../../../logic/person-management';

	import uiState from '../../../../stores/ui-state';

	export let allowEdit;

	let imageUrl;
	let file;
	let bioPhotoContent;
	let fileReader;

	const getAndShowBioPhoto = async () => {
		// only try fetching the photo from the repo
		// if the person has a bioPhotoUrl field
		if (
			$uiState.activePerson.bioPhotoUrl !== '' &&
			$uiState.activePerson.bioPhotoUrl !== undefined
		) {
			try {
				bioPhotoContent = await readFileFromRepo(
					repoOwner,
					dataRepoName,
					'8890',
					$uiState.activePerson.id + '/' + bioPhotoFileName + '.jpg'
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
				$uiState.activePerson.id + '/' + bioPhotoFileName + '.jpg',
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

<div id="bio-photo-container" class="bio-photo-container">
	<div id="avatar-container" class="avatar-container">
		<img src={imageUrl} id="avatar-image" class="avatar-image" alt="avatar of this person" />
	</div>
	<div id="avatar-edit-button-overlay" class="avatar-edit-button-overlay">
		{#if allowEdit}
			<input type="file" on:change={handleFileUpload} />
		{/if}
	</div>
</div>

<style>
	.bio-photo-container {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.avatar-container {
		display: flex;
		height: 100%;
		overflow: hidden;
		justify-content: center;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: lightgray;
	}

	.avatar-image {
		height: 100%;
		scale: 1.1; /* temporarily account for placeholder avatar */
	}

	.avatar-edit-button-overlay {
		position: absolute;
		display: flex;
		align-items: center;
		height: -webkit-fill-available;
		height: -moz-available;
	}
</style>
