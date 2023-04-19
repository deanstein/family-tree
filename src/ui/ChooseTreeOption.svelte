<script>
	import Button from './Button.svelte';

	export let buttonText;
	export let buttonFunction;
	export let description;
</script>

<div id="tree-option-container" class="tree-option-container">
	<div id="button-container" class="button-container">
		<Button {buttonText} onClickFunction={buttonFunction} />
	</div>
	<div id="example-tree-description" class="tree-description">
		{description}
	</div>
</div>

<style>
	.tree-option-container {
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-basis: 33%;
		color: white;
		background-color: gray;
	}

	.button-container {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.tree-description {
		position: absolute;
		color: black;
		text-align: center;
		font-size: 1.5vh;
		padding: 10px;
		bottom: 0;
	}
</style>
