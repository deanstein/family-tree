<script>
	import { css } from '@emotion/css';
	
	import stylingConstants from './styling-constants';
	
	export let isEnabled = true;
	export let inputValue = "";

	const textInputDynamicClass = css`
        border: 2px solid ${stylingConstants.colors.activeColor};
        :hover {
            border: 2px solid ${stylingConstants.colors.hoverColor};
		`;
</script>

<div id="input-container" class="input-container">
	<input type="text" bind:value={inputValue} class={textInputDynamicClass} disabled={!isEnabled}/>
</div>

<style>
	.input-container {
		display: flex;
	}

	input {
		width: 100%;
		outline: none;
	}

	input:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
