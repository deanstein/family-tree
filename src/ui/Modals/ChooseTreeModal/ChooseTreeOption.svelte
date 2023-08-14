<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	import Button from '../../Button.svelte';

	export let buttonText;
	export let buttonFunction;
	export let description;

	const treeOptionContainerDynamicClass = css`
		@media (max-width: ${stylingConstants.breakpoints.width[0]}) {
			flex-direction: column;
			padding-top: 10px;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[0]}) and (max-height: ${stylingConstants
				.breakpoints.width[1]}) {
			flex-direction: column;
			padding-top: 10px;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[1]}) {
			flex-direction: row;
			padding-top: 0px;
		}
	`;

	const treeDescriptionDynamicClass = css`
		@media (max-width: ${stylingConstants.breakpoints.width[0]}) {
			position: relative;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[0]}) and (max-height: ${stylingConstants
				.breakpoints.width[1]}) {
			position: relative;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[1]}) {
			position: absolute;
		}
	`;
</script>

<div id="tree-option-container" class="{treeOptionContainerDynamicClass} tree-option-container">
	<div id="button-container" class="button-container">
		<Button {buttonText} onClickFunction={buttonFunction} />
	</div>
	<div id="example-tree-description" class="{treeDescriptionDynamicClass} tree-description">
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
		background-color: #dbdbdb;
		border-radius: 10px;
	}

	.button-container {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.tree-description {
		color: black;
		text-align: center;
		font-size: 1.3vh;
		padding: 10px;
		bottom: 0;
	}
</style>
