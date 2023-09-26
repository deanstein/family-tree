<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	export let buttonText;
	export let isEnabled = true;
	export let onClickFunction;
	export let overrideColor = undefined;
	export let overrideColorHover = undefined;
	export let overrideBackgroundColor = undefined;
	export let overrideBackgroundColorHover = undefined;
	export let overrideFontSize = undefined;
	export let overridePadding = undefined;

	let buttonDynamicClass;

	$: {
		buttonDynamicClass = css`
			font-size: ${overrideFontSize ? overrideFontSize : '1.5vh'};
			padding: ${overridePadding ? overridePadding : '1vh'};
			color: ${overrideColor ? overrideColor : 'white'};
			background-color: ${overrideBackgroundColor
				? overrideBackgroundColor
				: stylingConstants.colors.buttonColorPrimary};
			:hover {
				color: ${overrideColorHover ? overrideColorHover : 'white'};
				background-color: ${overrideBackgroundColorHover
					? overrideBackgroundColorHover
					: stylingConstants.colors.hoverColor};
			}
			:disabled {
				background-color: ${stylingConstants.colors.buttonColorDisabled};
			}
			:disabled:hover {
				background-color: ${stylingConstants.colors.buttonColorDisabled};
			}
		`;
	}
</script>

<button disabled={!isEnabled} on:click={onClickFunction} class={buttonDynamicClass}>
	{buttonText}
</button>

<style>
	button {
		border: none;
		font-weight: bold;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
