<script>
	import { onMount } from 'svelte';

	import {
		dataRepoName,
		repoOwner,
		uploadFileToRepo,
		bioPhotoFileName
	} from '../logic/persistence-management';
	import { getPersonById, setPersonBioPhotoUrl } from '../logic/person-management';
	import { getExtensionFromUrl, getMIMEType as getMIMEType } from '../logic/utils';
	import {
		addImageToCache,
		getImageFromCache,
		removeImageFromCache
	} from '../logic/temp-management';
	import imageCache from '../stores/image-cache';

	export let personId;
	export let allowEdit;

	let file;
	let fileReader;
	let fileExtension;
	let imageUrl;
	let imgSrc;
	let isImageLoading = false;

	let person = getPersonById(personId);

	const getAndShowBioPhoto = async () => {
		// only load the file if the person has a valid bioPhotoUrl field
		const doLoadImage = person?.bioPhotoUrl !== '' && person?.bioPhotoUrl !== undefined;

		// initially set the image to the placeholder
		imgSrc = './img/avatar-placeholder.jpg';

		// only fetch the photo if the person has a bioPhotoUrl field
		if (doLoadImage) {
			try {
				// get the extension and construct a path from the stored URL
				fileExtension = getExtensionFromUrl(person.bioPhotoUrl);
				const filePath = person.id + '/' + bioPhotoFileName + fileExtension;

				// check the cache first
				const imageFromCache = getImageFromCache(filePath);
				if (imageFromCache) {
					imgSrc = imageFromCache;
				} else {
					// use a web worker to fetch the bio photo asynchronously
					const worker = new Worker(new URL('bio-photo-web-worker.js', import.meta.url), {
						type: 'module'
					});
					isImageLoading = true;
					// send a message to the worker with the image URL
					worker.postMessage(filePath);

					// listen for messages from the worker
					worker.onmessage = function (event) {
						// image data is in event.data
						const imgBinary = event.data;

						if (imgBinary) {
							const MIMEType = getMIMEType(imgBinary);
							if (MIMEType) {
								const imgBase64 = btoa(imgBinary);
								imgSrc = MIMEType + ';base64,' + imgBase64;

								// add the image to the cache
								addImageToCache(filePath, imgSrc);
							} else {
								console.error('Unknown MIME type');
							}
						} else {
							console.warn('No valid bio photo data received for ' + person.name) + '.';
						}

						// Terminate the worker
						worker.terminate();

						isImageLoading = false;
					};
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			isImageLoading = false;
		}
	};

	const uploadBioPhotoFromFileReader = async () => {
		const base64String = fileReader.result.replace('data:', '').replace(/^.+,/, '');

		// Get the file extension from the file name
		const fileReaderFileName = file.name;
		const fileExtension = fileReaderFileName.split('.').pop();
		const targetFilePath = `${person.id}/${bioPhotoFileName}.${fileExtension}`;

		try {
			imageUrl = await uploadFileToRepo(
				repoOwner,
				dataRepoName,
				'8890',
				targetFilePath,
				base64String,
				'Upload image'
			);

			// Remove the old image from the cache
			removeImageFromCache(targetFilePath);

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

	imageCache.subscribe(() => {
		getAndShowBioPhoto();
	});
</script>

<div id="avatar-container" class="avatar-container">
	{#if isImageLoading}
		<div id="avatar-loading-overlay" class="avatar-loading-overlay" />
	{/if}
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

	.avatar-loading-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		background-color: rgba(50, 50, 50, 0.5);
		animation: fade 2s infinite;
	}
	@keyframes fade {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.avatar-edit-button-overlay {
		position: absolute;
		top: 50%;
		display: flex;
	}
</style>
