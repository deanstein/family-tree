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
	import { getExtensionFromUrl, getMIMEType as getMIMEType } from '../../../../logic/utils';

	export let personId;
	export let allowEdit;

	let file;
	let fileReader;
	let fileExtension;
	let imageUrl;
	let imgSrc;
	let imgBinary;

	let person = getPersonById(personId);

	const getAndShowBioPhoto = async () => {
		// only load the file if the person has a valid bioPhotoUrl field
		const doLoadFile = person?.bioPhotoUrl !== '' && person?.bioPhotoUrl !== undefined;

		// only fetch the photo if the person has a bioPhotoUrl field
		if (doLoadFile) {
			try {
				// get the extension from the stored URL
				fileExtension = getExtensionFromUrl(person.bioPhotoUrl);

				const filePath = person.id + '/' + bioPhotoFileName + fileExtension;

				// get the raw photo content
				imgBinary = await readFileFromRepo(repoOwner, dataRepoName, '8890', filePath);

				const imgBase64 = btoa(imgBinary);

				const MIMEType = getMIMEType(imgBinary);
				imgSrc = MIMEType + ';base64,' + imgBase64;
			} catch (error) {}
		} else {
			imgSrc = './img/avatar-placeholder.jpg';
		}
	};

	const uploadBioPhotoFromFileReader = async () => {
		const base64String = fileReader.result.replace('data:', '').replace(/^.+,/, '');

		// Get the file extension from the file name
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop();

		try {
			imageUrl = await uploadFileToRepo(
				repoOwner,
				dataRepoName,
				'8890',
				`${person.id}/${bioPhotoFileName}.${fileExtension}`,
				base64String,
				'Upload image test'
			);

			setPersonBioPhotoUrl(imageUrl);
			getAndShowBioPhoto();
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
		getAndShowBioPhoto();
	}
</script>

<div id="avatar-container" class="avatar-container">
	<img src={imgSrc} id="avatar-image" class="avatar-image" alt="avatar of this person" />
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
