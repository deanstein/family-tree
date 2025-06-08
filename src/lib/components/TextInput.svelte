<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let isEnabled = true;
	export let inputValue = '';
	export let placeholder = undefined;
	export let fontColorOverride = undefined;
	export let fontSizeOverride = undefined;
	export let textAlignOverride = undefined;
	export let onInputFunction = (event) => {};
	// empty function in case no function is passed to the input by the parent
	export let useFunction = (element) => {};
	export let onKeyUpFunction = (event) => {};

	const textInputCss = css`
		min-height: ${stylingConstants.sizes.bioFieldHeight};
		color: ${fontColorOverride ? fontColorOverride : stylingConstants.colors.textColor};
		font-size: ${fontSizeOverride ? fontSizeOverride : stylingConstants.sizes.bioFieldFontSize};
		text-align: ${textAlignOverride ? textAlignOverride : 'left'};
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
		:disabled {
			border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
		}
	`;
</script>

<div class="input-container">
	<input
		type="text"
		bind:value={inputValue}
		on:input={onInputFunction}
		on:keyup={onKeyUpFunction}
		use:useFunction
		class={textInputCss}
		disabled={!isEnabled}
		{placeholder}
	/>
</div>

<style>
	.input-container {
		display: flex;
	}

	input {
		width: 100%;
		min-width: -webkit-fill-available;
		min-width: -moz-available;
		outline: none;
		padding: 4px;
	}

	input:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
