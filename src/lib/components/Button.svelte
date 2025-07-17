<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let buttonText;
	export let isEnabled = true;
	export let onClickFunction;
	export let overrideColor = undefined;
	export let overrideColorHover = undefined;
	export let overrideBackgroundColor = undefined;
	export let overrideBackgroundColorHover = undefined;
	export let overrideFontSize = undefined;
	export let overridePadding = undefined;

	let buttonCss;

	$: {
		buttonCss = css`
			font-size: ${overrideFontSize ? overrideFontSize : '1.5svh'};
			padding: ${overridePadding ? overridePadding : '1svh'};
			color: ${overrideColor ? overrideColor : 'white'};
			background-color: ${overrideBackgroundColor ?? stylingConstants.colors.buttonColorPrimary};
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

<button disabled={!isEnabled} on:click={onClickFunction} class={buttonCss}>
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
