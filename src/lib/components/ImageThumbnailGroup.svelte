<script>
	import { setImageGalleryContent, setImageGalleryId } from '$lib/temp-management';

	import AddButtonSquare from '$lib/components/ButtonCircularInSquare.svelte';
	import ImageThumbnail from '$lib/components/ImageThumbnail.svelte';
	import MediaGroupHorizontal from '$lib/components/MediaGroupHorizontal.svelte';
	import MediaGroupTitle from '$lib/components/MediaGroupTitle.svelte';

	export let images = [];
	export let showGroupTitle = true;
	export let showAddButton = true;
	export let onClickAddButtonFunction = undefined;
</script>

<div class="image-thumbnail-group-outer-container">
	{#if showGroupTitle}
		<MediaGroupTitle groupTitle="Images" />
	{/if}

	<MediaGroupHorizontal showEmptyState={images?.length === 0 && !showAddButton}>
		{#if showAddButton}
			<AddButtonSquare onClickFunction={onClickAddButtonFunction} />
		{/if}
		{#if images}
			{#each images as image}
				<ImageThumbnail
					imageContent={image}
					onClickFunction={() => {
						setImageGalleryId(image.id);
						setImageGalleryContent(image);
					}}
				/>
			{/each}
		{/if}
	</MediaGroupHorizontal>
</div>

<style>
	.image-thumbnail-group-outer-container {
		width: 100%;
	}
</style>
