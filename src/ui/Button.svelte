<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	export let buttonText;
	export let onClickFunction;
	export let overrideBackgroundColor = undefined;
	export let overrideFontSize = undefined;
	export let overridePadding = undefined;

	const buttonDynamicClass = css`
		font-size: ${overrideFontSize ? overrideFontSize : '1.5vh'};
		padding: ${overridePadding ? overridePadding : '1vh'};
		background-color: ${overrideBackgroundColor
			? overrideBackgroundColor
			: stylingConstants.colors.buttonColorPrimary};
		:hover {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<button on:click={onClickFunction} class={buttonDynamicClass}>
	{buttonText}
</button>

<style>
	button {
		color: white;
		border: none;
		font-weight: bold;
	}
</style>
