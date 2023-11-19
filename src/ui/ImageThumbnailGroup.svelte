<script>
	import AddPersonOrMediaButton from './AddPersonOrMediaButton.svelte';
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
		padding: 10px;
	}
</style>
