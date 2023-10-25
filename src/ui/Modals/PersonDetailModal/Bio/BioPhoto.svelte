<script>
	import { dataRepoName, uploadFileToRepo } from '../../../../logic/persistence-management';

	let allowEdit = true;
	let imageUrl;
	let file;

	async function handleFileUpload(event) {
		file = event.target.files[0];
		const reader = new FileReader();
		reader.onloadend = async function () {
			// @ts-expect-error
			const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
			await uploadFileToRepo(
				dataRepoName,
				'8890',
				'test/image.jpg',
				base64String,
				'Upload image test'
			);
		};
		reader.readAsDataURL(file);
	}
</script>

<div id="bio-photo-container" class="bio-photo-container">
	<div id="avatar-container" class="avatar-container">
		<img
			src="./img/avatar-placeholder.jpg"
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
	{#if imageUrl}
		<!-- Check if imageUrl is not null or undefined -->
		<img src={imageUrl} alt="Uploaded image" />
	{:else}
		<p>Loading image...</p>
	{/if}
</div>

<style>
	.bio-photo-container {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.avatar-container {
		height: 100%;
		overflow: hidden;
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
