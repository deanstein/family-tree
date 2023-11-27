<script>
	import AddButtonSquare from './AddButtonSquare.svelte';
	import ImageThumbnail from './ImageThumbnail.svelte';
	import MediaGroupHorizontal from './MediaGroupHorizontal.svelte';
	import MediaGroupTitle from './MediaGroupTitle.svelte';

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
		{#each images as image}
			<ImageThumbnail imgSrc={image.src} />
		{/each}
	</MediaGroupHorizontal>
</div>

<style>
	.image-thumbnail-group-outer-container {
		width: 100%;
	}
</style>
