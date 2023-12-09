<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import imageCache from '../stores/image-cache';

	import stylingConstants from './styling-constants';

	import { uploadFileToRepo } from '../logic/persistence-management';

	import { getMIMEType as getMIMEType, isUrlValid } from '../logic/utils';
	import {
		addImageToCache,
		getImageFromCache,
		removeImageFromCache,
		setMediaUploadedUrl
	} from '../logic/temp-management';

	export let repoOwner;
	export let repoName;
	export let password;
	export let imageUrl; // the full github url
	export let imageUploadPathNoExt; // file path (no extension) from the root of the repo where an uploaded photo would go
	export let imagePlaceholderSrc; // used if the url is not valid
	export let allowEdit; // shows overlay buttons like edit and delete
	export let afterUploadFunction = () => {}; // optional; runs after an image was uploaded

	// fontawesome icons
	const imageEditFaIcon = 'fa-pen';
	const imageDeleteFaIcon = 'fa-trash'; // TODO

	let file;
	let fileInput;
	let fileReader; // the edit button acts as a file reader, when shown
	let imgSrc;
	let isImageLoading = false;

	const getAndShowImage = async () => {
		// initially set the image to the placeholder
		imgSrc = imagePlaceholderSrc;

		// only proceed if there's an image to load
		if (isUrlValid(imageUrl)) {
			try {
				// check the cache first
				const imageFromCache = getImageFromCache(imageUploadPathNoExt);
				if (imageFromCache) {
					imgSrc = imageFromCache;
				} else {
					// use a web worker to fetch the image asynchronously
					const worker = new Worker(new URL('image-async-web-worker.js', import.meta.url), {
						type: 'module'
					});

					isImageLoading = true;

					// send a message to the worker with the image URL
					worker.postMessage(imageUploadPathNoExt);

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
								addImageToCache(imageUploadPathNoExt, imgSrc);
							} else {
								console.error('Unknown MIME type');
							}
						} else {
							console.warn('No valid image data received for ' + imageUploadPathNoExt) + '.';
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

		// Get the file extension from the file name
		const fileReaderFileName = file.name;
		const fileExtension = fileReaderFileName.split('.').pop();

		try {
			imageUrl = await uploadFileToRepo(
				repoOwner,
				repoName,
				password,
				`${imageUploadPathNoExt}.${fileExtension}`,
				base64String,
				'Upload image'
			);

			// remove the old image from the cache
			removeImageFromCache(imageUploadPathNoExt);

			// set the url in the temp state so other components can record it in the active person
			setMediaUploadedUrl(imageUrl);

			// run any post-upload functions the parent using this image may require
			afterUploadFunction();

			// refresh the image
			getAndShowImage();
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	const onEditButtonClick = () => {
		fileInput.click();
	};

	const onDeleteButtonClick = () => {};

	const handleFileUpload = async (event) => {
		file = event.target.files[0];
		fileReader = new FileReader();

		fileReader.onloadend = async function () {
			uploadImageFromFileReader();
		};

		fileReader.readAsDataURL(file);
	};

	onMount(async () => {
		getAndShowImage();
	});

	$: {
		if (!imageUploadPathNoExt)
			if ($imageCache[imageUploadPathNoExt]) {
				// show the image from the cache, always
				getAndShowImage();
			}
	}

	const editButtonDynamicClass = css`
		background-color: ${stylingConstants.colors.buttonColorPrimary};
		:hover {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div id="image-container" class="image-container">
	{#if isImageLoading}
		<div id="image-loading-overlay" class="image-loading-overlay" />
	{/if}
	<!-- svelte-ignore a11y-img-redundant-alt -->
	<img src={imgSrc} id="image" class="image" alt="Photo of this person" />
	{#if allowEdit}
		<div class="image-actions-container">
			<div
				id="image-edit-button"
				class="{editButtonDynamicClass} image-action-button"
				on:click={onEditButtonClick}
				on:keypress={onEditButtonClick}
				title="Choose another photo"
			>
				<i class="fa-solid {imageEditFaIcon}" />
			</div>
			<!-- TODO: enable this Delete button when the delete API is available-->
			<!-- <div
				id="image-delete-button"
				class="{editButtonDynamicClass} image-action-button"
				on:click={onDeleteButtonClick}
				on:keypress={onDeleteButtonClick}
			>
				<i class="fa-solid {bioPhotoDeleteFaIcon}" />
			</div> -->
		</div>
		<input
			type="file"
			id="file-input"
			style="display: none;"
			on:change={handleFileUpload}
			bind:this={fileInput}
		/>
	{/if}
</div>

<style>
	.image-container {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		background-color: lightgray;
	}

	.image {
		object-fit: cover;
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

	.image-action-button {
		font-size: 1.5em;
		height: 30%;
		aspect-ratio: 1;
		border-radius: 50%;
		opacity: 80%;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
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
