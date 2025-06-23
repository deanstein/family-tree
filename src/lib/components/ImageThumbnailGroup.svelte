<script>
	import {
		showMediaGalleryModal,
		mediaGalleryContent,
		mediaGalleryContentArray
	} from '$lib/states/ui-state';

	import AddButtonSquare from '$lib/components/ButtonCircularInSquare.svelte';
	import EmptyMediaSquare from '$lib/components/EmptyMediaSquare.svelte';
	import ImageThumbnail from '$lib/components/ImageThumbnail.svelte';
	import MediaGroupTitle from '$lib/components/MediaGroupTitle.svelte';

	export let imageArray = [];
	export let allowEdit = false;
	export let showEmptyState = true;
	export let showGroupTitle = true;
	export let groupTitle = 'Image Group';
	export let showAddButton = true;
	export let onClickAddButton = () => {};
</script>

<div class="image-thumbnail-group-outer-container">
	{#if imageArray.length === 0 && showEmptyState && !showAddButton}
		<EmptyMediaSquare
			message={'No images found'}
			faIcon="fa-image"
			tooltip="Edit this event to add images"
		/>
	{/if}
	{#if showGroupTitle}
		<MediaGroupTitle {groupTitle} />
	{/if}
	<div class="image-thumbnail-group-inner-container">
		{#if showAddButton}
			<AddButtonSquare enabled={allowEdit} onClickFunction={onClickAddButton} />
		{/if}
		{#if imageArray}
			{#each imageArray as image}
				<ImageThumbnail
					imageContent={image}
					{allowEdit}
					onClickFunction={() => {
						showMediaGalleryModal.set(true);
						mediaGalleryContent.set(image);
						mediaGalleryContentArray.set(imageArray);
					}}
				/>
			{/each}
		{/if}
	</div>
</div>

<style>
	.image-thumbnail-group-outer-container {
		display: flex;
		width: 100%;
		gap: 8px;
	}
	.image-thumbnail-group-inner-container {
		display: flex;
		gap: 8px;
	}
</style>
