<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import imageCache from '$lib/stores/image-cache';
	import { uploadedMediaUrl } from '$lib/states/temp-state';

	import { deleteFileFromRepoByUrl, uploadFileToRepo } from '$lib/persistence-management';
	import { addImageToCache, getImageFromCache, removeImageFromCache } from '$lib/temp-management';
	import {
		getExtensionFromFileNameOrPath,
		getExtensionFromUrl,
		getMIMEType,
		isUrlValid,
		requireAdminMode
	} from '$lib/utils';

	import { JDGButton } from 'jdg-ui-svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let repoOwner;
	export let repoName;
	export let imageUrl; // the full github url
	export let imagePlaceholderSrc; // used if the url is not valid
	export let allowEdit; // shows overlay buttons like edit and delete
	// optional
	export let imageFit = 'cover';
	export let imageUploadPathNoExt = undefined; // path (no ext) of the repo where an uploaded photo would go
	export let afterUploadFunction = () => {}; // runs after an image was uploaded
	export let afterDeleteFunction = () => {}; // runs after this image was deleted (for state cleanup)

	// fontawesome icons
	const imageEditFaIcon = 'fa-upload';
	const imageDeleteFaIcon = 'fa-trash';

	let file;
	let fileInput;
	let fileReader; // the upload button acts as a file reader, when shown
	let imgSrc;
	let isImageLoading = false;
	let imageExtension;

	const getAndShowImage = async () => {
		// initially set the image to the placeholder
		imgSrc = imagePlaceholderSrc;

		// only proceed if there's an image to load
		if (isUrlValid(imageUrl)) {
			try {
				// check the cache first
				const imageFromCache = getImageFromCache(imageUrl);
				if (imageFromCache) {
					//console.log("Image was found in cache", imageUrl)
					imgSrc = imageFromCache;
				} else {
					//console.log("Using a web worker to get the image", imageUrl)
					// use a web worker to fetch the image asynchronously
					const worker = new Worker(new URL('image-async-web-worker.js', import.meta.url), {
						type: 'module'
					});

					isImageLoading = true;

					// send a message to the web worker with the image URL
					worker.postMessage(imageUrl);

					// listen for messages from the worker
					worker.onmessage = (event) => {
						// image data is in event.data
						const imgBinary = event.data;

						if (imgBinary) {
							const MIMEType = getMIMEType(imgBinary);
							if (MIMEType) {
								const imgBase64 = btoa(imgBinary);
								imgSrc = MIMEType + ';base64,' + imgBase64;

								// add the image to the cache
								addImageToCache(imageUrl, imgSrc);
							} else {
								console.error('Unknown MIME type');
							}
						} else {
							console.warn(`No valid image data received for: ${imageUrl}.`);
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

	const uploadImageFromFileReader = async () => {
		const base64String = fileReader.result.replace('data:', '').replace(/^.+,/, '');

		try {
			// delete the file if it exists
			// this is (unfortunately) required to force refresh the image in the app
			await deleteFileFromRepoByUrl(imageUrl);

			imageUrl = await uploadFileToRepo(
				repoOwner,
				repoName,
				`${imageUploadPathNoExt}.${imageExtension}`,
				base64String,
				'Upload image'
			);

			// remove the old image from the cache
			removeImageFromCache(imageUrl);

			// refresh the image
			getAndShowImage();

			// set the url in the temp state so other components can record it in the active person
			uploadedMediaUrl.set(imageUrl);

			// run any post-upload functions the parent using this image may require
			afterUploadFunction();
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const onUploadButtonClick = () => {
		requireAdminMode(() => fileInput.click());
	};

	const onDeleteButtonClick = async () => {
		// try to delete the file first
		// if this works, then run the afterDelete function
		if (await deleteFileFromRepoByUrl(imageUrl)) {
			// run a post-delete function as desired (for example to clean up any references to this file)
			removeImageFromCache(imageUrl);
			imageUrl = '';
			getAndShowImage();
			afterDeleteFunction();
		} else {
			console.warn(
				'Failed to delete image from the repo, so leaving the activePerson references to this image: ' +
					imageUrl
			);
		}
	};

	const handleFileUpload = async (event) => {
		file = event.target.files[0];
		fileReader = new FileReader();

		fileReader.onloadend = async function () {
			uploadImageFromFileReader();
		};

		fileReader.readAsDataURL(file);
	};

	onMount(async () => {
		await getAndShowImage();
	});

	$: {
		// refresh the image from the cache as needed
		// in case it's been updated from somewhere else
		if ($imageCache[imageUrl]) {
			getAndShowImage();
		}

		// Get the file extension from the file name
		imageExtension = file
			? getExtensionFromFileNameOrPath(file.name)
			: getExtensionFromUrl(imageUrl);
	}

	const imageCss = css`
		object-fit: ${imageFit};
	`;
</script>

<div class="image-container">
	{#if isImageLoading}
		<div class="image-loading-overlay" />
	{/if}
	<!-- svelte-ignore a11y-img-redundant-alt -->
	<img src={imgSrc} class="image {imageCss}" alt="Photo of this person" />
	{#if allowEdit}
		<div class="image-actions-container">
			<JDGButton
				onClickFunction={onUploadButtonClick}
				label={null}
				tooltip="Choose another photo"
				faIcon={imageEditFaIcon}
				doForceSquareRatio
			/>
			<!-- only show the delete button if the recorded url is valid -->
			{#if isUrlValid(imageUrl)}
				<JDGButton
					onClickFunction={onDeleteButtonClick}
					label={null}
					tooltip="Delete photo"
					faIcon={imageDeleteFaIcon}
					doForceSquareRatio
				/>
			{/if}
		</div>
		<input type="file" style="display: none;" on:change={handleFileUpload} bind:this={fileInput} />
	{/if}
</div>

<style>
	.image-container {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.image {
		height: 100%;
		width: 100%;
	}

	.image-loading-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		background-color: rgba(50, 50, 50, 0.5);
		animation: fade 2s infinite;
	}

	.image-actions-container {
		position: absolute;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: end;
		height: 100%;
		width: 100%;
		gap: 0.5vw;
	}

	/* used for a fading effect while the image is loading */
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
</style>
