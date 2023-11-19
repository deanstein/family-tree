<script>
	import AddPersonOrMediaButton from './AddButtonSquare.svelte';
	import ImageThumbnail from './ImageThumbnail.svelte';

	export let images = [];
</script>

<div class="image-thumbnail-group-container">
	<AddPersonOrMediaButton />
	{#each images as image}
		<ImageThumbnail imgSrc={image.src} />
	{/each}
</div>

<style>
	.image-thumbnail-group-container {
		width: 100%;
	}
</style>
