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
	import { checkPersonForUnsavedChanges } from '../../../../logic/temp-management';

	import uiState from '../../../../stores/ui-state';

	let allowEdit = true;
	let imageUrl;
	let file;
	let bioPhotoContent;

	async function handleFileUpload(event) {
		file = event.target.files[0];
		const reader = new FileReader();
		let url = undefined;
		reader.onloadend = async function () {
			// @ts-expect-error
			const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
			url = await uploadFileToRepo(
				repoOwner,
				dataRepoName,
				'8890',
				$uiState.activePerson.id + '/' + bioPhotoFileName + '.jpg',
				base64String,
				'Upload image test'
			);

			console.log('URL: ' + url);

			// Call setPersonBioPhotoUrl after the async function is done
			setPersonBioPhotoUrl(url);
			checkPersonForUnsavedChanges($uiState.activePerson.id);
		};
		reader.readAsDataURL(file);
	}

	onMount(async () => {
		try {
			bioPhotoContent = await readFileFromRepo(
				repoOwner,
				dataRepoName,
				'8890',
				$uiState.activePerson.id + '/' + bioPhotoFileName + '.jpg'
			);
		} catch (error) {
			console.error('Error reading file:', error);
		}
	});
</script>

<div id="bio-photo-container" class="bio-photo-container">
	<div id="avatar-container" class="avatar-container">
		<img
			src={bioPhotoContent === undefined
				? './img/avatar-placeholder.jpg'
				: 'data:image/jpeg;base64,' + btoa(bioPhotoContent)}
			id="avatar-image"
			class="avatar-image"
			alt="avatar of this person"
		/>
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
