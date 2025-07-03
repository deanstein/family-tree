<script>
	import { css } from '@emotion/css';

	import { darkenColor } from 'jdg-ui-svelte/jdg-utils.js';

	import { JDGButton } from 'jdg-ui-svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let title = undefined;
	export let faIcon = undefined; // fontawesome font name
	export let buttonText = undefined;
	export let buttonFunction = undefined;
	export let buttonColor = stylingConstants.colors.activeColor;
	export let description;

	const treeOptionContainerCss = css`
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

	const titleCss = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const buttonAndIconContainerCss = css`
		&:hover .fa-solid {
			color: ${darkenColor(buttonColor, 0.2)};
		}

		&:hover button {
			background-color: ${darkenColor(buttonColor, 0.2)};
		}
	`;

	const iconContainerCss = css`
		padding: ${stylingConstants.sizes.padding};
	`;

	const iconCss = css`
		color: ${buttonColor};
	`;

	const treeDescriptionCss = css`
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

<div class="tree-option-container {treeOptionContainerCss}">
	{#if title}
		<h2 class="tree-option-title {titleCss}">
			{title}
		</h2>
	{/if}
	{#if faIcon}
		<div class="button-and-icon-container {buttonAndIconContainerCss}">
			<div
				class="icon-container {iconContainerCss}"
				on:click={buttonFunction}
				on:keypress={buttonFunction}
				role="button"
				tabindex="0"
			>
				<i class="fa-solid {faIcon} {iconCss}" />
			</div>
			<JDGButton
				onClickFunction={buttonFunction}
				label={buttonText}
				backgroundColor={buttonColor}
				faIcon={null}
			/>
		</div>
	{/if}
	<slot />
	<div class="tree-description {treeDescriptionCss}">
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
		background-color: white;
		border-radius: 10px;
		padding: 20px;
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
