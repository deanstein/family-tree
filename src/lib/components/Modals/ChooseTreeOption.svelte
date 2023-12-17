<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';

	export let faIcon; // fontawesome font name
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

	const buttonAndIconContainerDynamicClass = css`
		&:hover .fa-solid {
			color: ${stylingConstants.colors.hoverColor};
		}

		&:hover button {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;

	const iconContainerDynamicClass = css`
		padding: ${stylingConstants.sizes.padding};
	`;

	const iconDynamicClass = css`
		color: ${stylingConstants.colors.activeColor};
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
	<div
		id="button-and-icon-container"
		class="{buttonAndIconContainerDynamicClass} button-and-icon-container"
	>
		<div
			id="icon-container"
			class="{iconContainerDynamicClass} icon-container"
			on:click={buttonFunction}
			on:keypress={buttonFunction}
		>
			<i class="{iconDynamicClass} fa-solid {faIcon}" />
		</div>
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

	.button-and-icon-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* font awesome icon */
	.fa-solid {
		font-size: 60px;
	}

	.tree-description {
		color: black;
		text-align: center;
		font-size: 1.3vh;
		padding: 10px;
		bottom: 0;
	}
</style>
