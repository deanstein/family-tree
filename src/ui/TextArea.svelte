<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	export let isEnabled = true;
	export let inputValue = '';
	export let resizable = 'none'; // none, vertical, horizontal, or both
	// empty function in case no function is passed to the input by the parent
	export let useFunction = (element) => {};

	const textInputDynamicClass = css`
        border: 2px solid ${stylingConstants.colors.activeColor};
		resize: ${resizable};
        :hover {
            border: 2px solid ${stylingConstants.colors.hoverColor};
		`;
</script>

<div id="input-container" class="input-container">
	<textarea
		bind:value={inputValue}
		use:useFunction
		class={textInputDynamicClass}
		disabled={!isEnabled}
	/>
</div>

<style>
	.input-container {
		display: flex;
		height: 100%;
	}

	textarea {
		min-height: 10vh;
		width: 100%;
		outline: none;
	}

	textarea:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
