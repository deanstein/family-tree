<script>
	export let imgSrc;
</script>

<div class="image-thumbnail-container">
	<img src={imgSrc} alt="Some caption" />
</div>

<style>
	.image-thumbnail-container:hover {
		border: 2px solid blue;
	}
</style>
